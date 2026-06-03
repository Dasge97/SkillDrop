import { Router } from 'express';
import {
  CRITICAL_MIN,
  createEvaluationSchema,
  SubmissionStatus,
} from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../lib/http.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { serializeSubmission } from '../lib/serialize.js';
import { toJson } from '../lib/json.js';
import {
  applyEvaluationEffects,
  evaluationStatusFromScore,
  recalcUserProgress,
  recalcXp,
  submissionStatusFromEvaluation,
} from '../services/progress.service.js';

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

// Crear/registrar la evaluación de una entrega.
mentorRouter.post(
  '/submissions/:id/evaluation',
  asyncHandler(async (req, res) => {
    const data = createEvaluationSchema.parse(req.body);
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: {
        challenge: { include: { rubric: { include: { criteria: true } } } },
        evaluation: true,
      },
    });
    if (!submission) throw new HttpError(404, 'Entrega no encontrada');
    if (submission.evaluation) {
      throw new HttpError(409, 'Esta entrega ya ha sido evaluada');
    }

    const criteria = submission.challenge.rubric?.criteria ?? [];
    const criterionById = new Map(criteria.map((c) => [c.id, c]));

    // Valida que los criterios puntuados pertenezcan a la rúbrica del reto.
    for (const item of data.criteria) {
      if (!criterionById.has(item.criterionId)) {
        throw new HttpError(400, `Criterio inválido: ${item.criterionId}`);
      }
    }

    // Nota total = media ponderada por peso.
    let weightedSum = 0;
    let weightTotal = 0;
    let criticalOk = true;
    for (const item of data.criteria) {
      const crit = criterionById.get(item.criterionId)!;
      weightedSum += item.score * crit.weight;
      weightTotal += crit.weight;
      if (crit.isCritical && item.score < CRITICAL_MIN) criticalOk = false;
    }
    const avg = weightTotal > 0 ? weightedSum / weightTotal : 0;
    const totalScore = Math.round(avg * 10) / 10;

    const status = data.status ?? evaluationStatusFromScore(avg, criticalOk);
    const submissionStatus = submissionStatusFromEvaluation(status);

    const evaluation = await prisma.evaluation.create({
      data: {
        submissionId: submission.id,
        mentorId: req.user!.id,
        totalScore,
        mentorFeedback: data.mentorFeedback,
        requiredImprovements: toJson(data.requiredImprovements ?? []),
        optionalImprovements: toJson(data.optionalImprovements ?? []),
        status,
        estimatedLevel: data.estimatedLevel,
        criteriaScores: {
          create: data.criteria.map((c) => ({
            criterionId: c.criterionId,
            score: c.score,
            comment: c.comment ?? '',
          })),
        },
      },
    });

    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: submissionStatus },
    });

    // Efectos: skills, XP y recálculo del bloqueo de fases para el alumno.
    await applyEvaluationEffects(submission.userId, submission.challengeId);
    await recalcXp(submission.userId);
    await recalcUserProgress(submission.userId);

    const full = await prisma.submission.findUnique({
      where: { id: submission.id },
      include: {
        user: true,
        challenge: true,
        evaluation: {
          include: { mentor: true, criteriaScores: { include: { criterion: true } } },
        },
      },
    });
    res.status(201).json({
      evaluationId: evaluation.id,
      submission: serializeSubmission(full),
    });
  }),
);
