import { type PhaseSeed } from '../content-types.js';

export const conceptP01: PhaseSeed = {
  code: 'FASE 1',
  title: 'APIs y JSON',
  objective:
    'Entender qué es una API (un contrato) y JSON (el idioma común para intercambiar datos).',
  unlockedSkills: ['api-rest'],
  projects: [],
  lessons: [
    {
      title: '¿Qué es una API?',
      objective:
        'Comprender que una API es un contrato entre cliente y servidor: pides algo a una dirección y recibes datos a cambio.',
      theory:
        'Una API (Application Programming Interface) es un contrato: alguien expone una dirección a la que puedes hacer una petición y, a cambio, recibes datos o confirma que ocurrió algo. No necesitas saber cómo está construido el otro lado; solo necesitas conocer el contrato (qué dirección, qué datos envías, qué recibes).\n\nImagina que en un restaurante le dices al camarero lo que quieres; el camarero va a la cocina, y la cocina te prepara el plato. Tú no entras a la cocina ni sabes cómo se hace la comida: el camarero es la API. Das una petición, recibes una respuesta.\n\nEn la web, el cliente (normalmente el navegador o una app) hace una petición a la URL de la API, y el servidor devuelve datos —normalmente en formato JSON— sin que el cliente sepa nada de la base de datos ni del lenguaje del servidor.',
      concepts: ['api', 'contrato', 'cliente', 'servidor', 'petición', 'respuesta'],
      tools: [],
      estimatedTimeMinutes: 10,
      challenge: {
        title: 'Explica una API con tus palabras',
        brief:
          'Sin usar términos técnicos complejos, explica qué es una API y pon un ejemplo cotidiano que no sea informático.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['api-rest'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'short',
          runner: 'none',
          prompt:
            'Explica con tus palabras qué es una API y pon un ejemplo cotidiano (no técnico).',
          solution:
            'Una API es un contrato entre quien pide algo y quien lo sirve: el cliente hace una petición a una dirección conocida y recibe una respuesta, sin necesitar saber cómo funciona el otro lado por dentro. Ejemplo cotidiano: un camarero en un restaurante actúa como API —le dices lo que quieres (petición), él lo lleva a la cocina y te trae el resultado (respuesta)— sin que tú entres a la cocina.',
        },
      },
    },
    {
      title: 'JSON, el idioma común',
      objective:
        'Entender qué es JSON y cómo convertir objetos JavaScript a JSON y viceversa.',
      theory:
        'JSON (JavaScript Object Notation) es texto con una estructura muy concreta: objetos con llaves `{}`, arrays con corchetes `[]`, strings entre comillas dobles, números, booleanos (`true`/`false`) y `null`. Esa estructura es tan sencilla y legible que se ha convertido en el idioma estándar con el que cliente y servidor se intercambian datos en la web.\n\nCuando el servidor quiere enviarte datos, convierte sus objetos internos a texto JSON; cuando el cliente los recibe, los convierte de nuevo a objetos con los que puede trabajar. En JavaScript, `JSON.stringify(objeto)` convierte un objeto a texto JSON, y `JSON.parse(texto)` hace el camino inverso.\n\nEntender esta conversión es fundamental: lo que viaja por la red siempre es texto, y JSON es el formato de ese texto. Cualquier lenguaje (Python, Java, PHP…) sabe leer y escribir JSON, lo que lo convierte en el puente universal entre sistemas.',
      concepts: ['json', 'stringify', 'parse', 'serialización', 'texto', 'objeto'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Convierte una reseña a JSON y de vuelta',
        brief:
          'Practica la conversión entre objeto JavaScript y texto JSON usando JSON.stringify y JSON.parse.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Tienes un objeto reseña. Conviértelo a JSON con JSON.stringify, imprímelo con console.log, y vuelve a objeto con JSON.parse; imprime su campo "nota".',
          starterCode: `const resena = { titulo: 'Inception', nota: 9 };

// TODO: convierte resena a texto JSON con JSON.stringify e imprímelo
// TODO: convierte ese texto de vuelta a objeto con JSON.parse
// TODO: imprime el campo 'nota' del objeto resultante
`,
          solution: `const resena = { titulo: 'Inception', nota: 9 };

const textoJson = JSON.stringify(resena);
console.log(textoJson); // {"titulo":"Inception","nota":9}

const objeto = JSON.parse(textoJson);
console.log(objeto.nota); // 9
`,
        },
      },
    },
  ],
};
