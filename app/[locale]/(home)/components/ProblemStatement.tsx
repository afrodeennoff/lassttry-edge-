import React from 'react';
import { motion } from 'framer-motion';

const problems = [
    {
        title: "Outcome Bias",
        desc: "Winning trades hide process mistakes. The habit survives until volatility exposes it."
    },
    {
        title: "Emotional Drift",
        desc: "Small frustration compounds into over-sizing and off-plan entries across the session."
    },
    {
        title: "Broken Feedback Loops",
        desc: "Without structured review, traders optimize what happened, not what should repeat."
    }
];

const ProblemStatement: React.FC = () => {
    return (
        <section id="problem" className="py-fluid-xl border-y border-white/8 bg-[#050505]">
            <div className="container-fluid">
                <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Core Problem</p>
                        <h2 className="mt-3 text-fluid-3xl sm:text-fluid-5xl font-black tracking-tight leading-[0.95]">
                            PnL Tells You
                            <br />
                            <span className="text-zinc-500">What Happened.</span>
                        </h2>
                        <p className="mt-4 max-w-xl text-sm sm:text-base text-zinc-300">
                            But sustainable performance comes from diagnosing the decisions behind the result.
                            Qunt Edge shifts your review from profit snapshots to execution intelligence.
                        </p>

                        <div className="mt-6 rounded-xl border border-teal-400/20 bg-teal-400/10 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-300">Framework Shift</p>
                            <p className="mt-2 text-sm text-zinc-100">Audit execution first. Profit becomes a byproduct, not a compass.</p>
                        </div>
                    </motion.div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                        {problems.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                className="rounded-xl border border-white/10 bg-zinc-950/80 p-5"
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">0{i + 1}</p>
                                <h3 className="mt-2 text-lg font-black tracking-tight">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemStatement;
