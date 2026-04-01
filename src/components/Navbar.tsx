import { Link } from 'react-router-dom';
import CartSheet from './CartSheet';
import wichtechLogo from '@/assets/wichtech-logo.png';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between"
      style={{
        background: 'linear-gradient(180deg, hsl(220 15% 8% / 0.95), hsl(220 15% 8% / 0.7))',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid hsl(42 30% 20% / 0.15)',
      }}
    >
      <Link to="/" className="flex items-center h-9 rounded overflow-hidden shadow-lg">
        {/* Red section with logo icon */}
        <div className="flex items-center justify-center h-full overflow-hidden">
          <img src={wichtechLogo} alt="Wichtech" className="h-full w-auto block" />
        </div>
        {/* Dark blue section with Wichtech text */}
        <div className="flex items-center justify-center h-full px-3" style={{ background: 'hsl(216 56% 20%)' }}>
          <span className="font-display text-sm text-white tracking-wider font-semibold">Wichtech</span>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <CartSheet />
      </div>
    </nav>
  );
}
