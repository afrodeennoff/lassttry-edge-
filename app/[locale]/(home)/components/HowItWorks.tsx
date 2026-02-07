import { motion } from 'framer-motion'

const steps = [
  {
    name: 'Ingest',
    desc: 'Import broker data and normalize every event into one clean timeline.',
  },
  {
    name: 'Label',
    desc: 'Tag setup, risk context, and session state with minimal friction.',
  },
  {
    name: 'Diagnose',
    desc: 'Separate repeatable edge from random outcome using rule checks.',
  },
  {
    name: 'Adapt',
    desc: 'Apply targeted changes and verify behavior improvement week over week.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/70 bg-background py-fluid-xl">
      <div className="container-fluid">
        <div className="mb-8 sm:mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Workflow</p>
          <h2 className="mt-3 text-fluid-2xl font-black tracking-tight sm:text-fluid-4xl">
            A Tight Loop For
            <span className="text-muted-foreground"> Real Improvement</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.article
              key={step.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border border-border/70 bg-card/70 p-5"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-sm font-black text-primary">
                {i + 1}
              </div>
              <h3 className="text-lg font-black tracking-tight">{step.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
