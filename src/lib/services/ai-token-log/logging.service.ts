/**
 * @fileoverview 极简化的 AI Token 日志服务
 * @description 基于 Supabase 官方推荐的最简配置
 */

import { getSupabaseClient } from '@root/src/features/integrations/database/supabase'

// 自动记录 AI Token 使用情况
export async function logAiTokenUsage(
  flowName: string,
  totalTokens: number,
  status: 'succeeded' | 'failed',
  error?: string
): Promise<void> {
  try {
    const supabase = await getSupabaseClient()

    // 自动插入日志记录
    await supabase
      .from('ai_token_logs')
      .insert({
        flow_name: flowName,
        total_tokens: totalTokens,
        status: status,
        error: error,
        timestamp: new Date().toISOString(),
      })
  } catch (error) {
    // 静默处理错误，不影响主要业务逻辑
    console.error('AI token logging failed:', error)
  }
}

// 自动获取 Token 使用统计
export async function getAiTokenUsageStats(days: number = 30) {
  try {
    const supabase = await getSupabaseClient()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data } = await supabase
      .from('ai_token_logs')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Failed to get AI token stats:', error)
    return []
  }
}
