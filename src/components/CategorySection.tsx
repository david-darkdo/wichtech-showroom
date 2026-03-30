import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { ProductCategory } from '@/lib/types';
import categoryPaint from '@/assets/category-paint.jpg';
import categoryPlumbing from '@/assets/category-plumbing.jpg';
import categoryElectrical from '@/assets/category-electrical.jpg';
import categoryRoofing from '@/assets/category-roofing.jpg';

const categories: { name: ProductCategory; title: string; image: string }[] = [
  { name: 'Paint', title: 'Premium Paint', image: categoryPaint },
  { name: 'Plumbing', title: 'Luxury Bathroom System', image: categoryPlumbing },
  { name: 'Electrical', title: 'Designer Electrical Solutions', image: categoryElectrical },
  { name: 'Roofing', title: 'Architectural Zinc Roofing', image: categoryRoofing },
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
          className="text-center font-display text-2xl text-gold-shimmer mb-8"
        >
          Our Collections
        </motion.h2>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/category/${cat.name}`)}
              className="relative rounded-xl overflow-hidden text-center group"
              style={{
                boxShadow: '0 8px 30px -5px hsl(0 0% 0% / 0.6)',
              }}
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  width={512}
                  height={640}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Title below image */}
              <div className="py-3 px-2" style={{ background: 'hsl(220 15% 6%)' }}>
                <h3 className="font-display text-base font-extrabold text-foreground leading-tight tracking-wide">
                  {cat.title}
                </h3>
                <p className="font-ui text-xs font-bold text-gold-shimmer mt-1 uppercase tracking-widest">
                  {cat.name}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
