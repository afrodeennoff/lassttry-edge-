"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { useUserStore } from '@/store/user-store'
import { useI18n } from "@/locales/client"
import { Widget, WidgetType, WidgetSize, LayoutItem } from './types/dashboard'
import { WIDGET_REGISTRY } from './config/widget-registry'
import { toast } from "sonner"
import { defaultLayouts } from "@/lib/default-layouts"
import { DashboardLayoutWithWidgets } from '@/store/user-store'
import { widgetPersistenceManager } from '@/lib/widget-persistence-manager'

export const sizeToGrid = (size: WidgetSize, isSmallScreen = false): { w: number, h: number } => {
    if (isSmallScreen) {
        switch (size) {
            case 'tiny': return { w: 12, h: 1 }
            case 'small': return { w: 12, h: 2 }
            case 'small-long': return { w: 12, h: 2 }
            case 'medium': return { w: 12, h: 4 }
            case 'large': return { w: 12, h: 6 }
            case 'extra-large': return { w: 12, h: 6 }
            default: return { w: 12, h: 4 }
        }
    }
    switch (size) {
        case 'tiny': return { w: 3, h: 1 }
        case 'small': return { w: 3, h: 4 }
        case 'small-long': return { w: 6, h: 2 }
        case 'medium': return { w: 6, h: 4 }
        case 'large': return { w: 6, h: 8 }
        case 'extra-large': return { w: 12, h: 8 }
        default: return { w: 6, h: 4 }
    }
}

export const getWidgetGrid = (type: WidgetType, size: WidgetSize, isSmallScreen = false): { w: number, h: number } => {
    const config = WIDGET_REGISTRY[type]
    if (!config) return isSmallScreen ? { w: 12, h: 4 } : { w: 6, h: 4 }
    if (isSmallScreen) return sizeToGrid(size, true)
    return sizeToGrid(size)
}

interface DashboardContextType {
    isCustomizing: boolean
    setIsCustomizing: (val: boolean) => void
    toggleCustomizing: () => void
    layouts: DashboardLayoutWithWidgets | null
    currentLayout: Widget[]
    activeLayout: 'desktop' | 'mobile'

    addWidget: (type: WidgetType, size?: WidgetSize) => void
    removeWidget: (id: string) => void
    changeWidgetType: (id: string, newType: WidgetType) => void
    changeWidgetSize: (id: string, newSize: WidgetSize) => void
    removeAllWidgets: () => void
    restoreDefaultLayout: () => void
    handleLayoutChange: (layout: LayoutItem[]) => void

    isMobile: boolean
    
    autoSaveStatus: {
        hasPending: boolean
        isInitialized: boolean
    }
    flushPendingSaves: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const t = useI18n()
    const isMobile = useUserStore(state => state.isMobile)
    const layouts = useUserStore(state => state.dashboardLayout)
    const setLayouts = useUserStore(state => state.setDashboardLayout)
    const user = useUserStore(state => state.user)
    const supabaseUser = useUserStore(state => state.supabaseUser)

    const [isCustomizing, setIsCustomizing] = useState(false)
    const [isUserAction, setIsUserAction] = useState(false)
    const [autoSaveInitialized, setAutoSaveInitialized] = useState(false)

    const activeLayout = useMemo(() => isMobile ? 'mobile' : 'desktop', [isMobile])

    const toggleCustomizing = useCallback(async () => {
        if (isCustomizing && userId) {
            await widgetPersistenceManager.flushPendingSave(userId)
        }
        setIsCustomizing(prev => !prev)
    }, [isCustomizing, userId])

    const currentLayout = useMemo(() => {
        return layouts?.[activeLayout] || []
    }, [layouts, activeLayout])

    const userId = user?.id || supabaseUser?.id

    useEffect(() => {
        if (!userId) return

        widgetPersistenceManager.setLayoutId(userId)
        widgetPersistenceManager.loadLayout(userId).catch((error) => {
            console.error('[Dashboard] Failed to preload layout for persistence manager', error)
        })
        setAutoSaveInitialized(true)
    }, [userId])

    const handleLayoutChange = useCallback((layout: LayoutItem[]) => {
        if (!userId || !setLayouts || !layouts) return

        console.log('[DashboardContext] handleLayoutChange', layout)

        try {
            const currentWidgets = layouts[activeLayout] || []
            
            const updatedWidgets = layout.map(item => {
                const existingWidget = currentWidgets.find(w => w.i === item.i)
                if (!existingWidget) {
                    console.warn('[DashboardContext] Widget not found:', item.i)
                    return null
                }
                return {
                    ...existingWidget,
                    x: isMobile ? 0 : item.x,
                    y: item.y,
                    w: isMobile ? 12 : item.w,
                    h: item.h,
                }
            }).filter((item): item is NonNullable<typeof item> => item !== null)

            const updatedLayouts = {
                ...layouts,
                [activeLayout]: updatedWidgets,
                updatedAt: new Date()
            }

            setLayouts(updatedLayouts)
            widgetPersistenceManager.saveLayout(userId, updatedLayouts, { changeType: 'auto' })

            if (isUserAction) setIsUserAction(false)
        } catch (error) {
            console.error('[DashboardContext] Error updating layout:', error)
        }
    }, [userId, setLayouts, layouts, activeLayout, isMobile, isUserAction])

