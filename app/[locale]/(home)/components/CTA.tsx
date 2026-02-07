import React from 'react';
import Link from 'next/link';

interface CTAProps {
    onStart: () => void;
}

const CTA: React.FC<CTAProps> = ({ onStart }) => {
    return (
        <section className="py-fluid-xl bg-[#050505]">
            <div className="container-fluid">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/85 px-6 py-10 sm:px-10 sm:py-12">
                    <div className="pointer-events-none absolute -right-24 -top-16 h-64 w-64 rounded-full bg-teal-400/15 blur-[90px]" />

                    <div className="relative z-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Ready To Upgrade</p>
                        <h2 className="mt-3 text-fluid-3xl sm:text-fluid-5xl font-black tracking-tight leading-[0.95]">
                            Build Consistency
                            <br />
                            <span className="text-zinc-500">With Better Feedback</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-300">
                            Start using a behavior-first trading system that helps you improve decision quality, session after session.
                        </p>

                        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <button
                                onClick={onStart}
                                className="h-11 rounded-xl bg-teal-400 px-7 text-[11px] font-black uppercase tracking-[0.16em] text-black transition-all hover:bg-teal-300"
                            >
                                Apply For Access
                            </button>
                            <Link
                                href="/pricing"
                                className="h-11 rounded-xl border border-white/15 px-7 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-200 transition-all hover:border-teal-300/40 hover:text-white inline-flex items-center justify-center"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
