/**
 * @fileoverview 统一仓储管理页面
 * @description 仓储管理功能的唯一进入点，渲染包含标签页的主视图。
 */
'use server';

import { WarehousingView } from '@/features/resource-management/warehousing/views/warehousing-view';

export default async function WarehousingPage() {
  return <WarehousingView />;
}
