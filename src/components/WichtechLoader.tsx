import wichtechLogo from '@/assets/wichtech-logo.png';

export default function WichtechLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Logo with pulse-glow animation */}
        <div className="relative">
          <img
            src={wichtechLogo}
            alt="Loading..."
            className="h-16 w-auto animate-wichtech-pulse"
          />
          {/* Glow ring behind logo */}
          <div className="absolute inset-0 -m-3 rounded-full animate-wichtech-ring"
            style={{
              background: 'radial-gradient(circle, hsl(0 60% 28% / 0.3) 0%, transparent 70%)',
            }}
          />
        </div>
        {/* Subtle loading dots */}
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-shimmer animate-wichtech-dot1" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold-shimmer animate-wichtech-dot2" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold-shimmer animate-wichtech-dot3" />
        </div>
      </div>
    </div>
  );
}
