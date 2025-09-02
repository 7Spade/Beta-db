/**
 * @fileoverview 數據映射工具
 * @description 統一的數據庫字段到 TypeScript 類型的轉換
 */

import type { InventoryCategory, InventoryItem, InventoryLevel, InventoryMovement, ItemLoan, SerialNumberTracking, Warehouse } from '@root/src/shared/types/types';

// 通用日期轉換函數
const parseDate = (date: string | null | undefined): Date | undefined =>
    date ? new Date(date) : undefined;

// 通用映射函數
const createMapper = <T>(mapper: (db: any) => T) => mapper;

export const mapWarehouse = createMapper<Warehouse>((db) => ({
    id: db.id,
    name: db.name,
    location: db.location || undefined,
    isActive: db.is_active || false,
    createdAt: parseDate(db.created_at),
    leaseEndDate: parseDate(db.lease_end_date),
    monthlyRent: db.monthly_rent,
    lessorName: db.lessor_name,
}));

export const mapInventoryItem = createMapper<InventoryItem>((db) => ({
    id: db.id,
    name: db.name,
    category: db.category,
    unit: db.unit,
    safeStockLevel: db.safe_stock_level,
    createdAt: parseDate(db.created_at),
    itemType: db.item_type,
    hasExpiryTracking: db.has_expiry_tracking,
    requiresMaintenance: db.requires_maintenance,
    requiresInspection: db.requires_inspection,
    isSerialized: db.is_serialized,
}));

export const mapInventoryCategory = createMapper<InventoryCategory>((db) => ({
    id: db.id,
    name: db.name,
    createdAt: parseDate(db.created_at),
}));

export const mapInventoryMovement = createMapper<InventoryMovement>((db) => ({
    id: db.id,
    item_id: db.item_id,
    warehouse_id: db.warehouse_id,
    type: db.type,
    quantity: db.quantity,
    unit_price: db.unit_price,
    project_id: db.project_id,
    notes: db.notes,
    operator_id: db.operator_id,
    operator_name: db.operator_name,
    timestamp: new Date(db.timestamp),
    recipient_name: db.recipient_name,
    recipient_department: db.recipient_department,
    expected_return_date: parseDate(db.expected_return_date),
    actual_return_date: parseDate(db.actual_return_date),
    status: db.status,
    serial_numbers: db.serial_numbers,
    purpose: db.purpose,
    approval_required: db.approval_required,
    approved_by: db.approved_by,
    approved_at: parseDate(db.approved_at),
}));

export const mapInventoryLevel = createMapper<InventoryLevel>((db) => ({
    id: db.id,
    itemId: db.item_id,
    warehouseId: db.warehouse_id,
    quantity: db.quantity,
    lastUpdated: new Date(db.last_updated),
}));

// 新增映射函數
export const mapItemLoan = createMapper<ItemLoan>((db) => ({
    id: db.id,
    movement_id: db.movement_id,
    item_id: db.item_id,
    warehouse_id: db.warehouse_id,
    borrower_name: db.borrower_name,
    borrower_department: db.borrower_department,
    borrower_contact: db.borrower_contact,
    loan_date: new Date(db.loan_date),
    expected_return_date: parseDate(db.expected_return_date),
    actual_return_date: parseDate(db.actual_return_date),
    return_condition: db.return_condition,
    status: db.status,
    notes: db.notes,
    created_at: new Date(db.created_at),
    updated_at: new Date(db.updated_at),
}));

export const mapSerialNumberTracking = createMapper<SerialNumberTracking>((db) => ({
    id: db.id,
    item_id: db.item_id,
    warehouse_id: db.warehouse_id,
    serial_number: db.serial_number,
    status: db.status,
    current_holder: db.current_holder,
    current_department: db.current_department,
    loan_date: parseDate(db.loan_date),
    expected_return_date: parseDate(db.expected_return_date),
    actual_return_date: parseDate(db.actual_return_date),
    notes: db.notes,
    created_at: new Date(db.created_at),
    updated_at: new Date(db.updated_at),
}));

// 租約狀態檢查
export const getLeaseStatus = (leaseEndDate: Date | undefined) => {
    if (!leaseEndDate) return { status: '無租約', variant: 'secondary' as const };

    const isExpired = leaseEndDate < new Date();
    return isExpired
        ? { status: '已過期', variant: 'destructive' as const }
        : { status: '正常', variant: 'default' as const };
};

// 借用狀態檢查
export const getLoanStatus = (expectedReturnDate: Date | undefined, status: string) => {
    if (!expectedReturnDate) return { status: '無歸還日期', variant: 'secondary' as const };

    const now = new Date();
    const isOverdue = expectedReturnDate < now;
    const isDueSoon = expectedReturnDate < new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    if (status === 'returned') return { status: '已歸還', variant: 'default' as const };
    if (status === 'overdue' || isOverdue) return { status: '已過期', variant: 'destructive' as const };
    if (isDueSoon) return { status: '即將到期', variant: 'warning' as const };
    return { status: '正常', variant: 'default' as const };
};
