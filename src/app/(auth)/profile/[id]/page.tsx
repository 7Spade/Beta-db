'use client';

import { use } from 'react';
import { PublicProfileView } from '@/components/features/profile/public-profile-view';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PublicProfileView userId={id} />;
}
