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

import {
  FolderKanban,
  Building2,
  FileText,
  Users,
  ClipboardList,
  CalendarDays,
  ArrowLeftRight,
  Wrench,
  BookOpen,
  Calendar,
  UserCheck,
  Activity,
  Cloud,
  Shield,
  Briefcase,
  Mail,
  Cog,
  BarChart3,
  Handshake,
  Rocket,
  Package,
  Calculator,
  DollarSign,
  Warehouse,
  Truck,
  LayoutGrid,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  children?: NavigationItem[];
}

export const navigationConfig: NavigationItem[] = [
  {
    id: 'quick-actions',
    label: '快捷操作',
    icon: Rocket,
    href: '/quick-actions',
    children: [
      {
        id: 'daily-report',
        label: '工地日報',
        icon: Calendar,
        href: '/quick-actions/daily-report',
      },
      {
        id: 'attendance',
        label: '人員出勤',
        icon: UserCheck,
        href: '/quick-actions/staff-attendance',
      },
      {
        id: 'progress',
        label: '進度回報',
        icon: Activity,
        href: '/quick-actions/project-progress',
      },
      {
        id: 'kanban',
        label: '速記看板',
        icon: LayoutGrid,
        href: '/quick-actions/kanban',
      },
      {
        id: 'docu-parse',
        label: '文件解析',
        icon: FileText,
        href: '/quick-actions/docu-parse',
      },
      {
        id: 'cloud-drive',
        label: '雲端硬碟',
        icon: Cloud,
        href: '/quick-actions/cloud-drive',
      },
    ],
  },
  {
    id: 'projects',
    label: '專案管理',
    icon: FolderKanban,
    href: '/projects',
  },
  {
    id: 'contracts',
    label: '合約管理',
    icon: Building2,
    href: '/contracts',
    children: [
      {
        id: 'contract-list',
        label: '合約列表',
        icon: ClipboardList,
        href: '/contracts/contracts',
      },
      {
        id: 'billing',
        label: '計價作業',
        icon: Calculator,
        href: '/contracts/billing',
      },
    ],
  },
  {
    id: 'warehousing',
    label: '倉儲管理',
    icon: Warehouse,
    href: '/warehousing',
    children: [
      {
        id: 'warehousing-dashboard',
        label: '倉儲總覽',
        icon: BarChart3,
        href: '/warehousing',
      },
      {
        id: 'inventory-items',
        label: '物料主檔',
        icon: Package,
        href: '/warehousing/items',
      },
      {
        id: 'inventory-movements',
        label: '出入庫紀錄',
        icon: ArrowLeftRight,
        href: '/warehousing/movements',
      },
      {
        id: 'inventory-transfers',
        label: '跨倉調撥',
        icon: Truck,
        href: '/warehousing/transfers',
      },
      {
        id: 'inventory-warehouses',
        label: '倉庫管理',
        icon: Warehouse,
        href: '/warehousing/warehouses',
      },
    ],
  },
  {
    id: 'partnerverse',
    label: '合作夥伴',
    icon: Handshake,
    href: '/partnerverse/partners',
    children: [
      {
        id: 'partners',
        label: '夥伴列表',
        icon: Users,
        href: '/partnerverse/partners',
      },
      {
        id: 'workflows',
        label: '收支流程',
        icon: DollarSign,
        href: '/partnerverse/workflows',
      },
    ],
  },
  {
    id: 'team',
    label: '內部團隊',
    icon: Users,
    href: '/team/members',
    children: [
      {
        id: 'schedule',
        label: '排班表',
        icon: CalendarDays,
        href: '/team/schedule',
      },
      {
        id: 'members',
        label: '同伴列表',
        icon: ClipboardList,
        href: '/team/members',
      },
      {
        id: 'skills',
        label: '技能清單',
        icon: Wrench,
        href: '/team/skills',
      },
      {
        id: 'knowledge-base',
        label: '工法工序庫',
        icon: BookOpen,
        href: '/team/knowledge-base',
      },
    ],
  },
  {
    id: 'admin',
    label: '後台管理',
    icon: Shield,
    href: '/admin',
    children: [
      {
        id: 'admin-dashboard',
        label: '總覽',
        icon: LayoutGrid,
        href: '/dashboard-management',
      },
      {
        id: 'admin-user-management',
        label: '使用者管理',
        icon: Users,
        href: '/user-management',
      },
      {
        id: 'admin-blog-management',
        label: '文章管理',
        icon: BookOpen,
        href: '/blog-management/posts',
      },
      {
        id: 'admin-career-management',
        label: '職涯管理',
        icon: Briefcase,
        href: '/career-management',
      },
      {
        id: 'admin-contact-management',
        label: '聯絡管理',
        icon: Mail,
        href: '/contact-management',
      },
      {
        id: 'admin-content-management',
        label: '內容管理',
        icon: FileText,
        href: '/content-management',
      },
      {
        id: 'admin-system-management',
        label: '系統管理',
        icon: Cog,
        href: '/system-management',
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
  if (itemPath === '/partnerverse') {
    return currentPath.startsWith('/partnerverse');
  }
  if (itemPath.startsWith('/admin')) {
    return currentPath.startsWith('/admin');
  }
  return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
}
