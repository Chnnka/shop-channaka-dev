import React from 'react';
import { site } from '../../data/site';
import { TextLink } from '../common/TextLink';

export function ArtistIntro() {
  return (
    <section aria-labelledby="artist-heading" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6 lg:col-start-1">
          <div className="aspect-[4/5] overflow-hidden bg-sand">
            <img
              src={site.studioImage}
              alt="The artist’s hands painting at a studio table scattered with pencils, brushes and river stones"
              loading="lazy"
              className="h-full w-full object-cover" />
            
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-earth">The artist</p>
          <h2 id="artist-heading" className="font-serif text-4xl font-normal leading-[1.08] md:text-[52px]">
            Self-taught, patient, and led by what the island offers.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              I never trained formally. I learned by drawing every day — elephants at the river, fishermen on the beach,
              the light moving over the hills — and by experimenting with whatever materials I could find.
            </p>
            <p>
              Today I work across pencil, paint, paper, mixed media and even river stones. Every piece is made by hand
              and exists only once.
            </p>
          </div>
          <TextLink to="/about" className="mt-10">
            Read my story
          </TextLink>
        </div>
      </div>
    </section>);

}