/**
 * @fileoverview Supabase Database Types
 * @description 基于 Supabase 官方推荐的类型定义结构
 * 
 * 注意：这些类型应该与你的 Supabase 数据库 schema 保持一致
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
  total_tokens: number
  status: 'succeeded' | 'failed'
  user_id?: string  // 使用 string 类型避免 UUID 类型问题
  error?: string
  timestamp: string
}

export interface AiTokenLogInsert {
  id?: string
  flow_name: string
  total_tokens: number
  status: 'succeeded' | 'failed'
  user_id?: string  // 使用 string 类型避免 UUID 类型问题
  error?: string
  timestamp?: string
}

export interface AiTokenLogUpdate {
  id?: string
  flow_name?: string
  total_tokens?: number
  status?: 'succeeded' | 'failed'
  user_id?: string  // 使用 string 类型避免 UUID 类型问题
  error?: string
  timestamp?: string
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
