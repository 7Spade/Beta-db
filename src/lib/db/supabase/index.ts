/**
 * @fileoverview Unified Supabase Configuration
 * @description 极简主义的 Supabase 配置，整合所有客户端和类型定义
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ============================================================================
// 环境变量配置
// ============================================================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 环境变量验证
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing required Supabase environment variables');
}

// ============================================================================
// 客户端配置
// ============================================================================

/**
 * 客户端 Supabase 客户端
 * 用于浏览器端操作，支持认证和会话管理
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});

/**
 * 服务端 Supabase 客户端
 * 用于服务端操作，使用 service role key 进行管理操作
 */
export const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY 
  ? createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      db: {
        schema: 'public',
      },
    })
  : null;

// ============================================================================
// 类型导出
// ============================================================================
export type { Database, AiTokenLogRow, AiTokenLogInsert, AiTokenLogUpdate } from './types';

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 获取服务端客户端（如果可用）
 */
export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available. Check SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }
  return supabaseAdmin;
}

/**
 * 检查是否为服务端环境
 */
export const isServer = typeof window === 'undefined';

/**
 * 根据环境获取合适的客户端
 */
export function getSupabaseClient() {
  return isServer ? getSupabaseAdmin() : supabase;
}

// ============================================================================
// 默认导出
// ============================================================================
export default supabase;
