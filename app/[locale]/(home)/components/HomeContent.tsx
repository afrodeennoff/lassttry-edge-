
'use client';

import dynamic from 'next/dynamic';
import Hero from './Hero';
import ProblemStatement from './ProblemStatement';
import { useRouter } from 'next/navigation';

// Lazy load non-critical components
const AnalysisDemo = dynamic(() => import('./AnalysisDemo'), {
    loading: () => <div className="h-[600px] w-full bg-zinc-900/20 animate-pulse rounded-3xl mx-auto my-20 max-w-7xl" />
});
const Differentiators = dynamic(() => import('./Differentiators'));
const HowItWorks = dynamic(() => import('./HowItWorks'));
const Features = dynamic(() => import('./Features'));
const Qualification = dynamic(() => import('./Qualification'));
const CTA = dynamic(() => import('./CTA'));

export default function HomeContent() {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/authentication?next=dashboard');
    };

    return (
        <div className="selection:bg-primary/30 relative overflow-x-hidden bg-base text-fg-primary landing-scrollbar">
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute left-1/2 top-[-220px] h-[560px] w-[min(1000px,92vw)] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
                <div className="absolute -left-24 bottom-16 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
            </div>

            <main className="relative z-10 mx-auto w-full max-w-[1500px]">
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
    );
}
