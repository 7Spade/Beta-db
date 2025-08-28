/**
 * @fileoverview Supabase Type Definitions
 * @description 统一的 Supabase 类型定义
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface AiTokenLogRow {
  id: string
  flow_name: string
  total_tokens: number
  status: 'succeeded' | 'failed'
  user_id?: string
  error?: string
  timestamp: string
}

export interface AiTokenLogInsert {
  id?: string
  flow_name: string
  total_tokens: number
  status: 'succeeded' | 'failed'
  user_id?: string
  error?: string
  timestamp?: string
}

export interface AiTokenLogUpdate {
  id?: string
  flow_name?: string
  total_tokens?: number
  status?: 'succeeded' | 'failed'
  user_id?: string
  error?: string
  timestamp?: string
}

export type Database = {
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
