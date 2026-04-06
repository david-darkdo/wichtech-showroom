import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Enums } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type AdminRole = Enums<'app_role'> | null;

const INITIAL_AUTH_TIMEOUT_MS = 2000;

type UseAdminAuthResult = {
  loading: boolean;
  role: AdminRole;
  session: Session | null;
};

export function useAdminAuth(): UseAdminAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AdminRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let initialResolved = false;

    setLoading(true);
    setSession(null);
    setRole(null);
    console.log('[Auth] Starting clean admin auth check');

    const logDecision = (decision: string, details: Record<string, unknown> = {}) => {
      console.log('[Auth] Middleware decision:', { decision, ...details });
    };

    const finishInitial = (reason: string) => {
      if (!isMounted || initialResolved) return;
      initialResolved = true;
      window.clearTimeout(fallbackTimer);
      console.log('[Auth] Initial auth check resolved:', reason);
      setLoading(false);
    };

    const setGuestState = (source: string) => {
      if (!isMounted) return;
      setSession(null);
      setRole(null);
      console.log('[Auth] Auth check result:', {
        source,
        isAuthenticated: false,
        sessionStatus: 'missing',
      });
      logDecision('show-login', { source });
    };

    const fetchRole = async (userId: string, source: string): Promise<AdminRole> => {
      console.log('[Auth] Fetching role:', { source, userId });

      const { data, error } = await supabase
        .from('user_roles' as never)
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[Auth] Role fetch error:', { source, message: error.message, userId });
        return null;
      }

      const nextRole = ((data as { role?: AdminRole } | null)?.role ?? null) as AdminRole;
      console.log('[Auth] Role resolved:', { source, role: nextRole, userId });
      return nextRole;
    };

    const resolveAuthenticatedState = async (
      currentSession: Session,
      source: string,
      settleInitial: boolean,
    ) => {
      if (!isMounted) return;

      setSession(currentSession);
      console.log('[Auth] Session status:', {
        source,
        sessionStatus: 'present',
        userId: currentSession.user.id,
      });

      const nextRole = await fetchRole(currentSession.user.id, source);
      if (!isMounted) return;

      setRole(nextRole);
      console.log('[Auth] Auth check result:', {
        source,
        isAuthenticated: true,
        role: nextRole,
        sessionStatus: 'present',
        userId: currentSession.user.id,
      });

      logDecision(
        nextRole === 'super_admin' || nextRole === 'staff' ? 'allow-admin' : 'deny-admin',
        { source, role: nextRole, userId: currentSession.user.id },
      );

      if (settleInitial) {
        finishInitial(`resolved:${source}`);
      }
    };

    const fallbackTimer = window.setTimeout(() => {
      if (!isMounted || initialResolved) return;
      console.warn('[Auth] Initial auth check timed out; redirecting to login state');
      setGuestState('timeout');
      finishInitial('timeout');
    }, INITIAL_AUTH_TIMEOUT_MS);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      console.log('[Auth] State change:', event, {
        hasSession: !!nextSession,
        userId: nextSession?.user?.id ?? null,
      });

      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (!nextSession?.user) {
        setGuestState(`auth:${event}`);
        return;
      }

      void resolveAuthenticatedState(nextSession, `auth:${event}`, false);
    });

    void supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        if (error) {
          console.warn('[Auth] getSession error:', error.message);
          setGuestState('getSession:error');
          finishInitial('getSession:error');
          return;
        }

        const currentSession = data.session;
        console.log('[Auth] getSession result:', {
          hasSession: !!currentSession,
          userId: currentSession?.user?.id ?? null,
        });

        if (!currentSession?.user) {
          setGuestState('getSession');
          finishInitial('guest:getSession');
          return;
        }

        await resolveAuthenticatedState(currentSession, 'getSession', true);
      })
      .catch((error) => {
        console.error('[Auth] getSession failure:', error);
        setGuestState('getSession:exception');
        finishInitial('getSession:exception');
      });

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, []);

  return { loading, role, session };
}