'use client'

import { useState } from 'react'
import {
  Pencil,
  Share2,
  Plus,
  Search,
  RefreshCw,
  Upload,
  Zap,
  Sparkles,
  LayoutDashboard
} from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import ImportButton from './import/import-button'
import { useI18n } from "@/locales/client"
import { useKeyboardShortcuts } from '../../../../hooks/use-keyboard-shortcuts'
import { ActiveFilterTags } from './filters/active-filter-tags'
import { AnimatePresence, motion } from 'framer-motion'
import { FilterCommandMenu } from './filters/filter-command-menu'
import { useModalStateStore } from '@/store/modal-state-store'
import { useUserStore } from '@/store/user-store'
import ReferralButton from '@/components/referral-button'
import { useDashboard } from '../dashboard-context'
import { AddWidgetSheet } from './add-widget-sheet'
import { ShareButton } from './share-button'
import { useData } from '@/context/data-provider'
import { cn } from '@/lib/utils'
import { DailySummaryModal } from './daily-summary-modal'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Navbar() {
  const t = useI18n()
  const {
    isCustomizing,
    toggleCustomizing,
    addWidget,
    layouts
  } = useDashboard()
  const { refreshAllData, isPlusUser } = useData()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshAllData({ force: true })
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Initialize keyboard shortcuts
  useKeyboardShortcuts()

  const currentLayout = layouts || { desktop: [], mobile: [] }

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 flex flex-col z-40 bg-background/60 backdrop-blur-xl border-b border-white/5 shadow-[0_2px_20px_-12px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">

          {/* Left Side: Sidebar Toggle & Brand */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-foreground hover:bg-white/5 transition-colors" />
            <div className="h-4 w-px bg-white/10 hidden lg:block" />
            <Link href="/dashboard" className="flex items-center gap-3 group/logo">
              <div className="relative overflow-hidden flex aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/20 transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-3">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent)] opacity-50" />
                <Logo className="size-4 fill-white relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-100 select-none group-hover/logo:text-white transition-colors">
                  QuntEdge
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500 select-none">
                  Analytics
                </span>
              </div>
            </Link>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-3">

            {/* Dashboard Management Group */}
            <div className="hidden lg:flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
              <Button
                id="customize-mode"
                variant={isCustomizing ? "default" : "ghost"}
                size="sm"
                onClick={toggleCustomizing}
                className={cn(
                  "h-8 px-3 gap-2 rounded-xl transition-all duration-300",
                  isCustomizing
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
                )}
              >
                <Pencil className={cn("w-3.5 h-3.5", isCustomizing && "animate-pulse")} />
                <span className="text-[10px] font-black uppercase tracking-wider">{isCustomizing ? "Lock" : "Edit"}</span>
              </Button>

              <AddWidgetSheet onAddWidget={addWidget} isCustomizing={isCustomizing} />

              <div className="w-px h-4 bg-white/10 mx-1" />

              <ShareButton currentLayout={currentLayout} />
            </div>

            {/* Performance & Search Group */}
            <div className="flex items-center gap-1.5">
              <FilterCommandMenu variant="navbar" />

              <div className="hidden md:flex items-center gap-2">
                <ImportButton />

                {!isPlusUser() && (
                  <Link href="/dashboard/billing">
                    <Button variant="outline" size="sm" className="h-9 px-4 gap-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:border-amber-500/60 hover:from-amber-500/30 transition-all duration-500 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>Upgrade</span>
                    </Button>
                  </Link>
                )}
              </div>

              <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

              {/* Real-time Actions */}
              <div className="flex items-center gap-2 bg-zinc-950/40 p-1 rounded-2xl border border-white/5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  className="h-8 w-8 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                  title="Manual Refresh"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5 transition-transform duration-700", isRefreshing && "animate-spin-fast")} />
                </Button>
                <DailySummaryModal />
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <AnimatePresence>
          <ActiveFilterTags showAccountNumbers={true} />
        </AnimatePresence>
      </nav>
    </>
  )
}
