'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Save, RefreshCw, Eye, CheckCircle2, AlertCircle, Code } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type ListResponse = { files: string[] };
type GetResponse = { name: string; content: string };
type SaveResponse = { ok: true; name: string };
type ResetAllResponse = { ok: true; restored: string[] };

function useDebouncedCallback<T extends (...args: any[]) => void>(
    fn: T,
    delay = 800,
) {
    const timer = useRef<number | undefined>(null);
    return useCallback(
        (...args: Parameters<T>) => {
            if (timer.current) window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => fn(...args), delay);
        },
        [fn, delay],
    );
}

async function getJSON<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        // If the error is an HTML page (like a 404), don't dump the whole thing
        if (text.trim().startsWith('<!DOCTYPE')) {
            throw new Error(`Server Error (${res.status}): The request failed. Check server logs.`);
        }
        const msg = text.length > 150 ? text.substring(0, 150) + '...' : text;
        throw new Error(msg || `HTTP ${res.status}`);
    }
    try {
        return (await res.json()) as T;
    } catch (err) {
        throw new Error("Invalid response from server (expected JSON)");
    }
}

export default function SchemaManager({ selected, setSelected }: { selected: string; setSelected: (name: string) => void }) {
    const [files, setFiles] = useState<string[]>([]);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedAt, setSavedAt] = useState<number | null>(null);
    const [resetAt, setResetAt] = useState<number | null>(null);

    const loadFiles = useCallback(async () => {
        try {
            const res = await fetch('/api/playground/schemas', {
                cache: 'no-store',
                headers: { 'x-api-key': process.env.NEXT_PUBLIC_NEXTMIN_API_KEY || 'playground_key' }
            });
            const data = await getJSON<ListResponse>(res);
            setFiles(data.files);
            if (!selected && data.files.length) setSelected(data.files[0]);
        } catch (e: any) {
            setError(e.message);
        }
    }, [selected]);

    const loadFile = useCallback(async (name: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/playground/schemas/${encodeURIComponent(name)}`, {
                cache: 'no-store',
                headers: { 'x-api-key': process.env.NEXT_PUBLIC_NEXTMIN_API_KEY || 'playground_key' }
            });
            const data = await getJSON<GetResponse>(res);
            try {
                setContent(JSON.stringify(JSON.parse(data.content), null, 2));
            } catch {
                setContent(data.content);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveFile = useCallback(async (name: string, raw: string) => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/playground/schemas/${encodeURIComponent(name)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_NEXTMIN_API_KEY || 'playground_key'
                },
                body: JSON.stringify({ content: raw }),
            });
            await getJSON<SaveResponse>(res);
            setSavedAt(Date.now());
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }, []);

    const resetFile = useCallback(
        async (name: string) => {
            try {
                if (!window.confirm(`Reset ${name} to the original snapshot?`)) return;
                const res = await fetch(`/api/playground/schemas/${encodeURIComponent(name)}/reset`, {
                    method: 'POST',
                    headers: { 'x-api-key': process.env.NEXT_PUBLIC_NEXTMIN_API_KEY || 'playground_key' }
                });
                await getJSON<{ ok: true; name: string }>(res);
                setResetAt(Date.now());
                await loadFile(name);
            } catch (e: any) {
                setError(e.message);
            }
        },
        [loadFile],
    );

    const debouncedSave = useDebouncedCallback((name: string, raw: string) => {
        try {
            JSON.parse(raw);
            void saveFile(name, raw);
        } catch {
            setError('Invalid JSON: fix syntax to auto-save.');
        }
    }, 800);

    useEffect(() => {
        void loadFiles();
    }, [loadFiles]);

    useEffect(() => {
        if (selected) void loadFile(selected);
    }, [selected, loadFile]);

    const onMount: OnMount = useCallback((editor, monaco) => {
        editor.updateOptions({ tabSize: 2 });
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            allowComments: false,
            schemas: [],
        });
    }, []);

    return (
        <div className="flex flex-col gap-6 bg-white border border-neutral-100 rounded-xl p-4 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 flex items-center gap-2">
                        <Code className="w-5 h-5 text-neutral-900" /> Schema Editor
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-500 italic">Edit your JSON models to trigger live engine updates.</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="border border-neutral-200 rounded-xl px-4 py-2 bg-neutral-50 text-sm font-semibold text-neutral-700 outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        {files.map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => selected && resetFile(selected)}
                        className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-500 transition-all"
                        title="Reset to local backup"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-neutral-900/5 to-neutral-700/5 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full h-[500px] border border-neutral-100 rounded-2xl overflow-hidden bg-white shadow-inner">
                    <Editor
                        height="100%"
                        defaultLanguage="json"
                        theme="light"
                        value={content}
                        options={{
                            automaticLayout: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            tabSize: 2,
                            fontSize: 14,
                            fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
                            padding: { top: 20, bottom: 20 },
                        }}
                        onChange={(val) => {
                            const next = typeof val === 'string' ? val : content;
                            setContent(next);
                            if (selected) debouncedSave(selected, next);
                        }}
                        onMount={onMount}
                    />
                </div>

                {/* Status Bar */}
                <div className="mt-3 flex items-center justify-between px-2">
                    <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                        {saving ? (
                            <span className="text-blue-500 flex items-center gap-1.5 animation-pulse">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" /> Synchronizing...
                            </span>
                        ) : error ? (
                            <span className="text-red-500 flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3" /> {error}
                            </span>
                        ) : (
                            <span className="text-emerald-500 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3" /> Live Engine Synced
                            </span>
                        )}
                    </div>

                    <div className="text-[10px] text-neutral-400 font-medium">
                        {savedAt && `Last update: ${new Date(savedAt).toLocaleTimeString()}`}
                    </div>
                </div>
            </div>
        </div>
    );
}
