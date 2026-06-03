import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`🚀 API escuchando en http://localhost:${config.port}`);
});
