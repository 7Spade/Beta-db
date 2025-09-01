/**
 * @project Beta-db Integrated Platform - 統一整合平台導航配置
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author Beta-db Development Team
 * @created 2025-01-22
 * @updated 2025-01-22
 * @version 1.1.0
 *
 * @fileoverview 應用程式導航配置和工具函數
 * @description 定義統一側邊欄的導航結構，包含主導航項目、子選單配置，
 * 以及相關的導航工具函數。此版本根據系統藍圖進行了擴展與優化。
 */

import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  Calendar,
  CalendarDays,
  ClipboardList,
  Cloud,
  Cog,
  DollarSign,
  FileText,
  FolderKanban,
  Handshake,
  LayoutGrid,
  Mail,
  Package,
  Plus,
  Rocket,
  Truck,
  UserCheck,
  Users,
  Warehouse,
  Wrench
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  children?: NavigationItem[];
}

export const navigationConfig: NavigationItem[] = [
  {
    id: 'dashboard',
    label: '儀表板',
    icon: LayoutGrid,
    href: '/dashboard',
  },
  {
    id: 'automation-tools',
    label: '自動化工具',
    icon: Rocket,
    href: '/automation-tools',
    children: [
      {
        id: 'kanban',
        label: '看板管理',
        icon: LayoutGrid,
        href: '/automation-tools/kanban',
      },
      {
        id: 'project-progress',
        label: '專案進度',
        icon: Activity,
        href: '/automation-tools/project-progress',
      },
      {
        id: 'knowledge-base',
        label: '工法工序庫',
        icon: BookOpen,
        href: '/automation-tools/knowledge-base',
      },
    ],
  },
  {
    id: 'business-intelligence',
    label: '商業智慧',
    icon: BarChart3,
    href: '/business-intelligence',
    children: [
      {
        id: 'analytics-dashboard',
        label: '分析儀表板',
        icon: LayoutGrid,
        href: '/business-intelligence/reporting-analytics/dashboard',
      },
      {
        id: 'daily-report',
        label: '日報系統',
        icon: Calendar,
        href: '/business-intelligence/reporting-analytics/daily-report',
      },
    ],
  },
  {
    id: 'core-operations',
    label: '核心操作',
    icon: Cog,
    href: '/core-operations',
    children: [
      {
        id: 'projects',
        label: '專案管理',
        icon: FolderKanban,
        href: '/core-operations/projects',
      },
      {
        id: 'contracts',
        label: '合約管理',
        icon: Building2,
        href: '/core-operations/contracts/contracts',
        children: [
          {
            id: 'contract-list',
            label: '合約列表',
            icon: ClipboardList,
            href: '/core-operations/contracts/contracts',
          },
          {
            id: 'create-contract',
            label: '建立合約',
            icon: Plus,
            href: '/core-operations/contracts/contracts/create',
          },
          {
            id: 'billing',
            label: '計價作業',
            icon: Calculator,
            href: '/core-operations/contracts/billing',
          },
        ],
      },
      {
        id: 'schedule',
        label: '排班表',
        icon: CalendarDays,
        href: '/core-operations/schedule',
      },
    ],
  },
  {
    id: 'resource-management',
    label: '資源管理',
    icon: Package,
    href: '/resource-management',
    children: [
      {
        id: 'hr',
        label: '人力資源',
        icon: Users,
        href: '/resource-management/hr',
        children: [
          {
            id: 'members',
            label: '團隊成員',
            icon: Users,
            href: '/resource-management/hr/members',
          },
          {
            id: 'attendance',
            label: '出勤管理',
            icon: UserCheck,
            href: '/resource-management/hr/attendance',
          },
          {
            id: 'skills',
            label: '技能清單',
            icon: Wrench,
            href: '/resource-management/hr/skills',
          },
        ],
      },
      {
        id: 'inventory',
        label: '庫存管理',
        icon: Warehouse,
        href: '/resource-management/inventory',
        children: [
          {
            id: 'items',
            label: '物料主檔',
            icon: Package,
            href: '/resource-management/inventory/items',
          },
          {
            id: 'movements',
            label: '出入庫紀錄',
            icon: ArrowLeftRight,
            href: '/resource-management/inventory/movements',
          },
          {
            id: 'transfers',
            label: '跨倉調撥',
            icon: Truck,
            href: '/resource-management/inventory/transfers',
          },
          {
            id: 'warehouses',
            label: '倉庫管理',
            icon: Warehouse,
            href: '/resource-management/inventory/warehouses',
          },
        ],
      },
      {
        id: 'crm',
        label: '客戶關係',
        icon: Handshake,
        href: '/resource-management/crm',
        children: [
          {
            id: 'partners',
            label: '合作夥伴',
            icon: Users,
            href: '/resource-management/crm/partners',
          },
          {
            id: 'workflows',
            label: '工作流程',
            icon: DollarSign,
            href: '/resource-management/crm/workflows',
          },
        ],
      },
      {
        id: 'cloud-drive',
        label: '雲端硬碟',
        icon: Cloud,
        href: '/resource-management/document/cloud-drive',
      },
      {
        id: 'docu-parse',
        label: '文件解析',
        icon: FileText,
        href: '/resource-management/document/docu-parse',
      },
    ],
  },
  {
    id: 'website-cms',
    label: '網站管理',
    icon: LayoutGrid,
    href: '/website-cms',
    children: [
      {
        id: 'cms-dashboard',
        label: '管理總覽',
        icon: LayoutGrid,
        href: '/website-cms/dashboard',
      },
      {
        id: 'user-management',
        label: '使用者管理',
        icon: Users,
        href: '/website-cms/user',
      },
      {
        id: 'blog-management',
        label: '文章管理',
        icon: BookOpen,
        href: '/website-cms/blog/posts',
      },
      {
        id: 'career-management',
        label: '職涯管理',
        icon: Briefcase,
        href: '/website-cms/career',
      },
      {
        id: 'contact-management',
        label: '聯絡管理',
        icon: Mail,
        href: '/website-cms/contact',
      },
      {
        id: 'content-management',
        label: '內容管理',
        icon: FileText,
        href: '/website-cms/content',
      },
      {
        id: 'system-management',
        label: '系統管理',
        icon: Cog,
        href: '/website-cms/system',
      },
    ],
  },
];

