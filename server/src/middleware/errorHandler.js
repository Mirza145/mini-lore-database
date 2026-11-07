import { ApiError } from '../utils/ApiError.js';

export function asyncHandler(handler) {
  return function wrapped(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function notFound(req, res) {
  res.status(404).json({
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  let status = err.status || 500;
  let message = err.message || 'Something went wrong.';
  let details = err.details;

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed.';
    details = Object.values(err.errors).map((validationError) => validationError.message);
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for "${err.path}".`;
  } else if (err.code === 11000) {
    status = 409;
    message = 'That record already exists.';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body must be valid JSON.';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body is too large.';
  }

  if (status >= 500) {
    console.error('[error]', err);
    message = 'Something went wrong on the server.';
    details = undefined;
  }

  res.status(status).json({
    error: {
      message,
      ...(details ? { details } : {}),
    },
  });
}

export function validateObjectId(paramName = 'id') {
  return function validateId(req, res, next) {
    const value = req.params[paramName];
    if (!value || !/^[a-fA-F0-9]{24}$/.test(value)) {
      return next(new ApiError(400, `Invalid ${paramName}: expected a 24-character MongoDB id.`));
    }
    next();
  };
}
