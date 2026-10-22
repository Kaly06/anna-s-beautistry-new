import { Link } from 'react-router-dom';
import { HOUSE } from '../data/house';
import Monogram from '../components/ui/Monogram';

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink-950 py-32">
      <div className="container-luxe text-center">
        {HOUSE.logoSrc ? (
          <img
            src={HOUSE.logoSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="mx-auto h-16 w-auto object-contain"
          />
        ) : (
          <Monogram className="mx-auto h-10 w-10 text-gold-300" />
        )}
        <p className="eyebrow mt-8">404</p>
        <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-tight text-ivory-50">
          Nothing booked here.
        </h1>
        <p className="mx-auto mt-5 max-w-sm font-sans text-[12px] font-light leading-relaxed text-ivory-400">
          The page you wanted has moved or never existed. The menu is the best place to start.
        </p>
        <Link to="/" className="btn-ghost mt-10">
          Back to the house
        </Link>
      </div>
    </section>
  );
}
