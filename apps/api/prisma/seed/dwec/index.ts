import type { CourseSeed } from '../content-types.js';
import { dwecP00 } from './p00.js';
import { dwecP01 } from './p01.js';
import { dwecP02 } from './p02.js';
import { dwecP03 } from './p03.js';
import { dwecP04 } from './p04.js';
import { dwecP05 } from './p05.js';
import { dwecP06 } from './p06.js';
import { dwecP07 } from './p07.js';
import { dwecP08 } from './p08.js';
import { dwecP09 } from './p09.js';
import { dwecP10 } from './p10.js';
import { dwecP11 } from './p11.js';

export const dwecCourse: CourseSeed = {
  slug: 'dwec-cliente',
  title: 'Desarrollo Web en Entorno Cliente (DWEC)',
  subtitle: 'JavaScript y Vue construyendo el frontend de ReseñApp',
  description:
    'Programa el cliente web —de JavaScript puro a Vue— construyendo la interfaz de ReseñApp que consume tu propia API. Alineado con los Resultados de Aprendizaje del módulo 0612 (DAW), pero entregado como retos sobre un producto real.',
  promise:
    'Al terminar sabrás construir interfaces web interactivas y una SPA en Vue conectada a una API real.',
  level: '2º DAW · Módulo 0612',
  phases: [
    dwecP00, dwecP01, dwecP02, dwecP03, dwecP04, dwecP05,
    dwecP06, dwecP07, dwecP08, dwecP09, dwecP10, dwecP11,
  ],
};
