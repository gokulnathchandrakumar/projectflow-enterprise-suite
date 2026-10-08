import { sendError } from '../utils/response.js';

export const notFoundHandler = (req, res) => {
  return sendError(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  // Prisma Unique Constraint Violation
  if (err.code === 'P2002') {
    const target = err.meta?.target ? ` (${err.meta.target})` : '';
    return sendError(res, `A record with this value already exists${target}.`, 409);
  }

  // Prisma Record Not Found
  if (err.code === 'P2025') {
    return sendError(res, 'The requested resource was not found.', 404);
  }

  // Syntax Error (e.g. malformed JSON in request body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'Malformed JSON in request body.', 400);
  }

  const message = process.env.NODE_ENV === 'production'
    ? 'An internal server error occurred.'
    : (err.message || 'An internal server error occurred.');

  return sendError(res, message, err.statusCode || 500);
};
