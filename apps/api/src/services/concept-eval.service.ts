import { EstimatedLevel, type CreateEvaluationInput } from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../lib/http.js';
import { parseArray, parseObject } from '../lib/json.js';
import { recordEvaluation } from './evaluation.service.js';
import { evaluateWithAI } from './ai-eval.service.js';
import { gradeAgainstSolution } from './code-grader.service.js';

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

// Muestra hasta 15 líneas de una salida, numeradas, para el feedback.
function showLines(lines: string[]): string {
  if (lines.length === 0) return '(no imprime nada)';
  const shown = lines.slice(0, 15).map((l) => `  ${l}`);
  if (lines.length > 15) shown.push(`  … (${lines.length - 15} líneas más)`);
  return shown.join('\n');
}

// Corrige un reto de código ejecutando el código del alumno y la solución en
// QuickJS y comparando lo que imprimen. Devuelve null si el reto no se puede
// corregir así (la solución falla o su salida no es siempre la misma).
async function gradeCode(submissionId: string) {
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
  if (!cfg.solution) return null;
  const grade = await gradeAgainstSolution(submission.code ?? '', String(cfg.solution));
  if (!grade.gradable) return null;

  const criteria = submission.challenge.rubric?.criteria ?? [];
  if (criteria.length === 0) throw new HttpError(400, 'El reto no tiene rúbrica');
  const score = grade.correct ? 10 : 3;

  let feedback: string;
  const required: string[] = [];
  if (grade.correct) {
    feedback = '¡Correcto! Tu código imprime exactamente lo esperado.';
  } else {
    const parts: string[] = ['Tu código no imprime lo esperado.'];
    if (grade.error) parts.push(`Al ejecutarlo da este error:\n  ${grade.error}`);
    parts.push(`Se esperaba:\n${showLines(grade.expected)}`);
    parts.push(`Tu código imprime:\n${showLines(grade.got)}`);
    const firstDiff = grade.expected.findIndex((l, i) => grade.got[i] !== l);
    if (firstDiff >= 0) {
      parts.push(
        `La primera diferencia está en la línea ${firstDiff + 1}: se esperaba "${grade.expected[firstDiff]}" ` +
          `y sale "${grade.got[firstDiff] ?? '(nada)'}".`,
      );
    } else if (grade.got.length > grade.expected.length) {
      parts.push('Imprimes líneas de más al final.');
    }
    feedback = parts.join('\n\n');
    required.push('Ejecuta tu código con el botón de ejecutar, compara la salida con la esperada y vuelve a enviarlo.');
    if (grade.error) required.unshift('Corrige el error que sale al ejecutar.');
  }

  const input: CreateEvaluationInput = {
    criteria: criteria.map((c) => ({
      criterionId: c.id,
      score,
      comment: grade.correct ? 'La salida coincide con la esperada.' : 'La salida no coincide con la esperada.',
    })),
    mentorFeedback: feedback,
    requiredImprovements: required,
    optionalImprovements: [],
    estimatedLevel: EstimatedLevel.JUNIOR,
  };
  return recordEvaluation(submissionId, null, input);
}

// Punto de entrada único: corrige automáticamente una entrega.
// - CONCEPT + quiz  -> corrección determinista.
// - CONCEPT + code con runner 'js' -> se ejecuta y se compara con la solución
//   (si no se puede, pasa a la IA).
// - resto (short/code sin ejecutar/PROJECT) -> evaluación con IA (OpenAI).
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
    if (cfg.kind === 'code' && cfg.runner === 'js') {
      const graded = await gradeCode(submissionId);
      if (graded) return graded;
    }
  }
  return evaluateWithAI(submissionId);
}
