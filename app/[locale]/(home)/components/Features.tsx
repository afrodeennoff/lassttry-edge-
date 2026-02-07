import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        title: "Unified Imports",
        subtitle: "Data Import",
        desc: "Sync from major brokers or upload CSV files with flexible field mapping."
    },
    {
        title: "Performance Analytics",
        subtitle: "Visualization",
        desc: "Track execution score, expectancy, and equity context in one workspace."
    },
    {
        title: "Daily Review Flow",
        subtitle: "Calendar Intelligence",
        desc: "Move from daily outcome to session-level behavior review in seconds."
    },
    {
        title: "AI Journaling",
        subtitle: "Context Engine",
        desc: "Capture mindset patterns and connect them to measurable execution quality."
    },
    {
        title: "Custom Dashboards",
        subtitle: "Workspace",
        desc: "Compose widgets around your process and keep the layout aligned with your style."
    },
    {
        title: "Team Oversight",
        subtitle: "Multi-User",
        desc: "Monitor traders, enforce structure, and compare consistency across accounts."
    }
];

const Features: React.FC = () => {
    return (
        <section id="features" className="py-fluid-xl border-b border-white/8 bg-[#050505] relative">
            <div id="data-import" className="absolute -top-24" />
            <div id="daily-performance" className="absolute -top-24" />
            <div id="ai-journaling" className="absolute -top-24" />

            <div className="container-fluid">
                <div className="mb-8 sm:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Platform Features</p>
                        <h2 className="mt-3 text-fluid-2xl sm:text-fluid-4xl font-black tracking-tight">
                            Precision Tools,
                            <span className="text-zinc-500"> Zero Clutter</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-sm text-zinc-400">
                        Designed for discretionary traders who want structure and speed without unnecessary complexity.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <motion.article
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group rounded-2xl border border-white/10 bg-zinc-950/80 p-5"
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 group-hover:text-teal-300 transition-colors">
                                {feature.subtitle}
                            </p>
                            <h3 className="mt-2 text-lg font-black tracking-tight">{feature.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.desc}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
