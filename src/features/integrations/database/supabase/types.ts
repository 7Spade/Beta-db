/**
 * @fileoverview Supabase Database Types
 * @description 基于 Supabase 官方推荐的类型定义结构
 * 
 * 注意：这些类型应该与你的 Supabase 资料库 schema 保持一致
 * 建议使用 Supabase CLI 的 `supabase gen types typescript` 命令自动生成
 */

// ============================================================================
// 基础类型
// ============================================================================
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// AI Token 日志表类型
// ============================================================================
export interface AiTokenLogRow {
  id: string
  flow_name: string
  model: string | null
  status: 'succeeded' | 'failed'
  input_tokens: number | null
  output_tokens: number | null
  total_tokens: number | null
  duration_ms: number | null
  user_id: string | null
  error: string | null
  timestamp: string
}

export interface AiTokenLogInsert {
  id?: string
  flow_name: string
  model?: string | null
  status: 'succeeded' | 'failed'
  input_tokens?: number | null
  output_tokens?: number | null
  total_tokens?: number | null
  duration_ms?: number | null
  user_id?: string | null
  error?: string | null
  timestamp?: string
}

export interface AiTokenLogUpdate {
  id?: string
  flow_name?: string
  model?: string | null
  status?: 'succeeded' | 'failed'
  input_tokens?: number | null
  output_tokens?: number | null
  total_tokens?: number | null
  duration_ms?: number | null
  user_id?: string | null
  error?: string | null
  timestamp?: string
}

// ============================================================================
// 仓储管理表格类型
// ============================================================================

export interface WarehouseRow {
  id: string
  name: string
  location: string | null
  is_active: boolean | null
  created_at: string | null
}

export interface InventoryItemRow {
  id: string
  name: string
  category: string | null
  unit: string | null
  safe_stock_level: number | null
  created_at: string | null
}

export interface InventoryLevelRow {
  id: string
  item_id: string
  warehouse_id: string
  quantity: number
  last_updated: string | null
}

export interface InventoryMovementRow {
  id: string
  item_id: string
  warehouse_id: string
  type: 'inbound' | 'outbound' | 'adjust'
  quantity: number
  unit_price: number | null
  project_id: string | null
  notes: string | null
  operator_id: string | null
  timestamp: string | null
}


// ============================================================================
// 数据库 Schema 类型
// ============================================================================
export interface Database {
  public: {
    Tables: {
      ai_token_logs: {
        Row: AiTokenLogRow
        Insert: AiTokenLogInsert
        Update: AiTokenLogUpdate
      },
      warehouses: {
        Row: WarehouseRow
        Insert: Omit<WarehouseRow, 'id' | 'created_at'>
        Update: Partial<Omit<WarehouseRow, 'id' | 'created_at'>>
      },
      inventory_items: {
        Row: InventoryItemRow
        Insert: Omit<InventoryItemRow, 'id' | 'created_at'>
        Update: Partial<Omit<InventoryItemRow, 'id' | 'created_at'>>
      },
      inventory_levels: {
        Row: InventoryLevelRow
        Insert: Omit<InventoryLevelRow, 'id' | 'last_updated'>
        Update: Partial<Omit<InventoryLevelRow, 'id'>>
      },
      inventory_movements: {
        Row: InventoryMovementRow
        Insert: Omit<InventoryMovementRow, 'id' | 'timestamp'>
        Update: Partial<Omit<InventoryMovementRow, 'id'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
