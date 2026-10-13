import type { CourseSeed } from '../content-types.js';
import { dwecPasoP00 } from './p00.js';
import { dwecPasoP01 } from './p01.js';
import { dwecPasoP02 } from './p02.js';
import { dwecPasoP03 } from './p03.js';
import { dwecPasoP04 } from './p04.js';
import { dwecPasoP05 } from './p05.js';
import { dwecPasoP06 } from './p06.js';
import { dwecPasoP07 } from './p07.js';
import { dwecPasoP08 } from './p08.js';
import { dwecPasoP09 } from './p09.js';
import { dwecPasoP10 } from './p10.js';
import { dwecPasoP11 } from './p11.js';
import { dwecPasoP12 } from './p12.js';
import { dwecPasoP13 } from './p13.js';
import { dwecPasoP14 } from './p14.js';
import { dwecPasoP15 } from './p15.js';

export const dwecPasoCourse: CourseSeed = {
  slug: 'dwec-paso-a-paso',
  title: 'DWEC paso a paso: JavaScript en el cliente desde cero',
  subtitle: 'Entiende cómo funciona cada cosa y compruébalo con preguntas y pruebas cortas',
  description:
    'Curso de apoyo para el módulo Desarrollo Web en Entorno Cliente (2º DAW/DAM). Recorre todo el temario: cómo funciona la web, depuración, JavaScript desde las variables hasta la POO, módulos y JSON, DOM y BOM, eventos y formularios, APIs del navegador, asincronía y fetch, Vue y Electron, seguridad en el cliente y el proyecto final. Cada lección explica el concepto con ejemplos y termina con una pregunta o una prueba de código corta que se corrige en la plataforma.',
  promise:
    'Al terminar entenderás qué hace cada línea de JavaScript que escribes en el cliente y por qué, y llegarás a las prácticas y al examen sabiendo resolverlos.',
  level: '2º DAW/DAM · Módulo DWEC · desde cero',
  phases: [
    dwecPasoP00, dwecPasoP01, dwecPasoP02, dwecPasoP03,
    dwecPasoP04, dwecPasoP05, dwecPasoP06, dwecPasoP07,
    dwecPasoP08, dwecPasoP09, dwecPasoP10, dwecPasoP11,
    dwecPasoP12, dwecPasoP13, dwecPasoP14, dwecPasoP15,
  ],
};
