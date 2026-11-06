import React from 'react';

export function FormSection({
  title,
  description,
  children




}: {title: string;description?: string;children: React.ReactNode;}) {
  const id = `section-${title.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  return (
    <section aria-labelledby={id} className="rounded-sm border border-border bg-card">
      <div className="border-b border-border px-5 py-4 md:px-6">
        <h2 id={id} className="font-medium">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>);

}