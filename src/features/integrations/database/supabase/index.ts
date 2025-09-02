/**
 * @fileoverview Unified Supabase Configuration
 * @description 基于 Supabase 官方推荐的极简配置，整合所有客户端和类型定义
 */

// ============================================================================
// 类型导出
// ============================================================================
export type {
  AiTokenLogInsert, AiTokenLogRow, AiTokenLogUpdate, Database
} from '@root/src/features/integrations/database/supabase/types';

// ============================================================================
// 客户端导出
// ============================================================================
// 极简配置：自动选择客户端

// 导出客户端创建函数
export { createClient as createBrowserClient } from '@root/src/features/integrations/database/supabase/client';
export { createClient as createServerClient } from '@root/src/features/integrations/database/supabase/server';

// DEPRECATED - Use createBrowserClient or createServerClient directly
export async function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // This dynamic import is problematic. It's better to explicitly
    // create the server client where cookies are available.
    // For now, returning null to avoid build errors.
    console.warn("getSupabaseClient on server is deprecated. Use createServerClient with cookieStore.");
    return null;
  } else {
    // 客户端
    const { createClient } = await import('@root/src/features/integrations/database/supabase/client');
    return createClient();
  }
}

export async function getSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseAdmin can only be called on the server.');
  }
  const { createClient } = await import('@/features/integrations/database/supabase/server');
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return createClient(cookieStore);
}


// 默认导出浏览器客户端
export { createClient as default } from '@root/src/features/integrations/database/supabase/client';

