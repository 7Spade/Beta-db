/**
 * @fileoverview Engagement Context Provider
 */
'use client';

import { createContext, ReactNode, useCallback, useContext, useReducer } from 'react';
import { engagementService } from '../services';
import type {
  CreateEngagementInput,
  Engagement,
  EngagementPhase,
  EngagementStatus,
  EngagementSummary,
  UpdateEngagementInput
} from '../types';

// Context 狀態類型
interface EngagementState {
  engagements: Engagement[];
  summaries: EngagementSummary[];
  currentEngagement: Engagement | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  filters: {
    status?: EngagementStatus[];
    phase?: EngagementPhase[];
    search?: string;
  };
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Action 類型
type EngagementAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CREATING'; payload: boolean }
  | { type: 'SET_UPDATING'; payload: boolean }
  | { type: 'SET_DELETING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ENGAGEMENTS'; payload: Engagement[] }
  | { type: 'SET_SUMMARIES'; payload: EngagementSummary[] }
  | { type: 'SET_CURRENT_ENGAGEMENT'; payload: Engagement | null }
  | { type: 'ADD_ENGAGEMENT'; payload: Engagement }
  | { type: 'UPDATE_ENGAGEMENT'; payload: Engagement }
  | { type: 'REMOVE_ENGAGEMENT'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<EngagementState['filters']> }
  | { type: 'SET_PAGINATION'; payload: Partial<EngagementState['pagination']> }
  | { type: 'RESET_STATE' };

// 初始狀態
const initialState: EngagementState = {
  engagements: [],
  summaries: [],
  currentEngagement: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    hasMore: true,
  },
};

// Reducer
function engagementReducer(state: EngagementState, action: EngagementAction): EngagementState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_CREATING':
      return { ...state, isCreating: action.payload };

    case 'SET_UPDATING':
      return { ...state, isUpdating: action.payload };

    case 'SET_DELETING':
      return { ...state, isDeleting: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_ENGAGEMENTS':
      return { ...state, engagements: action.payload };

    case 'SET_SUMMARIES':
      return { ...state, summaries: action.payload };

    case 'SET_CURRENT_ENGAGEMENT':
      return { ...state, currentEngagement: action.payload };

    case 'ADD_ENGAGEMENT':
      return { ...state, engagements: [action.payload, ...state.engagements] };

    case 'UPDATE_ENGAGEMENT':
      return {
        ...state,
        engagements: state.engagements.map(engagement =>
          engagement.id === action.payload.id ? action.payload : engagement
        ),
        currentEngagement: state.currentEngagement?.id === action.payload.id
          ? action.payload
          : state.currentEngagement,
      };

    case 'REMOVE_ENGAGEMENT':
      return {
        ...state,
        engagements: state.engagements.filter(engagement => engagement.id !== action.payload),
        currentEngagement: state.currentEngagement?.id === action.payload
          ? null
          : state.currentEngagement,
      };

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context 類型
interface EngagementContextType {
  state: EngagementState;

  // 數據操作
  loadEngagements: () => Promise<void>;
  loadEngagement: (id: string) => Promise<void>;
  createEngagement: (input: CreateEngagementInput) => Promise<{ success: boolean; engagementId?: string }>;
  updateEngagement: (id: string, input: UpdateEngagementInput) => Promise<{ success: boolean }>;
  deleteEngagement: (id: string) => Promise<{ success: boolean }>;

  // 篩選和分頁
  setFilters: (filters: Partial<EngagementState['filters']>) => void;
  setPagination: (pagination: Partial<EngagementState['pagination']>) => void;

  // 狀態管理
  clearError: () => void;
  resetState: () => void;
}

// 創建 Context
const EngagementContext = createContext<EngagementContextType | undefined>(undefined);

// Provider 組件
interface EngagementProviderProps {
  children: ReactNode;
}

export function EngagementProvider({ children }: EngagementProviderProps) {
  const [state, dispatch] = useReducer(engagementReducer, initialState);

  // 載入 Engagements
  const loadEngagements = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await engagementService.getEngagements({
        status: state.filters.status?.[0],
        phase: state.filters.phase?.[0],
        limit: state.pagination.limit,
      });

      if (result.success && result.engagements) {
        dispatch({ type: 'SET_ENGAGEMENTS', payload: result.engagements });
        dispatch({ type: 'SET_PAGINATION', payload: { hasMore: result.engagements.length === state.pagination.limit } });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || '載入失敗' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '載入數據時發生錯誤' });
      console.error('載入 Engagements 失敗:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters.status, state.filters.phase, state.pagination.limit]);

  // 載入單個 Engagement
  const loadEngagement = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await engagementService.getEngagement(id);

      if (result.success && result.engagement) {
        dispatch({ type: 'SET_CURRENT_ENGAGEMENT', payload: result.engagement });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || '載入失敗' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '載入數據時發生錯誤' });
      console.error('載入 Engagement 失敗:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // 創建 Engagement
  const createEngagement = useCallback(async (input: CreateEngagementInput) => {
    dispatch({ type: 'SET_CREATING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await engagementService.createEngagement(input);

      if (result.success && result.engagementId) {
        // 重新載入列表
        await loadEngagements();
        return { success: true, engagementId: result.engagementId };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || '創建失敗' });
        return { success: false };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '創建時發生錯誤' });
      console.error('創建 Engagement 失敗:', error);
      return { success: false };
    } finally {
      dispatch({ type: 'SET_CREATING', payload: false });
    }
  }, [loadEngagements]);

  // 更新 Engagement
  const updateEngagement = useCallback(async (id: string, input: UpdateEngagementInput) => {
    dispatch({ type: 'SET_UPDATING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await engagementService.updateEngagement(id, input);

      if (result.success) {
        // 重新載入當前 Engagement
        await loadEngagement(id);
        // 重新載入列表
        await loadEngagements();
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || '更新失敗' });
        return { success: false };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '更新時發生錯誤' });
      console.error('更新 Engagement 失敗:', error);
      return { success: false };
    } finally {
      dispatch({ type: 'SET_UPDATING', payload: false });
    }
  }, [loadEngagement, loadEngagements]);

  // 刪除 Engagement
  const deleteEngagement = useCallback(async (id: string) => {
    dispatch({ type: 'SET_DELETING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await engagementService.deleteEngagement(id);

      if (result.success) {
        dispatch({ type: 'REMOVE_ENGAGEMENT', payload: id });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || '刪除失敗' });
        return { success: false };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '刪除時發生錯誤' });
      console.error('刪除 Engagement 失敗:', error);
      return { success: false };
    } finally {
      dispatch({ type: 'SET_DELETING', payload: false });
    }
  }, []);

  // 設置篩選器
  const setFilters = useCallback((filters: Partial<EngagementState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // 設置分頁
  const setPagination = useCallback((pagination: Partial<EngagementState['pagination']>) => {
    dispatch({ type: 'SET_PAGINATION', payload: pagination });
  }, []);

  // 清除錯誤
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // 重置狀態
  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const contextValue: EngagementContextType = {
    state,
    loadEngagements,
    loadEngagement,
    createEngagement,
    updateEngagement,
    deleteEngagement,
    setFilters,
    setPagination,
    clearError,
    resetState,
  };

  return (
    <EngagementContext.Provider value={contextValue}>
      {children}
    </EngagementContext.Provider>
  );
}

// Hook 來使用 Context
export function useEngagementContext(): EngagementContextType {
  const context = useContext(EngagementContext);
  if (context === undefined) {
    throw new Error('useEngagementContext must be used within an EngagementProvider');
  }
  return context;
}