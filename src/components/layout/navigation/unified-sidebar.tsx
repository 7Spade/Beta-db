/**
 * @fileoverview 統一側邊欄
 * @description 根據 navigation.config.ts 動態生成導航選單，樣式已優化。
 */
'use client';

import {
  footerNavigationConfig,
  getToggleableNavigationGroups,
  getVisibleNavigationItems,
  navigationConfig,
  shouldExpandSection
} from '@/components/layout/config/navigation.config';
import { Logo } from '@/components/layout/shared/logo';
import { Button } from '@/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/ui/sidebar';
import { cn } from '@root/src/shared/utils';
import { ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { NavigationSettingsPanel, NavigationToggle } from './navigation-toggle';

interface UnifiedSidebarProps extends ComponentProps<typeof Sidebar> {
  className?: string;
}

export function UnifiedSidebar({ className, ...props }: UnifiedSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [groupVisibility, setGroupVisibility] = useState<Record<string, boolean>>({});
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const sectionsToExpand = navigationConfig
      .filter((item) => item.children && shouldExpandSection(item.id, pathname))
      .map((item) => item.id);

    setExpandedSections((prev) => {
      const newExpanded = new Set([...prev, ...sectionsToExpand]);
      return Array.from(newExpanded);
    });
  }, [pathname]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isRouteActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  const isSectionExpanded = (sectionId: string) =>
    expandedSections.includes(sectionId);

  const handleToggleGroupVisibility = (groupId: string, isVisible: boolean) => {
    setGroupVisibility((prev) => ({
      ...prev,
      [groupId]: isVisible,
    }));
  };

  const handleResetToDefault = () => {
    setGroupVisibility({});
  };

  // 獲取可見的導航項目
  const visibleNavigationItems = getVisibleNavigationItems(
    navigationConfig,
    groupVisibility
  );

  const renderNavigationItems = (items: typeof navigationConfig) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = isRouteActive(item.href);
      const isExpanded = isSectionExpanded(item.id);
      const isToggleable = item.toggleable === true;
      const isVisible = groupVisibility[item.id] !== false;

      return (
        <SidebarMenuItem key={item.id}>
          {hasChildren ? (
            <Collapsible
              open={isExpanded}
              onOpenChange={() => toggleSection(item.id)}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isToggleable && (
                      <NavigationToggle
                        groupId={item.id}
                        groupLabel={item.label}
                        isVisible={isVisible}
                        onToggle={handleToggleGroupVisibility}
                        variant="icon"
                        className="h-6 w-6"
                      />
                    )}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children?.map((child) => (
                    <SidebarMenuSubItem key={child.id}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isRouteActive(child.href)}
                      >
                        <Link href={child.href}>{child.label}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.label}
            >
              <Link href={item.href} className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar className={cn('border-r', className)} {...props}>
      <SidebarHeader className="border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo className="h-6 w-6 text-primary" />
          <span className="">Beta-db</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>{renderNavigationItems(visibleNavigationItems)}</SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t space-y-2">
        {footerNavigationConfig.length > 0 && (
          <SidebarMenu>
            {renderNavigationItems(footerNavigationConfig)}
          </SidebarMenu>
        )}

        {/* 導航設置按鈕 */}
        <div className="px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span>導航設置</span>
          </Button>
        </div>

        {/* 導航設置面板 */}
        {showSettings && (
          <div className="px-2 pb-2">
            <NavigationSettingsPanel
              groups={getToggleableNavigationGroups(navigationConfig).map((group) => ({
                id: group.id,
                label: group.label,
                isVisible: groupVisibility[group.id] !== false,
              }))}
              onToggleGroup={handleToggleGroupVisibility}
              onResetToDefault={handleResetToDefault}
              className="bg-background border rounded-lg p-3"
            />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
