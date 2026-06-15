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
import {
  courseProgressPercent,
  recalcUserProgress,
} from '../services/progress.service.js';

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

// Catálogo de cursos con el progreso del usuario en cada uno.
contentRouter.get(
  '/courses',
  asyncHandler(async (req, res) => {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { phases: true } } },
    });
    const result = [];
    for (const c of courses) {
      const computed = await recalcUserProgress(req.user!.id, c.id);
      const completedPhases = [...computed.values()].filter(
        (x) => x.status === 'COMPLETED',
      ).length;
      result.push({
        id: c.id,
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        promise: c.promise,
        level: c.level,
        phaseCount: c._count.phases,
        completedPhases,
        progressPercent: courseProgressPercent(computed),
      });
    }
    res.json(result);
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

    const computed = await recalcUserProgress(req.user!.id, course.id);
    // Marca este curso como el "activo" del usuario (catálogo abierto).
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { currentCourseId: course.id },
    });

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
    const computed = await recalcUserProgress(req.user!.id, phase.courseId);
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
