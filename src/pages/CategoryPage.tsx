import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import GoldFiligreeOverlay from '@/components/GoldFiligreeOverlay';
import Footer from '@/components/Footer';
import type { Product } from '@/lib/types';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products' as any)
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Product[];
    },
  });

  return (
    <div className="min-h-screen relative">
      <GoldFiligreeOverlay />
      <Navbar />
      <main className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-ui text-sm mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <h1 className="font-display text-3xl text-gold-shimmer mb-2">{category}</h1>
          <p className="font-body text-muted-foreground mb-8">Browse our premium {category?.toLowerCase()} collection</p>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-muted-foreground">No products in this category yet.</p>
              <p className="font-ui text-xs text-muted-foreground/50 mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
