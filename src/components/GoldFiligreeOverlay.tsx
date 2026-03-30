import { motion } from 'framer-motion';

export default function GoldFiligreeOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 gold-filigree-bg" aria-hidden="true">
      {/* Floating gold particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + i * 0.5,
            height: 2 + i * 0.5,
            left: `${15 + i * 14}%`,
            top: `${10 + i * 12}%`,
            background: `radial-gradient(circle, hsl(42 70% 55% / 0.2), transparent)`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}
