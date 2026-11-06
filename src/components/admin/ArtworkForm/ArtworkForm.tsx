import { Link } from 'react-router-dom';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { categories } from '../../../data/categories';
import { currencyConfig } from '../../../data/site';
import { useAdminCollections } from '../../../hooks/admin/useAdminCollections';
import type { Artwork, ArtworkCategory, Availability, LengthUnit, WeightUnit } from '../../../types/artwork';
import type { CurrencyCode } from '../../../types/commerce';
import { otherCurrency } from '../../../utils/artworkForm';
import { getCategory } from '../../../utils/categories';
import { availabilityLabels } from '../../artwork/AvailabilityBadge';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { describedBy, FormField } from '../../common/FormField';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { Input } from '../../ui/Input';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Switch } from '../../ui/Switch';
import { Textarea } from '../../ui/Textarea';
import { ImageUploader } from '../ImageUploader';
import { CategoryFields } from './CategoryFields';
import { FormSection } from './FormSection';
import { useArtworkForm } from './useArtworkForm';

const availabilityHelp: Record<Availability, string> = {
  available: 'Visible in the gallery and purchasable.',
  reserved: 'Visible, but checkout is disabled while a buyer is pending.',
  sold: 'Visible as sold. Cannot be purchased.',
  archived: 'Hidden from the public site.'
};

