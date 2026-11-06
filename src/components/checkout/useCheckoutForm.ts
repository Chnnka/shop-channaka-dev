import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ApiError } from '../../api/apiClient';
import { useCart } from '../../contexts/CartContext';
import { domesticCountry, paymentOptions, shippingMethods } from '../../data/commerce';
import { useCreateOrder } from '../../hooks/useCreateOrder';
import type { ShippingRegion } from '../../types/commerce';
import { getShippingEstimate } from '../../utils/pricing';

/** 'availability': an artwork was bought or reserved by someone else while this customer checked out */
export type CheckoutErrorKind = 'availability' | 'unknown';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.
  string().
  trim().
  regex(/^\+?[\d\s()-]{7,20}$/, 'Enter a valid phone number, including country code'),
  country: z.string().min(1, 'Select your country'),
  line1: z.string().trim().min(3, 'Enter your street address'),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, 'Enter your city or town'),
  region: z.string().trim().min(2, 'Enter your province, state or region'),
  postalCode: z.string().trim().max(12, 'Postal code looks too long').optional(),
  shippingMethodId: z.string().min(1, 'Choose a shipping method'),
  paymentOptionId: z.string().min(1, 'Choose a payment method'),
  acceptTerms: z.boolean().refine((v) => v, 'Please accept the terms of sale to continue')
});

export type CheckoutValues = z.infer<typeof schema>;
export type CheckoutField = keyof CheckoutValues;

const fieldOrder: CheckoutField[] = [
'name',
'email',
'phone',
'country',
'line1',
'line2',
'city',
'region',
'postalCode',
'shippingMethodId',
'paymentOptionId',
'acceptTerms'];


const initialValues: CheckoutValues = {
  name: '',
  email: '',
  phone: '',
  country: domesticCountry,
  line1: '',
  line2: '',
  city: '',
  region: '',
  postalCode: '',
  shippingMethodId: '',
  paymentOptionId: '',
  acceptTerms: false
};

function toSubmitError(err: unknown): {kind: CheckoutErrorKind;message: string;} {
  if (!(err instanceof ApiError)) {
    return { kind: 'unknown', message: 'Something unexpected happened. Please try again.' };
  }
  if (err.status === 409) {
    return {
      kind: 'availability',
      message: 'Someone else has just reserved or bought an artwork in your cart. Please review your cart and try again.'
    };
  }
  // Validation errors come back per field; the form checks the same rules, so show them together
  const fieldMessages = Object.entries(err.fieldErrors).map(([field, message]) => `${field}: ${message}`);
  return { kind: 'unknown', message: fieldMessages.length ? fieldMessages.join('; ') : err.message };
}

export function useCheckoutForm() {
  const { items, currency, subtotal, clear } = useCart();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  const [values, setValues] = useState<CheckoutValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<CheckoutField, string>>>({});
  const submitting = createOrder.isPending;
  const [submitError, setSubmitError] = useState<{kind: CheckoutErrorKind;message: string;} | null>(null);
  const placedRef = useRef(false);

  const region: ShippingRegion = values.country === domesticCountry ? 'domestic' : 'international';
  const availableShipping = useMemo(() => shippingMethods.filter((m) => m.region === region), [region]);
  const availablePayments = useMemo(
    () => paymentOptions.filter((p) => p.currencies.includes(currency) && p.regions.includes(region)),
    [currency, region]
  );

  useEffect(() => {
    setValues((v) => {
      const shippingOk = availableShipping.some((m) => m.id === v.shippingMethodId);
      const paymentOk = availablePayments.some((p) => p.id === v.paymentOptionId);
      if (shippingOk && paymentOk) return v;
      return {
        ...v,
        shippingMethodId: shippingOk ? v.shippingMethodId : availableShipping[0]?.id ?? '',
        paymentOptionId: paymentOk ? v.paymentOptionId : availablePayments[0]?.id ?? ''
      };
    });
  }, [availableShipping, availablePayments]);

  const selectedShipping = availableShipping.find((m) => m.id === values.shippingMethodId);
  const shippingAmount = selectedShipping ? getShippingEstimate(selectedShipping, currency) : undefined;

  function setField<K extends CheckoutField>(key: K, value: CheckoutValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => e[key] ? { ...e, [key]: undefined } : e);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<CheckoutField, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as CheckoutField;
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      const first = fieldOrder.find((k) => next[k]);
      if (first) document.getElementById(`co-${first}`)?.focus();
      return;
    }
    const shippingMethod = availableShipping.find((m) => m.id === values.shippingMethodId);
    const paymentOption = availablePayments.find((p) => p.id === values.paymentOptionId);
    if (!shippingMethod || !paymentOption) return;

    try {
      // The server looks up prices, shipping and availability itself, so only IDs are sent
      const order = await createOrder.mutateAsync({
        customer: { name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() },
        shippingAddress: {
          country: values.country,
          line1: values.line1.trim(),
          line2: values.line2?.trim() || undefined,
          city: values.city.trim(),
          region: values.region.trim(),
          postalCode: values.postalCode?.trim() || undefined
        },
        artworkIds: items.map((i) => i.line.artworkId),
        currency,
        shippingMethodId: shippingMethod.id,
        paymentOptionId: paymentOption.id
      });
      placedRef.current = true;
      // There's no public "get order" endpoint, so the confirmation page reads the order from here
      navigate(`/order/${order.orderNumber}`, { replace: true, state: { order } });
      clear();
    } catch (err) {
      setSubmitError(toSubmitError(err));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return {
    values,
    errors,
    setField,
    submit,
    submitting,
    submitError,
    region,
    availableShipping,
    availablePayments,
    shippingAmount,
    subtotal,
    currency,
    items,
    placedRef
  };
}