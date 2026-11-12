import { Plus } from 'lucide-react';
import { faqs } from '../../data/faqs';

interface FAQListProps {
  limit?: number;
}

export function FAQList({ limit }: FAQListProps) {
  const items = typeof limit === 'number' ? faqs.slice(0, limit) : faqs;

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
            <span className="font-serif text-xl font-normal leading-snug">{item.question}</span>
            <Plus
              className="size-4 shrink-0 text-earth transition-transform duration-200 group-open:rotate-45"
              aria-hidden="true"
            />
          </summary>
          <p className="max-w-3xl pt-4 pr-8 text-sm leading-relaxed text-[#4a443d]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}