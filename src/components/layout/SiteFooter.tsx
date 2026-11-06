import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { categories } from '../../data/categories';
import { careLinks, primaryNav, site, socialLinks } from '../../data/site';

const heading = 'mb-5 text-[11px] uppercase tracking-[0.24em] text-earth';
const link = 'text-sm text-[#4a443d] transition-colors hover:text-foreground';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-sand">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <p className="font-serif text-3xl">{site.name}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{site.statement}</p>
          </div>
          <nav aria-label="Footer">
            <p className={heading}>Explore</p>
            <ul className="space-y-3">
              {primaryNav.map((n) =>
              <li key={n.to}>
                  <Link to={n.to} className={link}>
                    {n.label}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <div>
            <p className={heading}>Categories</p>
            <ul className="space-y-3">
              {categories.map((c) =>
              <li key={c.id}>
                  <Link to={`/gallery?category=${c.id}`} className={link}>
                    {c.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <p className={heading}>Customer care</p>
            <ul className="space-y-3">
              {careLinks.map((c) =>
              <li key={c.to}>
                  <Link to={c.to} className={link}>
                    {c.label}
                  </Link>
                </li>
              )}
              <li>
                <Link to="/contact" className={link}>
                  Ask about an artwork
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className={heading}>Contact</p>
            <ul className="space-y-3 text-sm text-[#4a443d]">
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="hover:text-foreground">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
                {site.phone}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-3.5 text-muted-foreground" aria-hidden="true" />
                {site.location}
              </li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map((s) =>
              <li key={s.label}>
                  <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-foreground underline-offset-4 hover:underline">
                  
                    {s.label}
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All artworks and images are the property of the artist.
          </p>
          <Link to="/admin" className="hover:text-foreground">
            Studio login
          </Link>
        </div>
      </div>
    </footer>);

}