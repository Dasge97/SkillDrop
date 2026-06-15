import { Router } from 'express';
import { createEvaluationSchema, SubmissionStatus } from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../lib/http.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { serializeSubmission } from '../lib/serialize.js';
import { recordEvaluation } from '../services/evaluation.service.js';

export const mentorRouter = Router();
mentorRouter.use(authenticate, requireRole('MENTOR', 'ADMIN'));

// Cola de entregas pendientes de revisión.
mentorRouter.get(
  '/queue',
  asyncHandler(async (_req, res) => {
    const submissions = await prisma.submission.findMany({
      where: {
        status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.IN_REVIEW] },
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
        challenge: true,
        evaluation: {
          include: { mentor: true, criteriaScores: { include: { criterion: true } } },
        },
      },
    });
    res.json(submissions.map(serializeSubmission));
  }),
);

// Registrar la evaluación (mentor humano) de una entrega.
mentorRouter.post(
  '/submissions/:id/evaluation',
  asyncHandler(async (req, res) => {
    const data = createEvaluationSchema.parse(req.body);
    const result = await recordEvaluation(req.params.id, req.user!.id, data);
    res.status(201).json(result);
  }),
);
