import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { cn } from '../../utils/cn';
import { SectionHeading } from '../common/SectionHeading';

export function CategoryShowcase() {
  return (
    <section aria-labelledby="categories-heading" className="bg-sand py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Browse by medium"
          title="Seven ways of making"
          description="From quiet graphite studies to murals and painted river stones — explore the work by how it was made." />
        
        <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-5 lg:gap-x-8">
          {categories.map((c, i) =>
          <li key={c.id} className={cn(i === 0 && 'col-span-2 md:row-span-2')}>
              <Link
              to={`/gallery?category=${c.id}`}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              
                <div className={cn('overflow-hidden bg-linen', i === 0 ? 'aspect-[4/3] md:aspect-[1/1.1]' : 'aspect-square')}>
                  <img
                  src={c.coverImage}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                
                </div>
                <h3 className={cn('mt-4 font-serif leading-tight', i === 0 ? 'text-3xl' : 'text-xl md:text-[22px]')}>
                  {c.label}
                </h3>
                {i === 0 && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{c.description}</p>}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </section>);

}