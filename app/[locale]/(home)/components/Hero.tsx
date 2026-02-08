'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Target, TrendingUp } from 'lucide-react'

interface HeroProps {
  onStart: () => void
}

const metrics = [
  { label: 'Process Discipline', value: '93.2', delta: '+7.4%' },
  { label: 'Plan Adherence', value: '97%', delta: '+3.2%' },
  { label: 'Impulse Entries', value: '1', delta: '-58%' },
]

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden pb-14 pt-28 sm:pt-34 lg:pb-18">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[min(1080px,96vw)] -translate-x-1/2 rounded-full bg-primary/14 blur-[120px]" />
      </div>

      <div className="container-fluid relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Execution Intelligence Platform
          </span>

          <h1 className="mt-5 text-fluid-4xl font-black leading-[0.92] tracking-tight sm:text-fluid-6xl lg:text-fluid-7xl">
            Build a Trading
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-emerald-300 bg-clip-text text-transparent">
              System You Trust
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base text-muted-foreground sm:text-lg">
            Qunt Edge turns every session into a measurable feedback loop. Review execution quality, detect drift before it compounds,
            and coach better decisions with objective, repeatable data.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onStart}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[11px] font-black uppercase tracking-[0.15em] text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Start Assessment
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/pricing"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border/70 px-6 text-[11px] font-black uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-muted/70 sm:w-auto"
            >
              Compare Plans
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-primary" /> Tradovate</span>
            <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-primary" /> Rithmic</span>
            <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-primary" /> IBKR</span>
            <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-primary" /> CQG</span>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mx-auto mt-9 max-w-3xl rounded-2xl border border-border/70 bg-card/82 p-4 shadow-[0_24px_65px_-35px_hsl(var(--primary)/0.55)] sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Session Pulse</p>
              <h2 className="mt-1 text-lg font-black tracking-tight">Performance Snapshot</h2>
            </div>
            <span className="rounded-lg border border-primary/30 bg-primary/12 px-2 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-primary">
              Real-Time
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            {metrics.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border/70 bg-background/50 px-4 py-3 transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:border-primary/25 hover:bg-background/65 active:scale-[0.99]"
              >
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <p className="text-base font-black leading-none">{item.value}</p>
                  <p className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-primary">
                    <TrendingUp className="h-3 w-3" />
                    {item.delta}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Insight</p>
            <p className="mt-1 text-sm text-foreground/90">
              Sessions with completed pre-trade plans show <span className="font-black text-primary">34% lower drawdown variance</span> across the last 20 trading days.
            </p>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
