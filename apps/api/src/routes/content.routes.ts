import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../lib/http.js';
import { authenticate } from '../middleware/auth.js';
import {
  serializeChallenge,
  serializeLesson,
  serializePhase,
  serializeSubmission,
} from '../lib/serialize.js';
import { recalcUserProgress } from '../services/progress.service.js';

export const contentRouter = Router();
contentRouter.use(authenticate);

const phaseInclude = {
  lessons: {
    orderBy: { order: 'asc' as const },
    include: {
      challenge: { include: { rubric: { include: { criteria: true } } } },
    },
  },
};

// Lista de cursos (resumen).
contentRouter.get(
  '/courses',
  asyncHandler(async (_req, res) => {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json(
      courses.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        promise: c.promise,
        level: c.level,
      })),
    );
  }),
);

// Curso completo con fases y estado calculado para el usuario.
contentRouter.get(
  '/courses/:idOrSlug',
  asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    const course = await prisma.course.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { phases: { orderBy: { order: 'asc' }, include: phaseInclude } },
    });
    if (!course) throw new HttpError(404, 'Curso no encontrado');

    const computed = await recalcUserProgress(req.user!.id);

    res.json({
      id: course.id,
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      promise: course.promise,
      level: course.level,
      phases: course.phases.map((p) =>
        serializePhase(
          p,
          computed.get(p.id) ?? {
            status: 'LOCKED',
            progressPercent: 0,
            averageScore: null,
          },
        ),
      ),
    });
  }),
);

// Detalle de una fase.
contentRouter.get(
  '/phases/:id',
  asyncHandler(async (req, res) => {
    const phase = await prisma.phase.findUnique({
      where: { id: req.params.id },
      include: phaseInclude,
    });
    if (!phase) throw new HttpError(404, 'Fase no encontrada');
    const computed = await recalcUserProgress(req.user!.id);
    res.json(
      serializePhase(
        phase,
        computed.get(phase.id) ?? {
          status: 'LOCKED',
          progressPercent: 0,
          averageScore: null,
        },
      ),
    );
  }),
);

// Detalle de una lección (con su reto y rúbrica).
contentRouter.get(
  '/lessons/:id',
  asyncHandler(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        challenge: { include: { rubric: { include: { criteria: true } } } },
      },
    });
    if (!lesson) throw new HttpError(404, 'Lección no encontrada');
    res.json(serializeLesson(lesson));
  }),
);

// Detalle de un reto + historial de entregas del usuario para ese reto.
contentRouter.get(
  '/challenges/:id',
  asyncHandler(async (req, res) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
      include: { rubric: { include: { criteria: true } } },
    });
    if (!challenge) throw new HttpError(404, 'Reto no encontrado');

    const submissions = await prisma.submission.findMany({
      where: { userId: req.user!.id, challengeId: challenge.id },
      orderBy: { version: 'desc' },
      include: {
        evaluation: {
          include: {
            mentor: true,
            criteriaScores: { include: { criterion: true } },
          },
        },
      },
    });

    res.json({
      challenge: serializeChallenge(challenge),
      submissions: submissions.map(serializeSubmission),
    });
  }),
);
