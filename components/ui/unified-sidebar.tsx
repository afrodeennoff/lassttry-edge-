"use client"

import React, { useMemo, useCallback } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useI18n } from "@/locales/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SubscriptionBadge } from "@/components/subscription-badge"
import { Logo, LogoText } from "@/components/logo"
import {
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Globe
} from "lucide-react"
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface UnifiedSidebarItem {
  href?: string
  icon: React.ReactNode
  label: string
  i18nKey?: string
  action?: () => void
  badge?: React.ReactNode
  group?: string
  disabled?: boolean
}

export interface UnifiedSidebarConfig {
  items: UnifiedSidebarItem[]
  user?: {
    avatar_url?: string
    email?: string
    full_name?: string
  }
  actions?: React.ReactNode
  showSubscription?: boolean
  timezone?: {
    value: string
    options: string[]
    onChange: (value: string) => void
  }
  onLogout?: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
      duration: 0.4,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }
  }
}

/**
 * Hook to handle active link logic
 */
function useActiveLink() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const checkActive = useCallback((href: string) => {
    if (!pathname) return false

    // Handle query params matching (e.g. ?tab=)
    if (href.includes("?tab=")) {
      const tab = href.split("tab=")[1]
      const activeTab = searchParams.get("tab") || "widgets"
      return pathname === "/dashboard" && activeTab === tab
    }

    // Handle exact dashboard match
    if (href === "/dashboard") return pathname === "/dashboard" && (searchParams.get("tab") || "widgets") === "widgets"

    // Handle root /teams/manage vs /teams/dashboard distinction
    if (href === '/teams/manage' && pathname.includes('/teams/manage')) return true
    if (href === '/teams/dashboard' && pathname.includes('/teams/dashboard')) return true

    // Default prefix match
    return pathname.startsWith(href)
  }, [pathname, searchParams])

  return { checkActive }
}

/**
 * Memoized Individual Sidebar Item
 */
