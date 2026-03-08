'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Terminal, Rocket, Info } from 'lucide-react';
import SchemaManager from '@/components/playground/SchemaManager';
import ArchitectureDemo from '@/components/playground/ArchitectureDemo';

export default function PlaygroundPage() {
    const [selected, setSelected] = React.useState<string>('');

    return (
        <div className="min-h-screen bg-[#fcfcfd] text-neutral-800 selection:bg-neutral-900/10 font-sans overflow-x-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neutral-900/[0.03] blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neutral-900/[0.02] blur-[100px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)]" />
            </div>

            <nav className="relative z-20 mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">NextMin Active Instance</span>
                </div>
            </nav>

            <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-20">
                {/* Header Section */}
                <header className="mb-8 space-y-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-100 bg-neutral-50/50 px-4 py-1.5 text-[10px] font-black text-neutral-700 uppercase tracking-widest mb-4">
                            <Sparkles className="w-3 h-3" /> Live Laboratory
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral-900 leading-tight mb-4">
                            Developer
                            <span className="text-neutral-900 italic"> Playground</span>.
                        </h1>
                        <p className="text-base text-neutral-500 font-medium max-w-2xl leading-relaxed">
                            Tweak your JSON models and watch as the engine hot-reloads its entire
                            REST surface and real-time namespace instantly.
                        </p>
                    </motion.div>
                </header>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-4 sm:p-6 rounded-2xl bg-neutral-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-neutral-200"
                >
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                            <Info className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base leading-tight uppercase tracking-tight">How it works</h3>
                            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                                Every save triggers an internal file watcher. The engine re-validates your schema and broadcasts a <code>schema:update</code> event across the namespace.
                            </p>
                        </div>
                    </div>
                    <Link href="/docs/nextmin-node/schema-examples" className="px-5 py-2.5 rounded-lg bg-white text-neutral-900 font-bold text-xs hover:scale-105 transition-all outline-none">
                        View Examples
                    </Link>
                </motion.div>

                {/* Content Tabs/Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 sm:gap-6 items-start">
                    <section className="space-y-6">
                        <SchemaManager selected={selected} setSelected={setSelected} />
                    </section>

                    <section className="space-y-6 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-neutral-900/20 w-fit">
                                <Terminal className="w-3 h-3" /> Real-time Execution Demo
                            </div>
                            <Link href="/admin" target="_blank" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors">
                                <Rocket className="w-3.5 h-3.5 group-hover:animate-bounce" /> Admin Panel
                            </Link>
                        </div>
                        <ArchitectureDemo selectedModel={selected} />
                    </section>
                </div>



                {/* Footer CTA */}
                <section className="mt-20 text-center space-y-8">
                    <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Ready to integrate?</h2>
                    <div className="flex justify-center gap-4">
                        <Link href="/docs/nextmin-node" className="px-8 py-3 rounded-lg bg-neutral-900 text-white font-bold text-xs tracking-widest uppercase hover:bg-black transition-all">
                            Read Node.js SDK
                        </Link>
                        <Link href="/docs/nextmin-react" className="px-8 py-3 rounded-lg border-2 border-neutral-100 bg-white text-neutral-600 font-bold text-xs tracking-widest uppercase hover:bg-neutral-50 transition-all">
                            Read React Hooks
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
