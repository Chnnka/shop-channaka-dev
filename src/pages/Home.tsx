import React from 'react';
import { ArtistIntro } from '../components/home/ArtistIntro';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { ClosingCta } from '../components/home/ClosingCta';
import { CollectionsShowcase } from '../components/home/CollectionsShowcase';
import { FeaturedArtworks } from '../components/home/FeaturedArtworks';
import { HeroSection } from '../components/home/HeroSection';
import { site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

export function Home() {
  usePageMeta({ title: site.name, image: site.heroImage });
  return (
    <>
      <HeroSection />
      <FeaturedArtworks />
      <CategoryShowcase />
      <ArtistIntro />
      <CollectionsShowcase />
      <ClosingCta />
    </>);

}