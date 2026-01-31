'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

export const EquityChart = dynamic(
  () => import('@/components/charts/equity-chart').then(mod => ({ default: mod.EquityChart })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
) as ComponentType<any>

export const PnLBarChart = dynamic(
  () => import('@/components/charts/pnl-bar-chart').then(mod => ({ default: mod.PnLBarChart })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
) as ComponentType<any>

export const WeekdayPnL = dynamic(
  () => import('@/components/charts/weekday-pnl').then(mod => ({ default: mod.WeekdayPnL })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
) as ComponentType<any>

export const TimeRangePerformance = dynamic(
  () => import('@/components/charts/time-range-performance').then(mod => ({ default: mod.TimeRangePerformance })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
) as ComponentType<any>

export const TradeDistribution = dynamic(
  () => import('@/components/charts/trade-distribution').then(mod => ({ default: mod.TradeDistribution })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
) as ComponentType<any>

export const PnLBySide = dynamic(
  () => import('@/components/charts/pnl-by-side').then(mod => ({ default: mod.PnLBySide })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
) as ComponentType<any>

function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}
