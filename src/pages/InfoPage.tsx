import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { TextLink } from '../components/common/TextLink';
import { careLinks } from '../data/site';
import { policies } from '../data/policies';
import { usePageMeta } from '../hooks/usePageMeta';
import { cn } from '../utils/cn';

export function InfoPage() {
  const { slug } = useParams();
  const policy = policies.find((p) => p.slug === slug);
  usePageMeta({ title: policy?.title ?? 'Information', description: policy?.intro });

  if (!policy) {
    return (
      <EmptyState icon={FileText} title="Page not found" action={<TextLink to="/">Back home</TextLink>} className="py-32" />);

  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-28 pt-10 md:px-10 md:pt-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: policy.title }]} />
      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <nav aria-label="Customer care" className="lg:col-span-3">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col">
            {careLinks.map((l) =>
            <li key={l.to}>
                <Link
                to={l.to}
                className={cn('text-sm', l.to.endsWith(policy.slug) ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground')}>
                
                  {l.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <article className="max-w-2xl lg:col-span-8 lg:col-start-5">
          <h1 className="font-serif text-5xl font-normal md:text-6xl">{policy.title}</h1>
          <p className="mt-5 text-[15px] text-muted-foreground">{policy.intro}</p>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {policy.sections.map((s) =>
            <section key={s.heading} className="py-8">
                <h2 className="font-serif text-2xl font-normal">{s.heading}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4a443d]">{s.body}</p>
              </section>
            )}
          </div>
        </article>
      </div>
    </div>);

}