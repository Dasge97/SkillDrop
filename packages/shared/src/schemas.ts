import { z } from 'zod';
import {
  EstimatedLevel,
  EvaluationStatus,
  Role,
} from './enums.js';

// ---------- Auth ----------

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es demasiado corto').max(80),
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(100),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(1, 'Introduce tu contraseña'),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ---------- Submission ----------

export const createSubmissionSchema = z.object({
  challengeId: z.string().min(1),
  // Enlace principal de la entrega: Figma, repositorio Git, etc. (cualquier URL).
  figmaUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  // URL de la web/app desplegada (opcional).
  liveUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  // Código pegado directamente (para retos de programación).
  code: z.string().max(20000).optional().default(''),
  screenshots: z.array(z.string().url()).max(10).optional().default([]),
  notes: z.string().max(4000).optional().default(''),
  // Si es true se envía directamente a revisión; si no, queda como borrador.
  submit: z.boolean().optional().default(true),
});
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

// ---------- Evaluation (mentor) ----------

export const criterionScoreSchema = z.object({
  criterionId: z.string().min(1),
  score: z.number().int().min(1).max(10),
  comment: z.string().max(1000).optional().default(''),
});

export const createEvaluationSchema = z.object({
  criteria: z.array(criterionScoreSchema).min(1, 'Puntúa al menos un criterio'),
  mentorFeedback: z.string().min(1, 'El feedback general es obligatorio').max(5000),
  requiredImprovements: z.array(z.string().max(500)).optional().default([]),
  optionalImprovements: z.array(z.string().max(500)).optional().default([]),
  estimatedLevel: z.nativeEnum(EstimatedLevel),
  // El mentor decide el estado final; si se omite se calcula por la nota media.
  status: z.nativeEnum(EvaluationStatus).optional(),
});
export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>;

// ---------- Preferences ----------

export const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
});
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;

export const roleSchema = z.nativeEnum(Role);
