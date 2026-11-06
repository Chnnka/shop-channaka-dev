import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LoaderCircle, Lock, ShieldCheck } from 'lucide-react';
import { ChoiceOption } from '../components/checkout/ChoiceOption';
import { CheckoutOrderSummary } from '../components/checkout/CheckoutOrderSummary';
import { useCheckoutForm, type CheckoutField } from '../components/checkout/useCheckoutForm';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { describedBy, FormField } from '../components/common/FormField';
import { PrototypeNotice } from '../components/common/PrototypeNotice';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Input } from '../components/ui/Input';
import { RadioGroup } from '../components/ui/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useCart } from '../contexts/CartContext';
import { countries } from '../data/commerce';
import { usePageMeta } from '../hooks/usePageMeta';
import { formatPrice } from '../utils/format';
import { getShippingEstimate } from '../utils/pricing';

const inputClass = 'h-11 rounded-sm bg-card';

export function Checkout() {
  usePageMeta({ title: 'Checkout' });
  const { count, hasIssues } = useCart();
  const form = useCheckoutForm();
  const { values, errors, setField, submit, submitting, submitError, region, currency } = form;

  if (!form.placedRef.current && (count === 0 || hasIssues)) return <Navigate to="/cart" replace />;

  const text = (key: CheckoutField, label: string, opts: {type?: string;autoComplete?: string;optional?: boolean;hint?: string;className?: string;} = {}) =>
  <FormField
    id={`co-${key}`}
    label={label}
    required={!opts.optional}
    optional={opts.optional}
    error={errors[key]}
    hint={opts.hint}
    className={opts.className}>
    
      <Input
      id={`co-${key}`}
      type={opts.type ?? 'text'}
      autoComplete={opts.autoComplete}
      value={String(values[key] ?? '')}
      onChange={(e) => setField(key, e.target.value as never)}
      aria-invalid={Boolean(errors[key])}
      aria-describedby={describedBy(`co-${key}`, errors[key], opts.hint)}
      className={inputClass}
      disabled={submitting} />
    
    </FormField>;


  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-28 pt-10 md:px-10 md:pt-14">
      <Breadcrumbs items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-6 font-serif text-5xl font-normal md:text-6xl">Checkout</h1>
      <PrototypeNotice className="mt-6 max-w-2xl">
        Online payment isn’t connected yet: placing an order reserves the artworks and creates the order as pending.
        No payment is taken here.
      </PrototypeNotice>

      {submitError &&
      <ErrorMessage
        className="mt-6 max-w-2xl"
        title={submitError.kind === 'availability' ? 'An artwork is no longer available' : 'Order not placed'}
        message={submitError.message} />

      }
      {submitError?.kind === 'availability' &&
      <Link to="/cart" className="mt-3 inline-block text-sm underline underline-offset-4">
          Review your cart
        </Link>
      }

      <form onSubmit={submit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div className="flex flex-col gap-14">
          <Section step={1} title="Your details">
            <div className="grid gap-5 sm:grid-cols-2">
              {text('name', 'Full name', { autoComplete: 'name', className: 'sm:col-span-2' })}
              {text('email', 'Email address', { type: 'email', autoComplete: 'email', hint: 'For your order confirmation.' })}
              {text('phone', 'Phone number', { type: 'tel', autoComplete: 'tel', hint: 'Include your country code, e.g. +94' })}
            </div>
          </Section>

          <Section step={2} title="Shipping address">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="co-country" label="Country" required error={errors.country} className="sm:col-span-2">
                <Select value={values.country} onValueChange={(v) => setField('country', v)} disabled={submitting}>
                  <SelectTrigger id="co-country" className="h-11 w-full rounded-sm bg-card" aria-invalid={Boolean(errors.country)}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) =>
                    <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormField>
              {text('line1', 'Address line 1', { autoComplete: 'address-line1', className: 'sm:col-span-2' })}
              {text('line2', 'Address line 2', { autoComplete: 'address-line2', optional: true, className: 'sm:col-span-2' })}
              {text('city', 'City / town', { autoComplete: 'address-level2' })}
              {text('region', region === 'domestic' ? 'Province / district' : 'State / province / region', {
                autoComplete: 'address-level1'
              })}
              {text('postalCode', 'Postal / ZIP code', {
                autoComplete: 'postal-code',
                optional: true,
                hint: 'Where applicable'
              })}
            </div>
          </Section>

          <Section step={3} title="Shipping method">
            <RadioGroup
              id="co-shippingMethodId"
              value={values.shippingMethodId}
              onValueChange={(v) => setField('shippingMethodId', v)}
              className="gap-3"
              aria-label="Shipping method">
              
              {form.availableShipping.map((m) => {
                const est = getShippingEstimate(m, currency);
                return (
                  <ChoiceOption
                    key={m.id}
                    id={`ship-${m.id}`}
                    value={m.id}
                    selected={values.shippingMethodId === m.id}
                    title={m.label}
                    description={m.description}
                    meta={m.eta}
                    aside={est == null ? 'Quoted by email' : est === 0 ? 'Free' : `${formatPrice(est, currency)} est.`} />);


              })}
            </RadioGroup>
            {errors.shippingMethodId && <p className="mt-2 text-xs text-destructive">{errors.shippingMethodId}</p>}
          </Section>

          <Section step={4} title="Payment">
            {form.availablePayments.length ?
            <RadioGroup
              id="co-paymentOptionId"
              value={values.paymentOptionId}
              onValueChange={(v) => setField('paymentOptionId', v)}
              className="gap-3"
              aria-label="Payment method">
              
                {form.availablePayments.map((p) =>
              <ChoiceOption
                key={p.id}
                id={`pay-${p.id}`}
                value={p.id}
                selected={values.paymentOptionId === p.id}
                title={p.label}
                description={p.description}
                meta={`Available in ${p.currencies.join(' & ')}`} />

              )}
              </RadioGroup> :

            <ErrorMessage
              title="No payment method available"
              message={`There’s no payment method for ${currency} orders to this destination yet. Try switching currency in your cart, or contact us.`} />

            }
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-earth" aria-hidden="true" />
              Card details are entered only on our payment provider’s secure page — they never touch this website.
            </p>

            <div className="mt-8 flex items-start gap-3">
              <Checkbox
                id="co-acceptTerms"
                checked={values.acceptTerms}
                onCheckedChange={(v) => setField('acceptTerms', v === true)}
                aria-invalid={Boolean(errors.acceptTerms)}
                aria-describedby={errors.acceptTerms ? 'co-acceptTerms-error' : undefined}
                disabled={submitting} />
              
              <div>
                <label htmlFor="co-acceptTerms" className="text-sm">
                  I agree to the{' '}
                  <Link to="/info/terms" className="underline underline-offset-4" target="_blank">
                    terms of sale
                  </Link>{' '}
                  and understand each artwork is a unique original.
                </label>
                {errors.acceptTerms &&
                <p id="co-acceptTerms-error" className="mt-1 text-xs text-destructive" role="alert">
                    {errors.acceptTerms}
                  </p>
                }
              </div>
            </div>
          </Section>

          <div className="flex flex-col gap-3 border-t border-border pt-8">
            <Button
              type="submit"
              disabled={submitting || !form.availablePayments.length}
              className="h-12 rounded-sm text-[12px] uppercase tracking-[0.2em]">
              
              {submitting ?
              <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  Processing securely…
                </> :

              <>
                  <Lock className="size-4" aria-hidden="true" />
                  Place order
                </>
              }
            </Button>
            <p className="text-center text-xs text-muted-foreground" aria-live="polite">
              {submitting ? 'Confirming availability and payment — please don’t close this page.' : `You’ll be charged in ${currency}.`}
            </p>
          </div>
        </div>

        <aside className="order-first lg:order-none lg:sticky lg:top-28 lg:self-start">
          <CheckoutOrderSummary
            items={form.items}
            currency={currency}
            subtotal={form.subtotal}
            shipping={form.shippingAmount}
            international={region === 'international'} />
          
        </aside>
      </form>
    </div>);

}

function Section({ step, title, children }: {step: number;title: string;children: React.ReactNode;}) {
  return (
    <section aria-labelledby={`step-${step}`}>
      <h2 id={`step-${step}`} className="mb-6 flex items-baseline gap-3 font-serif text-3xl font-normal">
        <span className="text-base text-earth">{String(step).padStart(2, '0')}</span>
        {title}
      </h2>
      {children}
    </section>);

}