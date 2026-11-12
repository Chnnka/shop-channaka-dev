import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FAQList } from '../components/common/FAQList';
import { usePageMeta } from '../hooks/usePageMeta';
import { site } from '../data/site';

export function FAQ() {
  usePageMeta({
    title: 'Frequently Asked Questions',
    description: 'Answers about original artworks, delivery, framing, exchanges and payment.',
  });

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-28 pt-10 md:px-10 md:pt-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
      <header className="mt-10 max-w-3xl">
        <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-earth">Customer care</p>
        <h1 className="font-serif text-5xl font-normal leading-[1.02] md:text-7xl">
          Frequently asked questions
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
          Details on artwork, orders and delivery from {site.name}.
        </p>
      </header>
      <section className="mt-14 grid gap-10 lg:grid-cols-12" aria-label="Frequently asked questions">
        <p className="text-[11px] uppercase tracking-[0.28em] text-earth lg:col-span-3">
          Orders, artwork & delivery
        </p>
        <div className="lg:col-span-8 lg:col-start-5">
          <FAQList />
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            Still have a question?{' '}
            <Link to="/contact" className="inline-flex items-center gap-1 text-foreground underline underline-offset-4">
              Contact us <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}