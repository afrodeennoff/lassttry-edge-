"use client"

import React, { useMemo, useCallback } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useI18n } from "@/locales/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SubscriptionBadge } from "@/components/subscription-badge"
import { Logo, LogoText } from "@/components/logo"
import {
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Globe,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  styleVariant?: UnifiedSidebarStyle
}

export type UnifiedSidebarStyle = "minimal" | "glassy"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.04,
      duration: 0.24,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] },
  },
}

const fastSpring = {
  type: "spring" as const,
  stiffness: 340,
  damping: 30,
  mass: 0.65,
}

const subtleSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 0.72,
}

function stripLocalePrefix(pathname: string) {
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "")
  return withoutLocale.length > 0 ? withoutLocale : "/"
}

function getUserInitials(user?: UnifiedSidebarConfig["user"]) {
  const raw = user?.full_name || user?.email || "User"
  const parts = raw
    .replace(/@.*/, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (parts.length === 0) return "U"
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("")
}

/**
 * Hook to handle active link logic
 */
function useActiveLink() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const normalizedPathname = useMemo(() => {
    if (!pathname) return ""
    return stripLocalePrefix(pathname)
  }, [pathname])

  const checkActive = useCallback(
    (href: string) => {
      if (!normalizedPathname) return false

      const [basePath, queryString] = href.split("?")
      const hrefParams = new URLSearchParams(queryString ?? "")
      const hrefTab = hrefParams.get("tab")

      // Handle tab-aware dashboard links
      if (basePath === "/dashboard" && hrefTab) {
        const activeTab = searchParams.get("tab") || "widgets"
        return normalizedPathname === "/dashboard" && activeTab === hrefTab
      }

      // Handle root dashboard route (widgets tab)
      if (basePath === "/dashboard") {
        return (
          normalizedPathname === "/dashboard" &&
          (searchParams.get("tab") || "widgets") === "widgets"
        )
      }

      // Handle root /teams/manage vs /teams/dashboard distinction
      if (basePath === "/teams/manage" && normalizedPathname.includes("/teams/manage")) {
        return true
      }

      if (basePath === "/teams/dashboard" && normalizedPathname.includes("/teams/dashboard")) {
        return true
      }

      // Default exact or nested match
      return (
        normalizedPathname === basePath ||
        normalizedPathname.startsWith(`${basePath}/`)
      )
    },
    [normalizedPathname, searchParams]
  )

  return { checkActive }
}

type SidebarState = "expanded" | "collapsed"

type SidebarItemProps = {
  item: UnifiedSidebarItem
  state: SidebarState
  active: boolean
  styleVariant: UnifiedSidebarStyle
  reduceMotion: boolean
}

const SIDEBAR_STYLE_CLASSES: Record<
  UnifiedSidebarStyle,
  {
    sidebar: string
    rail: string
    header: string
    brandCard: string
    brandIcon: string
    workspaceLabel: string
    userCard: string
    avatar: string
    avatarFallback: string
    content: string
    groupLabel: string
    groupLine: string
    itemTrack: string
    itemIconActive: string
    itemIconInactive: string
    itemButtonActive: string
    itemButtonInactive: string
    selectTrigger: string
    collapsedMeta: string
    collapsedLine: string
    footer: string
    logout: string
    collapse: string
  }
