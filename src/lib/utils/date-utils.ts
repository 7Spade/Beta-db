import type { Timestamp } from 'firebase/firestore';

/**
 * 将Date或Timestamp转换为Date
 * @param date - Date或Timestamp对象
 * @returns Date对象
 */
export function toDate(date: Date | Timestamp): Date {
  if (date instanceof Date) {
    return date;
  }
  return date.toDate();
}

/**
 * 检查值是否为Date类型
 * @param value - 任意值
 * @returns 如果是Date类型返回true，否则返回false
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

/**
 * 检查值是否为Timestamp类型
 * @param value - 任意值
 * @returns 如果是Timestamp类型返回true，否则返回false
 */
export function isTimestamp(value: unknown): value is Timestamp {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Timestamp).toDate === 'function'
  );
}
