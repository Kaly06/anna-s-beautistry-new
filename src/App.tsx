import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import GalleryPage from './pages/GalleryPage';
import ServicesPage from './pages/ServicesPage';
import ServicePage from './pages/ServicePage';
import WigsOptionsPage from './pages/WigsOptionsPage';
import AdminClosures from './pages/AdminClosures';
import NotFound from './pages/NotFound';
import {
  FEATURES,
  WIG_OPTIONS_PREVIEW_KEY,
  WIG_OPTIONS_STORAGE_KEY,
} from './lib/features';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/ui/Loader';
import ScrollProgress from './components/ui/ScrollProgress';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Route changes should always start at the top of the new page. */
function ScrollToTop() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Booking used to live at /#book. Send old links to the dedicated page,
    // preserving any preselected service or treatment in the query string.
    if (hash === '#book') {
      navigate({ pathname: '/book', search }, { replace: true });
      return;
    }

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
  }, [pathname, hash, search, navigate]);

  return null;
}

/**
 * The wigs options sheet is built but not live. While the feature is off it
 * answers 404 like any unknown page — unless this browser has unlocked the
 * private preview with ?preview=<key> (remembered in localStorage).
 */
function WigOptionsGate() {
  const [searchParams] = useSearchParams();
  const previewParam = searchParams.get('preview');

  useEffect(() => {
    if (previewParam === WIG_OPTIONS_PREVIEW_KEY) {
      window.localStorage.setItem(WIG_OPTIONS_STORAGE_KEY, '1');
    }
  }, [previewParam]);

  const unlocked =
    FEATURES.wigOptionsSheet ||
    previewParam === WIG_OPTIONS_PREVIEW_KEY ||
    window.localStorage.getItem(WIG_OPTIONS_STORAGE_KEY) === '1';

  return unlocked ? <WigsOptionsPage /> : <NotFound />;
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
        <Route path="/book" element={<BookingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/wigs/options" element={<WigOptionsGate />} />
        <Route path="/services/:serviceId" element={<ServicePage />} />
        <Route path="/services/:serviceId/:slug" element={<ServicePage />} />
        <Route path="/admin" element={<AdminClosures />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isHome ? null : <Footer />}
    </div>
  );
}
