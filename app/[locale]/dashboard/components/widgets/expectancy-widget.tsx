"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/context/data-provider"
import { calculateAdvancedMetrics } from "@/lib/advanced-metrics"
import { Info, Target } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useI18n } from "@/locales/client"

export default function ExpectancyWidget({ size }: { size?: string }) {
    const { formattedTrades: trades } = useData()
    const t = useI18n()

    const { expectancy } = React.useMemo(() => calculateAdvancedMetrics(trades as any), [trades])

    const formattedExpectancy = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expectancy)

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="py-3 px-4 flex-none border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{t('widgets.expectancy.title')}</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('widgets.expectancy.tooltip')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Expected Value Per Trade</span>
                    <div className={cn(
                        "text-4xl font-bold tracking-tighter tabular-nums",
                        expectancy > 0 ? "text-emerald-500" : expectancy < 0 ? "text-red-500" : "text-muted-foreground"
                    )}>
                        {expectancy > 0 ? '+' : ''}{formattedExpectancy}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center max-w-[200px]">
                        {expectancy > 0
                            ? "Your strategy has a positive edge. Keep executing consistently."
                            : "Your strategy currently has a negative expectancy. Review your risk management."}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
