import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Droplets, Paintbrush, Zap, Home } from 'lucide-react';
import type { ProductCategory } from '@/lib/types';

const categories: { name: ProductCategory; icon: typeof Droplets; desc: string }[] = [
  { name: 'Plumbing', icon: Droplets, desc: 'Faucets, pipes, fixtures & fittings' },
  { name: 'Paint', icon: Paintbrush, desc: 'Premium coatings & finishes' },
  { name: 'Electrical', icon: Zap, desc: 'Wiring, switches & lighting' },
  { name: 'Roofing', icon: Home, desc: 'Sheets, tiles & waterproofing' },
];

export default function CategorySection() {
  const navigate = useNavigate();

  return (
    <section id="categories" className="relative py-16 px-4">
      <div className="max-w-lg mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-display text-2xl text-gold-shimmer mb-10"
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
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/category/${cat.name}`)}
              className="relative p-6 rounded-lg text-left overflow-hidden group"
              style={{
                background: 'linear-gradient(145deg, hsl(220 15% 12%), hsl(220 15% 9%))',
                border: '1px solid hsl(42 30% 20% / 0.4)',
                boxShadow: '0 4px 20px -5px hsl(0 0% 0% / 0.5)',
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at center, hsl(42 70% 55% / 0.05), transparent 70%)' }}
              />
              <cat.icon className="w-8 h-8 mb-3 text-accent" />
              <h3 className="font-display text-lg text-foreground mb-1">{cat.name}</h3>
              <p className="font-body text-sm text-muted-foreground">{cat.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
