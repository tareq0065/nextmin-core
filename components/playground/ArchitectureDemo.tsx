'use client';

import { useEffect, useState, useRef } from 'react';
import { useNextMin, QueryBuilder, useRealtime, NextMinProvider } from '@airoom/nextmin-react';
import {
    Terminal,
    Activity,
    Database,
    Search,
    List,
    Zap,
    Clock,
    ArrowRight,
    Filter,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function DemoContent({ selectedModel }: { selectedModel: string }) {
    const { client } = useNextMin();
    const { isConnected, lastEvent } = useRealtime();
    const [items, setItems] = useState<any[]>([]);
    const [logs, setLogs] = useState<{ id: string; msg: string; type: 'info' | 'event' | 'error'; timestamp: string }[]>([]);
    const [fetching, setFetching] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const modelName = selectedModel.replace('.json', '') || 'Posts';

    const addLog = (msg: string, type: 'info' | 'event' | 'error' = 'info') => {
        setLogs((prev) => [
            { id: Math.random().toString(36).substr(2, 9), msg, type, timestamp: new Date().toLocaleTimeString() },
            ...prev
        ].slice(0, 50));
    };

    const clearLogs = () => setLogs([]);

    const fetchFilteredData = async (isManual = false) => {
        setFetching(true);
        if (isManual) addLog(`Initializing QueryBuilder for ${modelName}`, 'info');

        const qb = new QueryBuilder()
            .sort('createdAt', 'desc')
            .limit(3);

        const path = modelName.toLowerCase() === 'user' ? '/auth/user' : `/${modelName.toLowerCase()}`;

        try {
            const res = await client.request<any>(path, {
                method: 'GET',
                query: qb.build(),
            });
            setItems(res.data || []);
            addLog(`Successfully fetched ${res.data?.length || 0} documents from ${modelName}`, 'info');
        } catch (err: any) {
            let msg = 'Unknown Error';
            if (typeof err === 'string') msg = err;
            else if (err.error) msg = err.error;
            else if (err.message) msg = err.message;
            else if (typeof err === 'object') msg = JSON.stringify(err);

            // Prevent large HTML dumps in the event log
            const displayMsg = msg.trim().startsWith('<!DOCTYPE')
                // @ts-ignore
                ? `Server Error (${res.status}): The request failed. Check server console.`
                : msg;
            addLog(`Query error on ${modelName}: ${displayMsg}`, 'error');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (lastEvent) {
            addLog(`Namespace Event: ${lastEvent.event} on ${lastEvent.payload.modelName || 'system'}`, 'event');
            if (lastEvent.event.includes('created') || lastEvent.event.includes('updated') || lastEvent.event.includes('deleted') || lastEvent.event.includes('schemasUpdated')) {
                fetchFilteredData();
            }
        }
    }, [lastEvent]);

    // Initial fetch
    useEffect(() => {
        if (modelName) fetchFilteredData();
    }, [modelName]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-6">
            {/* Query Engine Demo */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
                            <Filter className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 leading-tight">Query Engine</h3>
                            <p className="text-[9px] text-neutral-500 font-medium tracking-tight uppercase">Watching {modelName}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchFilteredData(true)}
                        disabled={fetching}
                        className="group px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-[10px] transition-all hover:bg-black active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                        {fetching ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-emerald-400" />}
                        Execute
                    </button>
                </div>

                <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 h-[600px] flex flex-col overflow-hidden">
                    <div className="flex-1">
                        {items.length > 0 ? (
                            <div className="space-y-2">
                                {items.map((p, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={p.id || i}
                                        className="bg-white border border-neutral-200 p-3 rounded-lg shadow-sm group hover:border-neutral-900 transition-all cursor-default"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-neutral-800 text-xs">{p.title || p.name || p.id}</span>
                                            <div className="text-[9px] uppercase font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">Synced</div>
                                        </div>
                                        <div className="mt-1 text-[10px] text-neutral-400 font-medium flex items-center gap-2">
                                            <Clock className="w-2.5 h-2.5" /> {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                                            <div className="w-1 h-1 rounded-full bg-neutral-200" />
                                            <Database className="w-2.5 h-2.5" /> ID: {String(p.id || p._id).slice(-8)}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-4">
                                <Search className="w-6 h-6 mb-1" />
                                <p className="text-[9px] font-bold italic uppercase tracking-widest text-neutral-400">Waiting for data...</p>
                            </div>
                        )}
                    </div>

                    {/* Active Query Logic Visual */}
                    <div className="mt-4 pt-4 border-t border-neutral-200/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal className="w-3 h-3 text-neutral-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Generated Query</span>
                        </div>
                        <div className="bg-neutral-900 rounded-lg p-3 font-mono text-[9px] text-emerald-400/80 overflow-x-auto leading-relaxed">
                            <span className="text-purple-400">new</span> QueryBuilder()<br />
                            &nbsp;&nbsp;.<span className="text-blue-400">sort</span>(<span className="text-orange-300">'createdAt'</span>, <span className="text-orange-300">'desc'</span>)<br />
                            &nbsp;&nbsp;.<span className="text-blue-400">limit</span>(<span className="text-emerald-300">3</span>)<br />
                            &nbsp;&nbsp;.<span className="text-blue-400">build</span>() <span className="text-neutral-500">{"// -> "}</span>
                            <span className="text-white ml-2">{JSON.stringify({ sort: 'createdAt', sortType: 'desc', limit: 3 })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Log Demo */}
            <div className="flex flex-col h-full space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Activity className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Live Event Stream</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tight",
                            isConnected ? "text-emerald-500" : "text-red-500"
                        )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                            {isConnected ? "Connected" : "Offline"}
                        </div>
                        <button
                            onClick={clearLogs}
                            className="p-1 rounded-md hover:bg-neutral-100 text-neutral-400 transition-colors"
                            title="Clear Stream"
                        >
                            <RefreshCw className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-neutral-900 rounded-2xl p-4 overflow-hidden border border-neutral-800 flex flex-col h-[600px]">
                    <div className="flex-1 overflow-y-scroll font-mono text-[11px] space-y-2 pr-2 playground-scrollbar">
                        <AnimatePresence initial={false}>
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        "border-l-2 pl-3 py-1",
                                        log.type === 'event' ? "border-emerald-500 text-emerald-400" :
                                            log.type === 'error' ? "border-red-500 text-red-500" : "border-blue-500 text-blue-400"
                                    )}
                                >
                                    <div className="flex items-center gap-2 opacity-50 mb-0.5">
                                        <span className="text-[9px] font-black tracking-widest uppercase">[{log.timestamp}]</span>
                                        <div className="h-[1px] flex-1 bg-current opacity-10" />
                                    </div>
                                    <div className="font-bold leading-tight uppercase tracking-tight">{log.msg}</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {logs.length === 0 && <div className="text-neutral-600 italic">Waiting for backend emissions...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ArchitectureDemo({ selectedModel }: { selectedModel: string }) {
    // We wrap in a separate provider context to simulate a clean environment
    return (
        <NextMinProvider
            apiUrl="/rest"
            apiKey={process.env.NEXT_PUBLIC_NEXTMIN_API_KEY || 'playground_key'}
        >
            <div className="bg-white border border-neutral-100 rounded-2xl p-3 sm:p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-neutral-900/10" />
                <DemoContent selectedModel={selectedModel} />
            </div>
        </NextMinProvider>
    );
}
