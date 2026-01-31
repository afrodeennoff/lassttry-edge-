
"use client"

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { useDashboard } from '@/app/[locale]/dashboard/dashboard-context';
import { AddWidgetSheet } from '@/app/[locale]/dashboard/components/add-widget-sheet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import { PnLSummary } from './pnl-summary';
import { FilterCommandMenu } from './filters/filter-command-menu';
import ImportButton from './import/import-button';
import { DailySummaryModal } from './daily-summary-modal';
import { ShareButton } from './share-button';
import { useData } from '@/context/data-provider';
import {
    CloudUpload,
    CheckCircle2,
    RefreshCw,
    Sparkles,
    Search
} from 'lucide-react';
import Link from 'next/link';

export function DashboardHeader() {
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();
    const {
        isCustomizing,
        toggleCustomizing,
        addWidget,
        layouts,
        autoSaveStatus,
        flushPendingSaves
    } = useDashboard();
    const { refreshAllData, isPlusUser, isLoading } = useData();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const t = useI18n();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshAllData({ force: true });
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // Determine active tab/title from pathname
    const getTitle = () => {
        if (pathname === '/dashboard') return 'Overview';
        if (pathname.includes('table')) return 'Trades';
        if (pathname.includes('strategies')) return 'Journal';
        if (pathname.includes('reports')) return 'Analytics';
        if (pathname.includes('behavior')) return 'Behavior';
        if (pathname.includes('calendar')) return 'Calendar';
        if (pathname.includes('data')) return 'Import';
        if (pathname.includes('settings')) return 'Settings';
        if (pathname.includes('billing')) return 'Billing';
        return 'Dashboard';
    };

    const title = getTitle();
    const currentLayout = layouts || { desktop: [], mobile: [] };

    return (
        <header className="h-16 border-b border-white/5 bg-[#020202]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 overflow-hidden">
            {/* Left Side: Sidebar Toggle & Title */}
            <div className="flex items-center gap-4 flex-shrink-0">
                <button onClick={toggleSidebar} className="p-2 text-zinc-500 hover:text-white lg:hidden">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </button>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-sm font-bold text-white tracking-wide uppercase">{title}</h1>
                    <div className="h-4 w-px bg-white/10 hidden md:block" />
                    <span className="text-[10px] text-zinc-600 font-mono hidden md:inline-block">LIVE TERMINAL</span>
                </div>
            </div>

            {/* Center: PnL Summary Metrics */}
            <div className="flex-1 max-w-2xl px-8 hidden xl:block">
                <PnLSummary />
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-3">
                {/* Search / Command Menu */}
                <FilterCommandMenu variant="navbar" />

                {/* Edit Layout Group */}
                {title === 'Overview' && (
                    <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/5">
                        <AddWidgetSheet
                            onAddWidget={addWidget}
                            isCustomizing={isCustomizing}
                            trigger={
                                <button className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                                    <span className="">+ ADD WIDGET</span>
                                </button>
                            }
                        />

                        <button
                            onClick={toggleCustomizing}
                            className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md transition-all duration-300 border",
                                isCustomizing
                                    ? "bg-teal-500 text-black border-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                                    : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isCustomizing ? 'LOCK LAYOUT' : 'EDIT LAYOUT'}
                        </button>

                        {isCustomizing && autoSaveStatus.hasPending && (
                            <button
                                onClick={flushPendingSaves}
                                className="p-1.5 text-teal-400 hover:bg-teal-400/10 rounded-md transition-all animate-pulse"
                                title="Save Changes"
                            >
                                <CloudUpload className="w-3.5 h-3.5" />
                            </button>
                        )}

                        {!autoSaveStatus.hasPending && isCustomizing && (
                            <div className="px-2 text-teal-500/60">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                        )}

                        <div className="w-px h-4 bg-white/10 mx-1" />
                        <ShareButton currentLayout={currentLayout} />
                    </div>
                )}

                {/* Import & Sub Group */}
                <div className="hidden sm:flex items-center gap-2">
                    <ImportButton />

                    {!isPlusUser() && (
                        <Link href="/dashboard/billing">
                            <button className="h-8 px-4 gap-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-500 text-[9px] font-black uppercase tracking-widest hover:border-teal-500/50 hover:bg-teal-500/20 transition-all flex items-center">
                                <Sparkles className="w-3 h-3 animate-pulse" />
                                <span>UPGRADE</span>
                            </button>
                        </Link>
                    )}
                </div>

                <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

                {/* Sync & Daily Group */}
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="p-1.5 text-zinc-500 hover:text-white rounded-md transition-colors"
                        title="Manual Sync"
                    >
                        <RefreshCw className={cn("w-3.5 h-3.5", (isRefreshing || isLoading) && "animate-spin")} />
                    </button>
                    <DailySummaryModal />
                </div>
            </div>
        </header>
    );
}
