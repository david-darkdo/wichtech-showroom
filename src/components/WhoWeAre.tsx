import { motion } from 'framer-motion';
import wichtechLogo from '@/assets/wichtech-logo.png';

const reasons = [
  {
    title: 'Uncompromising Quality',
    desc: "If it's not Wichtech, it's not premium. We only provide materials that are tested and trusted by professionals.",
  },
  {
    title: 'Sovereign Strength',
    desc: 'Our products—from Zinc roofing to Luxury plumbing—are built to last and designed to impress.',
  },
  {
    title: "The Professional's Choice",
    desc: 'We serve those who value precision, beauty, and long-term value.',
  },
];

export default function WhoWeAre() {
  return (
    <section className="relative py-20 px-4 overflow-hidden" style={{ background: 'hsl(216 56% 15%)' }}>
      {/* 3D Gold Border top & bottom */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 70% 55%), hsl(42 50% 40%), hsl(42 70% 55%), transparent)',
          boxShadow: '0 2px 12px hsl(42 70% 55% / 0.4)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 70% 55%), hsl(42 50% 40%), hsl(42 70% 55%), transparent)',
          boxShadow: '0 -2px 12px hsl(42 70% 55% / 0.4)',
        }}
      />

      {/* Watermark seal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={wichtechLogo}
          alt=""
          aria-hidden="true"
          className="w-64 h-64 object-contain opacity-[0.06]"
          style={{ filter: 'sepia(1) saturate(3) hue-rotate(10deg) brightness(1.2)' }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl md:text-4xl font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, hsl(42 70% 55%), hsl(42 50% 70%), hsl(42 70% 45%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 6px hsl(42 70% 55% / 0.3))',
          }}
        >
          Who We Are
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-body text-sm text-gold-shimmer tracking-widest uppercase mb-8"
        >
          The Standard of Excellence
        </motion.p>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="font-body text-base md:text-lg text-white/90 leading-relaxed mb-10"
        >
          We are <span className="font-semibold text-gold-shimmer">Wichtech Showroom and Festoon Project Company.</span> We
          don't just sell building materials; we provide the foundation for luxury.
        </motion.p>

        {/* Why Choose Us */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="font-display text-xl font-bold text-gold-shimmer mb-6"
        >
          Why Choose Us?
        </motion.h3>

        <div className="space-y-6 text-left">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
              className="relative pl-5 border-l-2"
              style={{ borderColor: 'hsl(42 70% 55% / 0.5)' }}
            >
              <h4 className="font-display text-base font-bold text-gold-shimmer mb-1">{r.title}</h4>
              <p className="font-body text-sm text-white/85 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 font-display text-lg font-bold tracking-wide"
          style={{
            background: 'linear-gradient(135deg, hsl(0 60% 35%), hsl(42 70% 55%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Maintaining Standard. Always.
        </motion.p>
      </div>
    </section>
  );
}