export function ArtworkForm({ artwork }: {artwork?: Artwork;}) {
  const { data: collections = [], isPending: collectionsLoading, isError: collectionsFailed } = useAdminCollections();
  const { values, errors, saving, uploading, setUploading, isDirty, blocker, setField, setSlug, setDetail, submit } = useArtworkForm(artwork);
  const definition = values.category ? getCategory(values.category) : null;

  const textInput = (
  key: 'title' | 'slug' | 'price' | 'alternatePrice' | 'height' | 'width' | 'depth' | 'weight' | 'year' | 'sku' | 'medium' | 'keywords' | 'seoTitle',
  label: string,
  opts: {required?: boolean;optional?: boolean;hint?: string;inputMode?: 'decimal' | 'numeric';className?: string;prefix?: string;} = {}) =>
  {
    const id = `af-${key}`;
    return (
      <FormField id={id} label={label} required={opts.required} optional={opts.optional} error={errors[key]} hint={opts.hint} className={opts.className}>
        <div className="relative">
          {opts.prefix &&
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{opts.prefix}</span>
          }
          <Input
            id={id}
            inputMode={opts.inputMode}
            value={values[key]}
            onChange={(e) => key === 'slug' ? setSlug(e.target.value) : setField(key, e.target.value)}
            aria-invalid={Boolean(errors[key])}
            aria-describedby={describedBy(id, errors[key], opts.hint)}
            className={opts.prefix ? 'h-10 pl-12' : 'h-10'} />
          
        </div>
      </FormField>);

  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/admin/artworks" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Artworks
          </Link>
          <h1 className="mt-2 font-serif text-4xl font-normal">{artwork ? `Edit “${artwork.title}”` : 'Add artwork'}</h1>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {isDirty ? 'You have unsaved changes.' : 'All changes saved.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/artworks"
            className="inline-flex h-10 items-center rounded-sm border border-border bg-card px-4 text-sm hover:border-foreground">
            
            Cancel
          </Link>
          <Button type="submit" disabled={saving || uploading} className="h-10 rounded-sm px-5">
            {(saving || uploading) && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {saving ? 'Saving…' : uploading ? 'Uploading images…' : artwork ? 'Save changes' : 'Create artwork'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <FormSection title="Basic information">
            <div className="grid gap-5 sm:grid-cols-2">
              {textInput('title', 'Title', { required: true, className: 'sm:col-span-2' })}
              {textInput('slug', 'URL slug', {
                required: true,
                hint: values.slug ? `/artwork/${values.slug}` : 'Generated from the title',
                className: 'sm:col-span-2'
              })}
              <FormField id="af-category" label="Category" required error={errors.category} className="sm:col-span-2">
                <Select value={values.category || undefined} onValueChange={(v) => setField('category', v as ArtworkCategory)}>
                  <SelectTrigger id="af-category" className="h-10 w-full" aria-invalid={Boolean(errors.category)}>
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) =>
                    <SelectItem key={c.id} value={c.id}>
                        {c.singular}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField id="af-description" label="Short description" optional className="sm:col-span-2">
                <Textarea id="af-description" rows={3} value={values.description} onChange={(e) => setField('description', e.target.value)} />
              </FormField>
              <FormField id="af-story" label="Artwork story" optional hint="Shown in the “story behind it” section." className="sm:col-span-2">
                <Textarea
                  id="af-story"
                  rows={4}
                  value={values.story}
                  onChange={(e) => setField('story', e.target.value)}
                  aria-describedby="af-story-hint" />
                
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Price" description="Prices are authoritative on the server. Never auto-converted.">
            <div className="grid gap-5 sm:grid-cols-3">
              <FormField id="af-currency" label="Currency" required>
                <Select value={values.currency} onValueChange={(v) => setField('currency', v as CurrencyCode)}>
                  <SelectTrigger id="af-currency" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyConfig.supported.map((c) =>
                    <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormField>
              {textInput('price', 'Price', { required: true, inputMode: 'decimal', prefix: values.currency })}
              {textInput('alternatePrice', `Price in ${otherCurrency(values.currency)}`, {
                optional: true,
                inputMode: 'decimal',
                prefix: otherCurrency(values.currency),
                hint: 'Set explicitly to sell in both currencies.'
              })}
            </div>
          </FormSection>

          <FormSection title="Images" description="Add the full artwork first, then details, room or studio shots.">
            <ImageUploader
              id="af-images"
              images={values.images}
              onChange={(imgs) => setField('images', imgs)}
              error={errors.images}
              onUploadingChange={setUploading} />
          </FormSection>

          <FormSection
            title="Dimensions & weight"
            description={definition ? undefined : 'Choose a category to see which measurements apply.'}>
            
            {definition ?
            <div className="space-y-5">
                {definition.dimensions !== 'hidden' &&
              <div className="grid gap-5 sm:grid-cols-4">
                    {textInput('height', 'Height', { required: definition.dimensions === 'required', optional: definition.dimensions === 'optional', inputMode: 'decimal' })}
                    {textInput('width', 'Width', { required: definition.dimensions === 'required', optional: definition.dimensions === 'optional', inputMode: 'decimal' })}
                    {textInput('depth', 'Depth', { optional: true, inputMode: 'decimal' })}
                    <FormField id="af-lengthUnit" label="Unit">
                      <Select value={values.lengthUnit} onValueChange={(v) => setField('lengthUnit', v as LengthUnit)}>
                        <SelectTrigger id="af-lengthUnit" className="h-10 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">Centimetres (cm)</SelectItem>
                          <SelectItem value="mm">Millimetres (mm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
              }
                {definition.dimensions === 'optional' &&
              <p className="text-xs text-muted-foreground">Dimensions are optional for irregular objects — leave blank if not useful.</p>
              }
                {definition.weight !== 'hidden' &&
              <div className="grid gap-5 sm:grid-cols-4">
                    {textInput('weight', 'Weight', {
                  required: definition.weight === 'required',
                  optional: definition.weight === 'optional',
                  inputMode: 'decimal'
                })}
                    <FormField id="af-weightUnit" label="Unit">
                      <Select value={values.weightUnit} onValueChange={(v) => setField('weightUnit', v as WeightUnit)}>
                        <SelectTrigger id="af-weightUnit" className="h-10 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">Grams (g)</SelectItem>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
              }
              </div> :

            <p className="text-sm text-muted-foreground">No category selected.</p>
            }
          </FormSection>

          {definition &&
          <FormSection title={`${definition.singular} details`} description="Fields specific to this category. All optional.">
              <div className="space-y-5">
                {textInput('medium', definition.mediumLabel, { optional: true })}
                <CategoryFields definition={definition} details={values.details} onChange={setDetail} />
              </div>
            </FormSection>
          }

          <FormSection title="Search & SEO" description="Leave blank to use the title and description.">
            <div className="grid gap-5">
              {textInput('keywords', 'Keywords', { optional: true, hint: 'Comma-separated, used by gallery search.' })}
              {textInput('seoTitle', 'SEO title', { optional: true, hint: `${values.seoTitle.length}/70` })}
              <FormField id="af-seoDescription" label="SEO description" optional error={errors.seoDescription} hint={`${values.seoDescription.length}/160`}>
                <Textarea
                  id="af-seoDescription"
                  rows={2}
                  value={values.seoDescription}
                  onChange={(e) => setField('seoDescription', e.target.value)}
                  aria-invalid={Boolean(errors.seoDescription)}
                  aria-describedby={describedBy('af-seoDescription', errors.seoDescription, 'x')} />
                
              </FormField>
            </div>
          </FormSection>
        </div>

        <div className="flex flex-col gap-6 xl:sticky xl:top-6 xl:self-start">
          <FormSection title="Availability">
            <RadioGroup value={values.availability} onValueChange={(v) => setField('availability', v as Availability)} className="gap-3" aria-label="Availability">
              {(Object.keys(availabilityHelp) as Availability[]).map((a) =>
              <label key={a} htmlFor={`af-av-${a}`} className="flex cursor-pointer items-start gap-3">
                  <RadioGroupItem id={`af-av-${a}`} value={a} className="mt-0.5" />
                  <span>
                    <span className="block text-sm">{availabilityLabels[a]}</span>
                    <span className="block text-xs text-muted-foreground">{availabilityHelp[a]}</span>
                  </span>
                </label>
              )}
            </RadioGroup>
          </FormSection>

          <FormSection title="Settings">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="af-featured" className="text-sm">
                  Featured artwork
                  <span className="block text-xs text-muted-foreground">Shown on the homepage.</span>
                </label>
                <Switch id="af-featured" checked={values.featured} onCheckedChange={(v) => setField('featured', v)} />
              </div>
              {textInput('year', 'Creation year', { optional: true, inputMode: 'numeric' })}
              {textInput('sku', 'Reference / ID', { optional: true })}
              <fieldset>
                <legend className="mb-3 text-[13px] font-medium">Collections</legend>
                <div className="space-y-2.5">
                  {collectionsLoading && <p className="text-xs text-muted-foreground">Loading collections…</p>}
                  {collectionsFailed && <p className="text-xs text-destructive">Collections couldn’t be loaded.</p>}
                  {!collectionsLoading && !collectionsFailed && collections.length === 0 &&
                  <p className="text-xs text-muted-foreground">No collections yet.</p>
                  }
                  {collections.map((c) => {
                    const id = `af-col-${c.id}`;
                    const checked = values.collectionIds.includes(c.id);
                    return (
                      <div key={c.id} className="flex items-center gap-2.5">
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={(v) =>
                          setField(
                            'collectionIds',
                            v === true ? [...values.collectionIds, c.id] : values.collectionIds.filter((x) => x !== c.id)
                          )
                          } />
                        
                        <label htmlFor={id} className="text-sm">
                          {c.title}
                          {!c.published && <span className="ml-1 text-xs text-muted-foreground">(unpublished)</span>}
                        </label>
                      </div>);

                  })}
                </div>
              </fieldset>
            </div>
          </FormSection>
        </div>
      </div>

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        onOpenChange={(o) => {
          if (!o && blocker.state === 'blocked') blocker.reset();
        }}
        title="Discard unsaved changes?"
        description="You’ve made changes to this artwork that haven’t been saved. If you leave now, they’ll be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        destructive
        onConfirm={() => blocker.state === 'blocked' && blocker.proceed()} />
      
    </form>);

}