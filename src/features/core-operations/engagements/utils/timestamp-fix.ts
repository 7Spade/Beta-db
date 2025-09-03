/**
 * @fileoverview Timestamp 轉換修復工具
 * 用於批量修復組件中的 Timestamp 轉換問題
 */


/**
 * 安全地轉換 Timestamp 為 Date
 */
export const safeConvertTimestamp = (timestamp: any): Date => {
    if (timestamp instanceof Date) return timestamp;
    if (timestamp && typeof timestamp.toDate === 'function') return timestamp.toDate();
    if (timestamp && typeof timestamp.toMillis === 'function') return new Date(timestamp.toMillis());
    return new Date(timestamp);
};

/**
 * 安全地比較兩個日期
 */
export const safeCompareDates = (date1: any, date2: any): number => {
    const jsDate1 = safeConvertTimestamp(date1);
    const jsDate2 = safeConvertTimestamp(date2);
    return jsDate1.getTime() - jsDate2.getTime();
};

/**
 * 安全地格式化日期
 */
export const safeFormatDate = (date: any): string => {
    const jsDate = safeConvertTimestamp(date);
    return jsDate.toLocaleDateString('zh-TW');
};
