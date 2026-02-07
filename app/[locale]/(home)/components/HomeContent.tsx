'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Hero from './Hero'
import ProblemStatement from './ProblemStatement'

const AnalysisDemo = dynamic(() => import('./AnalysisDemo'))
const Differentiators = dynamic(() => import('./Differentiators'))
const HowItWorks = dynamic(() => import('./HowItWorks'))
const Features = dynamic(() => import('./Features'))
const Qualification = dynamic(() => import('./Qualification'))
const CTA = dynamic(() => import('./CTA'))

export default function HomeContent() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/authentication?next=dashboard')
  }

  return (
    <div className="relative overflow-x-hidden bg-base text-fg-primary selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 opacity-[0.025] bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:44px_44px]" />

      <main className="relative z-10 mx-auto w-full max-w-[1520px]">
        <Hero onStart={handleLogin} />
        <ProblemStatement />
        <AnalysisDemo />
        <Differentiators />
        <HowItWorks />
        <Features />
        <Qualification />
        <CTA onStart={handleLogin} />
      </main>
    </div>
  )
}
