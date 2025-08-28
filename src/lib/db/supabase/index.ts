/**
 * @fileoverview Unified Supabase Configuration
 * @description 基于 Supabase 官方推荐的极简配置，整合所有客户端和类型定义
 */

// ============================================================================
// 类型导出
// ============================================================================
export type { Database, AiTokenLogRow, AiTokenLogInsert, AiTokenLogUpdate } from './types';

// ============================================================================
// 客户端导出
// ============================================================================
export { createClient as createBrowserClient } from './client';
export { createClient as createServerClient } from './server';

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 检查是否为服务端环境
 */
export const isServer = typeof window === 'undefined';

/**
 * 根据环境获取合适的客户端
 */
export async function getSupabaseClient() {
  if (isServer) {
    const { createClient } = await import('./server');
    return createClient();
  } else {
    const { createClient } = await import('./client');
    return createClient();
  }
}

// ============================================================================
// 默认导出
// ============================================================================
export { createClient as default } from './client';
