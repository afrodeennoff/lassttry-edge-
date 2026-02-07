import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CTAProps {
  onStart: () => void
}

export default function CTA({ onStart }: CTAProps) {
  return (
    <section className="py-fluid-xl">
      <div className="container-fluid">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 px-6 py-10 sm:px-10 sm:py-12"
        >
          <div className="pointer-events-none absolute -right-24 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-[90px]" />

          <div className="relative z-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Ready To Improve</p>
            <h2 className="mt-3 text-fluid-3xl font-black leading-[0.95] tracking-tight sm:text-fluid-5xl">
              Build Consistency
              <br />
              <span className="text-muted-foreground">With Better Feedback</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Start using a behavior-first review system that improves decision quality session after session.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={onStart}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-[11px] font-black uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Apply For Access
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border/70 px-7 text-[11px] font-black uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-muted/70"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
