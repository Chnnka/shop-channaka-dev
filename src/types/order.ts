import type { Address, CurrencyCode, Customer, FulfillmentStatus, PaymentStatus } from './commerce';

/**
 * Body for POST /api/orders. The client only sends IDs: the server looks up prices,
 * shipping and availability itself. Server rules worth knowing:
 * - artworkIds: 1–20, no duplicates, each must still be available
 * - shippingMethodId must match the address (domestic or international)
 * - paymentOptionId must support the currency and the region
 */
export interface CreateOrderPayload {
  customer: Customer;
  shippingAddress: Address;
  artworkIds: string[];
  currency: CurrencyCode;
  shippingMethodId: string;
  paymentOptionId: string;
}

/** Body for PATCH /api/admin/orders/:id: at least one of the two */
export type OrderStatusPatch = Partial<{ paymentStatus: PaymentStatus; fulfillmentStatus: FulfillmentStatus }>;