export const footerNavigationConfig: NavigationItem[] = [];

// 工具函數：根據路徑找到對應的導航項目
export function findNavigationItemByPath(path: string): NavigationItem | null {
  for (const item of navigationConfig) {
    if (item.href === path) {
      return item;
    }
    if (item.children) {
      const childItem = item.children.find((child) =>
        path.startsWith(child.href)
      );
      if (childItem) return childItem;
    }
  }
  return null;
}

// 工具函數：檢查路徑是否應該展開某個區段
export function shouldExpandSection(
  sectionId: string,
  currentPath: string
): boolean {
  const section = navigationConfig.find((item) => item.id === sectionId);

  if (!section?.children) {
    return false;
  }

  return section.children.some(
    (child) =>
      currentPath === child.href || currentPath.startsWith(child.href + '/')
  );
}

// 工具函數：檢查路徑是否為活躍狀態
export function isPathActive(itemPath: string, currentPath: string): boolean {
  // 特殊處理某些路徑
  if (itemPath === '/dashboard') {
    return currentPath === '/dashboard';
  }
  if (itemPath.startsWith('/automation-tools')) {
    return currentPath.startsWith('/automation-tools');
  }
  if (itemPath.startsWith('/business-intelligence')) {
    return currentPath.startsWith('/business-intelligence');
  }
  if (itemPath.startsWith('/core-operations')) {
    return currentPath.startsWith('/core-operations');
  }
  if (itemPath.startsWith('/resource-management')) {
    return currentPath.startsWith('/resource-management');
  }
  if (itemPath.startsWith('/system-administration')) {
    return currentPath.startsWith('/system-administration');
  }

  // 一般情況：精確匹配或子路徑匹配
  return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
}
