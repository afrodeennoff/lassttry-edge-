import { motion } from 'framer-motion'
import { BarChart3, Brain, CalendarCheck2, Database, LayoutDashboard, Users } from 'lucide-react'

const features = [
  {
    title: 'Unified Imports',
    subtitle: 'Data Ingestion',
    desc: 'Sync major brokers or upload CSV files with flexible field mapping and validation.',
    icon: Database,
  },
  {
    title: 'Execution Analytics',
    subtitle: 'Visualization',
    desc: 'Track expectancy, discipline score, and equity context in one operational workspace.',
    icon: BarChart3,
  },
  {
    title: 'Daily Review System',
    subtitle: 'Calendar Intelligence',
    desc: 'Move from session outcome to decision-level diagnosis in minutes.',
    icon: CalendarCheck2,
  },
  {
    title: 'AI Journaling',
    subtitle: 'Context Engine',
    desc: 'Capture mindset patterns and connect them directly to measurable execution quality.',
    icon: Brain,
  },
  {
    title: 'Custom Dashboards',
    subtitle: 'Workspace Control',
    desc: 'Compose widgets around your process and keep layout consistency across sessions.',
    icon: LayoutDashboard,
  },
  {
    title: 'Team Oversight',
    subtitle: 'Multi-User',
    desc: 'Monitor traders, enforce structure, and compare consistency across accounts.',
    icon: Users,
  },
]

export default function Features() {
  return (
    <section id="features" className="relative border-b border-border/70 bg-card/20 py-fluid-xl">
      <div id="data-import" className="absolute -top-24" />
      <div id="daily-performance" className="absolute -top-24" />
      <div id="ai-journaling" className="absolute -top-24" />

      <div className="container-fluid">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Platform Features</p>
            <h2 className="mt-3 text-fluid-2xl font-black tracking-tight sm:text-fluid-4xl">
              Precision Tools,
              <span className="text-muted-foreground"> Zero Noise</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Designed for discretionary traders who need speed, structure, and dependable review quality.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-border/70 bg-card/75 p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-primary">
                  {feature.subtitle}
                </p>
                <h3 className="mt-2 text-lg font-black tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
