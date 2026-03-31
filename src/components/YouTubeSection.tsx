import { motion } from 'framer-motion';

export default function YouTubeSection() {
  return (
    <section className="py-12 px-4" style={{ background: 'hsl(220 15% 8%)' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{ border: '1px solid hsl(42 30% 20% / 0.3)' }}
        >
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/Am1hJqwx_CM?autoplay=0&rel=0"
              title="Wichtech Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
