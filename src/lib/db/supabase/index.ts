/**
 * @fileoverview Unified Supabase Configuration
 * @description 基于 Supabase 官方推荐的极简配置，整合所有客户端和类型定义
 */

// ============================================================================
// 类型导出
// ============================================================================
export type {
  Database,
  AiTokenLogRow,
  AiTokenLogInsert,
  AiTokenLogUpdate,
} from '@/supabase/types';

// ============================================================================
// 客户端导出
// ============================================================================
// 极简配置：自动选择客户端

// 导出客户端创建函数
export { createClient as createBrowserClient } from '@/supabase/client';
export { createClient as createServerClient } from '@/supabase/server';

// 自动获取合适的客户端
export async function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // 服务端
    const { createClient } = await import('@/supabase/server');
    return createClient();
  } else {
    // 客户端
    const { createClient } = await import('@/supabase/client');
    return createClient();
  }
}

// 默认导出浏览器客户端
export { createClient as default } from '@/supabase/client';
