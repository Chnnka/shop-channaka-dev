export type CurrencyCode = 'LKR' | 'USD';

export interface CurrencyConfig {
  supported: CurrencyCode[];
  default: CurrencyCode;
  /**
   * Conversion is OFF by default. Rates must come from the backend —
   * the frontend never invents exchange rates.
   */
  conversion: {
    enabled: boolean;
    rates: Partial<Record<CurrencyCode, Partial<Record<CurrencyCode, number>>>>;
  };
}

export interface CartLine {
  artworkId: string;
  addedAt: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus =
'unfulfilled' |
'processing' |
'shipped' |
'delivered' |
'cancelled';

export interface Address {
  country: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode?: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface OrderLine {
  artworkId: string;
  title: string;
  categoryLabel: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  shippingAddress: Address;
  lines: OrderLine[];
  currency: CurrencyCode;
  subtotal: number;
  shipping: number | null;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
}

export type ShippingRegion = 'domestic' | 'international';

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  region: ShippingRegion;
  eta: string;
  /** null = cannot be calculated yet; confirmed after the order. */
  estimates: Partial<Record<CurrencyCode, number>> | null;
}

export interface PaymentOption {
  id: string;
  label: string;
  description: string;
  currencies: CurrencyCode[];
  regions: ShippingRegion[];
}