const SidebarItem = React.memo(({
  item,
  state,
  active
}: {
  item: UnifiedSidebarItem,
  state: string,
  active: boolean
}) => {
  const t = useI18n()
  const label = item.i18nKey ? (t as any)(item.i18nKey) : item.label

  const content = (
    <div className="flex items-center gap-3 w-full relative z-10">
      <div className="relative flex items-center justify-center">
        <div className={cn(
          "size-4.5 transition-all duration-300",
          active ? "text-primary scale-110 drop-shadow-[0_0_6px_rgba(var(--primary),0.4)]" : "group-hover/item:text-primary/90 group-hover/item:scale-110"
        )}>
          {item.icon}
        </div>
        {active && (
          <motion.div
            layoutId="activeGlow"
            className="absolute inset-0 bg-primary/25 blur-lg rounded-full -z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </div>
      <span className={cn(
        "text-[13px] group-data-[collapsible=icon]:hidden font-medium transition-colors duration-200",
        active ? "font-semibold text-primary" : "text-muted-foreground group-hover/item:text-foreground"
      )}>{label}</span>
      {item.badge}
      {active && (
        <motion.div
          layoutId="activeHighlight"
          className="absolute left-0 w-1 h-5 bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.8)]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  )

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild={!!item.href}
        isActive={active}
        tooltip={state === "collapsed" ? label : undefined}
        onClick={item.action}
        className={cn(
          "relative flex items-center gap-3 px-3 h-10 transition-all duration-300 group/item overflow-visible cursor-pointer rounded-lg mx-1 my-0.5",
          "hover:bg-primary/5 border border-transparent",
          active
            ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/5 shadow-sm"
            : "hover:border-border/40"
        )}
      >
        {item.href ? (
          <Link href={item.href}>
            {content}
          </Link>
        ) : (
          <span className="w-full text-left">
            {content}
          </span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})

SidebarItem.displayName = "SidebarItem"

export function UnifiedSidebar({
  items,
  user,
  actions,
  showSubscription = true,
  timezone,
  onLogout
}: UnifiedSidebarConfig) {
  const { state, toggleSidebar } = useSidebar()
  const { checkActive } = useActiveLink()

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      const group = item.group || "default"
      if (!acc[group]) acc[group] = []
      acc[group].push(item)
      return acc
    }, {} as Record<string, UnifiedSidebarItem[]>)
  }, [items])

  const hasGroups = useMemo(() => Object.keys(groupedItems).length > 1, [groupedItems])

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-background">
      <SidebarRail className="after:transition-colors after:duration-200 hover:bg-sidebar-accent/10 hover:after:bg-sidebar-accent" />

      <SidebarHeader className="py-4 px-2 border-b border-border/50">
        <div className="flex items-center gap-3 px-2 overflow-hidden h-12 mb-3">
          <div className="flex items-center justify-center size-9 shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/10 shadow-sm">
            <Logo className="size-5 text-primary" />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden transition-all duration-300 opacity-100">
            <LogoText />
          </div>
        </div>

        {user && (
          <div className={cn(
            "mx-1 flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-border/40 hover:border-border/80 transition-all duration-300 group/user",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:border-none"
          )}>
            <Avatar className="size-9 border border-border/50 shadow-sm ring-1 ring-border/20 transition-transform duration-300 group-hover/user:scale-105">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-[10px] font-bold uppercase">
                {user.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold tracking-tight text-foreground truncate group-hover/user:text-primary transition-colors">
                  {user.full_name || user.email?.split('@')[0]}
                </span>
                {showSubscription && <SubscriptionBadge className="scale-90 origin-right shadow-none" />}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground truncate lowercase group-hover/user:text-muted-foreground/80">{user.email}</span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-6 p-3 custom-scrollbar">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1.5"
        >
          {Object.entries(groupedItems).map(([group, groupItems]) => (
            <SidebarGroup key={group} className="p-0">
              {hasGroups && group !== "default" && (
                <SidebarGroupLabel className="text-[10px] font-bold uppercase text-muted-foreground/70 tracking-widest px-4 py-2 mt-2">
                  {group}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {groupItems.map((item) => (
                    <motion.div key={item.label} variants={itemVariants}>
                      <SidebarItem
                        item={item}
                        state={state}
                        active={item.href ? checkActive(item.href) : false}
                      />
                    </motion.div>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          {actions && (
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {actions}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {timezone && state === "expanded" && (
            <SidebarGroup className="p-0 mt-auto pt-4">
              <SidebarGroupLabel className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-widest px-4 mb-2">
                Preferences
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  <motion.div variants={itemVariants}>
                    <SidebarMenuItem>
                      <div className="px-2">
                        <Select value={timezone.value} onValueChange={timezone.onChange}>
                          <SelectTrigger className="h-9 text-[12px] font-medium bg-background/50 border-input/40 hover:border-border/80 transition-colors focus:ring-sidebar-ring">
                            <div className="flex items-center gap-2 truncate">
                              <Globe className="size-3.5 text-muted-foreground" />
                              <SelectValue placeholder="Select timezone" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {timezone.options.map(tz => (
                              <SelectItem key={tz} value={tz} className="text-[12px]">
                                {tz}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </SidebarMenuItem>
                  </motion.div>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {state === "collapsed" && (
            <div className="flex flex-col items-center gap-2 py-4 opacity-20">
              <div className="size-px h-10 bg-gradient-to-b from-muted/50 to-transparent" />
              <span className="text-[9px] font-semibold uppercase text-muted-foreground tracking-[0.4em] leading-none text-center" style={{ writingMode: 'vertical-rl' }}>NAV</span>
            </div>
          )}
        </motion.div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-3 flex flex-col gap-1 bg-gradient-to-b from-background/50 to-background backdrop-blur-md">
        <div className="flex flex-col gap-1">
          {onLogout && (
            <button
              onClick={onLogout}
              className={cn(
                "flex items-center gap-3 px-3 h-9 w-full rounded-lg transition-all duration-300",
                "hover:bg-destructive/10 text-muted-foreground hover:text-destructive group/logout",
                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              )}
            >
              <LogOut className="size-4 shrink-0 transition-transform group-hover/logout:-translate-x-0.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider group-data-[collapsible=icon]:hidden truncate">Logout</span>
            </button>
          )}

          <button
            onClick={toggleSidebar}
            className={cn(
              "flex items-center gap-3 px-3 h-9 w-full rounded-lg transition-all duration-300",
              "hover:bg-accent/5 text-muted-foreground hover:text-foreground border border-transparent hover:border-border/30",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            )}
          >
            {state === "expanded" ? (
              <>
                <ChevronsLeft className="size-4 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wider group-data-[collapsible=icon]:hidden truncate">Collapse</span>
              </>
            ) : (
              <ChevronsRight className="size-4 shrink-0" />
            )}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