> = {
  minimal: {
    sidebar: "border-r border-border/60 bg-background",
    rail: "after:transition-colors after:duration-200 hover:bg-accent/40 hover:after:bg-border",
    header: "border-b border-border/60 px-3 py-3",
    brandCard: "mb-3 flex h-12 items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-background px-2.5",
    brandIcon: "flex size-8.5 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 text-primary",
    workspaceLabel: "truncate text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/80",
    userCard:
      "mx-0.5 flex items-center gap-3 rounded-xl border border-border/60 bg-background p-2.5 transition-colors duration-200 hover:border-border",
    avatar: "size-9 border border-border/60 ring-1 ring-border/30",
    avatarFallback: "bg-muted text-[11px] font-bold uppercase text-foreground",
    content: "flex flex-col gap-3 px-2 py-2 overflow-hidden",
    groupLabel: "text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
    groupLine: "h-px flex-1 bg-border/70",
    itemTrack: "bg-foreground/80",
    itemIconActive: "border-border/70 bg-background text-foreground",
    itemIconInactive:
      "border-border/60 bg-background text-muted-foreground group-hover/item:border-border group-hover/item:text-foreground",
    itemButtonActive: "border-border/70 bg-accent/50 text-foreground",
    itemButtonInactive: "hover:border-border/70 hover:bg-accent/35",
    selectTrigger:
      "h-9 rounded-xl border-input/60 bg-background text-[12px] font-medium hover:border-border focus:ring-sidebar-ring",
    collapsedMeta: "flex flex-col items-center gap-2 py-3 opacity-40",
    collapsedLine: "h-8 w-px bg-border",
    footer: "border-t border-border/60 bg-background p-2.5",
    logout:
      "flex h-9 w-full items-center gap-3 rounded-xl px-3 text-muted-foreground transition-all duration-200 hover:bg-accent/50 hover:text-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
    collapse:
      "flex h-9 w-full items-center gap-3 rounded-xl border border-transparent px-3 text-muted-foreground transition-all duration-200 hover:border-border/70 hover:bg-accent/45 hover:text-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
  },
  glassy: {
    sidebar:
      "border-r border-white/10 bg-gradient-to-b from-background/95 via-background/80 to-background/70 backdrop-blur-xl",
    rail: "after:transition-colors after:duration-200 hover:bg-primary/10 hover:after:bg-primary/40",
    header: "border-b border-white/10 px-3 py-3",
    brandCard:
      "mb-3 flex h-12 items-center gap-3 overflow-hidden rounded-xl border border-white/15 bg-white/[0.04] px-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
    brandIcon:
      "flex size-8.5 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/25 to-primary/10 text-primary",
    workspaceLabel: "truncate text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/85",
    userCard:
      "mx-0.5 flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] p-2.5 transition-colors duration-200 hover:border-white/25",
    avatar: "size-9 border border-white/15 ring-1 ring-white/10",
    avatarFallback: "bg-primary/20 text-[11px] font-bold uppercase text-primary",
    content: "flex flex-col gap-3 px-2 py-2 overflow-hidden",
    groupLabel: "text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/75",
    groupLine: "h-px flex-1 bg-white/15",
    itemTrack: "bg-primary",
    itemIconActive:
      "border-primary/30 bg-primary/15 text-primary shadow-[0_0_0_1px_rgba(var(--primary),0.15)]",
    itemIconInactive:
      "border-white/15 bg-white/[0.03] text-muted-foreground group-hover/item:border-white/25 group-hover/item:text-foreground",
    itemButtonActive:
      "border-primary/25 bg-primary/12 text-foreground shadow-[0_0_0_1px_rgba(var(--primary),0.10),0_6px_20px_rgba(0,0,0,0.12)]",
    itemButtonInactive: "hover:border-white/20 hover:bg-white/[0.04]",
    selectTrigger:
      "h-9 rounded-xl border-white/20 bg-white/[0.03] text-[12px] font-medium hover:border-white/30 focus:ring-sidebar-ring",
    collapsedMeta: "flex flex-col items-center gap-2 py-3 opacity-30",
    collapsedLine: "h-8 w-px bg-gradient-to-b from-white/35 to-transparent",
    footer: "border-t border-white/10 bg-background/75 p-2.5 backdrop-blur-sm",
    logout:
      "flex h-9 w-full items-center gap-3 rounded-xl px-3 text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
    collapse:
      "flex h-9 w-full items-center gap-3 rounded-xl border border-transparent px-3 text-muted-foreground transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04] hover:text-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
  },
}

/**
 * Memoized individual sidebar item
 */
