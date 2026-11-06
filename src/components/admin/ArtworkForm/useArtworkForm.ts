import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useBlocker, useNavigate, type BlockerFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { ApiError } from '../../../api/apiClient';
import { useAdminArtworks } from '../../../hooks/admin/useAdminArtworks';
import { useCreateArtwork } from '../../../hooks/admin/useCreateArtwork';
import { useUpdateArtwork } from '../../../hooks/admin/useUpdateArtwork';
import type { Artwork } from '../../../types/artwork';
import {
  fromFormValues,
  toFormErrors,
  toFormValues,
  validateArtworkForm,
  type ArtworkFormErrors,
  type ArtworkFormValues } from
'../../../utils/artworkForm';
import { slugify } from '../../../utils/categories';

const focusOrder = ['title', 'slug', 'category', 'price', 'alternatePrice', 'images', 'height', 'width', 'depth', 'weight', 'medium', 'keywords', 'seoTitle', 'seoDescription', 'year', 'sku'];

function focusField(key: string) {
  const el = document.getElementById(`af-${key}`);
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el?.focus({ preventScroll: true });
}

export function useArtworkForm(existing?: Artwork) {
  const { data: artworks = [] } = useAdminArtworks();
  const createArtwork = useCreateArtwork();
  const updateArtwork = useUpdateArtwork();
  const navigate = useNavigate();
  const initial = useMemo(() => toFormValues(existing), [existing]);
  const [values, setValues] = useState<ArtworkFormValues>(initial);
  const [errors, setErrors] = useState<ArtworkFormErrors>({});
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(existing));
  const allowLeaveRef = useRef(false);
  const saving = createArtwork.isPending || updateArtwork.isPending;

  const isDirty = JSON.stringify(values) !== JSON.stringify(initial);
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;

  const blocker = useBlocker(
    useCallback<BlockerFunction>(
      ({ currentLocation, nextLocation }) =>
      dirtyRef.current && !allowLeaveRef.current && currentLocation.pathname !== nextLocation.pathname,
      []
    )
  );

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  function setField<K extends keyof ArtworkFormValues>(key: K, value: ArtworkFormValues[K]) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      if (key === 'title' && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
    setErrors((e) => {
      if (!e[key as string] && !(key === 'title' && e.slug)) return e;
      const copy = { ...e };
      delete copy[key as string];
      if (key === 'title' && !slugTouched) delete copy.slug;
      return copy;
    });
  }

  function setSlug(value: string) {
    setSlugTouched(true);
    setField('slug', value);
  }

  function setDetail(key: string, value: string | boolean) {
    setValues((v) => ({ ...v, details: { ...v.details, [key]: value } }));
  }

  function showErrors(nextErrors: ArtworkFormErrors) {
    setErrors(nextErrors);
    const first = focusOrder.find((k) => nextErrors[k]);
    if (first) focusField(first);
    return Boolean(first);
  }

  // The server is the final check: show its validation messages on the matching fields
  function handleSaveError(error: unknown) {
    if (!(error instanceof ApiError)) {
      toast.error('Saving failed. Your changes are still here — please try again.');
      return;
    }
    if (error.status === 409) {
      showErrors({ slug: 'Another artwork already uses this slug' });
      toast.error('Please choose a different URL slug.');
      return;
    }
    const { errors: serverErrors, unmatched } = toFormErrors(error.fieldErrors);
    const shown = showErrors(serverErrors);
    if (unmatched.length) {
      toast.error(`Saving failed: ${unmatched.join('; ')}`);
    } else if (shown) {
      toast.error('Please fix the highlighted fields.');
    } else {
      toast.error(`${error.message} Your changes are still here.`);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (uploading) {
      toast.error('Please wait for the images to finish uploading.');
      return;
    }
    const taken = artworks.filter((a) => a.id !== existing?.id).map((a) => a.slug);
    if (showErrors(validateArtworkForm(values, taken))) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    const payload = fromFormValues(values);
    const onSuccess = (saved: Artwork) => {
      allowLeaveRef.current = true;
      toast.success(existing ? `“${saved.title}” saved` : `“${saved.title}” added to the catalogue`);
      navigate('/admin/artworks');
    };
    if (existing) {
      updateArtwork.mutate({ id: existing.id, payload }, { onSuccess, onError: handleSaveError });
    } else {
      createArtwork.mutate(payload, { onSuccess, onError: handleSaveError });
    }
  }

  return { values, errors, saving, uploading, setUploading, isDirty, blocker, setField, setSlug, setDetail, submit };
}
