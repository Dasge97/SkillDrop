import { EstimatedLevel, type CreateEvaluationInput } from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../lib/http.js';
import { parseArray, parseObject } from '../lib/json.js';
import { recordEvaluation } from './evaluation.service.js';
import { evaluateWithAI } from './ai-eval.service.js';

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sb = new Set(b);
  return a.every((x) => sb.has(x));
}

// Corrige un reto tipo quiz de forma determinista (sin IA).
async function gradeQuiz(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      challenge: { include: { rubric: { include: { criteria: { orderBy: { order: 'asc' } } } } } },
      evaluation: true,
    },
  });
  if (!submission) throw new HttpError(404, 'Entrega no encontrada');
  if (submission.evaluation) throw new HttpError(409, 'Esta entrega ya ha sido evaluada');

  const cfg: any = parseObject(submission.challenge.conceptConfig);
  const correctIds: string[] = (cfg.quiz?.correctIds ?? []).map(String);
  const selected = parseArray(submission.answer);
  const correct = sameSet(selected, correctIds);
  const explanation: string = cfg.quiz?.explanation ?? '';

  const criteria = submission.challenge.rubric?.criteria ?? [];
  if (criteria.length === 0) throw new HttpError(400, 'El reto no tiene rúbrica');
  const score = correct ? 10 : 3;

  const input: CreateEvaluationInput = {
    criteria: criteria.map((c) => ({
      criterionId: c.id,
      score,
      comment: correct ? 'Respuesta correcta.' : 'Respuesta incorrecta.',
    })),
    mentorFeedback:
      (correct ? '¡Correcto! ' : 'No es la respuesta correcta. ') + explanation,
    requiredImprovements: correct ? [] : ['Repasa el concepto y vuelve a intentarlo.'],
    optionalImprovements: [],
    estimatedLevel: EstimatedLevel.JUNIOR,
  };
  return recordEvaluation(submissionId, null, input);
}

// Punto de entrada único: corrige automáticamente una entrega.
// - CONCEPT + quiz  -> corrección determinista.
// - resto (short/code/PROJECT) -> evaluación con IA (OpenAI).
export async function autoEvaluateSubmission(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { challenge: true },
  });
  if (!submission) throw new HttpError(404, 'Entrega no encontrada');

  const ch = submission.challenge;
  if (ch.kind === 'CONCEPT') {
    const cfg: any = parseObject(ch.conceptConfig);
    if (cfg.kind === 'quiz') return gradeQuiz(submissionId);
  }
  return evaluateWithAI(submissionId);
}
