'use client';

import { PublicProfileView } from '@/features/profile/public-profile-view';
import { use } from 'react';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PublicProfileView userId={id} />;
}
