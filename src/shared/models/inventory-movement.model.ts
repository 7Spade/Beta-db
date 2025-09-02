/**
 * @fileoverview 庫存移動紀錄 Mongoose 模型
 * @description 定義了 inventory_movements 集合的資料結構。
 */
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInventoryMovement extends Document {
  itemId: string;
  type: 'inbound' | 'outbound' | 'transfer-out' | 'transfer-in' | 'adjust';
  quantity: number;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  transferId?: string;
  unitPrice?: number;
  timestamp: Date;
  operatorId: string;
  projectId?: string;
  notes?: string;
}

const MovementSchema: Schema<IInventoryMovement> = new Schema({
  itemId: { type: String, required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: ['inbound', 'outbound', 'transfer-out', 'transfer-in', 'adjust'],
  },
  quantity: { type: Number, required: true },
  fromWarehouseId: { type: String, index: true },
  toWarehouseId: { type: String, index: true },
  transferId: { type: String, index: true },
  unitPrice: { type: Number },
  timestamp: { type: Date, default: Date.now, index: true },
  operatorId: { type: String, required: true, index: true },
  projectId: { type: String, index: true },
  notes: { type: String },
});

const InventoryMovement: Model<IInventoryMovement> =
  mongoose.models.InventoryMovement ||
  mongoose.model<IInventoryMovement>('InventoryMovement', MovementSchema);

export default InventoryMovement;
