'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
    { session: 'Mon', score: 72, pnl: 240 },
    { session: 'Tue', score: 81, pnl: 390 },
    { session: 'Wed', score: 77, pnl: -110 },
    { session: 'Thu', score: 88, pnl: 520 },
    { session: 'Fri', score: 92, pnl: 760 },
];

const signals = [
    'Reduced position size after two losses: rule respected.',
    'Best win-rate window: 09:40 - 10:35 session block.',
    'High-confidence edge appears when checklist is complete.'
];

const AnalysisDemo: React.FC = () => {
    return (
        <section id="performance-visualization" className="py-fluid-xl border-b border-white/8 bg-[#040404]">
            <div className="container-fluid">
                <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Live Analysis</p>
                        <h2 className="mt-3 text-fluid-2xl sm:text-fluid-4xl font-black tracking-tight leading-[0.96]">
                            Convert Journal Noise
                            <br />
                            <span className="text-zinc-500">Into Actionable Signals</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-sm text-zinc-400">
                        Behavioral metrics and execution quality sit beside your PnL, so you can make decisions before damage compounds.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 sm:p-6"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">Execution Index</p>
                                <p className="mt-1 text-2xl font-black text-white">92 / 100</p>
                            </div>
                            <span className="rounded-lg border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-teal-300">
                                +14% Weekly
                            </span>
                        </div>

                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.38} />
                                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#212121" vertical={false} />
                                    <XAxis dataKey="session" stroke="#6b7280" fontSize={11} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={11} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#09090b',
                                            border: '1px solid #2a2a2f',
                                            borderRadius: '10px',
                                            fontSize: '11px'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={2.4} fill="url(#scoreFill)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="rounded-2xl border border-white/10 bg-black/50 p-4 sm:p-6"
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">AI Findings</p>
                        <h3 className="mt-2 text-xl font-black tracking-tight">Session Intelligence Feed</h3>

                        <div className="mt-4 space-y-3">
                            {signals.map((signal, i) => (
                                <div key={signal} className="rounded-xl border border-white/8 bg-white/[0.02] p-3.5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">Signal 0{i + 1}</p>
                                    <p className="mt-1 text-sm leading-relaxed text-zinc-300">{signal}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 rounded-xl border border-teal-400/20 bg-teal-400/10 p-3.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-300">Intervention Suggestion</p>
                            <p className="mt-1 text-sm text-zinc-100">Enable auto cool-down after 2 consecutive red trades.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AnalysisDemo;
