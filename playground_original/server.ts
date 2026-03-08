import dotenv from 'dotenv';
import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import next from 'next';
import {
    createNextMinRouter,
    NMAdapter,
} from '@airoom/nextmin-node';
import cors from 'cors';
import http from 'http';
import { promises as fs } from 'node:fs';
import path from 'node:path';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT || 3006);

// --- File system helpers (Playground Specific) -------------------------------
const ROOT = process.cwd();
const PLAYGROUND_DIR = path.join(ROOT, 'schemas');
const ORIGINALS_DIR = path.join(ROOT, 'playground_original');

async function ensureDirs() {
    await fs.mkdir(PLAYGROUND_DIR, { recursive: true });
    await fs.mkdir(ORIGINALS_DIR, { recursive: true });
}

function safeFileName(name: string): string {
    if (!name.endsWith('.json')) throw new Error('Only .json files allowed');
    if (name.includes('..') || name.includes('/') || name.includes('\\'))
        throw new Error('Invalid file name');
    return name;
}

async function start() {
    await ensureDirs();

    const app = express();
    const server = http.createServer(app);

    app.use(cors());
    app.use(express.json({ limit: '5mb' }));

    // Request logging for debugging playground issues
    app.use((req, res, next) => {
        if (req.url.startsWith('/api/playground') || req.url.startsWith('/rest')) {
            console.log(`[API LOG] ${req.method} ${req.url}`);
        }
        next();
    });

    // 1) Init Next.js
    const nextApp = next({ dev });
    const handle = nextApp.getRequestHandler();
    await nextApp.prepare();

    // 2) Init NextMin REST + WebSocket (using SQLite for zero-config playground)
    const dbAdapter = new NMAdapter({
        type: 'sqlite',
        database: 'playground.sqlite',
        synchronize: true,
    });

    await dbAdapter.connect();
    console.log('> Playground Database connected (SQLite)');

    const nextminRouter = createNextMinRouter({
        dbAdapter,
        server,
        // @ts-ignore - Hidden API for custom schema dirs if needed, but here we use /schemas
        // schemasDir: PLAYGROUND_DIR,
        apiKey: 'playground_key'
    });

    // Mount NextMin REST under /rest
    // @ts-ignore - Avoid express type mismatch in monorepo
    app.use('/rest', nextminRouter);

    // --- Playground Schema Management API ---
    app.get('/api/playground/schemas', async (_req: Request, res: Response) => {
        try {
            const entries = await fs.readdir(PLAYGROUND_DIR, { withFileTypes: true });
            const files = entries
                .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.json'))
                .map((e) => e.name)
                .sort((a, b) => a.localeCompare(b));
            res.json({ files });
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/playground/schemas/:name', async (req: Request, res: Response) => {
        try {
            const safe = safeFileName(req.params.name);
            const content = await fs.readFile(path.join(PLAYGROUND_DIR, safe), 'utf8');
            res.json({ name: safe, content });
        } catch (e: any) {
            res.status(404).json({ error: e.message });
        }
    });

    app.put('/api/playground/schemas/:name', async (req: Request, res: Response) => {
        try {
            const safe = safeFileName(req.params.name);
            const body = req.body as { content?: string };
            if (typeof body.content !== 'string') return res.status(400).json({ error: 'Missing content' });

            let pretty = '';
            try {
                pretty = JSON.stringify(JSON.parse(body.content), null, 2) + '\n';
            } catch {
                return res.status(400).json({ error: 'Invalid JSON' });
            }

            await fs.writeFile(path.join(PLAYGROUND_DIR, safe), pretty, 'utf8');
            res.json({ ok: true, name: safe });
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    });

    app.post('/api/playground/schemas/:name/reset', async (req: Request, res: Response) => {
        try {
            const safe = safeFileName(req.params.name);
            const src = path.join(ORIGINALS_DIR, safe);
            const content = await fs.readFile(src, 'utf8');
            await fs.writeFile(path.join(PLAYGROUND_DIR, safe), content, 'utf8');
            res.json({ ok: true, name: safe });
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    });

    app.post('/api/playground/schemas/reset-all', async (_req: Request, res: Response) => {
        try {
            const entries = await fs.readdir(ORIGINALS_DIR, { withFileTypes: true });
            const files = entries.filter((e) => e.isFile() && e.name.endsWith('.json')).map((e) => e.name);
            for (const f of files) {
                const data = await fs.readFile(path.join(ORIGINALS_DIR, f), 'utf8');
                await fs.writeFile(path.join(PLAYGROUND_DIR, f), data, 'utf8');
            }
            res.json({ ok: true, restored: files });
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    });

    // --- Next.js Handlers ---
    app.all('*', (req: Request, res: Response) => handle(req, res));

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
        console.log(`> NextMin API on http://localhost:${port}/rest`);
    });
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
