import type { CourseSeed } from '../content-types.js';
import { dwesP00 } from './p00.js';
import { dwesP01 } from './p01.js';
import { dwesP02 } from './p02.js';
import { dwesP03 } from './p03.js';
import { dwesP04 } from './p04.js';
import { dwesP05 } from './p05.js';
import { dwesP06 } from './p06.js';
import { dwesP07 } from './p07.js';
import { dwesP08 } from './p08.js';
import { dwesP09 } from './p09.js';
import { dwesP10 } from './p10.js';

export const dwesCourse: CourseSeed = {
  slug: 'dwes-servidor',
  title: 'Desarrollo Web en Entorno Servidor (DWES)',
  subtitle: 'PHP y MySQL construyendo el backend de ReseñApp',
  description:
    'Programa el servidor —PHP, MySQL, MVC, autenticación y una API REST— construyendo el backend de ReseñApp que consume el curso de cliente. Alineado con los Resultados de Aprendizaje del módulo 0613 (DAW), entregado como retos sobre un producto real.',
  promise:
    'Al terminar sabrás construir un backend PHP con base de datos, autenticación y una API REST segura, lista para producción.',
  level: '2º DAW · Módulo 0613',
  phases: [
    dwesP00, dwesP01, dwesP02, dwesP03, dwesP04, dwesP05,
    dwesP06, dwesP07, dwesP08, dwesP09, dwesP10,
  ],
};
