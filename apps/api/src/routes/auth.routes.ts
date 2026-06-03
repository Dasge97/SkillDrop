import { Router } from 'express';
import { loginSchema, registerSchema } from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { hashPassword, signToken, verifyPassword } from '../lib/auth.js';
import { asyncHandler, HttpError } from '../lib/http.js';
import { authenticate } from '../middleware/auth.js';
import { serializeUser } from '../lib/serialize.js';
import { toJson } from '../lib/json.js';
import { recalcUserProgress } from '../services/progress.service.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) throw new HttpError(409, 'Ya existe una cuenta con ese email');

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: await hashPassword(data.password),
        role: 'STUDENT',
        preferences: toJson({ theme: 'system' }),
      },
    });

    // Inicializa el progreso del usuario (desbloquea la primera fase).
    await recalcUserProgress(user.id);
    const fresh = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });

    const token = signToken({ sub: user.id, role: user.role });
    res.status(201).json({ token, user: serializeUser(fresh) });
  }),
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      throw new HttpError(401, 'Email o contraseña incorrectos');
    }
    const token = signToken({ sub: user.id, role: user.role });
    res.json({ token, user: serializeUser(user) });
  }),
);

authRouter.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new HttpError(404, 'Usuario no encontrado');
    res.json(serializeUser(user));
  }),
);
