import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import GoldFiligreeOverlay from '@/components/GoldFiligreeOverlay';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem, items } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products' as any)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as unknown as Product;
    },
  });

  const { data: similarProducts = [] } = useQuery({
    queryKey: ['similar-products', product?.related_tags, product?.id],
    enabled: !!product,
    queryFn: async () => {
      if (!product?.related_tags?.length) return [];
      const { data, error } = await supabase
        .from('products' as any)
        .select('*')
        .neq('id', product.id)
        .overlaps('related_tags', product.related_tags)
        .limit(6);
      if (error) throw error;
      return (data || []) as unknown as Product[];
    },
  });

  const inCart = product ? items.some(i => i.item_code === product.item_code) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <Navbar />
        <div className="pt-20 px-4 max-w-lg mx-auto space-y-4">
          <div className="aspect-square rounded-lg bg-muted animate-pulse" />
          <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <Navbar />
        <p className="font-body text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <GoldFiligreeOverlay />
      <Navbar />
      <main className="relative z-10 pt-16">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full aspect-square overflow-hidden"
        >
          {product.product_image ? (
            <img src={product.product_image} alt={product.product_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground font-body">No image</p>
            </div>
          )}
        </motion.div>

        {/* Finished Result Image */}
        {product.finished_result_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full aspect-video overflow-hidden"
          >
            <img src={product.finished_result_image} alt={`${product.product_name} in use`} className="w-full h-full object-cover" />
            <div className="px-4 py-2"
              style={{ background: 'linear-gradient(180deg, hsl(220 15% 10%), hsl(220 15% 8%))' }}
            >
              <p className="font-ui text-[10px] uppercase tracking-widest text-accent/60">Finished Result</p>
            </div>
          </motion.div>
        )}

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 py-6 space-y-4"
        >
          <div>
            <Link to={`/category/${product.category}`} className="font-ui text-[10px] uppercase tracking-widest text-accent/60 hover:text-accent transition-colors">
              {product.category}
            </Link>
            <h1 className="font-display text-2xl text-foreground mt-1">{product.product_name}</h1>
            <p className="font-ui text-xs text-muted-foreground">Code: {product.item_code}</p>
          </div>

          <p className="font-display text-3xl text-gold-shimmer">₦{product.price.toLocaleString()}</p>

          {product.full_details && (
            <div className="p-4 rounded-lg" style={{ background: 'hsl(220 15% 12%)', border: '1px solid hsl(42 30% 20% / 0.2)' }}>
              <p className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{product.full_details}</p>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={() => {
              if (!inCart) {
                addItem({
                  product_name: product.product_name,
                  item_code: product.item_code,
                  price: product.price,
                });
              }
            }}
            className="w-full py-3 rounded-sm font-ui text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
            style={{
              background: inCart ? 'hsl(42 70% 55% / 0.1)' : 'linear-gradient(135deg, hsl(0 60% 30%), hsl(0 60% 38%))',
              border: `1px solid ${inCart ? 'hsl(42 70% 55% / 0.5)' : 'hsl(42 70% 55% / 0.4)'}`,
              color: 'hsl(42 70% 55%)',
            }}
          >
            {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {inCart ? 'In Wheelbarrow' : 'Add to Wheelbarrow'}
          </button>

          {/* Tags */}
          {product.related_tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.related_tags.map(tag => (
                <span key={tag} className="px-2 py-1 rounded-full font-ui text-[10px] text-muted-foreground"
                  style={{ background: 'hsl(220 15% 14%)', border: '1px solid hsl(42 30% 20% / 0.2)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="px-4 pb-8">
            <div className="h-px w-full mb-8" style={{ background: 'linear-gradient(90deg, transparent, hsl(42 70% 55% / 0.2), transparent)' }} />
            <h2 className="font-display text-xl text-gold-shimmer mb-4">Similar Products</h2>
            <div className="grid grid-cols-2 gap-4">
              {similarProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
