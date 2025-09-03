/**
 * @fileoverview 工具函數測試
 * 確保所有工具函數正確工作
 */

import { Timestamp } from 'firebase/firestore';
import { convertTimestamp, formatCurrency, formatDate, formatDateTime, formatTime } from '../utils';

describe('Date Utils', () => {
    test('convertTimestamp 應該正確轉換 Date 對象', () => {
        const date = new Date('2024-01-01');
        const result = convertTimestamp(date);
        expect(result).toBe(date);
    });

    test('convertTimestamp 應該正確轉換 Timestamp 對象', () => {
        const timestamp = Timestamp.fromDate(new Date('2024-01-01'));
        const result = convertTimestamp(timestamp);
        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).toBe(timestamp.toDate().getTime());
    });

    test('formatDate 應該正確格式化日期', () => {
        const date = new Date('2024-01-01');
        const result = formatDate(date);
        expect(typeof result).toBe('string');
        expect(result).toContain('2024');
    });

    test('formatDate 應該能處理 undefined/null/無效日期', () => {
        expect(formatDate(undefined as any)).toBe('未設定');
        expect(formatDate(null as any)).toBe('未設定');
        expect(formatDate('invalid-date' as any)).toBe('未設定');
    });

    test('formatDateTime/formatTime 應該能處理 undefined/null', () => {
        expect(formatDateTime(undefined as any)).toBe('未設定');
        expect(formatTime(undefined as any)).toBe('未設定');
    });
});

describe('Financial Utils', () => {
    test('formatCurrency 應該正確格式化貨幣', () => {
        const result = formatCurrency(1000, 'TWD');
        expect(typeof result).toBe('string');
        expect(result).toContain('1,000');
    });

    test('formatCurrency 應該使用默認貨幣', () => {
        const result = formatCurrency(1000);
        expect(typeof result).toBe('string');
    });

    test('formatCurrency 對於 NaN 或 undefined 金額應該不拋錯', () => {
        expect(() => formatCurrency(NaN as any, 'TWD')).not.toThrow();
        expect(() => formatCurrency(undefined as any, 'TWD')).not.toThrow();
    });
});
