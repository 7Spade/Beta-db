'use client';

import { PublicProfileView } from '@root/src/features/system-administration/profile/public-profile-view';
import { use } from 'react';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PublicProfileView userId={id} />;
}
