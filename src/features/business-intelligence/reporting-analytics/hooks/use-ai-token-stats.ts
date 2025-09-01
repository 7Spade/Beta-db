/**
 * @fileoverview AI Token 統計數據管理 Hook
 */
'use client';

import { getAiTokenUsageStats } from '@/api/services/ai-token-log.service';
import { createClient } from '@root/src/features/integrations/database/supabase/client';
import type { AiTokenLogRow } from '@root/src/features/integrations/database/supabase/types';
import { useEffect, useState } from 'react';

interface AiTokenStats {
  totalTokens: number;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
}

export function useAiTokenStats() {
  const [stats, setStats] = useState<AiTokenStats>({
    totalTokens: 0,
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient();
        const logs: AiTokenLogRow[] = await getAiTokenUsageStats(supabase, 30); // Get last 30 days of stats

        const newStats = logs.reduce(
          (acc: AiTokenStats, log: AiTokenLogRow) => {
            acc.totalTokens += log.total_tokens || 0;
            acc.totalCalls += 1;
            if (log.status === 'succeeded') {
              acc.successfulCalls += 1;
            } else {
              acc.failedCalls += 1;
            }
            return acc;
          },
          {
            totalTokens: 0,
            totalCalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
          }
        );

        setStats(newStats);
        setError(null);
      } catch (err) {
        console.error('獲取 AI Token 統計時發生錯誤：', err);
        setError('獲取 AI Token 統計時發生錯誤');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
  };
}
