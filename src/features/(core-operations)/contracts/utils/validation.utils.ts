/**
 * @fileoverview 驗證工具
 */
import { z } from 'zod';

// Re-exporting schemas from a central place can be a good practice.
export * from '@/features/(core-operations)/contracts/forms/form-schemas';

// You can add more specific validation functions here if needed.
export const validationUtils = {
  isValidId: (id: string) => z.string().uuid().safeParse(id).success,
};
