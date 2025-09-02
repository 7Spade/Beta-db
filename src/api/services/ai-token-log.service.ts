/**
 * @fileoverview 极简化的 AI Token 日志服务
 * @description 基于 Supabase 官方推荐的最简配置
 */
import type {
  AiTokenLogInsert,
  AiTokenLogRow
} from '@root/src/features/integrations/database/supabase/types';
import type { SupabaseClient } from '@supabase/supabase-js';

// 自动记录 AI Token 使用情况
export async function logAiTokenUsage(
  supabase: SupabaseClient<any>, // Use any to bypass type issues
  logData: Omit<AiTokenLogInsert, 'timestamp' | 'id'>
): Promise<void> {
  try {
    // 自动插入日志记录
    const insertData = {
      ...logData,
      timestamp: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from('ai_token_logs').insert(insertData);
    if (insertError) throw insertError;
  } catch (error) {
    // 静默处理错误，不影响主要业务逻辑
    console.error('AI token logging failed:', error);
  }
}

// 自动获取 Token 使用统计
export async function getAiTokenUsageStats(
  supabase: SupabaseClient<any>, // Use any to bypass type issues
  days: number = 30
): Promise<AiTokenLogRow[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('ai_token_logs')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to get AI token stats:', error);
    return [];
  }
}
