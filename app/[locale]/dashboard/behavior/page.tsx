"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BellRing,
  Bot,
  Brain,
  CircleCheck,
  CircleX,
  Loader2,
  Gauge,
  HeartPulse,
  MessageSquareText,
  PauseCircle,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/locales/client"
import { MindsetWidget } from "../components/mindset/mindset-widget"
import { AnalysisOverview } from "../components/analysis/analysis-overview"
import ChatWidget from "../components/chat/chat"
import type { BehaviorInsights } from "@/lib/behavior-insights"

export default function DashboardBehaviorPage() {
  const t = useI18n()
  const [periodDays, setPeriodDays] = useState(30)
  const [refreshKey, setRefreshKey] = useState(0)
  const [insights, setInsights] = useState<BehaviorInsights | null>(null)
  const [isLoadingInsights, setIsLoadingInsights] = useState(true)
  const [insightsError, setInsightsError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadInsights = async () => {
      setIsLoadingInsights(true)
      setInsightsError(null)
      try {
        const response = await fetch(`/api/behavior/insights?periodDays=${periodDays}`, {
          method: "GET",
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Insights request failed (${response.status})`)
        }

        const payload = (await response.json()) as BehaviorInsights
        if (isMounted) {
          setInsights(payload)
        }
      } catch (error) {
        console.error("[Behavior Page] Failed to load insights", error)
        if (isMounted) {
          setInsightsError("Unable to load behavior insights right now.")
        }
      } finally {
        if (isMounted) {
          setIsLoadingInsights(false)
        }
      }
    }

    loadInsights()
    return () => {
      isMounted = false
    }
  }, [periodDays, refreshKey])

  const trainingModules = useMemo(() => {
    const checkInRate = insights?.modules.checkInRate ?? 0
    const averageEmotion = insights?.summary.averageEmotion ?? 50
    const emotionalRisk = insights?.summary.emotionalRiskPercent ?? 0

    return [
      {
        title: "Daily Emotional Check-In",
        description: "Track confidence, anxiety, and focus before market open to adapt your execution plan.",
        metric: `${checkInRate}% completion`,
      },
      {
        title: "Mindset Coaching Loop",
        description: "Use coaching prompts for market anxiety, losses, and overconfidence after winning streaks.",
        metric: `Avg emotion: ${averageEmotion}/100`,
      },
      {
        title: "Mindful Entry Reminders",
        description: "Nudges before execution: planned setup or emotional reaction?",
        metric: `Emotion-driven risk: ${emotionalRisk}%`,
      },
    ]
  }, [insights])

  const reflectionModules = useMemo(() => {
    return [
      {
        title: "Weekly Self-Reflection Dashboard",
        description: "Review loss-chasing, panic exits, and impulsive entries with behavior trend views.",
        metric: "Emotion-Driven Trades",
        value: `${insights?.summary.emotionalRiskPercent ?? 0}%`,
      },
      {
        title: "Post-Trade Psychological Review",
        description: "After high-risk trades, capture state-of-mind and trigger source (news, social, revenge, FOMO).",
        metric: "Reflection Completion",
        value: `${insights?.modules.reflectionCompletionRate ?? 0}%`,
      },
      {
        title: "Stress & Risk Impact Report",
        description: "Monthly synthesis of market exposure and emotional volatility with AI recommendations.",
        metric: "Stress Events",
        value: `${(insights?.summary.overtradingDays ?? 0) + (insights?.summary.lossChasingEvents ?? 0) + (insights?.summary.impulsiveTradeCount ?? 0)}`,
      },
    ]
  }, [insights])

  const gamificationModules = useMemo(() => {
    return [
      {
        badge: "Steady Hand",
        detail: "Maintain your risk profile for 30 consecutive days.",
        achieved: insights?.achievements.steadyHand ?? false,
      },
      {
        badge: "Emotional Master",
        detail: "Avoid revenge trading and overtrading behavior.",
        achieved: insights?.achievements.emotionalMaster ?? false,
      },
      {
        badge: "Control Streak",
        detail: "Trade 7 days with disciplined size and planned entries.",
        achieved: insights?.achievements.controlStreak ?? false,
      },
    ]
  }, [insights])

  const recommendationList = insights?.recommendations ?? []

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <Card className="border-white/10 bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-blue-500/10">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-teal-400" />
                <CardTitle className="text-xl md:text-2xl">Behavior AI Hub</CardTitle>
                <Badge variant="secondary" className="border-teal-400/30 text-teal-300">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  AI
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("analysis.description")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                Analysis
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Bot className="h-3.5 w-3.5" />
                Coach
              </Badge>
              <Badge variant="outline" className="gap-1">
                <MessageSquareText className="h-3.5 w-3.5" />
                Journal
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Gauge className="h-3.5 w-3.5" />
                Stress Monitor
              </Badge>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline">Trades: {insights?.summary.tradeCount ?? 0}</Badge>
            <Badge variant="outline">Win rate: {insights?.summary.winRate ?? 0}%</Badge>
            <Badge variant="outline">Stress score: {insights?.summary.stressScore ?? 0}</Badge>
            <Badge variant="outline">Streak: {insights?.summary.disciplineStreakDays ?? 0}d</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="sm"
              variant={periodDays === 7 ? "default" : "secondary"}
              onClick={() => setPeriodDays(7)}
            >
              7d
            </Button>
            <Button
              size="sm"
              variant={periodDays === 30 ? "default" : "secondary"}
              onClick={() => setPeriodDays(30)}
            >
              30d
            </Button>
            <Button
              size="sm"
              variant={periodDays === 90 ? "default" : "secondary"}
              onClick={() => setPeriodDays(90)}
            >
              90d
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const section = document.getElementById("analysis-section")
                section?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              Open AI Analysis
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const section = document.getElementById("coach-section")
                section?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              Ask AI Coach
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const section = document.getElementById("mindset-section")
                section?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              Open Journal
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const section = document.getElementById("training-section")
                section?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              Start Emotional Training
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const section = document.getElementById("resilience-section")
                section?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              Open Resilience Tools
            </Button>
            {isLoadingInsights ? (
              <Badge variant="outline" className="gap-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating insights
              </Badge>
            ) : null}
          </div>
          {insightsError ? (
            <p className="mt-3 text-sm text-destructive">{insightsError}</p>
          ) : null}
        </CardContent>
      </Card>

      <section id="training-section" className="grid gap-4 lg:grid-cols-3">
        {trainingModules.map((module) => (
          <Card key={module.title} className="border-white/10 bg-card/40">
            <CardHeader className="space-y-2">
              <CardTitle className="text-base">{module.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="outline" className="gap-1">
                  <Brain className="h-3.5 w-3.5" />
                  Adaptive AI
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <BellRing className="h-3.5 w-3.5" />
                  Mindful Prompt
                </Badge>
                <Badge variant="secondary">{module.metric}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {reflectionModules.map((module) => (
          <Card key={module.title} className="border-white/10 bg-card/40">
            <CardHeader className="space-y-2">
              <CardTitle className="text-base">{module.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{module.metric}</p>
              <p className="text-lg font-semibold">{module.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-card/40 lg:col-span-2">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-400" />
              Risk Discipline Gamification
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Reinforce healthy behavior with badges, streaks, and AI challenges focused on emotional control.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {gamificationModules.map((module) => (
              <div key={module.badge} className="rounded-xl border border-white/10 bg-background/40 p-3">
                <p className="text-sm font-medium flex items-center gap-2">
                  {module.achieved ? (
                    <CircleCheck className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <CircleX className="h-4 w-4 text-muted-foreground" />
                  )}
                  {module.badge}
                </p>
                <p className="text-sm text-muted-foreground">{module.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-card/40">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-teal-400" />
              AI Challenges
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Simulate stress scenarios and test your response quality under volatility.
            </p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Stress Test Challenge: trade a sudden drawdown while preserving size discipline.</p>
            <p>Emotional Control Test: avoid reactive entries and protect your daily risk plan.</p>
            <p className="text-foreground">{insights?.prompts.postTradeReview}</p>
          </CardContent>
        </Card>
      </section>

      <section id="resilience-section" className="grid gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-card/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HeartPulse className="h-4 w-4 text-rose-400" />
              Stress Resilience Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Breathing prompts and micro-reset exercises when emotional volatility rises.</p>
            <p>Guided calmness session after intense market windows.</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-card/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="h-4 w-4 text-cyan-400" />
              Emotional Stress Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Tracks impulsive execution signals, position size drift, and volatility pressure.</p>
            <p>Real-time coaching trigger: pause, reassess, then confirm trade intent.</p>
            <p className="text-foreground">Stress score: {insights?.summary.stressScore ?? 0}/100</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-card/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Risk Alignment Guard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Warns when behavior drifts from your risk profile and long-term objective.</p>
            <p>Option to pause execution and review plan compliance before entry.</p>
            <p className="text-foreground">Risk alignment: {insights?.modules.riskAlignmentScore ?? 0}%</p>
          </CardContent>
        </Card>
      </section>

      {recommendationList.length > 0 ? (
        <section className="rounded-2xl border border-white/10 bg-card/40 p-4 md:p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <h3 className="text-base font-semibold">AI Recommendations</h3>
          </div>
          <div className="space-y-2">
            {recommendationList.map((recommendation) => (
              <p key={recommendation} className="text-sm text-muted-foreground">
                {recommendation}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section id="analysis-section" className="rounded-2xl border border-white/10 bg-card/40 p-4 md:p-6">
        <AnalysisOverview />
      </section>

      <section id="coach-section" className="rounded-2xl border border-white/10 bg-card/40 p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Trading Coach</h2>
        </div>
        <div className="h-[680px] min-h-[520px]">
          <ChatWidget size="large" />
        </div>
      </section>

      <section id="mindset-section" className="rounded-2xl border border-white/10 bg-card/40 p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Mindset & Journal</h2>
        </div>
        <div className="h-[calc(100vh-200px)] min-h-[720px]">
          <MindsetWidget size="large" />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-blue-500/10 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Execution Mindfulness Prompt</h3>
            <p className="text-sm text-muted-foreground">
              {insights?.prompts.mindful ?? "Before executing: is this trade analysis-driven or emotion-driven?"}
            </p>
          </div>
          <Button variant="secondary" className="gap-2" onClick={() => setRefreshKey((value) => value + 1)}>
            <PauseCircle className="h-4 w-4" />
            Pause And Reassess
          </Button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {insights?.prompts.riskGuard}
        </p>
      </section>
    </div>
  )
}
