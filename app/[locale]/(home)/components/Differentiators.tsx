import React from 'react';
import { motion } from 'framer-motion';

const differentiators = [
    {
        title: "Behavior-First Metrics",
        desc: "Execution quality, discipline, and emotional variance are tracked as first-class signals."
    },
    {
        title: "Session Narrative",
        desc: "Each day is analyzed as a decision chain, not a list of disconnected trades."
    },
    {
        title: "Structured Interventions",
        desc: "When drift appears, the system suggests concrete action to protect expectancy."
    },
    {
        title: "Team-Ready Reporting",
        desc: "Owners and managers can monitor consistency, risk, and role-level performance."
    }
];

const Differentiators: React.FC = () => {
    return (
        <section className="py-fluid-xl border-b border-white/8 bg-[#050505]">
            <div className="container-fluid">
                <div className="mb-8 sm:mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Why Qunt Edge</p>
                    <h2 className="mt-3 text-fluid-2xl sm:text-fluid-4xl font-black tracking-tight">
                        Built For Traders Who
                        <span className="text-zinc-500"> Take Process Seriously</span>
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {differentiators.map((item, i) => (
                        <motion.article
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 sm:p-6"
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Layer 0{i + 1}</p>
                            <h3 className="mt-2 text-xl font-black tracking-tight text-white">{item.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Differentiators;
