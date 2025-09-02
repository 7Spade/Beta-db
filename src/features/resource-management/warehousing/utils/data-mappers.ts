/**
 * @fileoverview 數據映射工具
 * @description 統一的數據庫字段到 TypeScript 類型的轉換
 */

import type { InventoryCategory, InventoryItem, InventoryMovement, LeaseAgreement, Warehouse } from '@root/src/shared/types/types';

export const mapWarehouse = (db: any): Warehouse => ({
    id: db.id,
    name: db.name,
    location: db.location || undefined,
    isActive: db.is_active || false,
    createdAt: db.created_at ? new Date(db.created_at) : undefined,
    // 極簡租約信息
    leaseEndDate: db.lease_end_date ? new Date(db.lease_end_date) : undefined,
    monthlyRent: db.monthly_rent,
    lessorName: db.lessor_name,
});

export const mapInventoryItem = (db: any): InventoryItem => ({
    id: db.id,
    name: db.name,
    category: db.category,
    unit: db.unit,
    safeStockLevel: db.safe_stock_level,
    createdAt: db.created_at ? new Date(db.created_at) : undefined,
    itemType: db.item_type,
    hasExpiryTracking: db.has_expiry_tracking,
    requiresMaintenance: db.requires_maintenance,
    requiresInspection: db.requires_inspection,
    isSerialized: db.is_serialized,
});

export const mapInventoryCategory = (db: any): InventoryCategory => ({
    id: db.id,
    name: db.name,
    createdAt: db.created_at ? new Date(db.created_at) : undefined,
});

export const mapInventoryMovement = (db: any): InventoryMovement => ({
    ...db,
    timestamp: new Date(db.timestamp),
});

export const mapLeaseAgreement = (db: any): LeaseAgreement => ({
    id: db.id,
    warehouse_id: db.warehouse_id,
    lease_start_date: db.lease_start_date,
    lease_end_date: db.lease_end_date,
    monthly_rent: db.monthly_rent,
    lessor_name: db.lessor_name,
    contract_document_url: db.contract_document_url,
    status: db.status,
    createdAt: db.created_at ? new Date(db.created_at) : undefined,
});

// 極簡租約狀態檢查
export const getLeaseStatus = (leaseEndDate: Date | undefined) => {
    if (!leaseEndDate) return { status: '無租約', variant: 'secondary' as const };

    const now = new Date();
    const isExpired = leaseEndDate < now;

    return isExpired
        ? { status: '已過期', variant: 'destructive' as const }
        : { status: '正常', variant: 'default' as const };
};
