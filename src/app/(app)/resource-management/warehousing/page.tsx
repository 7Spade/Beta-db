/**
 * @fileoverview Unified Warehousing Management Page
 * @description The sole entry point for the warehousing feature, rendering the main tabbed view.
 */
'use server';

import { WarehousingView } from '@/features/resource-management/warehousing/views/warehousing-view';

export default async function WarehousingPage() {
  return <WarehousingView />;
}
