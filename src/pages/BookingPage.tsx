import Booking from '../components/Booking';
import { usePageMeta } from '../lib/usePageTitle';

/** Dedicated booking page — opens at the top, with no homepage anchor scrolling. */
export default function BookingPage() {
  usePageMeta({
    title: 'Book a service',
    description:
      'Choose your treatment, pick a time that is really free, and hold it for 30 minutes. Booking at Anna\'s Beautistry, Cape Coast.',
    path: '/book',
  });
  return (
    <main>
      <Booking />
    </main>
  );
}
