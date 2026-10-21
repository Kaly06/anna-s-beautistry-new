import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServicePage from './pages/ServicePage';
import WigsOptionsPage from './pages/WigsOptionsPage';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/ui/Loader';
import ScrollProgress from './components/ui/ScrollProgress';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Route changes should always start at the top of the new page. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the destination section exists before measuring.
      const id = hash.slice(1);
      const frame = requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [loading, setLoading] = useState(!prefersReducedMotion);
  const [introDone, setIntroDone] = useState(prefersReducedMotion);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const finishIntro = useCallback(() => {
    setLoading(false);
    setIntroDone(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <div className="relative min-h-screen bg-ink-950">
      <ScrollProgress />
      <ScrollToTop />

      <AnimatePresence>
        {loading ? <Loader key="loader" onDone={finishIntro} /> : null}
      </AnimatePresence>

      {isHome ? null : <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage introDone={introDone} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/wigs/options" element={<WigsOptionsPage />} />
        <Route path="/services/:serviceId" element={<ServicePage />} />
        <Route path="/services/:serviceId/:slug" element={<ServicePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isHome ? null : <Footer />}
    </div>
  );
}
