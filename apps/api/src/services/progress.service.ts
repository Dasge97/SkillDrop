import {
  APPROVE_SUBMISSION_MIN,
  CRITICAL_MIN,
  EvaluationStatus,
  PASS_THRESHOLD,
  PhaseProgressStatus,
  SubmissionStatus,
} from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { asStringArray } from '../lib/serialize.js';
import { toJson } from '../lib/json.js';

export interface PhaseComputed {
  status: PhaseProgressStatus;
  progressPercent: number;
  averageScore: number | null;
}

// Mapea el estado de una evaluación al estado de la entrega.
export function submissionStatusFromEvaluation(
  evalStatus: EvaluationStatus,
): SubmissionStatus {
  switch (evalStatus) {
    case EvaluationStatus.APROBADO:
      return SubmissionStatus.APPROVED;
    case EvaluationStatus.REQUIERE_MEJORAS:
      return SubmissionStatus.NEEDS_WORK;
    case EvaluationStatus.REHACER:
      return SubmissionStatus.REDO;
  }
}

// Deriva el estado de una evaluación a partir de la nota media (sección 8).
export function evaluationStatusFromScore(
  avg: number,
  criticalOk: boolean,
): EvaluationStatus {
  if (!criticalOk || avg < 5) return EvaluationStatus.REHACER;
  if (avg < APPROVE_SUBMISSION_MIN) return EvaluationStatus.REQUIERE_MEJORAS;
  return EvaluationStatus.APROBADO;
}

function levelFromScore(avg: number | null): number {
  if (avg == null) return 0;
  if (avg >= 9) return 5;
  if (avg >= 8) return 4;
  if (avg >= 7) return 3;
  if (avg >= 5) return 2;
  return 1;
}

// Para cada reto de la fase, busca la mejor entrega APROBADA (mayor nota).
async function getApprovedEvaluationsForChallenges(
  userId: string,
  challengeIds: string[],
) {
  if (challengeIds.length === 0) return new Map<string, any>();
  const subs = await prisma.submission.findMany({
    where: {
      userId,
      challengeId: { in: challengeIds },
      status: SubmissionStatus.APPROVED,
    },
    include: {
      evaluation: { include: { criteriaScores: { include: { criterion: true } } } },
    },
  });
  const best = new Map<string, any>();
  for (const s of subs) {
    if (!s.evaluation) continue;
    const prev = best.get(s.challengeId);
    if (!prev || s.evaluation.totalScore > prev.evaluation.totalScore) {
      best.set(s.challengeId, s);
    }
  }
  return best;
}

// ¿Hay alguna entrega pendiente de revisión en estos retos?
async function hasInReview(userId: string, challengeIds: string[]) {
  if (challengeIds.length === 0) return false;
  const count = await prisma.submission.count({
    where: {
      userId,
      challengeId: { in: challengeIds },
      status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.IN_REVIEW] },
    },
  });
  return count > 0;
}

// ¿Hay alguna entrega (de cualquier estado) en estos retos?
async function hasAnySubmission(userId: string, challengeIds: string[]) {
  if (challengeIds.length === 0) return false;
  const count = await prisma.submission.count({
    where: { userId, challengeId: { in: challengeIds } },
  });
  return count > 0;
}

interface PhaseStats {
  total: number;
  approvedCount: number;
  average: number | null;
  criticalOk: boolean;
  completed: boolean;
}

async function computePhaseStats(
  userId: string,
  phase: any,
): Promise<PhaseStats> {
  const challenges = (phase.lessons ?? [])
    .map((l: any) => l.challenge)
    .filter(Boolean);
  const challengeIds = challenges.map((c: any) => c.id);
  const total = challengeIds.length;

  const best = await getApprovedEvaluationsForChallenges(userId, challengeIds);
  const approvedCount = best.size;

  const scores: number[] = [];
  let criticalOk = true;
  for (const s of best.values()) {
    scores.push(s.evaluation.totalScore);
    for (const cs of s.evaluation.criteriaScores) {
      if (cs.criterion?.isCritical && cs.score < CRITICAL_MIN) criticalOk = false;
    }
  }
  const average =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  const completed =
    total > 0 &&
    approvedCount === total &&
    average != null &&
    average >= (phase.requiredScore ?? PASS_THRESHOLD) &&
    criticalOk;

  return { total, approvedCount, average, criticalOk, completed };
}

// Recalcula el estado de las fases de UN curso para el usuario y guarda
// UserPhaseProgress. La cadena de desbloqueo es independiente por curso.
// Devuelve un mapa phaseId -> PhaseComputed para usar al serializar.
export async function recalcUserProgress(
  userId: string,
  courseId: string,
): Promise<Map<string, PhaseComputed>> {
  const phases = await prisma.phase.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: { lessons: { include: { challenge: true } } },
  });

  const computed = new Map<string, PhaseComputed>();
  let prevCompleted = true; // la primera fase siempre está disponible

  for (const phase of phases) {
    const stats = await computePhaseStats(userId, phase);
    const challengeIds = (phase.lessons ?? [])
      .map((l: any) => l.challenge?.id)
      .filter(Boolean);

    let status: PhaseProgressStatus;
    if (stats.completed) {
      status = PhaseProgressStatus.COMPLETED;
    } else if (!prevCompleted) {
      status = PhaseProgressStatus.LOCKED;
    } else if (await hasInReview(userId, challengeIds)) {
      status = PhaseProgressStatus.IN_REVIEW;
    } else if (await hasAnySubmission(userId, challengeIds)) {
      status = PhaseProgressStatus.IN_PROGRESS;
    } else {
      status = PhaseProgressStatus.AVAILABLE;
    }

    const progressPercent =
      stats.total > 0
        ? Math.round((stats.approvedCount / stats.total) * 100)
        : status === PhaseProgressStatus.COMPLETED
          ? 100
          : 0;

    computed.set(phase.id, {
      status,
      progressPercent,
      averageScore:
        stats.average != null ? Math.round(stats.average * 10) / 10 : null,
    });

    await prisma.userPhaseProgress.upsert({
      where: { userId_phaseId: { userId, phaseId: phase.id } },
      create: { userId, phaseId: phase.id, status },
      update: { status },
    });

    prevCompleted = stats.completed;
  }

  return computed;
}

