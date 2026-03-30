import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Send } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import SignupPrompt from './SignupPrompt';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSheet() {
  const { items, removeItem, clearCart, itemCount } = useCart();
  const [showSignup, setShowSignup] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCheckout = async () => {
    const email = localStorage.getItem('wichtech-email');
    if (!email) {
      setShowSignup(true);
      return;
    }
    await sendToWhatsApp();
  };

  const sendToWhatsApp = async () => {
    // Log the action
    try {
      await supabase.from('activity_logs' as any).insert({
        action: 'whatsapp_checkout',
        details: { items, item_count: items.length },
        user_email: localStorage.getItem('wichtech-email'),
      } as any);
    } catch {}

    const orderText = items.map((item, i) =>
      `${i + 1}. ${item.product_name} (Code: ${item.item_code}) - ₦${item.price.toLocaleString()}`
    ).join('\n');

    const message = encodeURIComponent(
      `🏗️ *WICHTECH ORDER REQUEST*\n\n${orderText}\n\n📧 ${localStorage.getItem('wichtech-email') || 'N/A'}\n\nPlease confirm availability and pricing.`
    );

    window.open(`https://wa.me/2348066886521?text=${message}`, '_blank');
    clearCart();
    setOpen(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="relative p-2">
            <ShoppingCart className="w-5 h-5 text-accent" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-ui font-bold flex items-center justify-center"
                style={{ background: 'hsl(0 60% 35%)', color: 'hsl(42 70% 55%)' }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="bg-card border-border w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="font-display text-gold-shimmer">Your Wheelbarrow</SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex-1 overflow-y-auto space-y-3">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.item_code}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'hsl(220 15% 14%)', border: '1px solid hsl(42 30% 20% / 0.2)' }}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-body text-sm text-foreground truncate">{item.product_name}</p>
                    <p className="font-ui text-xs text-muted-foreground">Code: {item.item_code}</p>
                    <p className="font-ui text-xs text-accent">₦{item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeItem(item.item_code)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="font-body text-muted-foreground">Your wheelbarrow is empty</p>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="mt-6 space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-sm font-ui text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(0 60% 30%), hsl(0 60% 38%))',
                  border: '1px solid hsl(42 70% 55% / 0.4)',
                  color: 'hsl(42 70% 55%)',
                }}
              >
                <Send className="w-4 h-4" />
                Ship to WhatsApp
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <SignupPrompt
        open={showSignup}
        onClose={() => setShowSignup(false)}
        onSuccess={() => {
          setShowSignup(false);
          sendToWhatsApp();
        }}
      />
    </>
  );
}
