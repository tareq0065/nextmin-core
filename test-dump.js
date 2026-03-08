const { NMAdapter } = require('@airoom/nextmin-node');
const path = require('path');
const adapter = new NMAdapter({ type: 'sqlite', database: 'playground.sqlite' });

async function run() {
    try {
        await adapter.connect();
        await adapter.registerSchemas(path.join(__dirname, 'schemas'));
        console.log("Success! No error.");
    } catch(err) {
        console.error("Caught error:", err);
    }
}
run();
