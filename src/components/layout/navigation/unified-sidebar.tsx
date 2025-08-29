
'use client'

import { Button } from '@/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/ui/sidebar'
import {
  footerNavigationConfig,
  navigationConfig,
  shouldExpandSection,
} from '@root/src/lib/config/navigation.config'
import { Package2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import { useEffect, useState } from 'react'
import { NavigationMenu } from './navigation-menu'

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

  return (
    <Sidebar className={className} {...props}>
      <SidebarHeader>
        <Button
          variant="ghost"
          asChild
          className="h-12 w-full justify-start text-lg"
        >
          <Link href="/dashboard">
            <Package2 className="mr-3 h-6 w-6" />
            <span className="font-bold">Beta-db</span>
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <NavigationMenu
          items={navigationConfig}
          isRouteActive={isRouteActive}
          isSectionExpanded={isSectionExpanded}
          onToggleSection={toggleSection}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavigationMenu
          items={footerNavigationConfig}
          isRouteActive={isRouteActive}
          isSectionExpanded={isSectionExpanded}
          onToggleSection={toggleSection}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
