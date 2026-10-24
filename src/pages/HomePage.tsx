import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/ui/Marquee';
import Services from '../components/Services';
import Signatures from '../components/Signatures';
import Studio from '../components/Studio';
import Statement from '../components/Statement';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { MARQUEE } from '../data/services';
import { usePageMeta } from '../lib/usePageTitle';

export default function HomePage({ introDone }: { introDone: boolean }) {
  usePageMeta({ path: '/' });
  return (
    <>
      <Navbar />
      <main>
        <Hero introDone={introDone} />
        <Marquee phrases={MARQUEE} />
        <Services />
        <Signatures />
        <Studio />
        <Statement />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
