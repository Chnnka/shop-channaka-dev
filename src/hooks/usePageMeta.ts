import { useEffect } from 'react';
import { site } from '../data/site';

interface PageMeta {
  title: string;
  description?: string;
  image?: string;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets document title plus description and social-sharing metadata. */
export function usePageMeta({ title, description, image }: PageMeta) {
  useEffect(() => {
    const fullTitle = title === site.name ? `${site.name} — ${site.tagline}` : `${title} · ${site.name}`;
    document.title = fullTitle;
    const desc = description ?? site.statement;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'website');
    if (image) setMeta('property', 'og:image', image);
  }, [title, description, image]);
}