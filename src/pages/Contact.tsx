import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CircleCheck, LoaderCircle, Mail, MapPin } from 'lucide-react';
import { z } from 'zod';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { describedBy, FormField } from '../components/common/FormField';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import { site, socialLinks } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { isPublic } from '../utils/artworkFilters';
import { sendContactMessage } from '../utils/catalogApi';

const subjects = [
{ value: 'artwork', label: 'A question about an artwork' },
{ value: 'commission', label: 'Commission or wall painting' },
{ value: 'shipping', label: 'Shipping & delivery' },
{ value: 'general', label: 'Something else' }];


const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().trim().email('Enter a valid email address'),
  subject: z.string().min(1, 'Choose a subject'),
  artwork: z.string().optional(),
  message: z.string().trim().min(10, 'Please write a little more (at least 10 characters)')
});

type Values = z.infer<typeof schema>;
type Field = keyof Values;

export function Contact() {
  usePageMeta({ title: 'Contact', description: 'Questions about an artwork, commissions or shipping — get in touch with the studio.' });
  const [params] = useSearchParams();
  const { artworks } = usePublicCatalog();
  const initialArtwork = params.get('artwork') ?? '';
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    subject: initialArtwork ? 'artwork' : '',
    artwork: initialArtwork,
    message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (key: Field, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as Field;
        if (!next[k]) next[k] = i.message;
      });
      setErrors(next);
      const first = (['name', 'email', 'subject', 'message'] as Field[]).find((k) => next[k]);
      if (first) document.getElementById(`ct-${first}`)?.focus();
      return;
    }
    setState('sending');
    try {
      await sendContactMessage();
      setState('sent');
    } catch {
      setState('error');
    }
  };

  const publicArtworks = artworks.filter(isPublic);

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-28 pt-10 md:px-10 md:pt-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      <div className="mt-10 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h1 className="font-serif text-5xl font-normal leading-none md:text-7xl">Get in touch</h1>
          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
            Questions about a piece, shipping to your country, or a commission for your wall — I’d love to hear from you
            and usually reply within a few days.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-earth" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-earth" aria-hidden="true" />
              {site.location}
            </li>
          </ul>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {socialLinks.map((s) =>
            <li key={s.label}>
                <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.18em] underline-offset-4 hover:underline">
                
                  {s.label}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {state === 'sent' ?
          <div className="flex flex-col items-start bg-sand p-10" role="status">
              <CircleCheck className="size-8 text-[#6b7f4e]" strokeWidth={1.25} aria-hidden="true" />
              <h2 className="mt-6 font-serif text-4xl font-normal">Thank you — message received.</h2>
              <p className="mt-3 text-[15px] text-muted-foreground">
                I’ll reply to <span className="text-foreground">{values.email}</span> as soon as I can.
              </p>
              <Button
              variant="outline"
              className="mt-8 h-11 rounded-sm px-6"
              onClick={() => {
                setValues({ name: '', email: '', subject: '', artwork: '', message: '' });
                setState('idle');
              }}>
              
                Send another message
              </Button>
            </div> :

          <form onSubmit={submit} noValidate className="grid gap-6 sm:grid-cols-2">
              {state === 'error' &&
            <ErrorMessage
              className="sm:col-span-2"
              title="Message not sent"
              message="Something went wrong sending your message. Please try again, or email the studio directly." />

            }
              <FormField id="ct-name" label="Name" required error={errors.name}>
                <Input
                id="ct-name"
                autoComplete="name"
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy('ct-name', errors.name)}
                className="h-11 rounded-sm bg-card" />
              
              </FormField>
              <FormField id="ct-email" label="Email" required error={errors.email}>
                <Input
                id="ct-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy('ct-email', errors.email)}
                className="h-11 rounded-sm bg-card" />
              
              </FormField>
              <FormField id="ct-subject" label="Subject" required error={errors.subject} className="sm:col-span-2">
                <Select value={values.subject} onValueChange={(v) => set('subject', v)}>
                  <SelectTrigger id="ct-subject" className="h-11 w-full rounded-sm bg-card" aria-invalid={Boolean(errors.subject)}>
                    <SelectValue placeholder="What’s it about?" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) =>
                  <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                  )}
                  </SelectContent>
                </Select>
              </FormField>
              {values.subject === 'artwork' &&
            <FormField id="ct-artwork" label="Which artwork?" optional className="sm:col-span-2">
                  <Select value={values.artwork || undefined} onValueChange={(v) => set('artwork', v)}>
                    <SelectTrigger id="ct-artwork" className="h-11 w-full rounded-sm bg-card">
                      <SelectValue placeholder="Choose an artwork" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicArtworks.map((a) =>
                  <SelectItem key={a.id} value={a.slug}>
                          {a.title}
                        </SelectItem>
                  )}
                    </SelectContent>
                  </Select>
                </FormField>
            }
              <FormField id="ct-message" label="Message" required error={errors.message} className="sm:col-span-2">
                <Textarea
                id="ct-message"
                rows={7}
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy('ct-message', errors.message)}
                className="rounded-sm bg-card" />
              
              </FormField>
              <div className="sm:col-span-2">
                <Button
                type="submit"
                disabled={state === 'sending'}
                className="h-12 rounded-sm px-8 text-[12px] uppercase tracking-[0.2em]">
                
                  {state === 'sending' && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                  {state === 'sending' ? 'Sending…' : 'Send message'}
                </Button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>);

}