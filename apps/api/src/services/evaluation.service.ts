import { CRITICAL_MIN, type CreateEvaluationInput } from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../lib/http.js';
import { toJson } from '../lib/json.js';
import { serializeSubmission } from '../lib/serialize.js';
import {
  applyEvaluationEffects,
  courseIdForChallenge,
  evaluationStatusFromScore,
  recalcUserProgress,
  recalcXp,
  submissionStatusFromEvaluation,
} from './progress.service.js';

const fullInclude = {
  user: true,
  challenge: true,
  evaluation: {
    include: { mentor: true, criteriaScores: { include: { criterion: true } } },
  },
};

// Registra una evaluación (de un mentor humano o de la IA) sobre una entrega:
// calcula la nota ponderada, el estado, persiste y recalcula progreso/skills/XP.
// `mentorId` es null cuando la evaluación la genera la IA.
export async function recordEvaluation(
  submissionId: string,
  mentorId: string | null,
  input: CreateEvaluationInput,
) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
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

  for (const item of input.criteria) {
    if (!criterionById.has(item.criterionId)) {
      throw new HttpError(400, `Criterio inválido: ${item.criterionId}`);
    }
  }

  // Nota total = media ponderada por peso.
  let weightedSum = 0;
  let weightTotal = 0;
  let criticalOk = true;
  for (const item of input.criteria) {
    const crit = criterionById.get(item.criterionId)!;
    weightedSum += item.score * crit.weight;
    weightTotal += crit.weight;
    if (crit.isCritical && item.score < CRITICAL_MIN) criticalOk = false;
  }
  const avg = weightTotal > 0 ? weightedSum / weightTotal : 0;
  const totalScore = Math.round(avg * 10) / 10;

  const status = input.status ?? evaluationStatusFromScore(avg, criticalOk);
  const submissionStatus = submissionStatusFromEvaluation(status);

  const evaluation = await prisma.evaluation.create({
    data: {
      submissionId: submission.id,
      mentorId,
      totalScore,
      mentorFeedback: input.mentorFeedback,
      requiredImprovements: toJson(input.requiredImprovements ?? []),
      optionalImprovements: toJson(input.optionalImprovements ?? []),
      status,
      estimatedLevel: input.estimatedLevel,
      criteriaScores: {
        create: input.criteria.map((c) => ({
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

  // Efectos: skills, XP y recálculo del bloqueo (del curso) para el alumno.
  await applyEvaluationEffects(submission.userId, submission.challengeId);
  await recalcXp(submission.userId);
  const courseId = await courseIdForChallenge(submission.challengeId);
  if (courseId) await recalcUserProgress(submission.userId, courseId);

  const full = await prisma.submission.findUnique({
    where: { id: submission.id },
    include: fullInclude,
  });
  return { evaluationId: evaluation.id, submission: serializeSubmission(full) };
}
