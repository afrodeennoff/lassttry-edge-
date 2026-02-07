'use client'

import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { day: 'Mon', execution: 74, pnl: 250 },
  { day: 'Tue', execution: 80, pnl: 410 },
  { day: 'Wed', execution: 78, pnl: -120 },
  { day: 'Thu', execution: 88, pnl: 530 },
  { day: 'Fri', execution: 93, pnl: 790 },
]

const signals = [
  'Best expectancy appears between 09:40 and 10:35 after checklist completion.',
  'After 2 consecutive losses, smaller size preserved recovery probability.',
  'Tilt probability spikes when entries happen outside the setup window.',
]

export default function AnalysisDemo() {
  return (
    <section id="performance-visualization" className="border-b border-border/70 bg-background py-fluid-xl">
      <div className="container-fluid">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Execution Analytics</p>
            <h2 className="mt-3 text-fluid-2xl font-black leading-[0.96] tracking-tight sm:text-fluid-4xl">
              Turn Journal Noise
              <br />
              <span className="text-muted-foreground">Into Repeatable Signals</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Behavioral metrics sit beside PnL so you can intervene before drift compounds into drawdown.
          </p>
        </div>

        <div className="grid gap-3.5 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/70 bg-card/80 p-4 transition-all duration-150 ease-in-out hover:border-primary/20 hover:bg-card/90 active:scale-[0.995] sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Weekly Execution</p>
                <p className="mt-1 text-2xl font-black text-foreground">93 / 100</p>
              </div>
              <span className="rounded-lg border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-primary">
                +15% Weekly
              </span>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="executionFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '10px',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="execution" stroke="hsl(var(--primary))" strokeWidth={2.4} fill="url(#executionFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-border/70 bg-card/70 p-4 transition-all duration-150 ease-in-out hover:border-primary/20 hover:bg-card/85 active:scale-[0.995] sm:p-6"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">AI Findings</p>
            <h3 className="mt-2 text-xl font-black tracking-tight">Session Intelligence Feed</h3>

            <div className="mt-4 space-y-3">
              {signals.map((signal, i) => (
                <div
                  key={signal}
                  className="rounded-xl border border-border/70 bg-background/45 p-3.5 transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background/60 active:scale-[0.99]"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Signal 0{i + 1}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/85">{signal}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-primary/25 bg-primary/10 p-3.5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Intervention</p>
              <p className="mt-1 text-sm text-foreground/90">Enable auto cool-down after two off-plan entries in a single session.</p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
