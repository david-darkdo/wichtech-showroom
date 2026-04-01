import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import wichtechLogo from '@/assets/wichtech-logo.png';

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-6 flex items-center h-12 rounded overflow-hidden shadow-xl"
        >
          <div className="flex items-center justify-center h-full overflow-hidden">
            <img src={wichtechLogo} alt="Wichtech" className="h-full w-auto block" />
          </div>
          <div className="flex items-center justify-center h-full px-5" style={{ background: 'hsl(216 56% 20%)' }}>
            <span className="font-display text-lg text-white tracking-wider font-semibold">Wichtech</span>
          </div>
        </motion.div>

        {/* Company Name */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gold-shimmer font-ui text-xs tracking-[0.35em] uppercase mb-4"
        >
          Wichtech Festoon Project Showroom
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-display text-4xl md:text-6xl font-bold mb-8"
        >
          <span className="text-crimson-sheen">Mantaining</span>{' '}
          <span className="text-gold-shimmer">Standerd</span>
        </motion.h1>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group relative px-8 py-3 font-ui text-sm tracking-widest uppercase overflow-hidden rounded-sm"
          style={{
            background: 'linear-gradient(135deg, hsl(0 60% 30%), hsl(0 60% 38%))',
            border: '1px solid hsl(42 70% 55% / 0.5)',
            boxShadow: '0 0 25px -5px hsl(42 70% 55% / 0.2)',
          }}
        >
          <span className="relative z-10 text-gold-shimmer flex items-center gap-2">
            Explore Collection
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'hsl(42 70% 55%)' }} />
          </span>
        </motion.button>
      </div>
    </section>
  );
}
