/**
 * @fileoverview 日期和時間戳轉換工具
 */
import type { Timestamp } from 'firebase/firestore';

/**
 * 將 Firebase Timestamp 或 Date 轉換為 JavaScript Date
 */
export const convertTimestamp = (
    timestamp?: Date | Timestamp | string | number | null
): Date => {
    if (timestamp instanceof Date) return timestamp;
    if (timestamp && typeof (timestamp as any).toDate === 'function') {
        return (timestamp as unknown as Timestamp).toDate();
    }
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        return new Date(timestamp);
    }
    return new Date(NaN);
};

/**
 * 格式化日期為本地化字符串
 */
export const formatDate = (date?: Date | Timestamp | string | number | null): string => {
    if (!date) return '未設定';
    const jsDate = convertTimestamp(date);
    if (Number.isNaN(jsDate.getTime())) return '未設定';
    return jsDate.toLocaleDateString('zh-TW');
};

/**
 * 格式化日期時間為本地化字符串
 */
export const formatDateTime = (date?: Date | Timestamp | string | number | null): string => {
    if (!date) return '未設定';
    const jsDate = convertTimestamp(date);
    if (Number.isNaN(jsDate.getTime())) return '未設定';
    return jsDate.toLocaleString('zh-TW');
};

/**
 * 格式化時間為本地化字符串
 */
export const formatTime = (date?: Date | Timestamp | string | number | null): string => {
    if (!date) return '未設定';
    const jsDate = convertTimestamp(date);
    if (Number.isNaN(jsDate.getTime())) return '未設定';
    return jsDate.toLocaleTimeString('zh-TW');
};

/**
 * 檢查日期是否為今天
 */
export const isToday = (date?: Date | Timestamp | string | number | null): boolean => {
    const jsDate = convertTimestamp(date as any);
    if (Number.isNaN(jsDate.getTime())) return false;
    const today = new Date();
    return jsDate.toDateString() === today.toDateString();
};

/**
 * 檢查日期是否為昨天
 */
export const isYesterday = (date?: Date | Timestamp | string | number | null): boolean => {
    const jsDate = convertTimestamp(date as any);
    if (Number.isNaN(jsDate.getTime())) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return jsDate.toDateString() === yesterday.toDateString();
};

/**
 * 獲取相對時間描述
 */
export const getRelativeTime = (date?: Date | Timestamp | string | number | null): string => {
    const jsDate = convertTimestamp(date as any);
    if (Number.isNaN(jsDate.getTime())) return '剛剛';
    const now = new Date();
    const diffMs = now.getTime() - jsDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
        return `${diffDays} 天前`;
    } else if (diffHours > 0) {
        return `${diffHours} 小時前`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes} 分鐘前`;
    } else {
        return '剛剛';
    }
};

/**
 * 安全地比較兩個日期
 */
export const compareDates = (
    date1: Date | Timestamp | string | number | null | undefined,
    date2: Date | Timestamp | string | number | null | undefined
): number => {
    const jsDate1 = convertTimestamp(date1 as any);
    const jsDate2 = convertTimestamp(date2 as any);
    if (Number.isNaN(jsDate1.getTime()) || Number.isNaN(jsDate2.getTime())) return 0;
    return jsDate1.getTime() - jsDate2.getTime();
};
