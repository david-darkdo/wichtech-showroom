import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, BarChart3, Package, Upload, LogIn, LogOut, Eye, EyeOff } from 'lucide-react';
import type { ProductCategory } from '@/lib/types';

type Tab = 'products' | 'users' | 'analytics' | 'upload';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setIsLoggedIn(true);
      toast.success('Welcome, Admin');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm p-6 rounded-lg" style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.3)' }}>
          <h1 className="font-display text-2xl text-gold-shimmer text-center mb-6">Admin Access</h1>
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

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl text-gold-shimmer">Command Center</h1>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-accent transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {([
            { id: 'upload' as Tab, icon: Upload, label: 'Upload' },
            { id: 'products' as Tab, icon: Package, label: 'Products' },
            { id: 'users' as Tab, icon: Users, label: 'Users' },
            { id: 'analytics' as Tab, icon: BarChart3, label: 'Analytics' },
          ]).map(tab => (
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
        {activeTab === 'users' && <UserList />}
        {activeTab === 'analytics' && <Analytics />}
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
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) return toast.error('Select a category');
    setLoading(true);
    try {
      const timestamp = Date.now();
      let product_image = null;
      let finished_result_image = null;

      if (productImage) {
        product_image = await uploadImage(productImage, `products/${timestamp}_${productImage.name}`);
      }
      if (finishedImage) {
        finished_result_image = await uploadImage(finishedImage, `finished/${timestamp}_${finishedImage.name}`);
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
    } catch (err: any) {
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
        <input type="file" accept="image/*" onChange={e => setProductImage(e.target.files?.[0] || null)} className="font-ui text-xs text-foreground" />
      </div>
      <div>
        <label className="font-ui text-xs text-muted-foreground block mb-1">Finished Result Image</label>
        <input type="file" accept="image/*" onChange={e => setFinishedImage(e.target.files?.[0] || null)} className="font-ui text-xs text-foreground" />
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
        <div key={p.id} className="p-3 rounded-lg" style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.2)' }}>
          <div className="flex justify-between">
            <div>
              <p className="font-body text-sm text-foreground">{p.product_name}</p>
              <p className="font-ui text-[10px] text-muted-foreground">{p.item_code} · {p.category}</p>
            </div>
            <p className="font-ui text-sm text-accent">₦{Number(p.price).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
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
