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
export * from '@root/src/features/(core-operations)/projects/views/ProjectView';

// Auth Features
export * from '@/auth/index';

// Blog Features
export * from '@/blog/views/post-form-view';
export * from '@/blog/views/posts-list-view';

// Cloud Drive Features
export * from '@/features/(document-management)/cloud-drive/views/cloud-drive-view';

// Contracts Features
export * from '@/features/(core-operations)/contracts/index';

// Dashboard Features
export * from '@/dashboard/dashboard-view';

// PartnerVerse Features
export * from '@/(crm-management)/partners/partners-view';
export * from '@/(crm-management)/workflows/workflow-builder';

// Quick Actions Features
export * from '@/features/quick-actions/daily-report';
export * from '@/features/quick-actions/project-progress';
export * from '@/features/quick-actions/staff-attendance';

// Settings Features
export * from '@/features/(system-admin)/settings/settings-view';

// Team Features
export * from '@/team/index';
