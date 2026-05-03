import { Navbar } from '@/components/navbar';
import { DashedGrid } from '@/components/dashed-grid';
import { HeroSection } from '@/components/landing/hero-section';
import { ShowcaseSection } from '@/components/landing/showcase-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { CtaSection } from '@/components/landing/cta-section';
import { Footer } from '@/components/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative w-full">
      <DashedGrid fadeTop />
      <Navbar />

      <main className="flex-grow">
        <HeroSection />
        <ShowcaseSection />
        <HowItWorksSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
