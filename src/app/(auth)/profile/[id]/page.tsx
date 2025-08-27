'use client';

import { PublicProfileView } from '@/components/features/auth/public-profile-view';

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <PublicProfileView userId={id} />;
}
