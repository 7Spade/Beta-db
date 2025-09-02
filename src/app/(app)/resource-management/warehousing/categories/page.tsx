/**
 * @fileoverview Inventory Categories Page
 * @description The main page for managing inventory categories.
 */
'use server';

import { InventoryCategoriesView } from '@/features/resource-management/warehousing/views/inventory-categories-view';

export default async function InventoryCategoriesPage() {
  return (
    <div className="space-y-6">
      <InventoryCategoriesView />
    </div>
  );
}
