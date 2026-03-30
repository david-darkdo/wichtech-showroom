import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import StepGuide from '@/components/StepGuide';
import Footer from '@/components/Footer';
import GoldFiligreeOverlay from '@/components/GoldFiligreeOverlay';

export default function Index() {
  return (
    <div className="min-h-screen relative">
      <GoldFiligreeOverlay />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <CategorySection />
        <StepGuide />
      </main>
      <Footer />
    </div>
  );
}
