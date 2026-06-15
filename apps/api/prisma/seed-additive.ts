import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import type { ChallengeSeed, CourseSeed, LessonSeed, PhaseSeed, RubricCriterionSeed } from './seed/content-types.js';
import { skills } from './seed/skills.js';
import { resources } from './seed/resources.js';
import { demoUsers } from './seed/users.js';
import { phase00 } from './seed/phase-00.js';
import { phase01 } from './seed/phase-01.js';
import { phase02 } from './seed/phase-02.js';
import { phase03 } from './seed/phase-03.js';
import { phase04 } from './seed/phase-04.js';
import { phase05 } from './seed/phase-05.js';
import { phase06 } from './seed/phase-06.js';
import { phase07 } from './seed/phase-07.js';
import { phase08 } from './seed/phase-08.js';
import { phase09 } from './seed/phase-09.js';
import { phase10 } from './seed/phase-10.js';
import { phase11 } from './seed/phase-11.js';
import { phase12 } from './seed/phase-12.js';
import { conceptCourse } from './seed/concept/index.js';
import { dwecCourse } from './seed/dwec/index.js';
import { dwesCourse } from './seed/dwes/index.js';

const prisma = new PrismaClient();
const J = (v: unknown) => JSON.stringify(v ?? null);

const figmaCourse: CourseSeed = {
  slug: 'figma-product-design-bootcamp',
  title: 'Figma Product Design Bootcamp: de cero a diseñador UI/UX profesional',
  subtitle:
    'Aprende Figma, UI, UX, sistemas de diseño, prototipado y handoff trabajando como en un entorno real.',
  description:
    'Un bootcamp completo y guiado para pasar de cero a diseñador de producto digital. Mini teoría, retos realistas y evaluación tipo mentor con bloqueo de avance hasta dominar cada fase.',
  promise:
    'Al terminar, no solo sabrás usar Figma: sabrás diseñar productos digitales claros, escalables y defendibles profesionalmente.',
  level: 'De cero a profesional',
  phases: [
    phase00, phase01, phase02, phase03, phase04, phase05, phase06,
    phase07, phase08, phase09, phase10, phase11, phase12,
  ],
};

const allCourses: CourseSeed[] = [figmaCourse, conceptCourse, dwecCourse, dwesCourse];

async function upsertSkills() {
  for (const [i, s] of skills.entries()) {
    await prisma.skill.upsert({
      where: { slug: s.slug },
      create: { slug: s.slug, name: s.name, category: s.category, description: s.description, order: i },
      update: { name: s.name, category: s.category, description: s.description, order: i },
    });
  }
  console.log(`  ✓ ${skills.length} skills sincronizadas`);
}

async function upsertResources() {
  let count = 0;
  for (const r of resources) {
    const existing = await prisma.resource.findFirst({ where: { title: r.title, url: r.url } });
    const data = {
      title: r.title,
      description: r.description,
      url: r.url,
      type: r.type,
      category: r.category,
      phaseCode: r.phaseCode ?? null,
      order: r.order,
    };

    if (existing) {
      await prisma.resource.update({ where: { id: existing.id }, data });
    } else {
      await prisma.resource.create({ data });
    }
    count++;
  }
  console.log(`  ✓ ${count} recursos sincronizados`);
}

async function upsertRubricCriterion(rubricId: string, order: number, criterion: RubricCriterionSeed) {
  const data = {
    rubricId,
    name: criterion.name,
    description: criterion.description,
    maxScore: 10,
    weight: criterion.weight ?? 1,
    isCritical: criterion.isCritical ?? false,
    order,
  };
  const existing = await prisma.rubricCriterion.findFirst({ where: { rubricId, order } });

  if (existing) {
    await prisma.rubricCriterion.update({ where: { id: existing.id }, data });
  } else {
    await prisma.rubricCriterion.create({ data });
  }
}

