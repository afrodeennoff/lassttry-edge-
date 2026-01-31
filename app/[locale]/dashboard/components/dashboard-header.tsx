
"use client"

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { useDashboard } from '@/app/[locale]/dashboard/dashboard-context';
import { AddWidgetSheet } from '@/app/[locale]/dashboard/components/add-widget-sheet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';

export function DashboardHeader() {
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();
    const { isCustomizing, toggleCustomizing, addWidget } = useDashboard();
    const [isManagePanelOpen, setIsManagePanelOpen] = useState(false);
    const t = useI18n();

    // Determine active tab/title from pathname
    const getTitle = () => {
        if (pathname === '/dashboard') return 'Overview';
        if (pathname.includes('table')) return 'Trades';
        if (pathname.includes('strategies')) return 'Journal';
        if (pathname.includes('reports')) return 'Analytics';
        if (pathname.includes('calendar')) return 'Calendar';
        if (pathname.includes('data')) return 'Import';
        if (pathname.includes('settings')) return 'Settings';
        if (pathname.includes('billing')) return 'Billing';
        return 'Dashboard';
    };

    const title = getTitle();

    return (
        <header className="h-16 border-b border-white/5 bg-[#020202]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 text-zinc-500 hover:text-white lg:hidden">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </button>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-sm font-bold text-white tracking-wide uppercase">{title}</h1>
                    <span className="text-[10px] text-zinc-600 font-mono hidden md:inline-block">/ SESSION: LONDON</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {title === 'Overview' && (
                    <>
                        {/* + Widgets Button */}
                        <AddWidgetSheet
                            onAddWidget={addWidget}
                            isCustomizing={isCustomizing}
                            trigger={
                                <button className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-zinc-800 hover:text-white transition-colors bg-zinc-900/50 hover:bg-zinc-800 flex items-center gap-2">
                                    <span className="lg:hidden">+</span>
                                    <span className="hidden lg:inline">+ Widgets</span>
                                </button>
                            }
                        />

                        <button
                            onClick={toggleCustomizing}
                            className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors",
                                isCustomizing
                                    ? "bg-teal-500/20 text-teal-400 border-teal-500/50"
                                    : "text-zinc-500 border-transparent hover:text-white"
                            )}
                        >
                            {isCustomizing ? 'Save Layout' : 'Edit Layout'}
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
