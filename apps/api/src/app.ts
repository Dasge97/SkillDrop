import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { errorHandler, notFound } from './middleware/error.js';
import { adminRouter } from './routes/admin.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { contentRouter } from './routes/content.routes.js';
import { meRouter } from './routes/me.routes.js';
import { mentorRouter } from './routes/mentor.routes.js';
import { resourceRouter } from './routes/resource.routes.js';
import { submissionRouter } from './routes/submission.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.webOrigin, credentials: true }));
  app.use(express.json({ limit: '2mb' }));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/auth', authRouter);
  app.use('/', contentRouter); // /courses, /phases, /lessons, /challenges
  app.use('/submissions', submissionRouter);
  app.use('/mentor', mentorRouter);
  app.use('/me', meRouter);
  app.use('/resources', resourceRouter);
  app.use('/admin', adminRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
