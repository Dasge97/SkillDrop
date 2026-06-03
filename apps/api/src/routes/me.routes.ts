import { Router } from 'express';
import { SubmissionStatus, updatePreferencesSchema } from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../lib/http.js';
import { authenticate } from '../middleware/auth.js';
import {
  serializeEvaluation,
  serializeSkillProgress,
  serializeUser,
} from '../lib/serialize.js';
import { parseObject, toJson } from '../lib/json.js';
import { recalcUserProgress } from '../services/progress.service.js';

export const meRouter = Router();
meRouter.use(authenticate);

// Progreso por habilidades (todas las skills + progreso del usuario).
meRouter.get(
  '/skills',
  asyncHandler(async (req, res) => {
    const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
    const progress = await prisma.userSkillProgress.findMany({
      where: { userId: req.user!.id },
      include: { skill: true },
    });
    const bySkill = new Map(progress.map((p) => [p.skillId, p]));
    res.json(
      skills.map((skill) => {
        const p = bySkill.get(skill.id);
        return p
          ? serializeSkillProgress(p)
          : {
              skillId: skill.id,
              slug: skill.slug,
              name: skill.name,
              category: skill.category,
              level: 0,
              averageScore: null,
              completedExercises: 0,
              evidence: [],
            };
      }),
    );
  }),
);

// Actualizar preferencias (tema, etc.).
meRouter.patch(
  '/preferences',
  asyncHandler(async (req, res) => {
    const data = updatePreferencesSchema.parse(req.body);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.id },
    });
    const prefs = { ...parseObject(user.preferences), ...data };
    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: { preferences: toJson(prefs) },
    });
    res.json(serializeUser(updated));
  }),
);

// Dashboard del alumno (sección 6.1 del spec).
meRouter.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const computed = await recalcUserProgress(userId);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const course = await prisma.course.findFirst({
      orderBy: { createdAt: 'asc' },
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' }, include: { challenge: true } } },
        },
      },
    });
    if (!course) throw new HttpError(404, 'No hay cursos cargados');

    // Progreso global = media de los porcentajes de fase.
    const percents = course.phases.map((p) => computed.get(p.id)?.progressPercent ?? 0);
    const progressPercent =
      percents.length > 0
        ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)
        : 0;

    // Nota media global (mejor evaluación por reto aprobado).
    const approved = await prisma.submission.findMany({
      where: { userId, status: SubmissionStatus.APPROVED },
      include: { evaluation: true },
    });
    const bestByChallenge = new Map<string, number>();
    for (const s of approved) {
      if (!s.evaluation) continue;
      const prev = bestByChallenge.get(s.challengeId) ?? -1;
      if (s.evaluation.totalScore > prev)
        bestByChallenge.set(s.challengeId, s.evaluation.totalScore);
    }
    const scores = [...bestByChallenge.values()];
    const averageScore =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : null;

    // Fase y lección actuales.
    const currentPhase = course.phases.find((p) => p.id === user.currentPhaseId) ?? null;
    let currentLesson: any = null;
    for (const p of course.phases) {
      const l = p.lessons.find((ls) => ls.id === user.currentLessonId);
      if (l) {
        currentLesson = l;
        break;
      }
    }

    // Próximo reto: el de la lección actual (si no está aprobado).
    let nextChallenge: { id: string; title: string; lessonId: string } | null = null;
    if (currentLesson?.challenge) {
      const done = bestByChallenge.has(currentLesson.challenge.id);
      if (!done) {
        nextChallenge = {
          id: currentLesson.challenge.id,
          title: currentLesson.challenge.title,
          lessonId: currentLesson.id,
        };
      }
    }
    if (!nextChallenge && currentPhase) {
      for (const l of currentPhase.lessons) {
        if (l.challenge && !bestByChallenge.has(l.challenge.id)) {
          nextChallenge = { id: l.challenge.id, title: l.challenge.title, lessonId: l.id };
          break;
        }
      }
    }

    // Última evaluación recibida.
    const lastEvalSub = await prisma.submission.findFirst({
      where: { userId, evaluation: { isNot: null } },
      orderBy: { updatedAt: 'desc' },
      include: {
        evaluation: {
          include: { mentor: true, criteriaScores: { include: { criterion: true } } },
        },
      },
    });

    // Skills para fortalezas/debilidades.
    const skillProgress = await prisma.userSkillProgress.findMany({
      where: { userId, averageScore: { not: null } },
      include: { skill: true },
      orderBy: { averageScore: 'desc' },
    });
    const unlockedSkillsCount = await prisma.userSkillProgress.count({
      where: { userId, level: { gte: 1 } },
    });
    const strengths = skillProgress.slice(0, 3).map((s) => s.skill.name);
    const weaknesses = skillProgress
      .filter((s) => (s.averageScore ?? 10) < 8)
      .slice(-3)
      .map((s) => s.skill.name);

    const pendingReview = await prisma.submission.count({
      where: {
        userId,
        status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.IN_REVIEW] },
      },
    });

    res.json({
      user: serializeUser(user),
      course: { id: course.id, title: course.title },
      currentPhase: currentPhase
        ? { id: currentPhase.id, code: currentPhase.code, title: currentPhase.title }
        : null,
      currentLesson: currentLesson
        ? { id: currentLesson.id, title: currentLesson.title }
        : null,
      nextChallenge,
      progressPercent,
      averageScore,
      lastEvaluation: serializeEvaluation(lastEvalSub?.evaluation),
      unlockedSkillsCount,
      strengths,
      weaknesses,
      streakDays: user.streakDays,
      totalXp: user.totalXp,
      timeSpentMinutes: user.timeSpentMinutes,
      hasPendingWork: pendingReview > 0 || nextChallenge != null,
    });
  }),
);
