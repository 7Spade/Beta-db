'use client';

import { PublicProfileView } from '@/components/features/profile/public-profile-view';

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicProfileView userId={id} />;
}
