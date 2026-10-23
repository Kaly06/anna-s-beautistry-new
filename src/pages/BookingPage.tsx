import Booking from '../components/Booking';
import { usePageTitle } from '../lib/usePageTitle';

/** Dedicated booking page — opens at the top, with no homepage anchor scrolling. */
export default function BookingPage() {
  usePageTitle('Book a service');
  return (
    <main>
      <Booking />
    </main>
  );
}
