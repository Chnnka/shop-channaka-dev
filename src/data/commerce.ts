import type { PaymentOption, ShippingMethod } from '../types/commerce';

export const domesticCountry = 'Sri Lanka';

export const countries = [
'Sri Lanka',
'Australia',
'Canada',
'France',
'Germany',
'India',
'Italy',
'Japan',
'Maldives',
'Netherlands',
'New Zealand',
'Singapore',
'Switzerland',
'United Arab Emirates',
'United Kingdom',
'United States',
'Other'];


/** Sample shipping estimates — final costs are confirmed by the studio/backend. */
export const shippingMethods: ShippingMethod[] = [
{
  id: 'lk-courier',
  label: 'Island-wide courier',
  description: 'Insured, tracked delivery anywhere in Sri Lanka.',
  region: 'domestic',
  eta: '2–4 working days',
  estimates: { LKR: 1500, USD: 5 }
},
{
  id: 'lk-collect',
  label: 'Studio collection',
  description: 'Collect in person by appointment — we’ll be in touch to arrange a time.',
  region: 'domestic',
  eta: 'By appointment',
  estimates: { LKR: 0, USD: 0 }
},
{
  id: 'intl-tracked',
  label: 'International tracked courier',
  description:
  'Professionally packed and insured. The exact cost depends on size and destination and is confirmed by email before dispatch.',
  region: 'international',
  eta: '7–14 working days',
  estimates: null
}];


/**
 * Payment options are configured per provider availability and merchant
 * eligibility. Card details are always entered on the provider's hosted page.
 */
export const paymentOptions: PaymentOption[] = [
{
  id: 'card-hosted',
  label: 'Card payment',
  description: 'Visa or Mastercard via our payment provider’s secure hosted page.',
  currencies: ['LKR', 'USD'],
  regions: ['domestic', 'international']
},
{
  id: 'bank-transfer',
  label: 'Bank transfer',
  description: 'We’ll email bank details. Your artwork is held for 48 hours.',
  currencies: ['LKR'],
  regions: ['domestic']
}];