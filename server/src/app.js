import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { isDatabaseConnected } from './config/db.js';
import { apiLimiter, writeLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import characterRoutes from './routes/characters.js';
import relationshipRoutes from './routes/relationships.js';
import loreEntryRoutes from './routes/loreEntries.js';
import statsRoutes from './routes/stats.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  cors({
    origin: config.allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
app.use(express.json({ limit: '50kb' }));
app.use(apiLimiter);

// Writes get a tighter limit than reads.
app.use((req, res, next) => (req.method === 'GET' ? next() : writeLimiter(req, res, next)));

app.get('/api/health', (req, res) => {
  res.json({
    data: {
      status: 'ok',
      database: isDatabaseConnected() ? 'connected' : 'disconnected',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api/characters', characterRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/lore-entries', loreEntryRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
