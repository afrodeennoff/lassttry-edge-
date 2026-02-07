import React from 'react';
import { motion } from 'framer-motion';

const fitList = [
    "Discretionary traders building repeatable routines",
    "Prop firm candidates optimizing consistency",
    "Funded traders protecting existing edge",
    "Team leads auditing process quality"
];

const noFitList = [
    "Signal-copy workflows with no journaling discipline",
    "Impulse-driven sessions without risk framework",
    "Vanity metric tracking with no review loop",
    "Users looking for alert-only tools"
];

const Qualification: React.FC = () => {
    return (
        <section className="py-fluid-xl border-b border-white/8 bg-[#040404]">
            <div className="container-fluid">
                <div className="grid gap-4 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-6"
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Best Fit</p>
                        <h3 className="mt-2 text-2xl font-black tracking-tight">High-Discipline Traders</h3>
                        <ul className="mt-4 space-y-3">
                            {fitList.map((item) => (
                                <li key={item} className="flex gap-3 text-sm text-zinc-100">
                                    <span className="mt-0.5 text-teal-200">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6"
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">Not Ideal</p>
                        <h3 className="mt-2 text-2xl font-black tracking-tight">Noise-First Trading</h3>
                        <ul className="mt-4 space-y-3">
                            {noFitList.map((item) => (
                                <li key={item} className="flex gap-3 text-sm text-zinc-400">
                                    <span className="mt-0.5 text-zinc-600">✕</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Qualification;
