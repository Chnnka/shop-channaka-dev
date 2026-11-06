import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ArtworkGrid } from '../components/artwork/ArtworkGrid';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { TextLink } from '../components/common/TextLink';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import { categories } from '../data/categories';
import { site, socialLinks } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { isPublic } from '../utils/artworkFilters';

export function About() {
  const { artworks, status } = usePublicCatalog();
  usePageMeta({
    title: 'About the Artist',
    description: 'The story, philosophy and materials behind a self-taught artist working in Sri Lanka.',
    image: site.studioImage
  });
  const selected = artworks.filter((a) => isPublic(a) && a.featured).slice(0, 4);

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-[1440px] px-5 pt-10 md:px-10 md:pt-14">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About the Artist' }]} />
        <div className="mt-10 grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-earth">About the artist</p>
            <h1 className="font-serif text-5xl font-normal leading-[1.02] md:text-7xl">
              Learning to see, one drawing at a time.
            </h1>
            <p className="mt-8 max-w-lg text-[17px] leading-relaxed text-[#4a443d]">
              I’m a self-taught artist living and working in Sri Lanka. My work moves between pencil, paint, paper,
              mixed media and painted river stones — but it always begins with looking closely at the world around me.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="aspect-[4/5] overflow-hidden bg-sand">
              <img
                src={site.studioImage}
                alt="The artist at work in a small studio, painting with a fine brush among pencils and river stones"
                className="h-full w-full object-cover" />
              
            </div>
            <p className="mt-3 text-xs text-muted-foreground">In the studio. [Replace with an artist portrait.]</p>
          </div>
        </div>
      </header>

      <section aria-labelledby="bio" className="mx-auto mt-28 grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-12">
        <h2 id="bio" className="font-serif text-4xl font-normal lg:col-span-4">
          My story
        </h2>
        <div className="space-y-5 text-[15px] leading-relaxed text-[#4a443d] lg:col-span-7 lg:col-start-6">
          <p>
            [Placeholder biography — replace with the artist’s own words.] I started drawing as a child with whatever was
            at hand: school pencils, scraps of paper, smooth stones from the riverbank. Without formal training, I learned
            by copying what I saw, making mistakes and trying again.
          </p>
          <p>
            Over the years, drawing became painting, and painting became an exploration of materials — layering paper and
            paste, staining with tea, working on walls and stones as well as canvas.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-[1440px] gap-px overflow-hidden border border-border bg-border px-0 md:grid-cols-2 lg:mx-10 lg:max-w-none xl:mx-auto xl:max-w-[1360px]">
        <div className="bg-ivory p-10 md:p-14">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-earth">Philosophy</p>
          <h2 className="font-serif text-3xl font-normal leading-tight">Slow work, made to last.</h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            I believe a piece of art should reward a second and third look. I work slowly, building surfaces in layers,
            and I only release a piece when it feels finished — never to a deadline.
          </p>
        </div>
        <div className="bg-ivory p-10 md:p-14">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-earth">Inspiration</p>
          <h2 className="font-serif text-3xl font-normal leading-tight">The island, observed closely.</h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            Wildlife, birds, misty hill country, ancient places and the people who live alongside them. And sometimes,
            stories that only exist in imagination.
          </p>
        </div>
      </section>

      <section aria-labelledby="media" className="mx-auto mt-28 max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-earth">Media & techniques</p>
            <h2 id="media" className="font-serif text-4xl font-normal leading-tight">
              Seven ways of making
            </h2>
          </div>
          <ul className="divide-y divide-border border-y border-border lg:col-span-7 lg:col-start-6">
            {categories.map((c) =>
            <li key={c.id} className="grid gap-2 py-5 sm:grid-cols-[220px_1fr] sm:gap-8">
                <span className="font-serif text-xl">{c.label}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{c.description}</span>
              </li>
            )}
          </ul>
        </div>
      </section>

      <section aria-labelledby="selected" className="mx-auto mt-28 max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="selected" className="font-serif text-4xl font-normal">
            Selected works
          </h2>
          <TextLink to="/gallery">Visit the gallery</TextLink>
        </div>
        <ArtworkGrid artworks={selected} loading={status === 'loading'} skeletonCount={4} className="mt-12" />
      </section>

      <section className="mx-auto mt-28 max-w-3xl px-5 text-center">
        <h2 className="font-serif text-3xl font-normal">Follow along in the studio</h2>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {socialLinks.map((s) =>
          <li key={s.label}>
              <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.2em] underline-offset-4 hover:underline">
              
                {s.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          )}
        </ul>
      </section>
    </div>);

}