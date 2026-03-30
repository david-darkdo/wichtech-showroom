import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const inCart = items.some(i => i.item_code === product.item_code);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative rounded-lg overflow-hidden group cursor-pointer"
      style={{
        background: 'linear-gradient(145deg, hsl(220 15% 12%), hsl(220 15% 9%))',
        border: '1px solid hsl(42 30% 20% / 0.3)',
        boxShadow: '0 4px 20px -5px hsl(0 0% 0% / 0.4)',
      }}
    >
      {/* Image */}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative aspect-square overflow-hidden"
      >
        {product.product_image ? (
          <img
            src={product.product_image}
            alt={product.product_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ShoppingCart className="w-8 h-8 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="p-3" onClick={() => navigate(`/product/${product.id}`)}>
        <p className="font-body text-sm text-foreground truncate">{product.product_name}</p>
        <p className="font-ui text-[10px] text-muted-foreground">{product.item_code}</p>
        <p className="font-display text-lg text-accent mt-1">₦{product.price.toLocaleString()}</p>
      </div>

      {/* Add to cart button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!inCart) {
            addItem({
              product_name: product.product_name,
              item_code: product.item_code,
              price: product.price,
            });
          }
        }}
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
        style={{
          background: inCart ? 'hsl(42 70% 55%)' : 'hsl(0 60% 35%)',
          border: '1px solid hsl(42 70% 55% / 0.4)',
          color: inCart ? 'hsl(220 15% 8%)' : 'hsl(42 70% 55%)',
        }}
      >
        <Plus className={`w-4 h-4 transition-transform ${inCart ? 'rotate-45' : ''}`} />
      </button>
    </motion.div>
  );
}
