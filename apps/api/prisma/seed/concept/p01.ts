import { type PhaseSeed } from '../content-types.js';

export const conceptP01: PhaseSeed = {
  code: 'FASE 1',
  title: 'APIs y JSON',
  objective:
    'Entender la API como un contrato y JSON como el idioma común.',
  unlockedSkills: ['api-rest', 'js-fundamentos'],
  projects: [],
  lessons: [
    // ── L1 ─────────────────────────────────────────────────────────────────
    {
      title: '¿Qué es una API?',
      objective:
        'Comprender que una API es un contrato entre cliente y servidor, sin importar cómo funciona el otro lado por dentro.',
      theory:
        'Una API (Application Programming Interface) es un contrato: alguien expone una dirección a la que puedes hacer una petición y, a cambio, recibes datos o la confirmación de que algo ocurrió. No necesitas saber cómo está construido el otro lado; solo necesitas conocer el contrato: qué dirección, qué datos envías, qué recibes.\n\nImagina que en un restaurante le dices al camarero lo que quieres; él va a la cocina y te trae el plato. Tú no entras a la cocina ni conoces la receta: el camarero es la API. Das una petición, recibes una respuesta. El contrato es: «dime lo que quieres de la carta y yo te lo traigo».\n\nEn la web, el cliente hace una petición HTTP a la URL de la API, y el servidor devuelve datos sin que el cliente sepa nada de la base de datos ni del lenguaje del servidor. Eso es la potencia del contrato: desacopla completamente a quien pide de quien sirve.',
      concepts: ['api', 'contrato', 'cliente', 'servidor', 'desacoplamiento'],
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
            'Una API es un contrato entre quien pide algo y quien lo sirve: el cliente hace una petición a una dirección conocida y recibe una respuesta, sin necesitar saber cómo funciona el otro lado por dentro. Ejemplo cotidiano: el camarero de un restaurante actúa como API —le dices lo que quieres (petición), él lleva la orden a la cocina y te trae el resultado (respuesta)— sin que tú entres a la cocina ni conozcas la receta.',
        },
      },
    },

    // ── L2 ─────────────────────────────────────────────────────────────────
    {
      title: 'JSON en la práctica',
      objective:
        'Convertir un objeto JavaScript a JSON y de vuelta a objeto usando JSON.stringify y JSON.parse.',
      theory:
        'JSON (JavaScript Object Notation) es texto con una estructura muy concreta: objetos con llaves {}, arrays con corchetes [], strings entre comillas dobles, números, booleanos y null. Esa simplicidad y legibilidad lo han convertido en el idioma estándar con el que cliente y servidor intercambian datos en la web.\n\nCuando el servidor quiere enviarte datos, convierte sus objetos internos a texto JSON. Cuando el cliente los recibe, los convierte de nuevo a objetos con los que puede trabajar. En JavaScript, JSON.stringify(objeto) convierte un objeto a texto JSON, y JSON.parse(texto) hace el camino inverso.\n\nEntender esta conversión es fundamental: lo que viaja por la red siempre es texto, y JSON es el formato de ese texto. Cualquier lenguaje (Python, Java, PHP…) sabe leer y escribir JSON, lo que lo convierte en el puente universal entre sistemas.',
      concepts: ['json', 'stringify', 'parse', 'serialización', 'texto', 'objeto'],
      tools: [],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Convierte una reseña a JSON y de vuelta',
        brief:
          'Escribe el código para convertir un objeto a texto JSON, imprimirlo y volver a objeto para acceder a un campo concreto.',
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
            'Convierte el objeto reseña a JSON con JSON.stringify e imprímelo con console.log; luego conviértelo de vuelta a objeto con JSON.parse e imprime su campo "nota".',
          starterCode: `const resena = { titulo: 'Inception', nota: 9 };
// TODO`,
          solution: `const resena = { titulo: 'Inception', nota: 9 };

const textoJson = JSON.stringify(resena);
console.log(textoJson); // {"titulo":"Inception","nota":9}

const objeto = JSON.parse(textoJson);
console.log(objeto.nota); // 9`,
        },
      },
    },

    // ── L3 ─────────────────────────────────────────────────────────────────
    {
      title: '¿Qué JSON es válido?',
      objective:
        'Distinguir JSON sintácticamente correcto de variantes inválidas muy frecuentes.',
      theory:
        'JSON tiene reglas de sintaxis estrictas que lo diferencian de la notación de objetos de JavaScript. La más importante: todas las claves y todos los valores de tipo cadena deben ir entre comillas dobles, nunca simples. Tampoco se permiten comas finales después del último elemento ni comentarios.\n\nEsas diferencias provocan errores frecuentes: copiar un objeto JS directamente como JSON (usando comillas simples o claves sin comillas) hace que JSON.parse lance una excepción y que el servidor rechace la petición.\n\nAprender a identificar JSON válido a simple vista ahorra mucho tiempo de depuración. El truco rápido: si ves comillas simples, clave sin comillas o coma después del último valor, no es JSON válido.',
      concepts: ['json', 'sintaxis', 'comillas dobles', 'coma final', 'validación'],
      tools: [],
      estimatedTimeMinutes: 8,
      challenge: {
        title: '¿Cuál de estas cadenas es JSON válido?',
        brief:
          'Elige la única opción que cumple estrictamente la sintaxis JSON.',
        difficulty: 1,
        timeLimitMinutes: 3,
        skills: ['api-rest', 'js-fundamentos'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'quiz',
          prompt:
            'De las siguientes cadenas de texto, ¿cuál es JSON válido que JSON.parse aceptaría sin error?',
          runner: 'none',
          quiz: {
            options: [
              { id: 'a', text: `{'titulo':'Inception','nota':9}` },
              { id: 'b', text: `{titulo:"Inception",nota:9}` },
              { id: 'c', text: `{"titulo":"Inception","nota":9}` },
              { id: 'd', text: `{"titulo":"Inception","nota":9,}` },
            ],
            correctIds: ['c'],
            multiple: false,
            explanation:
              'Solo la opción c es JSON válido: claves y valores de cadena entre comillas dobles, sin coma final. La opción a usa comillas simples (inválido en JSON). La b tiene claves sin comillas (válido en JS pero no en JSON). La d tiene una coma final después del último valor, lo que JSON no permite.',
          },
        },
      },
    },
  ],
};
