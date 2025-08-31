# MongoDB 資料庫設計 v1.0

**注意：此文件是 MongoDB 資料模型的唯一事實來源 (Single Source of Truth)，專門用於處理高頻寫入的流水帳式數據。**

## 1. 混合數據庫策略

為了兼顧成本效益與性能，我們採用混合數據庫策略：
- **Firestore**: 用於核心業務數據，需要即時同步到前端，且讀取頻率高於寫入頻率。詳情請見 [Firestore 資料庫設計](./database.md)。
- **MongoDB**: 用於日誌型、流水帳式的數據。這類數據的特點是**寫入頻繁、更新極少**。MongoDB 在處理這類高吞吐量的寫入操作時，成本效益和性能均優於 Firestore。

## 2. MongoDB 集合

### 2.1. `inventory_movements` (庫存移動紀錄)

此集合作為不可變的流水帳，記錄每一次庫存的變動歷史。**這是倉儲管理系統的核心。**

- **集合名稱**: `inventory_movements`
- **Mongoose 模型**: `InventoryMovement`

#### Mongoose Schema 設計
```typescript
import mongoose, { Schema, Document } from 'mongoose';

const MovementSchema: Schema = new Schema({
  itemId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['inbound', 'outbound', 'transfer-out', 'transfer-in', 'adjust'] 
  },
  quantity: { type: Number, required: true },
  fromWarehouseId: { type: String, index: true },
  toWarehouseId: { type: String, index: true },
  transferId: { type: String, index: true }, // 用於關聯 transfer-out 和 transfer-in
  unitPrice: { type: Number },
  timestamp: { type: Date, default: Date.now, index: true },
  operatorId: { type: String, required: true, index: true },
  projectId: { type: String, index: true },
  notes: { type: String },
});

// 在 production 環境中，避免重複編譯模型
export default mongoose.models.InventoryMovement || mongoose.model('InventoryMovement', MovementSchema);
```

### 2.2. `ai_token_logs` (AI Token 消耗紀錄)

此集合用於記錄每一次呼叫 Genkit AI 流程時的 Token 消耗，以便進行成本分析和用量監控。

- **集合名稱**: `ai_token_logs`
- **Mongoose 模型**: `AiTokenLog`

#### Mongoose Schema 設計
```typescript
import mongoose, { Schema, Document } from 'mongoose';

const AiTokenLogSchema: Schema = new Schema({
  flowName: { type: String, required: true, index: true },
  totalTokens: { type: Number, required: true },
  status: { type: String, enum: ['succeeded', 'failed'], required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  userId: { type: String, index: true },
  error: { type: String },
});

export default mongoose.models.AiTokenLog || mongoose.model('AiTokenLog', AiTokenLogSchema);
```
