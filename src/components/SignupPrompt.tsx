import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SignupPromptProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SignupPrompt({ open, onClose, onSuccess }: SignupPromptProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('captured_users' as any).insert({ email: email.trim() } as any);
      if (error && error.code !== '23505') throw error;
      toast.success('Welcome to Wichtech!');
      localStorage.setItem('wichtech-email', email.trim());
      onSuccess();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-gold-shimmer">Stay Connected</DialogTitle>
          <DialogDescription className="font-body text-muted-foreground">
            Enter your email to receive exclusive updates and offers from Wichtech.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-input border-border font-ui"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-sm font-ui text-sm tracking-widest uppercase disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, hsl(0 60% 30%), hsl(0 60% 38%))',
              border: '1px solid hsl(42 70% 55% / 0.4)',
              color: 'hsl(42 70% 55%)',
            }}
          >
            {loading ? 'Joining...' : 'Join Wichtech'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-muted-foreground font-ui text-xs hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