// Calcula la fase/lección "actual" de un curso para el usuario: la primera fase
// disponible/en progreso/en revisión y, dentro, la primera lección con reto sin
// aprobar. No escribe en BD (es de solo lectura).
export async function getCurrentForCourse(
  userId: string,
  courseId: string,
): Promise<{ currentPhaseId: string | null; currentLessonId: string | null }> {
  const phases = await prisma.phase.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: { lessons: { orderBy: { order: 'asc' }, include: { challenge: true } } },
  });
  const computed = await recalcUserProgress(userId, courseId);

  for (const phase of phases) {
    const c = computed.get(phase.id);
    if (!c) continue;
    if (
      c.status === PhaseProgressStatus.AVAILABLE ||
      c.status === PhaseProgressStatus.IN_PROGRESS ||
      c.status === PhaseProgressStatus.IN_REVIEW
    ) {
      const challengeIds = (phase.lessons ?? [])
        .map((l: any) => l.challenge?.id)
        .filter(Boolean);
      const best = await getApprovedEvaluationsForChallenges(userId, challengeIds);
      const lessons = (phase.lessons ?? []).slice().sort((a: any, b: any) => a.order - b.order);
      const pending = lessons.find((l: any) => !l.challenge || !best.has(l.challenge.id));
      return { currentPhaseId: phase.id, currentLessonId: (pending ?? lessons[0])?.id ?? null };
    }
  }
  // Todo completado: apuntamos a la última fase.
  if (phases.length > 0) {
    const last = phases[phases.length - 1];
    const lessons = (last.lessons ?? []).slice().sort((a: any, b: any) => a.order - b.order);
    return { currentPhaseId: last.id, currentLessonId: lessons[0]?.id ?? null };
  }
  return { currentPhaseId: null, currentLessonId: null };
}

// Devuelve el courseId al que pertenece un reto (challenge -> lesson -> phase).
export async function courseIdForChallenge(challengeId: string): Promise<string | null> {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { lesson: { include: { phase: true } } },
  });
  return challenge?.lesson.phase.courseId ?? null;
}

// Porcentaje de progreso de un curso = media de los porcentajes de sus fases.
export function courseProgressPercent(computed: Map<string, PhaseComputed>): number {
  const vals = [...computed.values()].map((c) => c.progressPercent);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

// Actualiza progreso de habilidades y XP tras una evaluación.
export async function applyEvaluationEffects(
  userId: string,
  challengeId: string,
) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  });
  if (!challenge) return;
  const skillSlugs = asStringArray(challenge.skills);
  if (skillSlugs.length === 0) return;

  const skills = await prisma.skill.findMany({
    where: { slug: { in: skillSlugs } },
  });

  for (const skill of skills) {
    // Retos que entrenan esta skill y han sido aprobados por el usuario.
    const approvedSubs = await prisma.submission.findMany({
      where: { userId, status: SubmissionStatus.APPROVED },
      include: { evaluation: true, challenge: true },
    });
    const relevant = approvedSubs.filter((s) =>
      asStringArray(s.challenge.skills).includes(skill.slug),
    );
    // Mejor nota por reto
    const bestByChallenge = new Map<string, number>();
    const evidence: string[] = [];
    for (const s of relevant) {
      if (!s.evaluation) continue;
      const prev = bestByChallenge.get(s.challengeId) ?? -1;
      if (s.evaluation.totalScore > prev) {
        bestByChallenge.set(s.challengeId, s.evaluation.totalScore);
      }
      if (s.figmaUrl) evidence.push(s.figmaUrl);
    }
    const scores = [...bestByChallenge.values()];
    const avg =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

    await prisma.userSkillProgress.upsert({
      where: { userId_skillId: { userId, skillId: skill.id } },
      create: {
        userId,
        skillId: skill.id,
        level: levelFromScore(avg),
        averageScore: avg,
        completedExercises: bestByChallenge.size,
        evidence: toJson(evidence.slice(0, 10)),
      },
      update: {
        level: levelFromScore(avg),
        averageScore: avg,
        completedExercises: bestByChallenge.size,
        evidence: toJson(evidence.slice(0, 10)),
      },
    });
  }
}

// Recalcula y devuelve el total de XP del usuario (10 XP por punto de la mejor
// nota de cada reto aprobado).
export async function recalcXp(userId: string) {
  const approved = await prisma.submission.findMany({
    where: { userId, status: SubmissionStatus.APPROVED },
    include: { evaluation: true },
  });
  const bestByChallenge = new Map<string, number>();
  for (const s of approved) {
    if (!s.evaluation) continue;
    const prev = bestByChallenge.get(s.challengeId) ?? -1;
    if (s.evaluation.totalScore > prev) {
      bestByChallenge.set(s.challengeId, s.evaluation.totalScore);
    }
  }
  const totalXp = [...bestByChallenge.values()].reduce(
    (acc, score) => acc + Math.round(score * 10),
    0,
  );
  await prisma.user.update({ where: { id: userId }, data: { totalXp } });
  return totalXp;
}
