import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

let memoryServer = null;

async function startMemoryServer() {
  const sharedOptions = {};

  if (config.memoryDbPersist) {
    const dbPath = path.resolve(serverRoot, config.memoryDbDir);
    fs.mkdirSync(dbPath, { recursive: true });
    try {
      const server = await MongoMemoryServer.create({
        instance: { dbPath, storageEngine: 'wiredTiger' },
      });
      console.log(`[db] In-memory MongoDB started with persistent storage at ${dbPath}`);
      return server;
    } catch (error) {
      console.warn(`[db] Could not start persistent in-memory MongoDB (${error.message}). Falling back to ephemeral storage.`);
    }
  }

  const server = await MongoMemoryServer.create(sharedOptions);
  console.log('[db] In-memory MongoDB started (data resets when the server stops)');
  return server;
}

export async function connectDatabase() {
  let uri = config.mongoUri;

  if (config.useMemoryDb) {
    memoryServer = await startMemoryServer();
    uri = memoryServer.getUri('mini-lore-database');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`[db] Connected to database "${mongoose.connection.name}"`);
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
