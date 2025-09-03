/**
 * @fileoverview Unified Warehousing Management Page
 * @description The sole entry point for the warehousing feature, now simplified to render the main view.
 */
import WarehousingView from '@/features/core-operations/warehousing/views/warehousing-view';

export default async function WarehousingPage() {
  return <WarehousingView />;
}
