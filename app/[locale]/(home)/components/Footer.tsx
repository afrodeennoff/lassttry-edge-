"use client"

import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="py-fluid-lg px-fluid-sm border-t border-white/5 bg-[#050505]">
            <div className="container-fluid flex flex-col md:flex-row justify-between items-center gap-fluid-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center font-bold text-black text-xs">Q</div>
                    <span className="text-sm font-bold tracking-tighter uppercase mono">Qunt Edge</span>
                </div>

                <div className="grid grid-cols-2 gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500 max-w-md">
                    <div className="flex flex-col gap-2">
                        <span className="text-white mb-2">Product</span>
                        <a href="/#features" className="hover:text-white transition-colors">Features</a>
                        <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="/propfirms" className="hover:text-white transition-colors">Prop Firms Catalogue</a>
                        <a href="/teams" className="hover:text-white transition-colors">Teams</a>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-white mb-2">Support</span>
                        <a href="/about" className="hover:text-white transition-colors">Company</a>
                        <a href="/about" className="hover:text-white transition-colors">About</a>
                        <a href="#" className="hover:text-white transition-colors">Legal</a>
                        <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="/disclaimers" className="hover:text-white transition-colors">Disclaimers</a>
                    </div>
                </div>
                <div className="text-[10px] mono text-zinc-600">
                    © {new Date().getFullYear()} Qunt Edge. All rights reserved. Professional trading analytics.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
