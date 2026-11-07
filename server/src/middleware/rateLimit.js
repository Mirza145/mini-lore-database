import rateLimit from 'express-rate-limit';

// Broad protection for the whole API.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many requests. Please slow down and try again shortly.' } },
});

// Stricter limit for writes.
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many changes in a short time. Please wait a moment.' } },
});