async function upsertChallenge(lessonId: string, challenge: ChallengeSeed) {
  const data = {
    lessonId,
    kind: challenge.concept ? 'CONCEPT' : 'PROJECT',
    conceptConfig: challenge.concept ? J(challenge.concept) : null,
    title: challenge.title,
    brief: challenge.brief,
    context: challenge.context ?? '',
    objective: challenge.objective ?? '',
    targetUser: challenge.targetUser ?? '',
    restrictions: J(challenge.restrictions ?? []),
    deliverables: J(challenge.deliverables ?? []),
    checklist: J(challenge.checklist ?? []),
    commonMistakes: J(challenge.commonMistakes ?? []),
    difficulty: challenge.difficulty,
    timeLimitMinutes: challenge.timeLimitMinutes,
    skills: J(challenge.skills),
  };

  const createdChallenge = await prisma.challenge.upsert({
    where: { lessonId },
    create: data,
    update: data,
  });

  const rubric = await prisma.rubric.upsert({
    where: { challengeId: createdChallenge.id },
    create: { challengeId: createdChallenge.id },
    update: {},
  });

  for (const [index, criterion] of challenge.rubric.entries()) {
    await upsertRubricCriterion(rubric.id, index, criterion);
  }
}

async function upsertLesson(phaseId: string, order: number, lesson: LessonSeed) {
  const createdLesson = await prisma.lesson.upsert({
    where: { phaseId_order: { phaseId, order } },
    create: {
      phaseId,
      title: lesson.title,
      objective: lesson.objective,
      theory: lesson.theory,
      example: lesson.example ?? '',
      concepts: J(lesson.concepts),
      tools: J(lesson.tools),
      order,
      estimatedTimeMinutes: lesson.estimatedTimeMinutes,
    },
    update: {
      title: lesson.title,
      objective: lesson.objective,
      theory: lesson.theory,
      example: lesson.example ?? '',
      concepts: J(lesson.concepts),
      tools: J(lesson.tools),
      estimatedTimeMinutes: lesson.estimatedTimeMinutes,
    },
  });

  if (lesson.challenge) await upsertChallenge(createdLesson.id, lesson.challenge);
}

async function upsertPhase(courseId: string, order: number, phase: PhaseSeed) {
  const createdPhase = await prisma.phase.upsert({
    where: { courseId_order: { courseId, order } },
    create: {
      courseId,
      code: phase.code,
      title: phase.title,
      objective: phase.objective,
      order,
      requiredScore: 8,
      unlockedSkills: J(phase.unlockedSkills),
      projects: J(phase.projects),
    },
    update: {
      code: phase.code,
      title: phase.title,
      objective: phase.objective,
      requiredScore: 8,
      unlockedSkills: J(phase.unlockedSkills),
      projects: J(phase.projects),
    },
  });

  for (const [lessonIndex, lesson] of phase.lessons.entries()) {
    await upsertLesson(createdPhase.id, lessonIndex, lesson);
  }
}

async function upsertCourse(course: CourseSeed) {
  const createdCourse = await prisma.course.upsert({
    where: { slug: course.slug },
    create: {
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      promise: course.promise,
      level: course.level,
    },
    update: {
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      promise: course.promise,
      level: course.level,
    },
  });

  for (const [phaseIndex, phase] of course.phases.entries()) {
    await upsertPhase(createdCourse.id, phaseIndex, phase);
  }

  console.log(`  ✓ "${course.title}" sincronizado (${course.phases.length} fases)`);
}

async function createMissingDemoUsers() {
  for (const u of demoUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) continue;

    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.create({
      data: { name: u.name, email: u.email, passwordHash, role: u.role, preferences: J({ theme: 'system' }) },
    });
  }
  console.log(`  ✓ usuarios demo verificados sin resetear contraseñas existentes`);
}

async function main() {
  console.log('🌱 Seed aditivo SkillDrop (sin borrar datos)...');
  await upsertSkills();
  await upsertResources();
  for (const course of allCourses) await upsertCourse(course);
  await createMissingDemoUsers();
  console.log('✅ Seed aditivo completado. No se han eliminado entregas, evaluaciones ni progreso.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed aditivo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
