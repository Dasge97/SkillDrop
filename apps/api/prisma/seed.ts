import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import type { CourseSeed } from './seed/content-types.js';
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
import { dwecCourse } from './seed/dwec/index.js';
import { dwesCourse } from './seed/dwes/index.js';
import { conceptCourse } from './seed/concept/index.js';

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

async function clean() {
  await prisma.evaluationCriterionScore.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.userSkillProgress.deleteMany();
  await prisma.userPhaseProgress.deleteMany();
  await prisma.course.deleteMany(); // cascada → phases → lessons → challenges → rubrics → criteria
  await prisma.skill.deleteMany();
  await prisma.resource.deleteMany();
}

async function seedSkills() {
  for (const [i, s] of skills.entries()) {
    await prisma.skill.create({
      data: { slug: s.slug, name: s.name, category: s.category, description: s.description, order: i },
    });
  }
  console.log(`  ✓ ${skills.length} skills`);
}

async function seedResources() {
  for (const r of resources) {
    await prisma.resource.create({
      data: {
        title: r.title,
        description: r.description,
        url: r.url,
        type: r.type,
        category: r.category,
        phaseCode: r.phaseCode ?? null,
        order: r.order,
      },
    });
  }
  console.log(`  ✓ ${resources.length} recursos`);
}

async function seedCourse(course: CourseSeed) {
  const createdCourse = await prisma.course.create({
    data: {
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      promise: course.promise,
      level: course.level,
    },
  });

  let lessonCount = 0;
  let challengeCount = 0;

  for (const [pIndex, phase] of course.phases.entries()) {
    const createdPhase = await prisma.phase.create({
      data: {
        courseId: createdCourse.id,
        code: phase.code,
        title: phase.title,
        objective: phase.objective,
        order: pIndex,
        requiredScore: 8,
        unlockedSkills: J(phase.unlockedSkills),
        projects: J(phase.projects),
      },
    });

    for (const [lIndex, lesson] of phase.lessons.entries()) {
      const createdLesson = await prisma.lesson.create({
        data: {
          phaseId: createdPhase.id,
          title: lesson.title,
          objective: lesson.objective,
          theory: lesson.theory,
          example: lesson.example ?? '',
          concepts: J(lesson.concepts),
          tools: J(lesson.tools),
          order: lIndex,
          estimatedTimeMinutes: lesson.estimatedTimeMinutes,
        },
      });
      lessonCount++;

      if (lesson.challenge) {
        const ch = lesson.challenge;
        const createdChallenge = await prisma.challenge.create({
          data: {
            lessonId: createdLesson.id,
            kind: ch.concept ? 'CONCEPT' : 'PROJECT',
            conceptConfig: ch.concept ? J(ch.concept) : null,
            title: ch.title,
            brief: ch.brief,
            context: ch.context ?? '',
            objective: ch.objective ?? '',
            targetUser: ch.targetUser ?? '',
            restrictions: J(ch.restrictions ?? []),
            deliverables: J(ch.deliverables ?? []),
            checklist: J(ch.checklist ?? []),
            commonMistakes: J(ch.commonMistakes ?? []),
            difficulty: ch.difficulty,
            timeLimitMinutes: ch.timeLimitMinutes,
            skills: J(ch.skills),
          },
        });
        challengeCount++;

        const rubric = await prisma.rubric.create({ data: { challengeId: createdChallenge.id } });
        for (const [cIndex, crit] of ch.rubric.entries()) {
          await prisma.rubricCriterion.create({
            data: {
              rubricId: rubric.id,
              name: crit.name,
              description: crit.description,
              maxScore: 10,
              weight: crit.weight ?? 1,
              isCritical: crit.isCritical ?? false,
              order: cIndex,
            },
          });
        }
      }
    }
  }

  console.log(
    `  ✓ "${course.title}" — ${course.phases.length} fases, ${lessonCount} lecciones, ${challengeCount} retos`,
  );
}

async function seedUsers() {
  for (const u of demoUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      create: { name: u.name, email: u.email, passwordHash, role: u.role, preferences: J({ theme: 'system' }) },
      update: { name: u.name, passwordHash, role: u.role },
    });
  }
  console.log(`  ✓ ${demoUsers.length} usuarios demo`);
}

async function main() {
  console.log('🌱 Seeding SkillDrop...');
  await clean();
  await seedSkills();
  await seedResources();
  for (const course of allCourses) await seedCourse(course);
  await seedUsers();
  console.log('✅ Seed completado.');
  console.log('   Alumno:  student@skilldrop.dev / skilldrop');
  console.log('   Mentor:  mentor@skilldrop.dev / skilldrop');
  console.log('   Admin:   admin@skilldrop.dev / skilldrop');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