    const addWidget = useCallback(async (type: WidgetType, size: WidgetSize = 'medium') => {
        console.log('[DashboardContext] addWidget', { type, size, userId, hasLayouts: !!layouts })

        if (!layouts) {
            console.error('[DashboardContext] addWidget failed: missing layouts')
            return
        }

        if (!userId) {
            console.error('[DashboardContext] addWidget failed: missing user ID')
            return
        }

        const currentItems = layouts[activeLayout]
        if (currentItems.some(widget => widget.type === type)) {
            toast.error(t('widgets.duplicate.title'), { description: t('widgets.duplicate.description') })
            return
        }

        const effectiveSize = size
        const grid = sizeToGrid(effectiveSize, activeLayout === 'mobile')

        let lowestY = 0
        currentItems.forEach(widget => {
            const widgetBottom = widget.y + widget.h
            if (widgetBottom > lowestY) lowestY = widgetBottom
        })

        const newWidget: Widget = {
            i: `widget${Date.now()}`,
            type,
            size: effectiveSize,
            x: 0,
            y: lowestY,
            w: grid.w,
            h: grid.h
        }

        const updatedWidgets = [...currentItems, newWidget]
        const newLayouts = { ...layouts, [activeLayout]: updatedWidgets, updatedAt: new Date() }

        console.log('[DashboardContext] Updating state for addWidget')
        setLayouts(newLayouts)
        toast.success(t('widgets.widgetAdded'), { description: t('widgets.widgetAddedDescription') })

        if (userId) {
            widgetPersistenceManager.saveLayout(userId, newLayouts, { immediate: true, changeType: 'manual' })
        }
    }, [userId, layouts, activeLayout, setLayouts, t])

    const removeWidget = useCallback(async (i: string) => {
        console.log('[DashboardContext] removeWidget', { widgetId: i, userId, hasLayouts: !!layouts })

        if (!layouts) {
            console.error('[DashboardContext] removeWidget failed: missing layouts')
            return
        }

        const updatedWidgets = layouts[activeLayout].filter(widget => widget.i !== i)
        const newLayouts = { ...layouts, [activeLayout]: updatedWidgets, updatedAt: new Date() }

        console.log('[DashboardContext] Updating state for removeWidget')
        setLayouts(newLayouts)

        if (userId) {
            widgetPersistenceManager.saveLayout(userId, newLayouts, { immediate: true, changeType: 'manual' })
        }
    }, [userId, layouts, activeLayout, setLayouts])

    const changeWidgetType = useCallback(async (i: string, newType: WidgetType) => {
        if (!userId || !layouts) return
        const updatedWidgets = layouts[activeLayout].map(widget =>
            widget.i === i ? { ...widget, type: newType } : widget
        )
        const newLayouts = { ...layouts, [activeLayout]: updatedWidgets, updatedAt: new Date() }
        setLayouts(newLayouts)
        widgetPersistenceManager.saveLayout(userId, newLayouts, { immediate: true, changeType: 'manual' })
    }, [userId, layouts, activeLayout, setLayouts])

    const changeWidgetSize = useCallback(async (i: string, newSize: WidgetSize) => {
        if (!userId || !layouts) return
        const widget = layouts[activeLayout].find(w => w.i === i)
        if (!widget) return

        let effectiveSize = newSize
        if (widget.type.includes('Chart') && newSize === 'tiny') effectiveSize = 'medium'

        const grid = sizeToGrid(effectiveSize)
        const updatedWidgets = layouts[activeLayout].map(widget =>
            widget.i === i ? { ...widget, size: effectiveSize, ...grid } : widget
        )
        const newLayouts = { ...layouts, [activeLayout]: updatedWidgets, updatedAt: new Date() }
        setLayouts(newLayouts)
        widgetPersistenceManager.saveLayout(userId, newLayouts, { changeType: 'auto' })
    }, [userId, layouts, activeLayout, setLayouts])

    const removeAllWidgets = useCallback(async () => {
        if (!userId || !layouts) return
        const newLayouts = { ...layouts, desktop: [], mobile: [], updatedAt: new Date() }
        setLayouts(newLayouts)
        widgetPersistenceManager.saveLayout(userId, newLayouts, { immediate: true, changeType: 'manual' })
    }, [userId, layouts, setLayouts])

    const restoreDefaultLayout = useCallback(async () => {
        if (!userId || !layouts) return
        const newLayouts = {
            ...layouts,
            desktop: defaultLayouts.desktop as unknown as Widget[],
            mobile: defaultLayouts.mobile as unknown as Widget[],
            updatedAt: new Date()
        }
        setLayouts(newLayouts)
        widgetPersistenceManager.saveLayout(userId, newLayouts, { immediate: true, changeType: 'manual' })
        toast.success(t('widgets.restoredDefaultsTitle'), { description: t('widgets.restoredDefaultsDescription') })
    }, [userId, layouts, setLayouts, t])

    const flushPendingSaves = useCallback(async () => {
        if (userId) {
            await widgetPersistenceManager.flushPendingSave(userId)
        }
    }, [userId])

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (widgetPersistenceManager.hasPendingSave()) {
                e.preventDefault()
                e.returnValue = ''
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [])

    return (
        <DashboardContext.Provider value={{
            isCustomizing,
            setIsCustomizing,
            toggleCustomizing,
            layouts,
            currentLayout,
            activeLayout,
            addWidget,
            removeWidget,
            changeWidgetType,
            changeWidgetSize,
            removeAllWidgets,
            restoreDefaultLayout,
            handleLayoutChange,
            isMobile,
            autoSaveStatus: {
                hasPending: widgetPersistenceManager.hasPendingSave(),
                isInitialized: autoSaveInitialized,
            },
            flushPendingSaves,
        }}>
            {children}
        </DashboardContext.Provider>
    )
}

export function useDashboard() {
    const context = useContext(DashboardContext)
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider')
    }
    return context
}
