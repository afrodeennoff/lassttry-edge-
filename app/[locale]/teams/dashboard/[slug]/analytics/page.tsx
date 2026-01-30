'use client'

import { Suspense, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getTeamAnalyticsDataAction } from '../../../actions/analytics'
import { useUserStore } from '@/store/user-store'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'

interface TeamAnalyticsPageProps {
    params: Promise<{
        slug: string
    }>
}

interface AnalyticsData {
    analytics: any
    membersPerformance: {
        userId: string
        email: string
        totalPnL: number
        winRate: number
        totalTrades: number
    }[]
    chartData: {
        date: string
        dailyPnL: number
        cumulativePnL: number
    }[]
}

export default function TeamAnalyticsPage({ params }: TeamAnalyticsPageProps) {
    const [slug, setSlug] = useState<string>('')
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const { user } = useUserStore()

    useEffect(() => {
        params.then(({ slug }) => setSlug(slug))
    }, [params])

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !user?.id) return
            try {
                const result = await getTeamAnalyticsDataAction(slug, user.id)
                if (result.success && result.data) {
                    setData(result.data as AnalyticsData)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [slug, user?.id])

    if (!slug || loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg text-xs">
                    <p className="font-semibold mb-1">{new Date(label).toLocaleDateString()}</p>
                    <p className={cn("font-medium", payload[0].value >= 0 ? "text-green-500" : "text-red-500")}>
                        Cumulative: ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Analytics</h1>
                <p className="text-muted-foreground">Detailed performance metrics for the team.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Chart */}
                <Card className="col-span-3 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Team Cumulative Performance</CardTitle>
                        <CardDescription>Aggregated PnL over time across all members</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {data?.chartData && data.chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.chartData}>
                                    <defs>
                                        <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        tick={{ fontSize: 12, fill: '#888' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tickFormatter={(val) => `$${val}`}
                                        tick={{ fontSize: 12, fill: '#888' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="cumulativePnL"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorPnl)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">No enough data to chart</div>
                        )}
                    </CardContent>
                </Card>

                {/* Leaderboard / Top Stats */}
                <Card className="col-span-3 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Top Performers</CardTitle>
                        <CardDescription>Based on total PnL</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data?.membersPerformance?.slice(0, 5).map((member, i) => (
                                <div key={member.userId} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-semibold">
                                            {i + 1}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-medium leading-none truncate w-[100px]">{member.email.split('@')[0]}</p>
                                            <p className="text-xs text-muted-foreground">{member.winRate.toFixed(1)}% WR</p>
                                        </div>
                                    </div>
                                    <div className={cn("font-semibold text-sm", member.totalPnL >= 0 ? "text-green-600" : "text-destructive")}>
                                        {member.totalPnL >= 0 ? '+' : ''}${member.totalPnL.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            {(!data?.membersPerformance || data.membersPerformance.length === 0) && (
                                <div className="text-center py-4 text-sm text-muted-foreground">No member data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {[
                    {
                        label: 'Avg Win Rate',
                        value: `${data?.analytics?.winRate?.toFixed(1) ?? 0}%`
                    },
                    {
                        label: 'Total Trades',
                        value: data?.analytics?.totalTrades ?? 0
                    },
                    {
                        label: 'Profit Factor',
                        value: data?.analytics?.profitFactor?.toFixed(2) ?? 'N/A'
                    },
                    {
                        label: 'Best Day',
                        value: data?.analytics?.bestDay ? (
                            <div className="flex flex-col">
                                <span className="text-sm">{new Date(data.analytics.bestDay.date).toLocaleDateString()}</span>
                                <span className="text-xs text-green-500 font-medium">+${data.analytics.bestDay.pnl.toFixed(0)}</span>
                            </div>
                        ) : 'N/A'
                    }
                ].map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="py-4">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</CardTitle>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}
