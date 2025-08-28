/**
 * @project Beta-db Integrated Platform - 統一整合平台功能模組
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author Beta-db Development Team
 * @created 2025-01-22
 * @updated 2025-01-22
 * @version 1.0.0
 * 
 * @fileoverview 功能模組統一導出檔案
 * @description 集中管理所有功能模組的導出，方便其他模組引用
 */

// Admin Features
export * from '@/admin/views/admin-dashboard-view';

// Core App Features
export * from '@/app-features/projects-view';

// Auth Features
export * from '@/auth/index';

// Blog Features
export * from '@/blog/views/posts-list-view';
export * from '@/blog/views/post-form-view';

// Cloud Drive Features
export * from '@/cloud-drive/views/cloud-drive-view';

// Contracts Features
export * from '@/contracts/index';

// Dashboard Features
export * from '@/dashboard/dashboard-view';

// PartnerVerse Features
export * from '@/partnerverse/partners/partners-view';
export * from '@/partnerverse/workflows/workflow-builder';

// Quick Actions Features
export * from '@/quick-actions-features/daily-report';
export * from '@/quick-actions-features/project-progress';
export * from '@/quick-actions-features/staff-attendance';

// Settings Features
export * from '@/settings/settings-view';

// Team Features
export * from '@/team/index';
