import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../lib/http.js';
import { authenticate } from '../middleware/auth.js';
import { serializeResource } from '../lib/serialize.js';

export const resourceRouter = Router();
resourceRouter.use(authenticate);

// Biblioteca de recursos (sección 11 / pantalla 11).
resourceRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const category =
      typeof req.query.category === 'string' ? req.query.category : undefined;
    const resources = await prisma.resource.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
    res.json(resources.map(serializeResource));
  }),
);
