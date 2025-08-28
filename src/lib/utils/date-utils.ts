import type { Timestamp } from 'firebase-admin/firestore';
import { Timestamp as ClientTimestamp } from 'firebase/firestore';

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
 * 将Date或Timestamp转换为Firebase Timestamp
 * @param date - Date或Timestamp对象
 * @returns Firebase Timestamp对象
 */
export function toFirebaseTimestamp(date: Date | Timestamp): Timestamp {
  if (date instanceof Date) {
    // 这里需要根据环境选择正确的Timestamp类型
    // 在客户端使用firebase/firestore的Timestamp
    // 在服务端使用firebase-admin/firestore的Timestamp
    return ClientTimestamp.fromDate(date);
  }
  return date;
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
  return value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function';
}
