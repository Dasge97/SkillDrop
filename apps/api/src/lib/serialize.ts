import type {
  ChallengeDTO,
  EstimatedLevel,
  EvaluationDTO,
  EvaluationStatus,
  LessonDTO,
  PhaseDTO,
  PhaseProgressStatus,
  ResourceDTO,
  Role,
  RubricDTO,
  SkillProgressDTO,
  SubmissionDTO,
  SubmissionStatus,
  UserDTO,
} from '@skilldrop/shared';

import { parseArray, parseObject } from './json.js';

// Reexport para mantener compatibilidad con los imports existentes.
export const asStringArray = parseArray;

function iso(d: Date | string): string {
  return typeof d === 'string' ? d : d.toISOString();
}

export function serializeUser(u: any): UserDTO {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as Role,
    totalXp: u.totalXp,
    streakDays: u.streakDays,
    preferences: parseObject(u.preferences) as UserDTO['preferences'],
    currentCourseId: u.currentCourseId ?? null,
    currentPhaseId: u.currentPhaseId ?? null,
    currentLessonId: u.currentLessonId ?? null,
    createdAt: iso(u.createdAt),
  };
}

export function serializeRubric(r: any): RubricDTO | null {
  if (!r) return null;
  return {
    id: r.id,
    criteria: (r.criteria ?? [])
      .slice()
      .sort((a: any, b: any) => a.order - b.order)
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        maxScore: c.maxScore,
        weight: c.weight,
        isCritical: c.isCritical,
        order: c.order,
      })),
  };
}

// Construye la config pública de un reto CONCEPT (oculta solución y respuestas correctas).
function buildConceptPublic(kind: string | undefined, conceptConfig: unknown) {
  if (kind !== 'CONCEPT' || !conceptConfig) return null;
  const cfg = parseObject(conceptConfig) as any;
  return {
    kind: (cfg.kind ?? 'short') as 'quiz' | 'short' | 'code',
    prompt: String(cfg.prompt ?? ''),
    starterCode: String(cfg.starterCode ?? ''),
    runner: (cfg.runner ?? 'none') as 'none' | 'js' | 'server',
    sample: cfg.sample ?? null,
    quiz: cfg.quiz
      ? {
          options: (cfg.quiz.options ?? []).map((o: any) => ({ id: String(o.id), text: String(o.text) })),
          multiple: !!cfg.quiz.multiple,
        }
      : null,
  };
}

export function serializeChallenge(c: any): ChallengeDTO | null {
  if (!c) return null;
  return {
    id: c.id,
    lessonId: c.lessonId,
    kind: (c.kind ?? 'PROJECT') as ChallengeDTO['kind'],
    concept: buildConceptPublic(c.kind, c.conceptConfig),
    title: c.title,
    brief: c.brief,
    context: c.context,
    objective: c.objective,
    targetUser: c.targetUser,
    restrictions: asStringArray(c.restrictions),
    deliverables: asStringArray(c.deliverables),
    checklist: asStringArray(c.checklist),
    commonMistakes: asStringArray(c.commonMistakes),
    difficulty: c.difficulty,
    timeLimitMinutes: c.timeLimitMinutes,
    skills: asStringArray(c.skills),
    rubric: serializeRubric(c.rubric),
  };
}

export function serializeLesson(l: any): LessonDTO {
  return {
    id: l.id,
    phaseId: l.phaseId,
    title: l.title,
    objective: l.objective,
    theory: l.theory,
    example: l.example,
    concepts: asStringArray(l.concepts),
    tools: asStringArray(l.tools),
    order: l.order,
    estimatedTimeMinutes: l.estimatedTimeMinutes,
    challenge: serializeChallenge(l.challenge),
  };
}

export function serializePhase(
  p: any,
  computed: {
    status: PhaseProgressStatus;
    progressPercent: number;
    averageScore: number | null;
  },
): PhaseDTO {
  return {
    id: p.id,
    courseId: p.courseId,
    code: p.code,
    title: p.title,
    objective: p.objective,
    order: p.order,
    requiredScore: p.requiredScore,
    unlockedSkills: asStringArray(p.unlockedSkills),
    lessons: (p.lessons ?? [])
      .slice()
      .sort((a: any, b: any) => a.order - b.order)
      .map(serializeLesson),
    status: computed.status,
    progressPercent: computed.progressPercent,
    averageScore: computed.averageScore,
  };
}

export function serializeEvaluation(e: any): EvaluationDTO | null {
  if (!e) return null;
  return {
    id: e.id,
    submissionId: e.submissionId,
    totalScore: e.totalScore,
    mentorFeedback: e.mentorFeedback,
    requiredImprovements: asStringArray(e.requiredImprovements),
    optionalImprovements: asStringArray(e.optionalImprovements),
    status: e.status as EvaluationStatus,
    estimatedLevel: e.estimatedLevel as EstimatedLevel,
    mentorName: e.mentor?.name ?? 'SkillDrop IA',
    criteriaScores: (e.criteriaScores ?? []).map((s: any) => ({
      id: s.id,
      criterionId: s.criterionId,
      criterionName: s.criterion?.name ?? '',
      isCritical: s.criterion?.isCritical ?? false,
      score: s.score,
      comment: s.comment,
    })),
    createdAt: iso(e.createdAt),
  };
}

export function serializeSubmission(s: any): SubmissionDTO {
  return {
    id: s.id,
    userId: s.userId,
    challengeId: s.challengeId,
    challengeTitle: s.challenge?.title,
    studentName: s.user?.name,
    figmaUrl: s.figmaUrl ?? null,
    liveUrl: s.liveUrl ?? null,
    code: s.code ?? '',
    answer: s.answer ?? '',
    screenshots: asStringArray(s.screenshots),
    notes: s.notes,
    version: s.version,
    status: s.status as SubmissionStatus,
    createdAt: iso(s.createdAt),
    evaluation: serializeEvaluation(s.evaluation),
  };
}

export function serializeSkillProgress(sp: any): SkillProgressDTO {
  return {
    skillId: sp.skill.id,
    slug: sp.skill.slug,
    name: sp.skill.name,
    category: sp.skill.category,
    level: sp.level,
    averageScore: sp.averageScore ?? null,
    completedExercises: sp.completedExercises,
    evidence: asStringArray(sp.evidence),
  };
}

export function serializeResource(r: any): ResourceDTO {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    url: r.url,
    type: r.type,
    category: r.category,
    phaseCode: r.phaseCode ?? null,
  };
}