const SidebarItem = React.memo(({
  item,
  state,
  active,
  styleVariant,
  reduceMotion,
}: SidebarItemProps) => {
  const t = useI18n()
  const translate = t as unknown as (key: string) => string
  const label = item.i18nKey ? translate(item.i18nKey) : item.label
  const isDisabled = Boolean(item.disabled)
  const isLink = Boolean(item.href) && !isDisabled
  const styles = SIDEBAR_STYLE_CLASSES[styleVariant]
  const hoverAnimation = !reduceMotion && !isDisabled ? { x: 1.5 } : undefined
  const tapAnimation = !reduceMotion && !isDisabled ? { scale: 0.995 } : undefined

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault()
      return
    }

    item.action?.()
  }

  const content = (
    <div className="flex items-center gap-3 w-full relative z-10">
      {active && (
        <motion.div
          layoutId="activeHighlight"
          className={cn("absolute left-0 w-1 h-5 rounded-full", styles.itemTrack)}
          transition={reduceMotion ? { duration: 0 } : fastSpring}
        />
      )}

      <motion.div
        className={cn(
          "relative flex size-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 transform-gpu",
          active ? cn(styles.itemIconActive, "scale-110") : styles.itemIconInactive,
          isDisabled && "opacity-70"
        )}
        animate={
          reduceMotion
            ? undefined
            : { scale: active ? 1.06 : 1 }
        }
        transition={reduceMotion ? undefined : subtleSpring}
      >
        <div className="size-4">{item.icon}</div>
        {active && (
          <motion.div
            layoutId="activeGlow"
            className="absolute inset-0 rounded-full bg-primary/25 blur-md -z-10"
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1.3 }}
            transition={reduceMotion ? undefined : { duration: 0.24, ease: "easeOut" }}
          />
        )}
      </motion.div>

      <motion.span
        className={cn(
          "truncate text-[13px] font-medium transition-colors group-data-[collapsible=icon]:hidden",
          active ? "font-semibold text-primary" : "text-muted-foreground group-hover/item:text-foreground",
          isDisabled && "text-muted-foreground/70"
        )}
        animate={reduceMotion ? undefined : { x: active ? 0.9 : 0 }}
        transition={reduceMotion ? undefined : { duration: 0.16, ease: "easeOut" }}
      >
        {label}
      </motion.span>

      {item.badge && (
        <motion.span
          className="ml-auto shrink-0 group-data-[collapsible=icon]:hidden"
          animate={reduceMotion ? undefined : { scale: active ? 1.02 : 1 }}
          transition={reduceMotion ? undefined : subtleSpring}
        >
          {item.badge}
        </motion.span>
      )}
    </div>
  )

  return (
    <SidebarMenuItem>
      <motion.div
        layout={!reduceMotion}
        transition={reduceMotion ? { duration: 0 } : subtleSpring}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
      >
        <SidebarMenuButton
          asChild={isLink}
          isActive={active}
          tooltip={state === "collapsed" ? label : undefined}
          onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
          aria-disabled={isDisabled || undefined}
          disabled={isDisabled && !isLink}
          className={cn(
            "relative mx-0.5 h-10 rounded-xl border border-transparent px-2.5 transition-all duration-200 group/item overflow-visible will-change-transform",
            active
              ? cn(styles.itemButtonActive, "shadow-sm")
              : styles.itemButtonInactive,
            isDisabled && "opacity-60"
          )}
        >
          {isLink ? (
            <Link href={item.href as string} aria-current={active ? "page" : undefined}>
              {content}
            </Link>
          ) : (
            content
          )}
        </SidebarMenuButton>
      </motion.div>
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
  onLogout,
  styleVariant = "minimal",
}: UnifiedSidebarConfig) {
  const { state, toggleSidebar } = useSidebar()
  const shouldReduceMotion = useReducedMotion()
  const { checkActive } = useActiveLink()
  const styles = SIDEBAR_STYLE_CLASSES[styleVariant]

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      const group = item.group || "default"
      if (!acc[group]) acc[group] = []
      acc[group].push(item)
      return acc
    }, {} as Record<string, UnifiedSidebarItem[]>)
  }, [items])

  const hasGroups = useMemo(
    () => Object.keys(groupedItems).length > 1,
    [groupedItems]
  )

  const displayName = user?.full_name || user?.email?.split("@")[0] || "User"
  const initials = useMemo(() => getUserInitials(user), [user])

  return (
    <Sidebar
      collapsible="icon"
      className={cn(styles.sidebar, "transition-colors duration-300")}
    >
      <SidebarRail className={styles.rail} />

      <SidebarHeader className={styles.header}>
        <motion.button
          type="button"
          onClick={toggleSidebar}
          className={cn(styles.collapse, "mb-2 h-8")}
          whileHover={shouldReduceMotion ? undefined : { x: 1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
          transition={shouldReduceMotion ? undefined : subtleSpring}
        >
          {state === "expanded" ? (
            <>
              <ChevronsLeft className="size-4 shrink-0" />
              <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] group-data-[collapsible=icon]:hidden">
                Collapse
              </span>
            </>
          ) : (
            <ChevronsRight className="size-4 shrink-0" />
          )}
        </motion.button>

        <motion.div
          className={cn(
            styles.brandCard,
            "group-data-[collapsible=icon]:mb-2 group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none"
          )}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : subtleSpring}
        >
          <motion.div
            className={cn(
              styles.brandIcon,
              "ring-1 ring-inset ring-white/10 shadow-[0_4px_14px_rgba(0,0,0,0.16)]"
            )}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            transition={shouldReduceMotion ? undefined : subtleSpring}
          >
            <Logo className="size-4.5" />
          </motion.div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <LogoText />
            <span className={cn(styles.workspaceLabel, "tracking-[0.14em]")}>
              Workspace
            </span>
          </div>
        </motion.div>

        {user && (
          <motion.div
            className={cn(
              styles.userCard,
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0"
            )}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? undefined : subtleSpring}
            whileHover={
              shouldReduceMotion || state === "collapsed"
                ? undefined
                : { y: -1, scale: 1.005 }
            }
          >
            <Avatar className={styles.avatar}>
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className={styles.avatarFallback}>
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[13px] font-semibold text-foreground">
                  {displayName}
                </span>
                {showSubscription && (
                  <SubscriptionBadge className="origin-right scale-90 shadow-none" />
                )}
              </div>
              <span className="block truncate text-[11px] text-muted-foreground">
                {user.email}
              </span>
            </div>
          </motion.div>
        )}
      </SidebarHeader>

      <SidebarContent className={styles.content}>
        <motion.div
          layout={!shouldReduceMotion}
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? undefined : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          transition={shouldReduceMotion ? { duration: 0 } : subtleSpring}
          className="flex flex-col gap-2"
        >
          {Object.entries(groupedItems).map(([group, groupItems]) => (
            <motion.div
              key={group}
              layout={!shouldReduceMotion}
              transition={shouldReduceMotion ? { duration: 0 } : subtleSpring}
            >
              <SidebarGroup className="p-0">
              {hasGroups && group !== "default" && (
                <SidebarGroupLabel className="px-2 pb-1 pt-2">
                  <motion.div
                    className="flex items-center gap-2"
                    initial={shouldReduceMotion ? undefined : { opacity: 0, x: -4 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                    transition={shouldReduceMotion ? undefined : { duration: 0.18, ease: "easeOut" }}
                  >
                    <span className={styles.groupLabel}>
                      {group}
                    </span>
                    <div className={styles.groupLine} />
                  </motion.div>
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {groupItems.map((item, index) => (
                    <motion.div
                      key={`${item.href || item.label}-${index}`}
                      layout={!shouldReduceMotion}
                      variants={shouldReduceMotion ? undefined : itemVariants}
                      transition={shouldReduceMotion ? { duration: 0 } : subtleSpring}
                    >
                      <SidebarItem
                        item={item}
                        state={state as SidebarState}
                        styleVariant={styleVariant}
                        reduceMotion={Boolean(shouldReduceMotion)}
                        active={!item.disabled && !!item.href && checkActive(item.href)}
                      />
                    </motion.div>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
              </SidebarGroup>
            </motion.div>
          ))}

          {actions && (
            <SidebarGroup className="p-0 pt-2">
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">{actions}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          <AnimatePresence initial={false}>
            {timezone && state === "expanded" && (
              <motion.div
                key="timezone-prefs"
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
                transition={shouldReduceMotion ? { duration: 0 } : subtleSpring}
              >
                <SidebarGroup className="mt-auto p-0 pt-3">
                  <SidebarGroupLabel className="px-2 pb-1">
                    <div className="flex items-center gap-2">
                      <span className={styles.groupLabel}>
                        Preferences
                      </span>
                      <div className={styles.groupLine} />
                    </div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-1">
                      <motion.div
                        variants={shouldReduceMotion ? undefined : itemVariants}
                        initial={shouldReduceMotion ? undefined : "hidden"}
                        animate={shouldReduceMotion ? undefined : "visible"}
                      >
                        <SidebarMenuItem>
                          <div className="px-1.5">
                            <Select value={timezone.value} onValueChange={timezone.onChange}>
                              <SelectTrigger className={styles.selectTrigger}>
                                <div className="flex items-center gap-2 truncate">
                                  <Globe className="size-3.5 text-muted-foreground" />
                                  <SelectValue placeholder="Select timezone" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {timezone.options.map((tz) => (
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
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {state === "collapsed" && (
              <motion.div
                key="collapsed-indicator"
                className={styles.collapsedMeta}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
              >
                <div className={styles.collapsedLine} />
                <span
                  className="text-[9px] font-semibold uppercase tracking-[0.28em] text-muted-foreground"
                  style={{ writingMode: "vertical-rl" }}
                >
                  Menu
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </SidebarContent>

      <SidebarFooter className={styles.footer}>
        <div className="flex flex-col gap-1.5">
          {onLogout && (
            <motion.button
              type="button"
              onClick={onLogout}
              className={styles.logout}
              whileHover={shouldReduceMotion ? undefined : { x: 1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
              transition={shouldReduceMotion ? undefined : subtleSpring}
            >
              <LogOut className="size-4 shrink-0" />
              <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </motion.button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
