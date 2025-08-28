/**
 * @fileoverview Knowledge Base Server Actions 相關類型定義
 */

// 操作結果類型
export type SaveResult = {
    message: string;
    error?: undefined;
} | {
    error: string;
    message?: undefined;
}

// 知識庫條目狀態
export type KnowledgeEntryStatus = 'draft' | 'published' | 'archived' | 'review';

// 批量操作類型
export type BatchOperation = 'archive' | 'publish' | 'unpublish' | 'delete';

// 知識庫條目輸入
export interface KnowledgeEntryInput {
    title: string;
    content: string;
    category: string;
    tags: string[];
    status: KnowledgeEntryStatus;
    author?: string;
    references?: string[];
}

// 知識庫條目更新
export interface KnowledgeEntryUpdate {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
    status?: KnowledgeEntryStatus;
    references?: string[];
}

// 搜索和過濾選項
export interface KnowledgeSearchOptions {
    query?: string;
    category?: string;
    status?: KnowledgeEntryStatus;
    tags?: string[];
    author?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
}

// 知識庫統計
export interface KnowledgeStats {
    totalEntries: number;
    publishedEntries: number;
    draftEntries: number;
    archivedEntries: number;
    categories: string[];
    topTags: Array<{ tag: string; count: number }>;
}