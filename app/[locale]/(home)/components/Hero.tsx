'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroProps {
    onStart: () => void;
}

const panelItems = [
    { label: 'Execution Score', value: '91.4', trend: '+5.2%' },
    { label: 'Rule Compliance', value: '96%', trend: '+2.1%' },
    { label: 'Tilt Events', value: '2', trend: '-47%' },
];

const Hero: React.FC<HeroProps> = ({ onStart }) => {
    return (
        <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-20">
            <div className="container-fluid">
                <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center lg:text-left"
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                            Institutional Precision
                        </span>

                        <h1 className="mt-5 text-fluid-4xl sm:text-fluid-6xl lg:text-fluid-7xl font-black leading-[0.92] tracking-tight">
                            Trade With
                            <br />
                            <span className="bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
                                Clinical Clarity
                            </span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-300 sm:text-lg lg:mx-0">
                            Qunt Edge transforms raw trading data into a behavior-first operating system.
                            Measure execution quality, catch discipline drift early, and scale with confidence.
                        </p>

                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                            <button
                                onClick={onStart}
                                className="h-11 w-full rounded-xl bg-teal-400 px-6 text-[11px] font-black uppercase tracking-[0.16em] text-black transition-all hover:bg-teal-300 sm:w-auto"
                            >
                                Start Free
                            </button>
                            <Link
                                href="/docs"
                                className="h-11 w-full rounded-xl border border-white/15 px-6 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-200 transition-all hover:border-teal-300/40 hover:text-white sm:w-auto inline-flex items-center justify-center"
                            >
                                Explore Docs
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 shadow-[0_35px_80px_-45px_rgba(20,184,166,0.6)] sm:p-6"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Session Pulse</p>
                                <h2 className="mt-1 text-lg font-black tracking-tight">Execution Control Panel</h2>
                            </div>
                            <span className="rounded-lg border border-teal-400/30 bg-teal-400/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-teal-300">
                                Live
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {panelItems.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                    <span className="text-sm text-zinc-300">{item.label}</span>
                                    <div className="text-right">
                                        <p className="text-base font-black leading-none">{item.value}</p>
                                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-teal-300">{item.trend}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-xl border border-white/8 bg-gradient-to-r from-teal-400/12 to-transparent px-4 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Key Signal</p>
                            <p className="mt-1 text-sm text-zinc-100">
                                Your high-volatility sessions perform <span className="font-black text-teal-300">33% better</span> when rule-lock is enabled.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-12 rounded-2xl border border-white/8 bg-black/35 px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        <span>Tradovate</span>
                        <span>Rithmic</span>
                        <span>IBKR</span>
                        <span>CQG</span>
                        <span>CSV Sync</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
