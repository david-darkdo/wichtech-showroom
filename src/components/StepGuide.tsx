import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Send, MessageSquare } from 'lucide-react';

const steps = [
  { icon: Eye, title: 'Browse & Select', desc: 'Explore our premium collections and add items to your Wheelbarrow.' },
  { icon: ShoppingCart, title: 'Review Your Wheelbarrow', desc: 'Check your selected items, names, codes, and prices.' },
  { icon: Send, title: 'Ship to WhatsApp', desc: 'One tap sends your entire list directly to Wichtech management.' },
  { icon: MessageSquare, title: 'Finalize with Us', desc: 'Our team reviews your list — discuss payment, delivery, or visit our office.' },
];

export default function StepGuide() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-display text-2xl text-gold-shimmer mb-2"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-body text-muted-foreground mb-10"
        >
          Your step-by-step guide to ordering
        </motion.p>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, hsl(220 15% 12%), hsl(220 15% 10%))',
                border: '1px solid hsl(42 30% 20% / 0.3)',
              }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-accent font-ui text-sm font-bold"
                style={{ background: 'hsl(42 70% 55% / 0.1)', border: '1px solid hsl(42 70% 55% / 0.3)' }}
              >
                {i + 1}
              </div>
              <div>
                <h3 className="font-display text-foreground mb-1">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
