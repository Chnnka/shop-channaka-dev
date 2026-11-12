import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FAQList } from '../common/FAQList';

export function FAQPreview() {
  return (
    <section
      aria-labelledby="faq-preview-heading"
      className="mx-auto mt-24 grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-12"
    >
      <div className="lg:col-span-4">
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-earth">
          Before you order
        </p>
        <h2 id="faq-preview-heading" className="font-serif text-4xl font-normal leading-tight">
          A few things to know.
        </h2>
        <Link
          to="/faq"
          className="mt-7 inline-flex items-center gap-2 border-b border-foreground pb-1 text-[12px] uppercase tracking-[0.18em] hover:text-earth"
        >
          Visit the FAQ <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="lg:col-span-7 lg:col-start-6">
        <FAQList limit={4} />
      </div>
    </section>
  );
}