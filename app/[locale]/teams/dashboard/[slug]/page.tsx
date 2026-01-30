'use client'

import { Suspense, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Users, TrendingUp, DollarSign } from 'lucide-react'
import { getTeamOverviewDataAction } from '../../actions/overview'
import { useUserStore } from '@/store/user-store'
import { cn } from '@/lib/utils'

interface TeamOverviewPageProps {
  params: Promise<{
    slug: string
  }>
}

interface OverviewData {
  totalBalance: number
  activeTraders: number
  totalPnl: number
  winRate: number
  recentActivity: {
    id: string
    type: string
    description: string
    amount: number
    date: string | Date
    userEmail: string
  }[]
}

export default function TeamOverviewPage({ params }: TeamOverviewPageProps) {
  const [slug, setSlug] = useState<string>('')
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useUserStore()

  useEffect(() => {
    params.then(({ slug }) => setSlug(slug))
  }, [params])

  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !user?.id) return
      setLoading(true)
      try {
        const result = await getTeamOverviewDataAction(slug, user.id)
        if (result.success && result.data) {
          setData(result.data)
        } else {
          setError(result.error || 'Failed to load data')
        }
      } catch (err) {
        console.error(err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug, user?.id])

  if (!slug || loading) return <div className="p-8 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  if (error) return <div className="p-8 text-destructive">Error: {error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.activeTraders ?? 0}</div>
            <p className="text-xs text-muted-foreground">in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PnL</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", (data?.totalPnl ?? 0) >= 0 ? "text-green-600" : "text-destructive")}>
              {(data?.totalPnl ?? 0) >= 0 ? '+' : ''}${data?.totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}
            </div>
            {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.winRate.toFixed(1) ?? '0.0'}%</div>
            {/* <p className="text-xs text-muted-foreground">+4% from last month</p> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
              <span className="text-sm">Extended Analytics Coming Soon (Chart)</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {data?.recentActivity?.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">No recent activity</div>
              ) : (
                data?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none truncate max-w-[200px]" title={activity.description}>
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={cn("ml-auto font-medium", activity.amount >= 0 ? "text-green-600" : "text-destructive")}>
                      {activity.amount >= 0 ? '+' : ''}${activity.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
