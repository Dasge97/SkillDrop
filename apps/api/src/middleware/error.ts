import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http.js';

// Middleware central de errores. Convierte HttpError y ZodError en respuestas JSON.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Datos no válidos',
      details: err.flatten(),
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details,
    });
  }
  // Errores de unicidad de Prisma, etc.
  const anyErr = err as { code?: string; message?: string };
  if (anyErr?.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con esos datos' });
  }
  console.error('[error]', err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}
