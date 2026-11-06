import React from 'react';
import { Compass } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { TextLink } from '../components/common/TextLink';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFound() {
  usePageMeta({ title: 'Page not found' });
  return (
    <EmptyState
      icon={Compass}
      title="This page has wandered off"
      description="The page you’re looking for doesn’t exist or has moved."
      action={<TextLink to="/gallery">Explore the gallery</TextLink>}
      className="py-40" />);


}