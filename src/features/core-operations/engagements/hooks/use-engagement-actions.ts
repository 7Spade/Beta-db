/**
 * @fileoverview Engagement 操作相關的自定義 Hook
 */
'use client';

import { useState, useCallback } from 'react';
import { 
  updateEngagementAction,
  deleteEngagementAction,
  changeEngagementStatusAction,
  changeEngagementPhaseAction,
  completeEngagementAction,
  pauseEngagementAction,
  resumeEngagementAction,
  cancelEngagementAction,
} from '../actions';
import type { 
  UpdateEngagementInput,
  EngagementStatus,
  EngagementPhase 
} from '../types';

interface UseEngagementActionsReturn {
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  updateEngagement: (id: string, input: UpdateEngagementInput) => Promise<{ success: boolean }>;
  deleteEngagement: (id: string) => Promise<{ success: boolean }>;
  changeStatus: (id: string, status: EngagementStatus) => Promise<{ success: boolean }>;
  changePhase: (id: string, phase: EngagementPhase) => Promise<{ success: boolean }>;
  completeEngagement: (id: string, actualEndDate?: Date) => Promise<{ success: boolean }>;
  pauseEngagement: (id: string) => Promise<{ success: boolean }>;
  resumeEngagement: (id: string) => Promise<{ success: boolean }>;
  cancelEngagement: (id: string, reason?: string) => Promise<{ success: boolean }>;
  clearError: () => void;
}

export function useEngagementActions(): UseEngagementActionsReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async <T>(
    action: () => Promise<{ success: boolean; error?: string }>,
    setLoading: (loading: boolean) => void
  ): Promise<{ success: boolean }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await action();
      
      if (!result.success) {
        setError(result.error || '操作失敗');
      }
      
      return { success: result.success };
    } catch (err) {
      setError('發生未知錯誤');
      console.error('操作失敗:', err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEngagement = useCallback(async (
    id: string, 
    input: UpdateEngagementInput
  ): Promise<{ success: boolean }> => {
    return handleAction(
      () => updateEngagementAction(id, input),
      setIsUpdating
    );
  }, [handleAction]);

  const deleteEngagement = useCallback(async (
    id: string
  ): Promise<{ success: boolean }> => {
    return handleAction(
      () => deleteEngagementAction(id),
      setIsDeleting
    );
  }, [handleAction]);

  const changeStatus = useCallback(async (
    id: string, 
    status: EngagementStatus
  ): Promise<{ success: boolean }> => {
    return handleAction(
      () => changeEngagementStatusAction(id, status),
      setIsUpdating
    );
  }, [handleAction]);

  const changePhase = useCallback(async (
    id: string, 
    phase: EngagementPhase
  ): Promise<{ success: boolean }> => {
    return handleAction(
      () => changeEngagementPhaseAction(id, phase),
      setIsUpdating
    );
  }, [handleAction]);

  const completeEngagement = useCallback(async (
    id: string, 
    actualEndDate?: Date
  ): Promise<{ success: boolean }> => {
    return handleAction(
      () => completeEngagementAction(id, actualEndDate),
      setIsUpdating
    );
  }, [handleAction]);

  const pauseEngagement = useCallback(async (
    id: string
  ): Promise<{ success: boolean }> => {
    return handleAction(
      () => pauseEngagementAction(id),
      setIsUpdating
    );
  }, [handleAction]);

  const resumeEngagement = useCallback(async (
    id: string
  ): Promise<{ success: boolean }> => {
    return handleAction(
      () => resumeEngagementAction(id),
      setIsUpdating
    );
  }, [handleAction]);

  const cancelEngagement = useCallback(async (
    id: string, 
    reason?: string
  ): Promise<{ success: boolean }> => {
    return handleAction(
      () => cancelEngagementAction(id, reason),
      setIsUpdating
    );
  }, [handleAction]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUpdating,
    isDeleting,
    error,
    updateEngagement,
    deleteEngagement,
    changeStatus,
    changePhase,
    completeEngagement,
    pauseEngagement,
    resumeEngagement,
    cancelEngagement,
    clearError,
  };
}

// 任務操作相關的 Hook
interface UseTaskActionsReturn {
  isUpdating: boolean;
  error: string | null;
  addTask: (engagementId: string, taskData: any) => Promise<{ success: boolean }>;
  updateTask: (engagementId: string, taskId: string, taskData: any) => Promise<{ success: boolean }>;
  deleteTask: (engagementId: string, taskId: string) => Promise<{ success: boolean }>;
  assignTask: (engagementId: string, taskId: string, assigneeId: string) => Promise<{ success: boolean }>;
  completeTask: (engagementId: string, taskId: string) => Promise<{ success: boolean }>;
  clearError: () => void;
}

export function useTaskActions(): UseTaskActionsReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async <T>(
    action: () => Promise<{ success: boolean; error?: string }>
  ): Promise<{ success: boolean }> => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await action();
      
      if (!result.success) {
        setError(result.error || '操作失敗');
      }
      
      return { success: result.success };
    } catch (err) {
      setError('發生未知錯誤');
      console.error('任務操作失敗:', err);
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const addTask = useCallback(async (
    engagementId: string, 
    taskData: any
  ): Promise<{ success: boolean }> => {
    // TODO: 實現 addTaskAction
    return { success: true };
  }, []);

  const updateTask = useCallback(async (
    engagementId: string, 
    taskId: string, 
    taskData: any
  ): Promise<{ success: boolean }> => {
    // TODO: 實現 updateTaskAction
    return { success: true };
  }, []);

  const deleteTask = useCallback(async (
    engagementId: string, 
    taskId: string
  ): Promise<{ success: boolean }> => {
    // TODO: 實現 deleteTaskAction
    return { success: true };
  }, []);

  const assignTask = useCallback(async (
    engagementId: string, 
    taskId: string, 
    assigneeId: string
  ): Promise<{ success: boolean }> => {
    // TODO: 實現 assignTaskAction
    return { success: true };
  }, []);

  const completeTask = useCallback(async (
    engagementId: string, 
    taskId: string
  ): Promise<{ success: boolean }> => {
    // TODO: 實現 completeTaskAction
    return { success: true };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUpdating,
    error,
    addTask,
    updateTask,
    deleteTask,
    assignTask,
    completeTask,
    clearError,
  };
}