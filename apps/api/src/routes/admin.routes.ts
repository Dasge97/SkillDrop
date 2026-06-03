import { Router } from 'express';
import {
  challengeInputSchema,
  challengeUpdateSchema,
  courseInputSchema,
  courseUpdateSchema,
  lessonInputSchema,
  lessonUpdateSchema,
  phaseInputSchema,
  phaseUpdateSchema,
  updateRoleSchema,
  type AdminOverviewDTO,
} from '@skilldrop/shared';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../lib/http.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { toJson } from '../lib/json.js';
import { serializeChallenge } from '../lib/serialize.js';

export const adminRouter = Router();
adminRouter.use(authenticate, requireRole('ADMIN'));

// ---------- Métricas ----------
adminRouter.get(
  '/overview',
  asyncHandler(async (_req, res) => {
    const [
      total, students, mentors, admins,
      subTotal, pending, approved, needsWork,
      courses, phases, lessons, challenges, evaluations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'MENTOR' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.submission.count(),
      prisma.submission.count({ where: { status: { in: ['SUBMITTED', 'IN_REVIEW'] } } }),
      prisma.submission.count({ where: { status: 'APPROVED' } }),
      prisma.submission.count({ where: { status: { in: ['NEEDS_WORK', 'REDO'] } } }),
      prisma.course.count(),
      prisma.phase.count(),
      prisma.lesson.count(),
      prisma.challenge.count(),
      prisma.evaluation.count(),
    ]);
    const overview: AdminOverviewDTO = {
      users: { total, students, mentors, admins },
      submissions: { total: subTotal, pending, approved, needsWork },
      content: { courses, phases, lessons, challenges },
      evaluations,
    };
    res.json(overview);
  }),
);

// ---------- Usuarios ----------
adminRouter.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { submissions: true } } },
    });
    res.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        totalXp: u.totalXp,
        submissionCount: u._count.submissions,
        createdAt: u.createdAt.toISOString(),
      })),
    );
  }),
);

adminRouter.patch(
  '/users/:id/role',
  asyncHandler(async (req, res) => {
    const { role } = updateRoleSchema.parse(req.body);
    if (req.params.id === req.user!.id && role !== 'ADMIN') {
      throw new HttpError(400, 'No puedes quitarte a ti mismo el rol de admin');
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });
    res.json({ id: user.id, role: user.role });
  }),
);

// ---------- Cursos ----------
adminRouter.post(
  '/courses',
  asyncHandler(async (req, res) => {
    const data = courseInputSchema.parse(req.body);
    const course = await prisma.course.create({ data });
    res.status(201).json(course);
  }),
);

adminRouter.patch(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const data = courseUpdateSchema.parse(req.body);
    const course = await prisma.course.update({ where: { id: req.params.id }, data });
    res.json(course);
  }),
);

adminRouter.delete(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.status(204).end();
  }),
);

// ---------- Fases ----------
adminRouter.post(
  '/phases',
  asyncHandler(async (req, res) => {
    const data = phaseInputSchema.parse(req.body);
    const order =
      data.order ??
      ((await prisma.phase.aggregate({
        where: { courseId: data.courseId },
        _max: { order: true },
      }))._max.order ?? -1) + 1;
    const phase = await prisma.phase.create({
      data: {
        courseId: data.courseId,
        code: data.code,
        title: data.title,
        objective: data.objective,
        order,
        requiredScore: data.requiredScore,
        unlockedSkills: toJson(data.unlockedSkills),
        projects: toJson(data.projects),
      },
    });
    res.status(201).json(phase);
  }),
);

adminRouter.patch(
  '/phases/:id',
  asyncHandler(async (req, res) => {
    const data = phaseUpdateSchema.parse(req.body);
    const phase = await prisma.phase.update({
      where: { id: req.params.id },
      data: {
        ...(data.code !== undefined && { code: data.code }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.objective !== undefined && { objective: data.objective }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.requiredScore !== undefined && { requiredScore: data.requiredScore }),
        ...(data.unlockedSkills !== undefined && { unlockedSkills: toJson(data.unlockedSkills) }),
        ...(data.projects !== undefined && { projects: toJson(data.projects) }),
      },
    });
    res.json(phase);
  }),
);

adminRouter.delete(
  '/phases/:id',
  asyncHandler(async (req, res) => {
    await prisma.phase.delete({ where: { id: req.params.id } });
    res.status(204).end();
  }),
);

