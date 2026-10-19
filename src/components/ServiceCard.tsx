import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '../types';
import { EASE } from '../lib/animations';

interface ServiceCardProps {
  service: Service;
  index: number;
  className?: string;
}

export default function ServiceCard({ service, index, className = '' }: ServiceCardProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <m.article
      ref={ref}
      className={`group relative overflow-hidden bg-ink-800 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.2, ease: EASE, delay: (index % 2) * 0.12 }}
    >
      <m.div style={{ y }} className="absolute inset-x-0 -inset-y-[7%]">
        <img
          src={service.image}
          alt={`${service.name} at Anna's Beautistry`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.06]"
        />
      </m.div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/25 to-ink-950/10 transition-opacity duration-700 group-hover:from-ink-950" />
      <div className="absolute inset-0 bg-ink-950/10 transition-colors duration-700 group-hover:bg-ink-950/0" />

      <div className="absolute inset-3 border border-ivory-50/0 transition-colors duration-700 ease-luxe group-hover:border-gold-200/25 sm:inset-4" />

      <Link
        to={`/services/${service.id}`}
        data-cursor="view"
        data-cursor-label="View"
        aria-label={`View the ${service.name} menu`}
        className="absolute inset-0 z-20"
      >
        <span className="sr-only">{service.name} menu</span>
      </Link>

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-7">
        <div className="flex items-start justify-between">
          <span className="font-display text-sm italic text-gold-200/80">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-ivory-50/25 text-ivory-50 opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:border-gold-200/70 group-hover:text-gold-200 group-hover:opacity-100">
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.3} />
          </span>
        </div>

        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.32em] text-ivory-300/70">
            {service.count}
          </p>
          <h3 className="mt-3 font-display text-4xl font-light leading-none text-ivory-50 sm:text-5xl">
            {service.name}
          </h3>
          <div className="grid grid-rows-[0fr] transition-all duration-700 ease-luxe group-hover:grid-rows-[1fr]">
            <p className="overflow-hidden font-sans text-xs font-light leading-relaxed text-ivory-200/70 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <span className="block pt-4">{service.description}</span>
            </p>
          </div>
          <span className="mt-5 inline-flex items-center gap-2 font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-gold-200">
            See the menu
            <span className="h-px w-6 bg-gold-300/60 transition-all duration-500 ease-luxe group-hover:w-10" />
          </span>
        </div>
      </div>
    </m.article>
  );
}
