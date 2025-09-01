
'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/ui/sidebar'
import {
  footerNavigationConfig,
  navigationConfig,
  shouldExpandSection,
} from '@root/src/components/layout/config/navigation.config'
import { ChevronDown, Package2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import { useEffect, useState } from 'react'

interface UnifiedSidebarProps extends ComponentProps<typeof Sidebar> {
  className?: string
}

export function UnifiedSidebar({ className, ...props }: UnifiedSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  useEffect(() => {
    const sectionsToExpand = navigationConfig
      .filter(item => item.children && shouldExpandSection(item.id, pathname))
      .map(item => item.id)

    setExpandedSections(prev => {
      const newExpanded = new Set([...prev, ...sectionsToExpand])
      return Array.from(newExpanded)
    })
  }, [pathname])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const isRouteActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const isSectionExpanded = (sectionId: string) =>
    expandedSections.includes(sectionId)

  const renderNavigationItems = (items: typeof navigationConfig) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0
      const isActive = isRouteActive(item.href) ||
        (item.children?.some(child => isRouteActive(child.href)) ?? false)
      const isExpanded = isSectionExpanded(item.id)

      return (
        <SidebarMenuItem key={item.id}>
          {hasChildren ? (
            <Collapsible open={isExpanded} onOpenChange={() => toggleSection(item.id)}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  className="w-full justify-between"
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
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
                        <Link href={child.href}>
                          <child.icon className="h-4 w-4" />
                          <span>{child.label}</span>
                        </Link>
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
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      )
    })
  }

  return (
    <Sidebar className={className} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href="/dashboard">
                <Package2 className="h-6 w-6" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Beta-db</span>
                  <span className="truncate text-xs">專案管理平台</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>主要功能</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderNavigationItems(navigationConfig)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {footerNavigationConfig.length > 0 && (
        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {renderNavigationItems(footerNavigationConfig)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
