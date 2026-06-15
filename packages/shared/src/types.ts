import type {
  EstimatedLevel,
  EvaluationStatus,
  PhaseProgressStatus,
  Role,
  SubmissionStatus,
} from './enums.js';

// Formas de los datos tal y como viajan por JSON (fechas como ISO string).

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  totalXp: number;
  streakDays: number;
  preferences: { theme?: 'light' | 'dark' | 'system' } & Record<string, unknown>;
  currentCourseId: string | null;
  currentPhaseId: string | null;
  currentLessonId: string | null;
  createdAt: string;
}

export interface CourseSummaryDTO {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  promise: string;
  level: string;
  phaseCount: number;
  completedPhases: number;
  progressPercent: number;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export interface RubricCriterionDTO {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
  isCritical: boolean;
  order: number;
}

export interface RubricDTO {
  id: string;
  criteria: RubricCriterionDTO[];
}

export interface ChallengeDTO {
  id: string;
  lessonId: string;
  title: string;
  brief: string;
  context: string;
  objective: string;
  targetUser: string;
  restrictions: string[];
  deliverables: string[];
  checklist: string[];
  commonMistakes: string[];
  difficulty: number; // 1-5
  timeLimitMinutes: number;
  skills: string[]; // skill slugs evaluados
  rubric: RubricDTO | null;
}

export interface LessonDTO {
  id: string;
  phaseId: string;
  title: string;
  objective: string;
  theory: string;
  example: string;
  concepts: string[];
  tools: string[];
  order: number;
  estimatedTimeMinutes: number;
  challenge: ChallengeDTO | null;
}

export interface PhaseDTO {
  id: string;
  courseId: string;
  code: string; // "FASE 0", etc.
  title: string;
  objective: string;
  order: number;
  requiredScore: number;
  unlockedSkills: string[];
  lessons: LessonDTO[];
  // Estado calculado para el usuario autenticado:
  status: PhaseProgressStatus;
  progressPercent: number;
  averageScore: number | null;
}

export interface CourseDTO {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  promise: string;
  level: string;
  phases: PhaseDTO[];
}

export interface EvaluationCriterionScoreDTO {
  id: string;
  criterionId: string;
  criterionName: string;
  isCritical: boolean;
  score: number;
  comment: string;
}

export interface EvaluationDTO {
  id: string;
  submissionId: string;
  totalScore: number;
  mentorFeedback: string;
  requiredImprovements: string[];
  optionalImprovements: string[];
  status: EvaluationStatus;
  estimatedLevel: EstimatedLevel;
  criteriaScores: EvaluationCriterionScoreDTO[];
  mentorName: string;
  createdAt: string;
}

export interface SubmissionDTO {
  id: string;
  userId: string;
  challengeId: string;
  challengeTitle?: string;
  studentName?: string;
  figmaUrl: string | null;
  liveUrl: string | null;
  code: string;
  screenshots: string[];
  notes: string;
  version: number;
  status: SubmissionStatus;
  createdAt: string;
  evaluation: EvaluationDTO | null;
}

export interface SkillProgressDTO {
  skillId: string;
  slug: string;
  name: string;
  category: string;
  level: number; // 0-5
  averageScore: number | null;
  completedExercises: number;
  evidence: string[];
}

export interface MedalDTO {
  key: string;
  label: string;
  description: string;
  earned: boolean;
}

export interface DashboardDTO {
  user: UserDTO;
  course: { id: string; title: string };
  currentPhase: { id: string; code: string; title: string } | null;
  currentLesson: { id: string; title: string } | null;
  nextChallenge: { id: string; title: string; lessonId: string } | null;
  progressPercent: number;
  averageScore: number | null;
  lastEvaluation: EvaluationDTO | null;
  unlockedSkillsCount: number;
  strengths: string[];
  weaknesses: string[];
  streakDays: number;
  totalXp: number;
  timeSpentMinutes: number;
  hasPendingWork: boolean;
}

export interface ResourceDTO {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  category: string;
  phaseCode: string | null;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
