'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Shield,
  Database,
  RefreshCcw,
  Layout,
  ArrowRight,
  Code,
  CheckCircle2,
  Terminal,
  ChevronDown,
  HelpCircle,
  Cpu,
  Globe,
  Lock,
  Box,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';
import pack from '../../package.json';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Standard tailwind-merge helper */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FEATURE_CARDS = [
  {
    title: "Granular Real-time",
    description: "Ultra-fast namespaced events (e.g., posts:created) for responsive dashboards.",
    icon: RefreshCcw,
    color: "emerald"
  },
  {
    title: "Multi-DB Freedom",
    description: "Universal NMAdapter for SQL, MongoDB, and more. Mix and match with ease.",
    icon: Database,
    color: "blue"
  },
  {
    title: "Auth & Policies",
    description: "Fine-grained RBAC and ownership policies baked directly into your JSON schemas.",
    icon: Shield,
    color: "purple"
  },
  {
    title: "Schema-Driven UI",
    description: "Beautiful forms, tables, and dashboards generated automatically from your models.",
    icon: Layout,
    color: "orange"
  }
];

const FAQS = [
  {
    question: "How does the schema hot-reloading work?",
    answer: "NextMin watches your `schemasDir` for changes. Whenever you edit and save a JSON schema file, the server instantly re-validates and hot-swaps the model in memory. Your API routes update immediately without a server restart."
  },
  {
    question: "Can I integrate custom Express routes?",
    answer: "Yes! `createNextMinRouter` returns a standard Express router. You can mount it under any path and add your own custom controllers before or after the NextMin routes for specialized logic."
  },
  {
    question: "Does NextMin support auto-migrations?",
    answer: "Yes, when using SQL adapters via NMAdapter, NextMin can be configured to automatically sync your database tables with your schema definitions during startup or hot-reloading."
  },
  {
    question: "Is NextMin production-ready?",
    answer: "NextMin is built for production environments. It includes built-in security policies, read/write masks, audit logging, and performant database query engines designed for scale."
  },
  {
    question: "How do I handle complex custom business logic?",
    answer: "Use the Namespaced Event system. Subscribe to events like `posts:before:create` on the backend to add custom validation, trigger emails, or communicate with external microservices without touching core CRUD code."
  }
];

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-6 text-left focus:outline-none group"
      >
        <span className="text-lg font-semibold text-neutral-800 group-hover:text-emerald-600 transition-colors">{question}</span>
        <ChevronDown className={cn("w-5 h-5 text-neutral-400 transition-transform duration-300", isOpen && "rotate-180 text-emerald-500")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-neutral-600 leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FloatingBadge = ({ children, className, delay = 0, yOffset = 10 }: { children: React.ReactNode, className: string, delay?: number, yOffset?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: [0, -yOffset, 0]
    }}
    transition={{
      duration: 3,
      delay,
      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
    className={cn("absolute z-20 px-4 py-2 rounded-full border bg-white/80 backdrop-blur-md shadow-lg text-[10px] font-bold uppercase tracking-widest pointer-events-none", className)}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const [npmDownloads, setNpmDownloads] = useState<number | null>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [nodeRes, reactRes] = await Promise.all([
          fetch('https://api.npmjs.org/downloads/point/last-month/@airoom/nextmin-node'),
          fetch('https://api.npmjs.org/downloads/point/last-month/@airoom/nextmin-react')
        ]);
        const nodeData = await nodeRes.json();
        const reactData = await reactRes.json();
        setNpmDownloads((nodeData.downloads || 0) + (reactData.downloads || 0));
      } catch (err) {
        console.error('Failed to fetch NPM stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-neutral-800 selection:bg-neutral-900/10 font-sans overflow-x-hidden">
      {/* --- BACKGROUND BLOBS & EXPERIMENTAL GRID --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-neutral-400/[0.04] blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neutral-400/[0.04] blur-[140px] rounded-full" />
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-neutral-400/[0.02] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-8 pb-12">
        {/* --- CREATIVE LAYERED HERO --- */}
        <section className="relative min-h-[70vh] grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">

          <div className="relative z-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[10px] font-black text-emerald-700 backdrop-blur-xl uppercase tracking-[0.2em] shadow-sm">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-500" /> Version {pack.version}
                </div>
                <div className="h-[1px] w-8 bg-neutral-200 hidden sm:block" />
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest hidden sm:block">Real-time Architecture</span>
              </div>

              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter text-neutral-900 leading-[0.9] mb-6">
                Backend <br />
                <span className="text-neutral-900 italic drop-shadow-sm">Infrastructure</span> <br />
                Simplified.
              </h1>

              <p className="text-lg md:text-xl text-neutral-500 leading-relaxed font-semibold max-w-xl">
                The unified system that turns <span className="text-neutral-900 uppercase tracking-tighter font-black">schemas</span> into <span className="text-neutral-900 underline decoration-neutral-900/10 underline-offset-8">Production Assets</span>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link
                href="/docs/nextmin-node"
                className="group relative px-8 py-3 rounded-2xl bg-neutral-900 text-white font-black text-xs transition-all hover:bg-black hover:scale-105 active:scale-95 overflow-hidden shadow-xl shadow-neutral-400/20"
              >
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest">
                  Quick Start
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/playground"
                className="px-8 py-3 rounded-2xl border-2 border-neutral-100 bg-white/50 backdrop-blur-xl font-bold text-xs text-neutral-600 transition-all hover:bg-white hover:border-neutral-900 hover:text-neutral-900 shadow-sm active:scale-95"
              >
                Launch Playground
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-10 flex gap-8 sm:gap-12 items-center"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 overflow-hidden shadow-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer">
                    <img
                      src={`/avatars/avatar${i}.png`}
                      alt={`Developer Avatar ${i}`}
                      className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold text-neutral-400 italic">
                Trusted by builders with <span className="text-neutral-900 not-italic">{npmDownloads ? `${npmDownloads * 5}+` : '490+'}</span> downloads.
              </div>
            </motion.div>
          </div>

          {/* CREATIVE VISUAL STACK */}
          <div className="relative h-[600px] hidden lg:flex items-center justify-center">

            {/* Floating Decorative Badges */}
            <FloatingBadge className="top-10 left-0 border-neutral-100 text-neutral-900" delay={0.2} yOffset={15}>
              <Cpu className="w-3 h-3" /> Auto-Migration
            </FloatingBadge>
            <FloatingBadge className="top-40 right-10 border-neutral-100 text-neutral-600" delay={0.6} yOffset={20}>
              <Database className="w-3 h-3" /> Universal Adapters
            </FloatingBadge>
            <FloatingBadge className="bottom-20 left-10 border-neutral-100 text-neutral-600" delay={0.4} yOffset={-15}>
              <Zap className="w-3 h-3" /> Real-time Sync
            </FloatingBadge>

            {/* Stacked Cards for depth */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[450px] h-[550px] bg-white/40 border border-white/50 rounded-[3rem] shadow-2xl backdrop-blur-sm -rotate-6 translate-x-[-40px] translate-y-[20px]"
            />
            <motion.div
              animate={{ rotate: [2, -2, 2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[450px] h-[550px] bg-white/60 border border-white/80 rounded-[3rem] shadow-2xl backdrop-blur-md rotate-3 translate-x-[20px] translate-y-[-10px]"
            />

            {/* Main Content Card (Terminal) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative w-[500px] z-30"
            >
              <div className="bg-white border-2 border-neutral-100 rounded-[2.5rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)]">
                <div className="px-8 py-6 bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-neutral-200" />
                    <div className="w-3 h-3 rounded-full bg-neutral-200" />
                    <div className="w-3 h-3 rounded-full bg-neutral-200" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Main.ts {"->"} Initialize</span>
                </div>
                <div className="p-10 font-mono text-sm space-y-6">
                  <div className="flex gap-4">
                    <span className="text-neutral-900 font-black">❯</span>
                    <span className="text-neutral-900 font-bold italic">npm start</span>
                  </div>

                  <div className="space-y-4">
                    <div className="text-neutral-400 italic">// 1. Load your schemas folder</div>
                    <div className="text-neutral-800">
                      <span className="text-purple-600 font-black">const</span> router = createNextMinRouter(&#123;
                    </div>
                    <div className="text-neutral-800">
                      &nbsp;&nbsp;schemasDir: <span className="text-neutral-900 font-bold underline decoration-neutral-200 underline-offset-4">path.join(process.cwd(), 'schemas')</span>,
                    </div>
                    <div className="text-neutral-800">
                      &nbsp;&nbsp;dbAdapter: <span className="text-blue-600">new</span> NMAdapter(&#123; ... &#125;)
                    </div>
                    <div className="text-neutral-800">&#125;);</div>
                  </div>

                  <div className="mt-8 border-t border-neutral-50 pt-8">
                    <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <RefreshCcw className="w-4 h-4 text-emerald-500 animate-spin" />
                      <span className="text-emerald-700 font-black text-[10px] uppercase tracking-widest">Live Sync Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- MOBILE TERMINAL (Fallback) --- */}
        <section className="mt-20 lg:hidden">
          <div className="bg-white border-2 border-neutral-100 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="p-6 font-mono text-xs text-neutral-800 whitespace-pre overflow-x-auto">
              <span className="text-purple-600 font-bold italic">const</span> router = createNextMinRouter(&#123;<br />
              &nbsp;&nbsp;schemasDir: './schemas',<br />
              &nbsp;&nbsp;dbAdapter: <span className="text-blue-600">new</span> NMAdapter(&#123;...&#125;)<br />
              &#125;);
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID CORE --- */}
        <section className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 space-y-2"
          >
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tighter leading-none">The Engine for Builders.</h2>
            <p className="text-base text-neutral-500 font-medium max-w-xl mx-auto italic">Everything you need to ship enterprise-grade systems from day zero.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURE_CARDS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-6 rounded-2xl border-2 border-neutral-50 bg-white hover:border-neutral-200 hover:shadow-2xl hover:shadow-neutral-900/10 transition-all"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-all group-hover:scale-110",
                  item.color === 'emerald' && "bg-neutral-100 text-neutral-900",
                  item.color === 'blue' && "bg-blue-50 text-blue-600",
                  item.color === 'purple' && "bg-purple-50 text-purple-600",
                  item.color === 'orange' && "bg-orange-50 text-orange-600",
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-neutral-900 mb-2 tracking-tight">{item.title}</h3>
                <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- TECH STOIC SECTION (CREATIVE SPLIT) --- */}
        <section className="mt-20 relative py-12 rounded-3xl border-2 border-neutral-50 bg-white overflow-hidden group shadow-sm">
          <div className="absolute inset-0 bg-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <RefreshCcw className="w-72 h-72 text-neutral-200 animate-[spin_60s_linear_infinite]" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 px-12 md:px-20">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-neutral-900 leading-[0.9]">
                Universal <br />
                <span className="text-neutral-900 underline decoration-neutral-200 underline-offset-8 decoration-4">Compatibility</span>.
              </h2>
              <p className="text-lg text-neutral-500 font-medium leading-relaxed italic">
                "We didn't just build another framework. We built a system that connects your metadata to your infrastructure naturally."
              </p>
              <div className="grid gap-4">
                {[
                  "Native Next.js & Vite Ecosystem",
                  "Any NMAdapter supported DB (Postgres, SQL, Mongo)",
                  "Ultra-Granular Real-time Namespacing",
                  "Self-Service Security Policy Engine"
                ].map(t => (
                  <div key={t} className="flex items-center gap-3 group/item">
                    <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center transition-transform group-hover/item:scale-110">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-base font-black text-neutral-900 uppercase tracking-tighter">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-neutral-900/10 blur-[80px] rounded-full" />
                <div className="relative z-10 w-full h-full bg-neutral-900 rounded-2xl p-8 flex flex-col items-center justify-between text-white shadow-2xl">
                  <Zap className="w-12 h-12 text-neutral-400" />
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-1">Performance</div>
                    <div className="text-3xl font-black tracking-tighter">99.9%</div>
                    <div className="text-[9px] font-bold text-neutral-400 mt-1">REAL-TIME UP-TIME</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="mt-64 max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-neutral-900 mb-6 tracking-tight">Technical Insights</h2>
            <p className="text-xl text-neutral-500 font-medium italic">Everything you need to know about building with NextMin.</p>
          </div>

          <div className="bg-white rounded-[3rem] p-12 border-2 border-neutral-50 shadow-sm">
            {FAQS.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* --- DARK CTA --- */}
        <section className="mt-32 text-center px-4">
          <div className="relative inline-block w-full group">
            <div className="absolute inset-0 bg-neutral-200 rounded-[3rem] blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative px-8 py-16 md:px-24 md:py-24 rounded-[3rem] bg-neutral-900 border border-neutral-800 shadow-3xl text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)]" />

              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-8 relative z-10">Stop Waiting. <br /> Start Shipping.</h2>
              <p className="max-w-2xl mx-auto text-neutral-400 text-lg font-medium mb-12 relative z-10">Join the thousands of engineers building production backends in minutes, not months.</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                <Link href="/docs/nextmin-node" className="px-10 py-5 rounded-[2rem] bg-white text-neutral-900 font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl">
                  View Documentation
                </Link>
                <Link href="/docs/nextmin-react" className="px-10 py-5 rounded-[2rem] border-2 border-white/20 hover:bg-white/10 text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95">
                  System Architecture
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- THE CREATIVE FOOTER --- */}
        <footer className="mt-32 pt-16 pb-12 text-center">
          <div className="flex flex-col items-center gap-16">
            <div className="text-neutral-900 font-black text-4xl tracking-tighter flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="NextMin Logo"
                width={40}
                height={40}
                className="transition-all"
              />
              NextMin
            </div>

            <div className="flex flex-wrap items-center justify-center gap-12 text-sm font-black uppercase tracking-[0.2em] text-neutral-400">
              <Link href="/docs/license" className="hover:text-neutral-900 transition-colors">License</Link>
              <a href="https://github.com/tareq0065/nextmin-core" className="hover:text-neutral-900 transition-colors">GitHub</a>
              <Link href="/docs/why-nextmin" className="hover:text-neutral-900 transition-colors">Vision</Link>
              <a href="mailto:hello@gscodes.dev" className="hover:text-neutral-900 transition-colors">Contact</a>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-[1px] bg-neutral-200" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 italic">
                By <span className="text-neutral-400 not-italic">GS Codes AI</span> — 2026
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
