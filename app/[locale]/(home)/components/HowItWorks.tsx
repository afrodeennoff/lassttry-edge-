import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    { name: "Ingest", desc: "Import broker data and normalize every event in one schema." },
    { name: "Label", desc: "Tag setup, risk context, and session state with minimal friction." },
    { name: "Diagnose", desc: "Separate repeatable edge from random outcome using rule checks." },
    { name: "Adapt", desc: "Apply focused improvements and track if behavior actually changes." }
];

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-fluid-xl border-b border-white/8 bg-[#040404]">
            <div className="container-fluid">
                <div className="mb-8 sm:mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Workflow</p>
                    <h2 className="mt-3 text-fluid-2xl sm:text-fluid-4xl font-black tracking-tight">
                        A Tight Loop For
                        <span className="text-zinc-500"> Consistent Improvement</span>
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="relative rounded-2xl border border-white/10 bg-zinc-950/80 p-5"
                        >
                            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-sm font-black text-teal-300">
                                {i + 1}
                            </div>
                            <h3 className="text-lg font-black tracking-tight">{step.name}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
