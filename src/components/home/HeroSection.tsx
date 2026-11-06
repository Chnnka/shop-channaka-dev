import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { site } from '../../data/site';

export function HeroSection() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="hero-title" className="relative bg-sand">
      <div className="relative h-[68vh] min-h-[420px] w-full overflow-hidden md:h-[100svh] md:min-h-[680px]">
        <motion.img
          src={site.heroImage}
          alt="A large original painting of misty tea-country hills hanging on an ivory gallery wall"
          className="h-full w-full object-cover object-[60%_center]"
          initial={reduce ? false : { scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} />
        
      </div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto -mt-16 max-w-[1440px] px-5 md:absolute md:inset-x-0 md:bottom-12 md:mt-0 md:px-10">
        
        <div className="max-w-xl bg-ivory px-7 py-9 md:px-12 md:py-12">
          <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-earth">Original artworks · Sri Lanka</p>
          <h1 id="hero-title" className="font-serif text-[44px] font-normal leading-[1.02] text-foreground md:text-[64px]">
            Art inspired by nature, created by hand.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Drawings, paintings and painted river stones by a self-taught artist — each one an original, made slowly in a
            small studio on the island.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/gallery"
              className="inline-flex h-12 items-center bg-foreground px-7 text-[12px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-[#3a352f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              
              Explore the gallery
            </Link>
            <Link
              to="/about"
              className="border-b border-foreground pb-1 text-[12px] uppercase tracking-[0.2em] hover:border-earth hover:text-earth focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              
              Meet the artist
            </Link>
          </div>
        </div>
      </motion.div>
    </section>);

}