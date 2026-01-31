"use client"

import { useState, useCallback, useMemo } from "react"
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSyncContext } from "@/context/sync-context"
import { useRithmicSyncStore } from "@/store/rithmic-sync-store"
import { useData } from "@/context/data-provider"
import { toast } from "sonner"
import { useI18n } from "@/locales/client"
import { getAllRithmicData } from "@/lib/rithmic-storage"
import { motion, AnimatePresence } from "framer-motion"

export function GlobalSyncButton() {
    const t = useI18n()
    const { rithmic, tradovate, manualSync } = useSyncContext()
    const { refreshAllData } = useData()
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Rithmic state
    const { isAutoSyncing: isRithmicSyncing, syncInterval } = useRithmicSyncStore()

    // Tradovate state
    const isTradovateSyncing = tradovate.isAutoSyncing
    const isAnySyncing = isRithmicSyncing || isTradovateSyncing || isRefreshing

    const handleGlobalSync = useCallback(async () => {
        if (isAnySyncing) return

        setIsRefreshing(true)
        const toastId = toast.loading(t('dashboard.refreshData'))

        try {
            // 1. Sync Rithmic
            const rithmicCredentials = getAllRithmicData()
            const rithmicIds = Object.keys(rithmicCredentials)

            for (const id of rithmicIds) {
                await manualSync('rithmic', id)
            }

            // 2. Sync Tradovate
            await tradovate.performSyncForAllAccounts()

            // 3. Refresh client data from DB
            await refreshAllData({ force: true })

            toast.success(t('dashboard.refreshSuccess'), { id: toastId })
        } catch (error) {
            console.error("Global sync error:", error)
            toast.error(t('dashboard.refreshError'), { id: toastId })
        } finally {
            setIsRefreshing(false)
        }
    }, [isAnySyncing, manualSync, tradovate, refreshAllData, t])

    return (
        <button
            onClick={handleGlobalSync}
            disabled={isAnySyncing}
            className={cn(
                "group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300",
                isAnySyncing
                    ? "bg-teal-500/10 border-teal-500/30 text-teal-400 cursor-wait"
                    : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/10"
            )}
            title={isAnySyncing ? "Syncing..." : "Sync All Accounts"}
        >
            <div className="relative">
                <RefreshCw className={cn(
                    "w-4 h-4 transition-transform duration-700",
                    isAnySyncing ? "animate-spin" : "group-hover:rotate-180"
                )} />
                {isAnySyncing && (
                    <motion.div
                        className="absolute inset-0 bg-teal-400/20 blur-sm rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </div>

            <AnimatePresence mode="wait">
                {isAnySyncing ? (
                    <motion.span
                        key="syncing"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        className="text-[10px] font-bold uppercase tracking-widest"
                    >
                        Syncing
                    </motion.span>
                ) : (
                    <motion.span
                        key="sync"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        className="text-[10px] font-bold uppercase tracking-widest hidden md:inline"
                    >
                        Sync
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Background Glow when syncing */}
            {isAnySyncing && (
                <div className="absolute inset-0 rounded-lg bg-teal-500/5 blur-md -z-10" />
            )}
        </button>
    )
}
