import Booking from '../components/Booking';
import { usePageMeta } from '../lib/usePageTitle';

/** Dedicated booking page — opens at the top, with no homepage anchor scrolling. */
export default function BookingPage() {
  usePageMeta({
    title: 'Book a Service in Cape Coast',
    description:
      'Book wig installation, lashes, piercings or makeup at Anna\'s Beautistry in Cape Coast. Choose your treatment, pick a real opening time and hold it for 30 minutes.',
    keywords:
      "book beauty appointment Cape Coast, wig installation booking Cape Coast, lash appointment Cape Coast, piercing booking Cape Coast, makeup booking Cape Coast, Anna's Beautistry",
    path: '/book',
  });
  return (
    <main>
      <Booking />
    </main>
  );
}
