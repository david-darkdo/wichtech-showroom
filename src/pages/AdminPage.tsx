import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, BarChart3, Package, Upload, LogOut, Eye, EyeOff, ShieldCheck, UserCog, MessageCircle } from 'lucide-react';
import type { ProductCategory } from '@/lib/types';
import { useAdminAuth } from '@/hooks/useAdminAuth';

type Tab = 'products' | 'users' | 'analytics' | 'upload' | 'staff' | 'customers';

export default function AdminPage() {
  const { session, role, loading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      console.log('[Auth] Attempting sign in:', { email });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log('[Auth] Login success:', {
        isAuthenticated: !!data.session,
        sessionStatus: data.session ? 'present' : 'missing',
        userId: data.user?.id ?? null,
      });
    } catch (err: any) {
      console.error('[Auth] Login error:', err);
      toast.error(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[Auth] Logout error:', error);
      toast.error(error.message || 'Sign out failed');
      return;
    }
    console.log('[Auth] Logout complete:', { sessionStatus: 'cleared' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-ui text-sm text-muted-foreground animate-pulse">Verifying access...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm p-6 rounded-lg" style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.3)' }}>
          <h1 className="font-display text-2xl text-gold-shimmer text-center mb-6">System Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-input border-border font-ui" />
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="bg-input border-border font-ui pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button type="submit" disabled={loginLoading} className="w-full py-2.5 rounded-sm font-ui text-sm tracking-widest uppercase disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, hsl(0 60% 30%), hsl(0 60% 38%))', border: '1px solid hsl(42 70% 55% / 0.4)', color: 'hsl(42 70% 55%)' }}
            >
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isSuperAdmin = role === 'super_admin';
  const isStaff = role === 'staff';

  if (!isSuperAdmin && !isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <ShieldCheck className="w-16 h-16 mx-auto text-destructive/50" />
          <h1 className="font-display text-xl text-foreground">Access Denied</h1>
          <p className="font-body text-sm text-muted-foreground">You do not have permission to access the Command Center.</p>
          <button onClick={handleLogout} className="font-ui text-xs text-accent underline">Sign Out</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'upload' as Tab, icon: Upload, label: 'Upload' },
    { id: 'products' as Tab, icon: Package, label: 'Products' },
    ...(isSuperAdmin ? [
      { id: 'staff' as Tab, icon: UserCog, label: 'Staff' },
      { id: 'customers' as Tab, icon: MessageCircle, label: 'Customers' },
      { id: 'users' as Tab, icon: Users, label: 'Emails' },
      { id: 'analytics' as Tab, icon: BarChart3, label: 'Analytics' },
    ] : []),
  ];

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-xl text-gold-shimmer">Command Center</h1>
            <p className="font-ui text-[10px] text-accent/60 uppercase tracking-widest mt-1">
              {isSuperAdmin ? 'Super Admin' : 'Staff'}
            </p>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-accent transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-sm font-ui text-xs tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-accent' : 'text-muted-foreground'}`}
              style={activeTab === tab.id ? { background: 'hsl(42 70% 55% / 0.1)', border: '1px solid hsl(42 70% 55% / 0.3)' } : { border: '1px solid transparent' }}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'upload' && <ProductUploader />}
        {activeTab === 'products' && <ProductList />}
        {activeTab === 'staff' && isSuperAdmin && <StaffManager />}
        {activeTab === 'customers' && isSuperAdmin && <CustomerTracker />}
        {activeTab === 'users' && isSuperAdmin && <UserList />}
        {activeTab === 'analytics' && isSuperAdmin && <Analytics />}
      </div>
    </div>
  );
}

