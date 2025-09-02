/**
 * @fileoverview 管理 Engagements 的自定義 Hook
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { engagementService } from '../services';
import type { 
  Engagement, 
  EngagementSummary, 
  EngagementStatus, 
  EngagementPhase 
} from '../types';

interface UseEngagementsOptions {
  status?: EngagementStatus;
  phase?: EngagementPhase;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseEngagementsReturn {
  engagements: Engagement[];
  summaries: EngagementSummary[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useEngagements(options: UseEngagementsOptions = {}): UseEngagementsReturn {
  const {
    status,
    phase,
    limit = 20,
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
  } = options;

  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [summaries, setSummaries] = useState<EngagementSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const loadEngagements = useCallback(async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setIsLoading(true);
        setError(null);
      }

      const result = await engagementService.getEngagements({
        status,
        phase,
        limit,
        startAfter: isLoadMore ? lastDoc : undefined,
      });

      if (result.success && result.engagements) {
        if (isLoadMore) {
          setEngagements(prev => [...prev, ...result.engagements!]);
        } else {
          setEngagements(result.engagements);
        }
        
        setHasMore(result.engagements.length === limit);
        if (result.engagements.length > 0) {
          setLastDoc(result.engagements[result.engagements.length - 1]);
        }
      } else {
        setError(result.error || '載入失敗');
      }
    } catch (err) {
      setError('載入數據時發生錯誤');
      console.error('載入 Engagements 失敗:', err);
    } finally {
      setIsLoading(false);
    }
  }, [status, phase, limit, lastDoc]);

  const loadSummaries = useCallback(async () => {
    try {
      const result = await engagementService.getEngagementSummaries({
        status,
        phase,
        limit,
      });

      if (result.success && result.summaries) {
        setSummaries(result.summaries);
      } else {
        setError(result.error || '載入摘要失敗');
      }
    } catch (err) {
      setError('載入摘要時發生錯誤');
      console.error('載入 Engagement 摘要失敗:', err);
    }
  }, [status, phase, limit]);

  const refresh = useCallback(async () => {
    setLastDoc(null);
    setHasMore(true);
    await Promise.all([loadEngagements(false), loadSummaries()]);
  }, [loadEngagements, loadSummaries]);

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await loadEngagements(true);
    }
  }, [isLoading, hasMore, loadEngagements]);

  // 初始載入
  useEffect(() => {
    refresh();
  }, [refresh]);

  // 自動刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  return {
    engagements,
    summaries,
    isLoading,
    error,
    refresh,
    loadMore,
    hasMore,
  };
}

// 單個 Engagement 的 Hook
interface UseEngagementOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseEngagementReturn {
  engagement: Engagement | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useEngagement(
  id: string, 
  options: UseEngagementOptions = {}
): UseEngagementReturn {
  const {
    autoRefresh = false,
    refreshInterval = 30000,
  } = options;

  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEngagement = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await engagementService.getEngagement(id);

      if (result.success && result.engagement) {
        setEngagement(result.engagement);
      } else {
        setError(result.error || '載入失敗');
      }
    } catch (err) {
      setError('載入數據時發生錯誤');
      console.error('載入 Engagement 失敗:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const refresh = useCallback(async () => {
    await loadEngagement();
  }, [loadEngagement]);

  // 初始載入
  useEffect(() => {
    loadEngagement();
  }, [loadEngagement]);

  // 自動刷新
  useEffect(() => {
    if (!autoRefresh || !id) return;

    const interval = setInterval(() => {
      loadEngagement();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadEngagement, id]);

  return {
    engagement,
    isLoading,
    error,
    refresh,
  };
}