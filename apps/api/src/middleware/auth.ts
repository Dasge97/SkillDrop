import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@skilldrop/shared';
import { verifyToken } from '../lib/auth.js';
import { HttpError } from '../lib/http.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

// Verifica el JWT del header Authorization y adjunta req.user.
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(401, 'No autenticado');
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role as Role };
    next();
  } catch {
    throw new HttpError(401, 'Token inválido o caducado');
  }
}

// Restringe el acceso a determinados roles.
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new HttpError(401, 'No autenticado');
    if (!roles.includes(req.user.role)) {
      throw new HttpError(403, 'No tienes permisos para esta acción');
    }
    next();
  };
}
