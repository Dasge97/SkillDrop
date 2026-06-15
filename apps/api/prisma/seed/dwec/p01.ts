import { type PhaseSeed } from '../content-types.js';

export const dwecP01: PhaseSeed = {
  code: 'FASE 1',
  title: 'Fundamentos de JavaScript',
  objective:
    'Escribir sentencias JavaScript correctas usando variables, tipos, operadores, estructuras de control y plantillas literales aplicadas a lógica real de ReseñApp.',
  unlockedSkills: ['js-fundamentos'],
  projects: ['Módulo de utilidades de ReseñApp'],
  lessons: [
    {
      title: 'Variables, tipos y operadores',
      objective:
        'Declarar variables con let/const, distinguir los tipos primitivos y aplicar operadores y comparaciones estrictas.',
      theory:
        'JavaScript tiene dos palabras clave modernas para declarar variables: const para valores que no se reasignarán y let para los que sí. Evita var: su ámbito de función y su hoisting generan bugs difíciles de detectar. La regla práctica es empezar con const y cambiar a let solo cuando necesites reasignar.\n\nLos tipos primitivos son: string, number, boolean, null, undefined, bigint y symbol. Los más usados en el día a día son los tres primeros. Atención a las comparaciones: == hace coerción de tipos (convierte antes de comparar) y produce resultados inesperados, como 0 == false siendo true. Usa siempre === para comparar valor y tipo a la vez.\n\nLas plantillas literales (template literals) usan backticks y permiten incrustar expresiones con ${expresión}. Son la forma moderna de construir cadenas dinámicas: más legibles que la concatenación con + y soportan saltos de línea directamente en el código.',
      example:
        'const titulo = "Dune";\nconst nota = 4.5;\nconst resumen = `"${titulo}" tiene una nota de ${nota}/5`;\nconsole.log(resumen); // "Dune" tiene una nota de 4.5/5',
      concepts: [
        'const vs let vs var',
        'Tipos primitivos',
        'Coerción de tipos',
        '=== vs ==',
        'Operadores aritméticos y lógicos',
        'Plantillas literales',
      ],
      tools: ['DevTools Console', 'VS Code'],
      estimatedTimeMinutes: 35,
      challenge: {
        title: 'Utilidades básicas de ReseñApp — parte 1',
        brief:
          'Escribe las primeras funciones de utilidad de ReseñApp: formatear el título de un ítem y mostrar su nota con estrellas. Pruébalas en consola con datos de ejemplo.',
        context:
          'En ReseñApp los ítems (pelis, series, juegos) tienen un título y una nota del 1 al 5. Antes de tener interfaz necesitamos las funciones que procesan esos datos.',
        objective:
          'Tener dos funciones puras y bien nombradas que transforman datos de un ítem y verlas funcionar en la consola con al menos 3 casos de prueba.',
        targetUser: 'El propio alumno comprobando que la lógica funciona antes de conectarla a la UI.',
        restrictions: [
          'Solo const y let, sin var.',
          'Usar plantillas literales para construir las cadenas de salida.',
          'Comparaciones estrictas (===) en todos los condicionales.',
          'Sin librerías externas; solo JS vanilla.',
          'El código debe estar en el repositorio de la FASE 0, en un fichero src/utils.js.',
        ],
        deliverables: [
          'Enlace al commit en el repositorio de GitHub con el fichero src/utils.js.',
          'Captura de la consola mostrando los resultados de las 3 pruebas.',
        ],
        checklist: [
          'formatTitle(titulo, tipo) devuelve un string como "Dune [Película]".',
          'renderStars(nota) devuelve una cadena de estrellas llenas y vacías (p. ej. "★★★★☆" para 4/5).',
          'Ambas funciones se exportan con export function.',
          'main.js las importa y llama al menos 3 veces cada una con datos distintos.',
          'No hay errores en consola.',
          'Las comparaciones usan ===.',
        ],
        commonMistakes: [
          'Usar == en vez de === y no detectar el bug cuando nota es "4" (string) en lugar de 4 (number).',
          'Olvidar el export y que la importación en main.js falle silenciosamente.',
          'Mutar parámetros de la función en lugar de devolver un valor nuevo.',
          'Plantilla literal con comillas simples o dobles en vez de backticks.',
        ],
        difficulty: 2,
        timeLimitMinutes: 50,
        skills: ['js-fundamentos'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description:
              'Las dos funciones producen el resultado correcto para todos los casos de prueba sin errores en consola.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description:
              'Funciones cortas y con nombre descriptivo; sin código muerto; plantillas literales bien usadas.',
          },
          {
            name: 'Buenas prácticas',
            description:
              'const/let correctamente elegidos; comparaciones estrictas; export/import ES modules.',
          },
          {
            name: 'Claridad / organización',
            description:
              'El fichero src/utils.js es fácil de leer; las pruebas en consola muestran el resultado esperado junto al dato de entrada.',
          },
        ],
      },
    },
    {
      title: 'Control de flujo y funciones de utilidad',
      objective:
        'Usar if/switch/for/while para construir lógica de filtrado y cálculo aplicada a colecciones de reseñas de ReseñApp.',
      theory:
        'El control de flujo determina qué código se ejecuta y cuántas veces. if/else encadena condiciones mutuamente excluyentes; switch es útil cuando el valor de una expresión puede tomar varios casos discretos (como el tipo de ítem: película, serie, juego). Para repetir código existen for (cuando sabes cuántas iteraciones), while (cuando la condición cambia dentro del bucle) y los métodos de array como forEach, filter o map, que son más expresivos para colecciones.\n\nUna función debe hacer una sola cosa y hacerla bien. El nombre debe describir esa acción: calcularMedia, filtrarPorNota, formatearResena. Los parámetros con valores por defecto (function foo(min = 1)) hacen las funciones más flexibles sin necesidad de comprobar undefined manualmente. Devuelve siempre un valor explícito con return; una función que no devuelve nada devuelve undefined de forma implícita, lo que suele ser un bug encubierto.',
      example:
        'function calcularMedia(resenas) {\n  if (resenas.length === 0) return 0;\n  const suma = resenas.reduce((acc, r) => acc + r.nota, 0);\n  return suma / resenas.length;\n}\n\nfunction filtrarPorNota(resenas, minNota = 3) {\n  return resenas.filter(r => r.nota >= minNota);\n}',
      concepts: [
        'if / else if / else',
        'switch / case / break',
        'for / while',
        'Funciones declaradas vs expresiones',
        'Parámetros con valor por defecto',
        'return explícito',
        'Array.filter, Array.reduce',
      ],
      tools: ['DevTools Console', 'VS Code'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'Utilidades de ReseñApp — parte 2: cálculo y filtrado',
        brief:
          'Añade a src/utils.js tres funciones: calcularMedia (media de notas de un array de reseñas), filtrarPorNota (devuelve las reseñas con nota >= minNota) y clasificarItem (devuelve "Muy bien" / "Bien" / "Regular" / "Mal" según la media). Pruébalas con un array de reseñas de ejemplo.',
        context:
          'La lógica de negocio de ReseñApp necesita estas funciones antes de que exista interfaz. Si la lógica está bien separada en utils.js, conectarla a la UI en fases posteriores será trivial.',
        objective:
          'Tres funciones puras, exportadas y testeadas en consola con un conjunto de datos realista de al menos 5 reseñas de distintos ítems.',
        targetUser: 'El propio alumno verificando que la lógica de negocio es correcta antes de construir la UI.',
        restrictions: [
          'Sin librerías externas.',
          'calcularMedia debe devolver 0 si el array está vacío, sin lanzar error.',
          'filtrarPorNota debe tener minNota = 1 como valor por defecto.',
          'clasificarItem debe usar switch o if/else encadenado sobre rangos numéricos.',
          'Código en src/utils.js del repositorio ya existente; main.js lo importa y ejecuta.',
        ],
        deliverables: [
          'Enlace al commit en GitHub con los cambios en src/utils.js y main.js.',
          'Captura de consola mostrando los resultados de las pruebas con los 5 ítems de ejemplo.',
        ],
        checklist: [
          'calcularMedia([]) devuelve 0 sin error.',
          'calcularMedia con notas [5,4,3] devuelve 4.',
          'filtrarPorNota devuelve solo reseñas con nota >= minNota.',
          'clasificarItem devuelve la etiqueta correcta para cada rango.',
          'Las tres funciones están exportadas y se importan en main.js.',
          'No hay errores en consola.',
          'El código usa for, while o métodos de array (al menos uno de cada estilo en el conjunto de funciones).',
        ],
        commonMistakes: [
          'División por cero en calcularMedia cuando el array está vacío.',
          'switch sin break que provoca fall-through inesperado.',
          'Comparar nota con == en vez de >= y perder el caso exacto.',
          'No exportar las funciones nuevas y que main.js falle al importarlas.',
          'Mutar el array original dentro de filtrarPorNota en lugar de devolver uno nuevo.',
        ],
        difficulty: 2,
        timeLimitMinutes: 55,
        skills: ['js-fundamentos'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description:
              'Las tres funciones producen el resultado correcto para todos los casos de prueba, incluido el array vacío.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description:
              'Funciones cortas, con nombre descriptivo y return explícito; sin efectos colaterales en filtrarPorNota.',
          },
          {
            name: 'Buenas prácticas',
            description:
              'Parámetros por defecto usados correctamente; switch/if con casos cubiertos exhaustivamente; sin magic numbers.',
          },
          {
            name: 'Claridad / organización',
            description:
              'Las pruebas en consola muestran el input y el output esperado; el código está comentado donde la lógica no es obvia.',
          },
        ],
      },
    },
  ],
};
