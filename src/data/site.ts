import type { CurrencyConfig } from '../types/commerce';

export const site = {
  name: 'Kalā Studio',
  tagline: 'Original art from Sri Lanka',
  statement:
  'Hand-made drawings and paintings by a self-taught artist in Sri Lanka. Every piece is an original, one of a kind, and inspired by the island’s wildlife, landscapes and quiet everyday moments.',
  email: 'channakagunawardana@gmail.com',
  phone: '+94 70 587 1797',
  location: 'Sri Lanka · studio visits by appointment',
  heroImage: "/8b56be80-b9b6-4a68-9aed-a6ce67db8541.jpg",

  studioImage: "/6624039a-203b-4386-9718-d4428b481e30.jpg"

};

export const primaryNav = [
{ label: 'Home', to: '/' },
{ label: 'Gallery', to: '/gallery' },
{ label: 'Collections', to: '/collections' },
{ label: 'About the Artist', to: '/about' },
{ label: 'Contact', to: '/contact' }];


/** Placeholder profiles — replace with the artist's real URLs. */
export const socialLinks = [
{ label: 'Instagram', href: 'https://www.instagram.com/ch_paintings/' },
{ label: 'Facebook', href: 'https://www.facebook.com/chnnkasg/' },
{ label: 'YouTube', href: 'https://www.youtube.com/@ch_paintings' }];


export const careLinks = [
{ label: 'Shipping', to: '/info/shipping' },
{ label: 'Returns', to: '/info/returns' },
{ label: 'Privacy Policy', to: '/info/privacy' },
{ label: 'Terms of Sale', to: '/info/terms' }];


export const currencyConfig: CurrencyConfig = {
  supported: ['LKR', 'USD'],
  default: 'LKR',
  conversion: { enabled: false, rates: {} }
};