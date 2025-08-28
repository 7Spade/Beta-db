/**
 * @fileoverview 极简化的 AI Token 日志服务
 * @description 基于 Supabase 官方推荐的最简配置
 */

import { getSupabaseClient } from '@/lib/db/supabase';

/**
 * 记录 AI Token 使用量（极简化版本）
 */
export async function logAiTokenUsage(flowName: string, totalTokens: number, status: 'succeeded' | 'failed', error?: string) {
  try {
    const supabase = await getSupabaseClient();
    
    // 使用 any 类型避免复杂的类型推断问题
    await (supabase as any)
      .from('ai_token_logs')
      .insert({
        flow_name: flowName,
        total_tokens: totalTokens,
        status,
        error,
      });
  } catch (error) {
    // 静默失败，不影响主要业务逻辑
    console.error('AI token logging failed:', error);
  }
}

/**
 * 获取 Token 使用统计（极简化版本）
 */
export async function getTokenStats() {
  try {
    const supabase = await getSupabaseClient();
    
    const { data } = await (supabase as any)
      .from('ai_token_logs')
      .select('total_tokens, status')
      .eq('status', 'succeeded');
    
    return data?.reduce((sum: number, log: any) => sum + log.total_tokens, 0) || 0;
  } catch {
    return 0;
  }
}
