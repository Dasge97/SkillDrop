import 'dotenv/config';

export const config = {
  port: Number(process.env.API_PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o',
};

// ¿Está configurada la evaluación con IA?
export const aiEnabled = () => config.openaiApiKey.trim().length > 0;
