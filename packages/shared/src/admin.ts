import { z } from 'zod';
import { Role } from './enums.js';

// ---------- Gestión de usuarios ----------
export const updateRoleSchema = z.object({
  role: z.nativeEnum(Role),
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

// ---------- Curso ----------
export const courseInputSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  title: z.string().min(3).max(160),
  subtitle: z.string().max(240).default(''),
  description: z.string().max(2000).default(''),
  promise: z.string().max(500).default(''),
  level: z.string().max(80).default(''),
});
export type CourseInput = z.infer<typeof courseInputSchema>;
export const courseUpdateSchema = courseInputSchema.partial();

// ---------- Fase ----------
export const phaseInputSchema = z.object({
  courseId: z.string().min(1),
  code: z.string().min(1).max(40),
  title: z.string().min(2).max(160),
  objective: z.string().max(1000).default(''),
  order: z.number().int().min(0).optional(),
  requiredScore: z.number().int().min(1).max(10).default(8),
  unlockedSkills: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
});
export type PhaseInput = z.infer<typeof phaseInputSchema>;
export const phaseUpdateSchema = phaseInputSchema.omit({ courseId: true }).partial();

// ---------- Lección ----------
export const lessonInputSchema = z.object({
  phaseId: z.string().min(1),
  title: z.string().min(2).max(160),
  objective: z.string().max(1000).default(''),
  theory: z.string().max(8000).default(''),
  example: z.string().max(2000).default(''),
  concepts: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  order: z.number().int().min(0).optional(),
  estimatedTimeMinutes: z.number().int().min(1).max(600).default(30),
});
export type LessonInput = z.infer<typeof lessonInputSchema>;
export const lessonUpdateSchema = lessonInputSchema.omit({ phaseId: true }).partial();

// ---------- Criterio de rúbrica ----------
export const criterionInputSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).default(''),
  weight: z.number().min(0.1).max(10).default(1),
  isCritical: z.boolean().default(false),
});

// ---------- Reto ----------
export const challengeInputSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(2).max(160),
  brief: z.string().max(4000).default(''),
  context: z.string().max(2000).default(''),
  objective: z.string().max(1000).default(''),
  targetUser: z.string().max(500).default(''),
  restrictions: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  checklist: z.array(z.string()).default([]),
  commonMistakes: z.array(z.string()).default([]),
  difficulty: z.number().int().min(1).max(5).default(1),
  timeLimitMinutes: z.number().int().min(1).max(600).default(45),
  skills: z.array(z.string()).default([]),
  rubric: z.array(criterionInputSchema).default([]),
});
export type ChallengeInput = z.infer<typeof challengeInputSchema>;
export const challengeUpdateSchema = challengeInputSchema.omit({ lessonId: true }).partial();

// ---------- DTOs de respuesta admin ----------
export interface AdminOverviewDTO {
  users: { total: number; students: number; mentors: number; admins: number };
  submissions: {
    total: number;
    pending: number;
    approved: number;
    needsWork: number;
  };
  content: { courses: number; phases: number; lessons: number; challenges: number };
  evaluations: number;
}

export interface AdminUserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  totalXp: number;
  submissionCount: number;
  createdAt: string;
}
