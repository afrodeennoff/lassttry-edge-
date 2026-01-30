"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/context/data-provider"
import { calculateAdvancedMetrics } from "@/lib/advanced-metrics"
import { Info, ShieldAlert } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useI18n, useCurrentLocale } from "@/locales/client"

export default function RiskMetricsWidget({ size = 'medium' }: { size?: 'tiny' | 'small' | 'medium' | 'large' | 'small-long' | 'extra-large' }) {
    const { formattedTrades: trades } = useData()
    const t = useI18n()
    const locale = useCurrentLocale()

    const { kellyHalf, kellyFull, sharpeRatio, sortinoRatio, calmarRatio, maxDrawdown } = React.useMemo(() => calculateAdvancedMetrics(trades as any), [trades])

    // Format currency helper
    const formatCurrency = (value: number) => {
        const formatted = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
        return formatted
    }

    // Determine colors
    const goodColor = "text-emerald-500"
    const badColor = "text-amber-500" // or red-500 depending on severity
    const neutralColor = "text-muted-foreground"

    return (
        <Card className="h-full flex flex-col">
            <CardHeader
                className={cn(
                    "flex-none border-b",
                    size === 'tiny'
                        ? "py-1 px-2"
                        : (size === 'small' || size === 'small-long')
                            ? "py-2 px-3"
                            : "py-3 px-4"
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle
                            className={cn(
                                "line-clamp-1",
                                size === 'tiny'
                                    ? "text-xs"
                                    : (size === 'small' || size === 'small-long')
                                        ? "text-sm"
                                        : "text-base"
                            )}
                        >
                            {t('widgets.riskMetrics.title')}
                        </CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('widgets.riskMetrics.tooltip')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <div className="grid h-full grid-cols-2">
                    {/* Return Risk Ratios */}
                    <div className={cn(
                        "flex flex-col border-r border-b",
                        size === 'tiny' ? "p-1.5" : "p-3"
                    )}>
                        <h3 className="text-xs font-medium mb-1.5 text-muted-foreground">Ratios</h3>
                        <div className="flex-1 flex flex-col justify-center gap-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Sharpe</span>
                                <span className={cn("text-xs font-medium font-mono", sharpeRatio > 1 ? goodColor : badColor)}>
                                    {sharpeRatio.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Sortino</span>
                                <span className={cn("text-xs font-medium font-mono", sortinoRatio > 1.5 ? goodColor : badColor)}>
                                    {sortinoRatio.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Calmar</span>
                                <span className={cn("text-xs font-medium font-mono", calmarRatio > 1 ? goodColor : badColor)}>
                                    {calmarRatio.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Position Sizing */}
                    <div className={cn(
                        "flex flex-col border-b",
                        size === 'tiny' ? "p-1.5" : "p-3"
                    )}>
                        <h3 className="text-xs font-medium mb-1.5 text-muted-foreground">Position Sizing</h3>
                        <div className="flex-1 flex flex-col justify-center gap-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Kelly (Half)</span>
                                <span className={cn("text-xs font-medium font-mono", kellyHalf > 0 ? goodColor : badColor)}>
                                    {(kellyHalf * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Optimal</span>
                                <span className={cn("text-xs font-medium font-mono", kellyFull > 0 ? goodColor : badColor)}>
                                    {(kellyFull * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Conservative</span>
                                <span className={cn("text-xs font-medium font-mono", kellyHalf > 0 ? goodColor : badColor)}>
                                    {((kellyHalf / 2) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Drawdown Section */}
                    <div className={cn(
                        "flex flex-col col-span-2",
                        size === 'tiny' ? "p-1.5" : "p-3"
                    )}>
                        <h3 className="text-xs font-medium mb-1.5 text-muted-foreground">Drawdown Analysis</h3>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-xs">Max Drawdown</span>
                            <span className="text-sm font-bold font-mono text-red-500">
                                {formatCurrency(maxDrawdown)}
                            </span>
                        </div>
                        {/* Placeholder for future drawdown recovery metrics */}
                        <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-red-500/50 w-full" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
