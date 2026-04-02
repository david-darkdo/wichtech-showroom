import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Shield, Lock, Award } from 'lucide-react';
import MapPopup from './MapPopup';

export default function Footer() {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <footer className="relative py-12 px-4 border-t border-border/30">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Company Info */}
          <div className="text-center">
            <h3 className="font-display text-xl text-gold-shimmer mb-2">Wichtech Festoon Project ShowRoom</h3>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <a href="mailto:wichtechfestoonproject@gmail.com" className="flex items-center gap-3 text-sm font-body text-muted-foreground hover:text-accent transition-colors">
              <Mail className="w-4 h-4 text-accent" />
              wichtechfestoonproject@gmail.com
            </a>
            <a href="tel:+2348066886521" className="flex items-center gap-3 text-sm font-body text-muted-foreground hover:text-accent transition-colors">
              <Phone className="w-4 h-4 text-accent" />
              +234 806 688 6521
            </a>
            <a href="tel:+2347044915219" className="flex items-center gap-3 text-sm font-body text-muted-foreground hover:text-accent transition-colors">
              <Phone className="w-4 h-4 text-accent" />
              +234 704 491 5219
            </a>
            <button
              onClick={() => setShowMap(true)}
              className="flex items-center gap-3 text-sm font-body text-muted-foreground hover:text-accent transition-colors text-left"
            >
              <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
              Abuja Dei Dei, Nigeria
            </button>
          </div>

          {/* Social Icons */}
          <div>
            <p className="font-ui text-xs uppercase tracking-widest text-accent mb-3">Join Us</p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
                  style={{ background: 'hsl(220 15% 14%)', border: '1px solid hsl(42 30% 20% / 0.3)' }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 border-t border-border/20">
            <div className="flex justify-center gap-6 mb-4">
              {[
                { icon: Shield, label: 'Secure' },
                { icon: Lock, label: 'Encrypted' },
                { icon: Award, label: 'Trusted' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon className="w-5 h-5 text-accent/60" />
                  <span className="font-ui text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <a href="/system-login" className="block text-center font-ui text-[10px] text-muted-foreground/50 tracking-wider hover:text-muted-foreground/70 transition-colors cursor-pointer">
              © {new Date().getFullYear()} WICHTECH FESTOON PROJECT SHOWROOM. ALL RIGHTS RESERVED.
            </a>
          </div>
        </div>
      </footer>

      <MapPopup open={showMap} onClose={() => setShowMap(false)} />
    </>
  );
}
