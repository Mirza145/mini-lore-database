import 'dotenv/config';

const parseBool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini-lore-database',
  // The memory database is a real MongoDB instance started by mongodb-memory-server,
  // so no local installation is required for development.
  useMemoryDb: parseBool(process.env.USE_MEMORY_DB, process.env.NODE_ENV !== 'production'),
  memoryDbPersist: parseBool(process.env.MEMORY_DB_PERSIST, true),
  memoryDbDir: process.env.MEMORY_DB_DIR || '.mongo-data',
  autoSeed: parseBool(process.env.AUTO_SEED, true),
  allowedOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
