import { type PhaseSeed } from '../content-types.js';

export const dwecP02: PhaseSeed = {
  code: 'FASE 2',
  title: 'Datos: arrays y objetos',
  objective: 'Usar los tipos de datos complejos de JavaScript para modelar y transformar colecciones de reseñas en ReseñApp.',
  unlockedSkills: ['js-datos'],
  projects: ['Catálogo de reseñas mock', 'Top valoradas', 'Agrupador por categoría', 'Buscador por texto'],
  lessons: [
    {
      title: 'Arrays y métodos funcionales',
      objective: 'Aplicar map, filter, reduce, find, sort, some y every sobre arrays de datos reales.',
      theory:
        'Un array en JavaScript es una colección ordenada de valores. Los métodos de array modernos permiten transformar datos sin mutar el original: `map` genera un nuevo array aplicando una función a cada elemento; `filter` devuelve solo los elementos que cumplen una condición; `reduce` acumula un único resultado a partir de todos los elementos.\n\n`find` devuelve el primer elemento que satisface un predicado, o `undefined` si ninguno lo hace. `sort` ordena in-place (y acepta un comparador personalizado para ordenar números o cadenas correctamente). `some` y `every` comprueban si al menos uno o todos los elementos cumplen la condición, respectivamente.\n\nEncadenar estos métodos es la base del estilo funcional de JS: legible, predecible y fácil de testear. En ReseñApp los usaremos para filtrar por categoría, calcular medias de puntuación o buscar por título sin tocar el estado original del catálogo.\n\nImportante: `sort` sin comparador convierte los elementos a string antes de comparar, lo que produce resultados incorrectos con números. Siempre usa `(a, b) => a - b` para orden ascendente numérico.',
      example:
        'const resenas = [\n  { titulo: "Dune", puntuacion: 9, categoria: "pelicula" },\n  { titulo: "Breaking Bad", puntuacion: 10, categoria: "serie" },\n];\nconst top = resenas.filter(r => r.puntuacion >= 9);\nconst media = resenas.reduce((acc, r) => acc + r.puntuacion, 0) / resenas.length;',
      concepts: ['Array', 'map', 'filter', 'reduce', 'find', 'sort', 'some', 'every', 'inmutabilidad'],
      tools: ['Consola del navegador', 'Node.js REPL'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'Transformar el catálogo de ReseñApp',
        brief: 'Dado un array mock de al menos 8 reseñas (películas, series y juegos), aplica métodos de array para generar 4 vistas distintas del catálogo.',
        context: 'ReseñApp necesita mostrar el contenido de formas distintas según la pantalla: top valoradas, agrupadas por tipo, media de puntuación por ítem y resultados de búsqueda. El array de datos llega del servidor como JSON; el cliente JS debe transformarlo antes de renderizarlo.',
        objective: 'Implementar cuatro funciones puras que reciban el array de reseñas y devuelvan la transformación correcta.',
        targetUser: 'Alumno de DAW que construye la capa de datos del cliente de ReseñApp.',
        restrictions: [
          'Usar solo métodos nativos de array (map, filter, reduce, find, sort, some, every).',
          'Las funciones deben ser puras: no mutar el array original.',
          'Sin librerías externas.',
          'El array mock debe tener al menos 8 reseñas con campos: id, titulo, categoria, puntuacion (1-10), año.',
        ],
        deliverables: [
          'Repositorio GitHub con el código (enlace en la entrega).',
          'Archivo resenas.js con el array mock y las cuatro funciones exportadas.',
          'Captura de consola mostrando el resultado de las cuatro funciones.',
        ],
        checklist: [
          'topValoradas(n) devuelve las n reseñas con mayor puntuación, ordenadas de mayor a menor.',
          'agruparPorCategoria() devuelve un objeto con una clave por categoría y un array de reseñas como valor.',
          'mediaPorCategoria() devuelve un objeto con la media de puntuación de cada categoría.',
          'buscarPorTexto(texto) devuelve las reseñas cuyo título incluye el texto (insensible a mayúsculas).',
          'El array original no se modifica tras llamar a ninguna función.',
        ],
        commonMistakes: [
          'Usar sort sin comparador numérico y obtener orden incorrecto.',
          'Mutar el array original dentro de filter o map.',
          'Calcular la media dividiendo por la longitud del array total en vez del grupo.',
          'La búsqueda por texto no es case-insensitive.',
        ],
        difficulty: 2,
        timeLimitMinutes: 60,
        skills: ['js-datos'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Las cuatro funciones devuelven los resultados esperados con el array mock proporcionado.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Uso correcto y expresivo de los métodos de array; sin bucles for/while donde un método funcional es más claro.',
          },
          {
            name: 'Buenas prácticas',
            description: 'Funciones puras, nombres descriptivos, sin mutaciones del array original.',
          },
          {
            name: 'Claridad',
            description: 'El código es legible sin necesidad de comentarios adicionales; la lógica de cada función es evidente.',
          },
        ],
      },
    },
    {
      title: 'Objetos, desestructuración y spread',
      objective: 'Modelar una reseña como objeto JS y manipularlo con desestructuración y spread.',
      theory:
        'Los objetos en JavaScript son colecciones de pares clave-valor. Cada propiedad puede contener cualquier tipo: primitivo, array u otro objeto. Definir la forma de un objeto de dominio (como una reseña) es el primer paso para trabajar con datos reales de una API.\n\nLa desestructuración permite extraer propiedades de un objeto (o elementos de un array) en variables locales con una sintaxis compacta: `const { titulo, puntuacion } = resena`. Acepta valores por defecto (`{ activo = true }`) y renombrado (`{ titulo: nombre }`).\n\nEl operador spread (`...`) copia las propiedades enumerables de un objeto en otro. Es la forma idiomática de crear copias modificadas sin mutar el original: `const actualizada = { ...resena, puntuacion: 9 }`. Combinado con rest en parámetros de función, permite recoger el resto de propiedades que no nos interesan.\n\nEn ReseñApp modelaremos cada ítem como un objeto con campos tipados y usaremos spread para actualizar reseñas o mezclar datos locales con los que llegan del servidor.',
      example:
        'const resena = { id: 1, titulo: "Dune", puntuacion: 9, categoria: "pelicula", año: 2021 };\nconst { titulo, puntuacion, categoria = "sin categoria" } = resena;\nconst actualizada = { ...resena, puntuacion: 10 };\nconsole.log(actualizada); // { id:1, titulo:"Dune", puntuacion:10, categoria:"pelicula", año:2021 }',
      concepts: ['Objeto literal', 'propiedad', 'desestructuración', 'valores por defecto', 'renombrado', 'spread', 'rest', 'copia superficial'],
      tools: ['Consola del navegador', 'Node.js REPL'],
      estimatedTimeMinutes: 35,
      challenge: {
        title: 'Modelo de reseña y operaciones con objetos',
        brief: 'Define la estructura de objeto de una reseña de ReseñApp y crea funciones que la manipulen usando desestructuración y spread.',
        context: 'Antes de hacer fetch a la API del servidor, el cliente JS necesita una representación clara del modelo de datos. Este reto formaliza ese modelo y practica su manipulación de forma segura (sin mutaciones).',
        objective: 'Crear un módulo que defina el modelo Reseña y exponga funciones para crear, actualizar y formatear reseñas usando desestructuración y spread.',
        targetUser: 'Alumno de DAW construyendo la capa de modelo del cliente ReseñApp.',
        restrictions: [
          'Una reseña tiene al menos: id, titulo, categoria ("pelicula"|"serie"|"juego"), puntuacion (1-10), año, autor.',
          'Las funciones de actualización no deben mutar el objeto recibido.',
          'Usar desestructuración en al menos dos funciones.',
          'Usar spread en la función de actualización.',
        ],
        deliverables: [
          'Repositorio GitHub con el código (enlace en la entrega).',
          'Archivo modelo.js con la función crearResena, actualizarResena y formatearResena.',
          'Captura de consola con ejemplos de uso de las tres funciones.',
        ],
        checklist: [
          'crearResena({ titulo, categoria, puntuacion, año, autor }) devuelve un objeto completo con id generado.',
          'actualizarResena(resena, cambios) devuelve un nuevo objeto con los cambios aplicados sin mutar el original.',
          'formatearResena(resena) devuelve un string legible tipo "Dune (2021) — 9/10 [pelicula]".',
          'Se usan valores por defecto en la desestructuración donde tiene sentido.',
          'El objeto original no cambia tras llamar a actualizarResena.',
        ],
        commonMistakes: [
          'Asignar directamente resena.puntuacion = x en vez de usar spread.',
          'No usar desestructuración cuando simplifica la lectura.',
          'Olvidar que spread hace copia superficial: objetos anidados siguen siendo la misma referencia.',
          'Generar ids duplicados o no incrementales.',
        ],
        difficulty: 2,
        timeLimitMinutes: 45,
        skills: ['js-datos'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Las tres funciones producen los resultados correctos; actualizarResena no muta el objeto original.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Uso expresivo de desestructuración y spread; sin código redundante.',
          },
          {
            name: 'Buenas prácticas',
            description: 'Inmutabilidad respetada, nombres de variables descriptivos, sin efectos secundarios inesperados.',
          },
          {
            name: 'Claridad',
            description: 'La forma del objeto Reseña es evidente al leer el código; las funciones tienen un propósito claro.',
          },
        ],
      },
    },
  ],
};
