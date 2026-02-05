
'use client';

import dynamic from 'next/dynamic';
import Navigation from './Navigation';
import Hero from './Hero';
import ProblemStatement from './ProblemStatement';
import Footer from './Footer';
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
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col selection:bg-teal-500/30 relative bg-[#050505] text-white overflow-x-hidden landing-scrollbar font-sans">
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-50"></div>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="noise"></div>

            <Navigation onAccessPortal={handleLogin} />
            <main className="flex-grow relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Hero onStart={handleLogin} />
                <ProblemStatement />
                <AnalysisDemo />
                <Differentiators />
                <HowItWorks />
                <Features />
                <Qualification />
                <CTA onStart={handleLogin} />
            </main>
            <Footer />
        </div>
    );
}
