import type { CourseSeed } from '../content-types.js';
import { conceptP00 } from './p00.js';
import { conceptP01 } from './p01.js';
import { conceptP02 } from './p02.js';
import { conceptP03 } from './p03.js';
import { conceptP04 } from './p04.js';
import { conceptP05 } from './p05.js';

export const conceptCourse: CourseSeed = {
  slug: 'fundamentos-cliente-servidor',
  title: 'Cómo hablan cliente y servidor — fundamentos',
  subtitle: 'Entiende el viaje de una petición con el mínimo de código',
  description:
    'Antes de construir proyectos enteros, entiende los conceptos: qué es cliente y servidor, cómo viaja una petición HTTP, qué son las APIs, los middlewares, la autenticación y la seguridad. Lecciones cortas con micro-retos (predecir, elegir, arreglar 4 líneas) que ejecutas y compruebas dentro de la plataforma. Recomendado antes de DWEC y DWES.',
  promise:
    'Al terminar tendrás un modelo mental claro de cómo se comunican cliente y servidor, listo para aplicarlo en cualquier lenguaje.',
  level: 'Fundamentos · antes de DWEC/DWES',
  phases: [conceptP00, conceptP01, conceptP02, conceptP03, conceptP04, conceptP05],
};