// ---------- Lecciones ----------
adminRouter.post(
  '/lessons',
  asyncHandler(async (req, res) => {
    const data = lessonInputSchema.parse(req.body);
    const order =
      data.order ??
      ((await prisma.lesson.aggregate({
        where: { phaseId: data.phaseId },
        _max: { order: true },
      }))._max.order ?? -1) + 1;
    const lesson = await prisma.lesson.create({
      data: {
        phaseId: data.phaseId,
        title: data.title,
        objective: data.objective,
        theory: data.theory,
        example: data.example,
        concepts: toJson(data.concepts),
        tools: toJson(data.tools),
        order,
        estimatedTimeMinutes: data.estimatedTimeMinutes,
      },
    });
    res.status(201).json(lesson);
  }),
);

adminRouter.patch(
  '/lessons/:id',
  asyncHandler(async (req, res) => {
    const data = lessonUpdateSchema.parse(req.body);
    const lesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.objective !== undefined && { objective: data.objective }),
        ...(data.theory !== undefined && { theory: data.theory }),
        ...(data.example !== undefined && { example: data.example }),
        ...(data.concepts !== undefined && { concepts: toJson(data.concepts) }),
        ...(data.tools !== undefined && { tools: toJson(data.tools) }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.estimatedTimeMinutes !== undefined && {
          estimatedTimeMinutes: data.estimatedTimeMinutes,
        }),
      },
    });
    res.json(lesson);
  }),
);

adminRouter.delete(
  '/lessons/:id',
  asyncHandler(async (req, res) => {
    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.status(204).end();
  }),
);

// ---------- Retos (con rúbrica) ----------
async function writeRubric(challengeId: string, criteria: ReturnType<typeof challengeInputSchema.parse>['rubric']) {
  const rubric = await prisma.rubric.upsert({
    where: { challengeId },
    create: { challengeId },
    update: {},
  });
  await prisma.rubricCriterion.deleteMany({ where: { rubricId: rubric.id } });
  for (const [i, c] of criteria.entries()) {
    await prisma.rubricCriterion.create({
      data: {
        rubricId: rubric.id,
        name: c.name,
        description: c.description,
        weight: c.weight,
        isCritical: c.isCritical,
        order: i,
      },
    });
  }
}

adminRouter.post(
  '/challenges',
  asyncHandler(async (req, res) => {
    const data = challengeInputSchema.parse(req.body);
    const existing = await prisma.challenge.findUnique({ where: { lessonId: data.lessonId } });
    if (existing) throw new HttpError(409, 'Esta lección ya tiene un reto');
    const challenge = await prisma.challenge.create({
      data: {
        lessonId: data.lessonId,
        title: data.title,
        brief: data.brief,
        context: data.context,
        objective: data.objective,
        targetUser: data.targetUser,
        restrictions: toJson(data.restrictions),
        deliverables: toJson(data.deliverables),
        checklist: toJson(data.checklist),
        commonMistakes: toJson(data.commonMistakes),
        difficulty: data.difficulty,
        timeLimitMinutes: data.timeLimitMinutes,
        skills: toJson(data.skills),
      },
    });
    await writeRubric(challenge.id, data.rubric);
    const full = await prisma.challenge.findUnique({
      where: { id: challenge.id },
      include: { rubric: { include: { criteria: true } } },
    });
    res.status(201).json(serializeChallenge(full));
  }),
);

adminRouter.patch(
  '/challenges/:id',
  asyncHandler(async (req, res) => {
    const data = challengeUpdateSchema.parse(req.body);
    await prisma.challenge.update({
      where: { id: req.params.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.brief !== undefined && { brief: data.brief }),
        ...(data.context !== undefined && { context: data.context }),
        ...(data.objective !== undefined && { objective: data.objective }),
        ...(data.targetUser !== undefined && { targetUser: data.targetUser }),
        ...(data.restrictions !== undefined && { restrictions: toJson(data.restrictions) }),
        ...(data.deliverables !== undefined && { deliverables: toJson(data.deliverables) }),
        ...(data.checklist !== undefined && { checklist: toJson(data.checklist) }),
        ...(data.commonMistakes !== undefined && { commonMistakes: toJson(data.commonMistakes) }),
        ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
        ...(data.timeLimitMinutes !== undefined && { timeLimitMinutes: data.timeLimitMinutes }),
        ...(data.skills !== undefined && { skills: toJson(data.skills) }),
      },
    });
    if (data.rubric !== undefined) {
      await writeRubric(req.params.id, data.rubric);
    }
    const full = await prisma.challenge.findUnique({
      where: { id: req.params.id },
      include: { rubric: { include: { criteria: true } } },
    });
    res.json(serializeChallenge(full));
  }),
);

adminRouter.delete(
  '/challenges/:id',
  asyncHandler(async (req, res) => {
    await prisma.challenge.delete({ where: { id: req.params.id } });
    res.status(204).end();
  }),
);
