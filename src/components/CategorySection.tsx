import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { ProductCategory } from '@/lib/types';
import productRoofing from '@/assets/product-1.jpeg';
import productPaint from '@/assets/product-2.jpeg';
import productElectrical from '@/assets/product-3.jpeg';
import productPlumbing from '@/assets/product-4.jpeg';

const categories: { name: ProductCategory; title: string; image: string }[] = [
  { name: 'Roofing', title: 'Architectural Zinc Roofing', image: productRoofing },
  { name: 'Paint', title: 'Premium Paint', image: productPaint },
  { name: 'Electrical', title: 'Designer Electrical Solutions', image: productElectrical },
  { name: 'Plumbing', title: 'Luxury Bathroom System', image: productPlumbing },
];

export default function CategorySection() {
  const navigate = useNavigate();

  return (
    <section id="categories" className="relative py-12 px-4">
      <div className="max-w-lg mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-display text-2xl text-gold-shimmer mb-2"
        >
          Our Collections
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center font-body text-sm text-foreground/70 mb-8 max-w-md mx-auto leading-relaxed"
        >
          Premium building materials — plumbing, paint, electrical & roofing — curated for excellence.
        </motion.p>

        <div className="space-y-6">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/category/${cat.name}`)}
              className="relative w-full rounded-xl overflow-hidden text-left group block"
              style={{
                boxShadow: '0 8px 30px -5px hsl(0 0% 0% / 0.6)',
              }}
            >
              {/* Category label on top */}
              <div className="py-2 px-4" style={{ background: 'hsl(220 15% 10%)' }}>
                <p className="font-ui text-xs font-bold text-gold-shimmer uppercase tracking-widest">
                  {cat.name}
                </p>
              </div>

              {/* Image */}
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Title below image */}
              <div className="py-3 px-4" style={{ background: 'hsl(220 15% 6%)' }}>
                <h3 className="font-display text-base font-extrabold text-foreground leading-tight tracking-wide">
                  {cat.title}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
