/**
 * @fileoverview Unified Warehousing Management Page
 * @description The sole entry point for the warehousing feature, now simplified to render the main view.
 */
'use server';

import { WarehousingView } from '@/features/resource-management/warehousing/views/warehousing-view';

export const dynamic = 'force-dynamic';

export default async function WarehousingPage() {
  return <WarehousingView />;
}
