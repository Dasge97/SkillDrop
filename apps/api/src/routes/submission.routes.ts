import { Router } from 'express';
import { createSubmissionSchema, SubmissionStatus } from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../lib/http.js';
import { authenticate } from '../middleware/auth.js';
import { serializeSubmission } from '../lib/serialize.js';
import { toJson } from '../lib/json.js';
import { recalcUserProgress } from '../services/progress.service.js';

export const submissionRouter = Router();
submissionRouter.use(authenticate);

const submissionInclude = {
  challenge: true,
  user: true,
  evaluation: {
    include: { mentor: true, criteriaScores: { include: { criterion: true } } },
  },
};

// Actualiza la racha de estudio del usuario al entregar.
async function bumpStreak(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const now = new Date();
  const last = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
  let streak = user.streakDays;
  if (!last) {
    streak = 1;
  } else {
    const dayMs = 24 * 60 * 60 * 1000;
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startLast = new Date(last.getFullYear(), last.getMonth(), last.getDate());
    const diffDays = Math.round((startToday.getTime() - startLast.getTime()) / dayMs);
    if (diffDays === 0) {
      // mismo día, sin cambios
    } else if (diffDays === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  }
  await prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: now, streakDays: streak },
  });
}

// Crear una entrega (nueva versión).
submissionRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createSubmissionSchema.parse(req.body);
    const challenge = await prisma.challenge.findUnique({
      where: { id: data.challengeId },
    });
    if (!challenge) throw new HttpError(404, 'Reto no encontrado');

    const last = await prisma.submission.findFirst({
      where: { userId: req.user!.id, challengeId: data.challengeId },
      orderBy: { version: 'desc' },
    });
    const version = (last?.version ?? 0) + 1;

    const submission = await prisma.submission.create({
      data: {
        userId: req.user!.id,
        challengeId: data.challengeId,
        figmaUrl: data.figmaUrl || null,
        screenshots: toJson(data.screenshots ?? []),
        notes: data.notes ?? '',
        version,
        status: data.submit ? SubmissionStatus.SUBMITTED : SubmissionStatus.DRAFT,
      },
      include: submissionInclude,
    });

    if (data.submit) await bumpStreak(req.user!.id);
    await recalcUserProgress(req.user!.id);

    res.status(201).json(serializeSubmission(submission));
  }),
);

// Listar entregas del usuario (opcionalmente por reto).
submissionRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const challengeId =
      typeof req.query.challengeId === 'string' ? req.query.challengeId : undefined;
    const submissions = await prisma.submission.findMany({
      where: { userId: req.user!.id, ...(challengeId ? { challengeId } : {}) },
      orderBy: [{ createdAt: 'desc' }],
      include: submissionInclude,
    });
    res.json(submissions.map(serializeSubmission));
  }),
);

// Detalle de una entrega (dueño o mentor).
submissionRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: submissionInclude,
    });
    if (!submission) throw new HttpError(404, 'Entrega no encontrada');
    const isOwner = submission.userId === req.user!.id;
    const isMentor = req.user!.role === 'MENTOR' || req.user!.role === 'ADMIN';
    if (!isOwner && !isMentor) throw new HttpError(403, 'Sin acceso');
    res.json(serializeSubmission(submission));
  }),
);
