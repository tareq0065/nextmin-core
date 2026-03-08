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
    events,
    Events,
} from '@airoom/nextmin-node';
import cors from 'cors';
import http from 'http';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const envLocal = path.join(ROOT, '.env.local');

// Load .env.local first (Next.js style), then fallback to .env
if (require('fs').existsSync(envLocal)) {
    dotenv.config({ path: envLocal });
} else {
    dotenv.config();
}

console.log('> Environment:', require('fs').existsSync(envLocal) ? '.env.local' : '.env');

// Alias NEXT_PUBLIC_NEXTMIN_API_KEY to NEXTMIN_API_KEY for nextmin-node package
if (process.env.NEXT_PUBLIC_NEXTMIN_API_KEY) {
    process.env.NEXTMIN_API_KEY = process.env.NEXT_PUBLIC_NEXTMIN_API_KEY;
}

console.log('> API Key:', process.env.NEXTMIN_API_KEY ? 'Present' : 'Undefined');

const dev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT || 3006);

// --- File system helpers (Playground Specific) -------------------------------
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

// --- Data Seeding (Playground Specific) ---------------------------------------
async function seedInitialData(dbAdapter: any) {
    try {
        // Wait a tiny bit for repositories to be definitely ready
        await new Promise(resolve => setTimeout(resolve, 200));

        const postsCount = await dbAdapter.count('Posts', {});
        if (postsCount === 0) {
            await dbAdapter.create('Posts', {
                title: 'Welcome to NextMin!',
                name: 'Antigravity',
                description: 'This is your first post generated from a JSON schema. Tweak the model to see changes!'
            });
            console.log('> 🌱 Seeded initial Posts');
        }

        const commentsCount = await dbAdapter.count('Comments', {});
        if (commentsCount === 0) {
            await dbAdapter.create('Comments', {
                title: 'Amazing Tool!',
                comment: 'I love how fast I can prototype with NextMin. The real-time updates are magic!'
            });
            console.log('> 🌱 Seeded initial Comments');
        }
    } catch (err: any) {
        if (err.message?.includes('Repository for') && err.message?.includes('not found')) {
            // Expected if schemas are not yet hot-reloaded
            return;
        }
        console.error('> ❌ Seeding error:', err.message);
    }
}

async function start() {
    await ensureDirs();

    const app = express();
    const server = http.createServer(app);

    app.use(cors());
    app.use(express.json({ limit: '5mb' }));


    // 1) Init Next.js
    const nextApp = next({ dev, dir: ROOT });
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

    // Listen for events to trigger seeding
    events.on(Events.SERVER_START, () => {
        console.log('> 🚀 Server started event received, triggering seeding...');
        seedInitialData(dbAdapter);
    });

    events.on(Events.SCHEMA_UPDATE, () => {
        console.log('> ♻️ Schema update event received, triggering seeding...');
        seedInitialData(dbAdapter);
    });

    // Initial attempt (might fail if schemas not loaded yet)
    seedInitialData(dbAdapter);

    const nextminRouter = createNextMinRouter({
        dbAdapter,
        server,
        // @ts-ignore - Hidden API for custom schema dirs if needed, but here we use /schemas
        // schemasDir: PLAYGROUND_DIR,
    });

    // Mount NextMin REST under /rest
    // @ts-ignore - Avoid express type mismatch in monorepo
    app.use('/rest', nextminRouter);

    // --- Playground Schema Management API ---
    app.use('/api/playground', (req, res, next) => {
        const providedKey = req.headers['x-api-key'];
        const trustedKey = process.env.NEXT_PUBLIC_NEXTMIN_API_KEY || 'playground_key';
        if (providedKey !== trustedKey) {
            return res.status(401).json({ error: 'Unauthorized: Invalid Playground API Key' });
        }
        next();
    });

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
            // Allow time for hot-reload to register schema
            setTimeout(() => seedInitialData(dbAdapter), 500);
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
            // Allow time for hot-reload to register schemas
            setTimeout(() => seedInitialData(dbAdapter), 800);
            res.json({ ok: true, restored: files });
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    });

    // --- Next.js Handlers ---
    app.all('*', (req: Request, res: Response) => {
        return handle(req, res);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
        console.log(`> NextMin API on http://localhost:${port}/rest`);
    });
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
