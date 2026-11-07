import app from './app.js';
import { config } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { seedIfEmpty } from './seed.js';

const host = process.env.HOST || '127.0.0.1';

async function start() {
  await connectDatabase();

  if (config.autoSeed) {
    const counts = await seedIfEmpty();
    if (counts) {
      console.log(
        `[seed] Sample universe loaded: ${counts.characters} characters, ${counts.relationships} relationships, ${counts.loreEntries} lore entries.`,
      );
    }
  }

  const server = app.listen(config.port, host, () => {
    console.log(`[api] Mini Lore Database API listening on http://${host}:${config.port}`);
  });

  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n[api] ${signal} received, shutting down.`);
    server.close();
    await disconnectDatabase();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  console.error('[api] Failed to start:', error);
  process.exit(1);
});
