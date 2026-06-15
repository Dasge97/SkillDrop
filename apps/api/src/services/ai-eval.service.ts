import OpenAI from 'openai';
import {
  EstimatedLevel,
  type CreateEvaluationInput,
} from '@skilldrop/shared';
import { aiEnabled, config } from '../config.js';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../lib/http.js';
import { asStringArray } from '../lib/serialize.js';
import { recordEvaluation } from './evaluation.service.js';

const LEVELS = Object.values(EstimatedLevel);

// Esquema de salida estructurada que exigimos al modelo.
const responseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    criteria: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          criterionId: { type: 'string' },
          score: { type: 'integer' },
          comment: { type: 'string' },
        },
        required: ['criterionId', 'score', 'comment'],
      },
    },
    mentorFeedback: { type: 'string' },
    requiredImprovements: { type: 'array', items: { type: 'string' } },
    optionalImprovements: { type: 'array', items: { type: 'string' } },
    estimatedLevel: { type: 'string', enum: LEVELS },
  },
  required: [
    'criteria',
    'mentorFeedback',
    'requiredImprovements',
    'optionalImprovements',
    'estimatedLevel',
  ],
} as const;

const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n)));

// Evalúa una entrega con IA (OpenAI) contra la rúbrica del reto y la registra.
export async function evaluateWithAI(submissionId: string) {
  if (!aiEnabled()) {
    throw new HttpError(503, 'La evaluación con IA no está configurada (falta OPENAI_API_KEY).');
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      challenge: { include: { rubric: { include: { criteria: { orderBy: { order: 'asc' } } } } } },
      evaluation: true,
    },
  });
  if (!submission) throw new HttpError(404, 'Entrega no encontrada');
  if (submission.evaluation) throw new HttpError(409, 'Esta entrega ya ha sido evaluada');

  const ch = submission.challenge;
  const criteria = ch.rubric?.criteria ?? [];
  if (criteria.length === 0) throw new HttpError(400, 'El reto no tiene rúbrica para evaluar');

  const rubricText = criteria
    .map(
      (c, i) =>
        `${i + 1}. id="${c.id}" — "${c.name}"${c.isCritical ? ' [CRÍTICO]' : ''} (peso ${c.weight}). ${c.description}`,
    )
    .join('\n');

  const deliverable = [
    submission.figmaUrl ? `Enlace de entrega: ${submission.figmaUrl}` : null,
    submission.liveUrl ? `Web desplegada: ${submission.liveUrl}` : null,
    submission.notes ? `Notas del alumno: ${submission.notes}` : null,
    submission.code ? `Código entregado:\n\`\`\`\n${submission.code.slice(0, 16000)}\n\`\`\`` : null,
  ]
    .filter(Boolean)
    .join('\n\n');

  const screenshots = asStringArray(submission.screenshots).filter((u) => /^https?:\/\//.test(u));

  const systemPrompt =
    'Eres un mentor senior, exigente pero constructivo, que evalúa la entrega de un alumno de un ' +
    'ciclo de Desarrollo de Aplicaciones Web. Evalúas SOLO con la información aportada. Para cada ' +
    'criterio de la rúbrica das una nota entera de 1 a 10 y un comentario breve y concreto que la ' +
    'justifique. Sé justo: no regales notas ni seas destructivo. Señala errores concretos y mejoras ' +
    'accionables. Responde EXCLUSIVAMENTE con el JSON del esquema, usando el id exacto de cada criterio.';

  const userText =
    `RETO: ${ch.title}\n\n` +
    `Brief: ${ch.brief}\n` +
    (ch.context ? `Contexto: ${ch.context}\n` : '') +
    (ch.objective ? `Objetivo: ${ch.objective}\n` : '') +
    `\nRÚBRICA (puntúa cada criterio por su id):\n${rubricText}\n\n` +
    `ENTREGA DEL ALUMNO:\n${deliverable || '(sin contenido textual; revisa las capturas)'}\n\n` +
    'Recuerda: la nota media para aprobar es 8 y ningún criterio crítico debe bajar de 7. ' +
    'Estima el nivel del alumno entre: ' +
    LEVELS.join(', ') +
    '.';

  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    { type: 'text', text: userText },
    ...screenshots.map(
      (url): OpenAI.Chat.Completions.ChatCompletionContentPart => ({
        type: 'image_url',
        image_url: { url },
      }),
    ),
  ];

  const openai = new OpenAI({ apiKey: config.openaiApiKey });
  const completion = await openai.chat.completions.create({
    model: config.openaiModel,
    temperature: 0.2,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'evaluacion', strict: true, schema: responseSchema },
    },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new HttpError(502, 'La IA no devolvió respuesta');

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new HttpError(502, 'Respuesta de la IA no válida');
  }

  // Mapea por id; garantiza que TODOS los criterios estén puntuados.
  const byId = new Map<string, { score: number; comment: string }>();
  for (const item of parsed.criteria ?? []) {
    if (item && typeof item.criterionId === 'string') {
      byId.set(item.criterionId, {
        score: clamp(Number(item.score) || 5),
        comment: String(item.comment ?? ''),
      });
    }
  }
  const scoredCriteria = criteria.map((c) => {
    const found = byId.get(c.id);
    return {
      criterionId: c.id,
      score: found?.score ?? 5,
      comment: found?.comment ?? 'Sin evaluación específica de la IA.',
    };
  });

  const level: EstimatedLevel = LEVELS.includes(parsed.estimatedLevel)
    ? parsed.estimatedLevel
    : EstimatedLevel.JUNIOR;

  const input: CreateEvaluationInput = {
    criteria: scoredCriteria,
    mentorFeedback:
      (typeof parsed.mentorFeedback === 'string' && parsed.mentorFeedback.trim()) ||
      'Evaluación generada por IA.',
    requiredImprovements: (parsed.requiredImprovements ?? []).map(String).slice(0, 12),
    optionalImprovements: (parsed.optionalImprovements ?? []).map(String).slice(0, 12),
    estimatedLevel: level,
  };

  // El estado se deriva de la nota (no lo fija la IA).
  return recordEvaluation(submissionId, null, input);
}
