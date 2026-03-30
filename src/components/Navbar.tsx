import { Link } from 'react-router-dom';
import CartSheet from './CartSheet';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between"
      style={{
        background: 'linear-gradient(180deg, hsl(220 15% 8% / 0.95), hsl(220 15% 8% / 0.7))',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid hsl(42 30% 20% / 0.15)',
      }}
    >
      <Link to="/" className="font-display text-sm text-gold-shimmer tracking-wider">
        WICHTECH
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/admin" className="font-ui text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
          Admin
        </Link>
        <CartSheet />
      </div>
    </nav>
  );
}
