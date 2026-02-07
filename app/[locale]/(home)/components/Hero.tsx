'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Target, TrendingUp } from 'lucide-react'

interface HeroProps {
  onStart: () => void
}

const metrics = [
  { label: 'Execution Score', value: '91.4', delta: '+6.1%' },
  { label: 'Rule Compliance', value: '96%', delta: '+2.8%' },
  { label: 'Max Drift Events', value: '2', delta: '-41%' },
]

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden pb-14 pt-26 sm:pt-34 lg:pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-200px] h-[440px] w-[min(980px,95vw)] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="container-fluid relative z-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Behavior-First Trading OS
            </span>

            <h1 className="mt-5 text-fluid-4xl font-black leading-[0.93] tracking-tight sm:text-fluid-6xl lg:text-fluid-7xl">
              Stop Auditing
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-emerald-300 bg-clip-text text-transparent">
                Outcomes Only
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg lg:mx-0">
              Qunt Edge turns noisy trade history into a disciplined review loop. Track execution quality, find process drift early,
              and compound consistency with measurable feedback.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                onClick={onStart}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[11px] font-black uppercase tracking-[0.15em] text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/pricing"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border/70 px-6 text-[11px] font-black uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-muted/70 sm:w-auto"
              >
                See Pricing
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground lg:justify-start">
              <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-primary" /> Tradovate</span>
              <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-primary" /> Rithmic</span>
              <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-primary" /> IBKR</span>
              <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-primary" /> CQG</span>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="rounded-2xl border border-border/70 bg-card/85 p-4 shadow-[0_24px_65px_-35px_hsl(var(--primary)/0.6)] sm:p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Session Pulse</p>
                <h2 className="mt-1 text-lg font-black tracking-tight">Execution Control Panel</h2>
              </div>
              <span className="rounded-lg border border-primary/30 bg-primary/12 px-2 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-primary">
                Live
              </span>
            </div>

            <div className="space-y-2">
              {metrics.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-background/50 px-4 py-3 transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:border-primary/25 hover:bg-background/65 active:scale-[0.99]"
                >
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <div className="text-right">
                    <p className="text-base font-black leading-none">{item.value}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-primary">
                      <TrendingUp className="h-3 w-3" />
                      {item.delta}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Insight</p>
              <p className="mt-1 text-sm text-foreground/90">
                Your volatile sessions perform <span className="font-black text-primary">31% better</span> when pre-trade checklist completion is 100%.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