// ============ Staff Manager ============
function StaffManager() {
  const queryClient = useQueryClient();

  const { data: roles = [] } = useQuery({
    queryKey: ['all-user-roles'],
    queryFn: async () => {
      const { data } = await supabase.from('user_roles' as any).select('*');
      return (data || []) as any[];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles' as any).select('*').order('created_at', { ascending: false });
      return (data || []) as any[];
    },
  });

  const promoteUser = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      // Delete existing role then insert new one
      await supabase.from('user_roles' as any).delete().eq('user_id', userId);
      const { error } = await supabase.from('user_roles' as any).insert({ user_id: userId, role: newRole } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
      toast.success('Role updated');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const getUserRole = (userId: string) => {
    const r = roles.find((r: any) => r.user_id === userId);
    return r?.role || 'customer';
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-foreground">Manage Staff</h2>
      <p className="font-ui text-xs text-muted-foreground">Promote or demote users. Only super admins can manage roles.</p>

      <div className="space-y-3">
        {profiles.map((p: any) => {
          const currentRole = getUserRole(p.user_id);
          return (
            <div key={p.id} className="p-3 rounded-lg flex items-center justify-between gap-3"
              style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.2)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-ui text-sm text-foreground truncate">{p.email}</p>
                <p className="font-ui text-[10px] text-accent uppercase tracking-widest">{currentRole}</p>
              </div>
              <div className="flex gap-1">
                {currentRole !== 'staff' && (
                  <button
                    onClick={() => promoteUser.mutate({ userId: p.user_id, newRole: 'staff' })}
                    className="px-2 py-1 rounded text-[10px] font-ui uppercase tracking-wider"
                    style={{ background: 'hsl(42 70% 55% / 0.15)', color: 'hsl(42 70% 55%)', border: '1px solid hsl(42 70% 55% / 0.3)' }}
                  >
                    Make Staff
                  </button>
                )}
                {currentRole === 'staff' && (
                  <button
                    onClick={() => promoteUser.mutate({ userId: p.user_id, newRole: 'customer' })}
                    className="px-2 py-1 rounded text-[10px] font-ui uppercase tracking-wider"
                    style={{ background: 'hsl(0 60% 35% / 0.15)', color: 'hsl(0 60% 50%)', border: '1px solid hsl(0 60% 35% / 0.3)' }}
                  >
                    Remove Staff
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {profiles.length === 0 && (
          <p className="font-ui text-sm text-muted-foreground text-center py-8">No users yet</p>
        )}
      </div>
    </div>
  );
}

// ============ Customer Tracker ============
function CustomerTracker() {
  const { data: profiles = [] } = useQuery({
    queryKey: ['customer-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles' as any).select('*').order('last_seen', { ascending: false });
      return (data || []) as any[];
    },
  });

  const { data: whatsappLogs = [] } = useQuery({
    queryKey: ['whatsapp-logs'],
    queryFn: async () => {
      const { data } = await supabase.from('activity_logs' as any).select('user_email').eq('action', 'whatsapp_checkout');
      return (data || []) as any[];
    },
  });

  const whatsappEmails = new Set(whatsappLogs.map((l: any) => l.user_email));

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-foreground">Customer Tracker</h2>
      <p className="font-ui text-xs text-muted-foreground">Track user activity and WhatsApp engagement.</p>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-3 gap-2 px-3 py-2">
          <span className="font-ui text-[10px] uppercase tracking-widest text-accent">Email</span>
          <span className="font-ui text-[10px] uppercase tracking-widest text-accent text-center">Last Seen</span>
          <span className="font-ui text-[10px] uppercase tracking-widest text-accent text-right">WhatsApp</span>
        </div>

        {profiles.map((p: any) => (
          <div key={p.id} className="grid grid-cols-3 gap-2 p-3 rounded-lg items-center"
            style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.15)' }}
          >
            <p className="font-ui text-xs text-foreground truncate">{p.email || 'Unknown'}</p>
            <p className="font-ui text-[10px] text-muted-foreground text-center">
              {p.last_seen ? new Date(p.last_seen).toLocaleDateString() : 'N/A'}
            </p>
            <p className={`font-ui text-[10px] text-right font-bold uppercase tracking-wider ${whatsappEmails.has(p.email) ? 'text-green-400' : 'text-muted-foreground/40'}`}>
              {whatsappEmails.has(p.email) ? 'Yes' : 'No'}
            </p>
          </div>
        ))}

        {profiles.length === 0 && (
          <p className="font-ui text-sm text-muted-foreground text-center py-8">No customers tracked yet</p>
        )}
      </div>
    </div>
  );
}

function ProductUploader() {
  const [form, setForm] = useState({
    product_name: '', item_code: '', price: '', category: '' as ProductCategory | '',
    full_details: '', related_tags: '',
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [finishedImage, setFinishedImage] = useState<File | null>(null);
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [finishedPreview, setFinishedPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file: File | null, type: 'product' | 'finished') => {
    if (!file) return;
    console.log('[FileSelect]', type, file.name, file.type, file.size);
    const previewUrl = URL.createObjectURL(file);
    if (type === 'product') {
      setProductImage(file);
      setProductPreview(previewUrl);
    } else {
      setFinishedImage(file);
      setFinishedPreview(previewUrl);
    }
  };

  const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/upload-image`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errData.error || errData.details || 'Upload failed');
    }

    const data = await res.json();
    if (!data.url) throw new Error('No URL returned from upload');
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) return toast.error('Select a category');
    setLoading(true);
    try {
      let product_image: string | null = null;
      let finished_result_image: string | null = null;

      if (productImage) {
        console.log('[Upload] Uploading product image...');
        product_image = await uploadToCloudinary(productImage, 'wichtech/products');
        console.log('[Upload] Product image URL:', product_image);
      }
      if (finishedImage) {
        console.log('[Upload] Uploading finished image...');
        finished_result_image = await uploadToCloudinary(finishedImage, 'wichtech/finished');
        console.log('[Upload] Finished image URL:', finished_result_image);
      }

      const tags = form.related_tags.split(',').map(t => t.trim()).filter(Boolean);

      const { error } = await supabase.from('products' as any).insert({
        product_name: form.product_name,
        item_code: form.item_code,
        price: parseFloat(form.price),
        category: form.category,
        product_image,
        finished_result_image,
        full_details: form.full_details,
        related_tags: tags,
      } as any);

      if (error) throw error;
      toast.success('Product uploaded!');
      setForm({ product_name: '', item_code: '', price: '', category: '', full_details: '', related_tags: '' });
      setProductImage(null);
      setFinishedImage(null);
      setProductPreview(null);
      setFinishedPreview(null);
    } catch (err: any) {
      console.error('[Upload] Error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-display text-lg text-foreground">Product Uploader</h2>
      <Input placeholder="Product Name" value={form.product_name} onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))} required className="bg-input border-border font-ui" />
      <Input placeholder="Item Code" value={form.item_code} onChange={e => setForm(f => ({ ...f, item_code: e.target.value }))} required className="bg-input border-border font-ui" />
      <Input type="number" placeholder="Price (₦)" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required className="bg-input border-border font-ui" />
      <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as ProductCategory }))}>
        <SelectTrigger className="bg-input border-border font-ui">
          <SelectValue placeholder="Parent Category" />
        </SelectTrigger>
        <SelectContent>
          {['Plumbing', 'Paint', 'Electrical', 'Roofing'].map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div>
        <label className="font-ui text-xs text-muted-foreground block mb-1">Product Image</label>
        <label className="block w-full cursor-pointer rounded-sm border border-dashed border-border p-3 text-center hover:border-accent/50 transition-colors"
          style={{ background: 'hsl(220 15% 10%)' }}
        >
          <input type="file" onChange={e => handleFileSelect(e.target.files?.[0] || null, 'product')} className="hidden" />
          {productPreview ? (
            <div className="space-y-2">
              <img src={productPreview} alt="Preview" className="w-20 h-20 object-cover rounded mx-auto" />
              <p className="font-ui text-xs text-accent truncate">{productImage?.name}</p>
            </div>
          ) : (
            <span className="font-ui text-xs text-muted-foreground">Tap to select product photo</span>
          )}
        </label>
      </div>
      <div>
        <label className="font-ui text-xs text-muted-foreground block mb-1">Finished Result Image</label>
        <label className="block w-full cursor-pointer rounded-sm border border-dashed border-border p-3 text-center hover:border-accent/50 transition-colors"
          style={{ background: 'hsl(220 15% 10%)' }}
        >
          <input type="file" onChange={e => handleFileSelect(e.target.files?.[0] || null, 'finished')} className="hidden" />
          {finishedPreview ? (
            <div className="space-y-2">
              <img src={finishedPreview} alt="Preview" className="w-20 h-20 object-cover rounded mx-auto" />
              <p className="font-ui text-xs text-accent truncate">{finishedImage?.name}</p>
            </div>
          ) : (
            <span className="font-ui text-xs text-muted-foreground">Tap to select finished result photo</span>
          )}
        </label>
      </div>

      <Textarea placeholder="Full Details" value={form.full_details} onChange={e => setForm(f => ({ ...f, full_details: e.target.value }))} className="bg-input border-border font-ui min-h-24" />
      <Input placeholder="Related Tags (comma separated)" value={form.related_tags} onChange={e => setForm(f => ({ ...f, related_tags: e.target.value }))} className="bg-input border-border font-ui" />

      <button type="submit" disabled={loading} className="w-full py-2.5 rounded-sm font-ui text-sm tracking-widest uppercase disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, hsl(0 60% 30%), hsl(0 60% 38%))', border: '1px solid hsl(42 70% 55% / 0.4)', color: 'hsl(42 70% 55%)' }}
      >
        {loading ? 'Uploading...' : 'Upload Product'}
      </button>
    </form>
  );
}

function ProductList() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await supabase.from('products' as any).select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg text-foreground">Products ({products.length})</h2>
      {products.map((p: any) => (
        editingId === p.id ? (
          <ProductEditor key={p.id} product={p} onClose={() => setEditingId(null)} onSaved={() => { setEditingId(null); queryClient.invalidateQueries({ queryKey: ['admin-products'] }); }} />
        ) : (
          <div key={p.id} className="p-3 rounded-lg" style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.2)' }}>
            <div className="flex justify-between items-start">
              <div className="flex gap-3 flex-1 min-w-0">
                {p.product_image && <img src={p.product_image} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />}
                <div className="min-w-0">
                  <p className="font-body text-sm text-foreground">{p.product_name}</p>
                  <p className="font-ui text-[10px] text-muted-foreground">{p.item_code} · {p.category}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="font-ui text-sm text-accent">₦{Number(p.price).toLocaleString()}</p>
                <button onClick={() => setEditingId(p.id)} className="font-ui text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ background: 'hsl(42 70% 55% / 0.1)', color: 'hsl(42 70% 55%)', border: '1px solid hsl(42 70% 55% / 0.3)' }}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
}

function ProductEditor({ product, onClose, onSaved }: { product: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    product_name: product.product_name || '',
    item_code: product.item_code || '',
    price: String(product.price || ''),
    category: product.category || '',
    full_details: product.full_details || '',
    related_tags: (product.related_tags || []).join(', '),
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [finishedImage, setFinishedImage] = useState<File | null>(null);
  const [productPreview, setProductPreview] = useState<string | null>(product.product_image || null);
  const [finishedPreview, setFinishedPreview] = useState<string | null>(product.finished_result_image || null);
  const [saving, setSaving] = useState(false);

  const handleFileSelect = (file: File | null, type: 'product' | 'finished') => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'product') { setProductImage(file); setProductPreview(url); }
    else { setFinishedImage(file); setFinishedPreview(url); }
  };

  const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const res = await fetch(`https://${projectId}.supabase.co/functions/v1/upload-image`, { method: 'POST', body: fd });
    if (!res.ok) { const err = await res.json().catch(() => ({ error: res.statusText })); throw new Error(err.error || 'Upload failed'); }
    const data = await res.json();
    if (!data.url) throw new Error('No URL returned');
    return data.url;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) return toast.error('Select a category');
    setSaving(true);
    try {
      let product_image = product.product_image;
      let finished_result_image = product.finished_result_image;

      if (productImage) product_image = await uploadToCloudinary(productImage, 'wichtech/products');
      if (finishedImage) finished_result_image = await uploadToCloudinary(finishedImage, 'wichtech/finished');

      const tags = form.related_tags.split(',').map(t => t.trim()).filter(Boolean);

      const { error } = await supabase.from('products' as any).update({
        product_name: form.product_name,
        item_code: form.item_code,
        price: parseFloat(form.price),
        category: form.category,
        product_image,
        finished_result_image,
        full_details: form.full_details,
        related_tags: tags,
      } as any).eq('id', product.id);

      if (error) throw error;
      toast.success('Product updated!');
      onSaved();
    } catch (err: any) {
      console.error('[Edit] Error:', err);
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="p-4 rounded-lg space-y-3" style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 70% 55% / 0.3)' }}>
      <div className="flex justify-between items-center">
        <h3 className="font-display text-sm text-gold-shimmer">Edit Product</h3>
        <button type="button" onClick={onClose} className="font-ui text-xs text-muted-foreground hover:text-foreground">Cancel</button>
      </div>
      <Input placeholder="Product Name" value={form.product_name} onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))} required className="bg-input border-border font-ui text-sm" />
      <Input placeholder="Item Code" value={form.item_code} onChange={e => setForm(f => ({ ...f, item_code: e.target.value }))} required className="bg-input border-border font-ui text-sm" />
      <Input type="number" placeholder="Price (₦)" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required className="bg-input border-border font-ui text-sm" />
      <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
        <SelectTrigger className="bg-input border-border font-ui text-sm"><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          {['Plumbing', 'Paint', 'Electrical', 'Roofing'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-ui text-[10px] text-muted-foreground block mb-1">Product Image</label>
          <label className="block cursor-pointer rounded-sm border border-dashed border-border p-2 text-center hover:border-accent/50 transition-colors" style={{ background: 'hsl(220 15% 10%)' }}>
            <input type="file" onChange={e => handleFileSelect(e.target.files?.[0] || null, 'product')} className="hidden" />
            {productPreview ? <img src={productPreview} alt="" className="w-16 h-16 object-cover rounded mx-auto" /> : <span className="font-ui text-[10px] text-muted-foreground">Select</span>}
          </label>
        </div>
        <div>
          <label className="font-ui text-[10px] text-muted-foreground block mb-1">Finished Image</label>
          <label className="block cursor-pointer rounded-sm border border-dashed border-border p-2 text-center hover:border-accent/50 transition-colors" style={{ background: 'hsl(220 15% 10%)' }}>
            <input type="file" onChange={e => handleFileSelect(e.target.files?.[0] || null, 'finished')} className="hidden" />
            {finishedPreview ? <img src={finishedPreview} alt="" className="w-16 h-16 object-cover rounded mx-auto" /> : <span className="font-ui text-[10px] text-muted-foreground">Select</span>}
          </label>
        </div>
      </div>
      <Textarea placeholder="Full Details" value={form.full_details} onChange={e => setForm(f => ({ ...f, full_details: e.target.value }))} className="bg-input border-border font-ui text-sm min-h-20" />
      <Input placeholder="Tags (comma separated)" value={form.related_tags} onChange={e => setForm(f => ({ ...f, related_tags: e.target.value }))} className="bg-input border-border font-ui text-sm" />
      <button type="submit" disabled={saving} className="w-full py-2 rounded-sm font-ui text-xs tracking-widest uppercase disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, hsl(0 60% 30%), hsl(0 60% 38%))', border: '1px solid hsl(42 70% 55% / 0.4)', color: 'hsl(42 70% 55%)' }}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

function UserList() {
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await supabase.from('captured_users' as any).select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg text-foreground">Registered Users ({users.length})</h2>
      {users.map((u: any) => (
        <div key={u.id} className="p-3 rounded-lg flex justify-between items-center" style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.2)' }}>
          <p className="font-ui text-sm text-foreground">{u.email}</p>
          <p className="font-ui text-[10px] text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

function Analytics() {
  const { data: logs = [] } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await supabase.from('activity_logs' as any).select('*').eq('action', 'whatsapp_checkout').order('created_at', { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-foreground">WhatsApp Analytics</h2>
      <div className="p-4 rounded-lg text-center" style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.3)' }}>
        <p className="font-display text-4xl text-gold-shimmer">{logs.length}</p>
        <p className="font-ui text-xs text-muted-foreground mt-1">Total WhatsApp Checkouts</p>
      </div>
      <div className="space-y-2">
        {logs.slice(0, 20).map((log: any) => (
          <div key={log.id} className="p-3 rounded-lg" style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.15)' }}>
            <div className="flex justify-between items-center">
              <p className="font-ui text-xs text-foreground">{log.user_email || 'Anonymous'}</p>
              <p className="font-ui text-[10px] text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
            </div>
            {log.details?.item_count && (
              <p className="font-ui text-[10px] text-accent mt-1">{log.details.item_count} items</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
