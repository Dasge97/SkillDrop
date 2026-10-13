import { type PhaseSeed } from '../content-types.js';

// Delimitador de bloque de código y unión de párrafos (separados por línea en blanco).
const C = '```';
const t = (...parrafos: string[]): string => parrafos.join('\n\n');

const RUBRICA = [
  { name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true },
];

export const dwecPasoP03: PhaseSeed = {
  code: 'FASE 3',
  title: 'Operadores y decisiones',
  objective:
    'Dominar los operadores de JavaScript (aritméticos, de comparación, lógicos, ?? y ?.) y usar if, el ternario y switch para que tu programa tome decisiones sin sorpresas.',
  unlockedSkills: ['js-fundamentos'],
  projects: [],
  lessons: [
    // ── L1 ─────────────────────────────────────────────────────────────────
    {
      title: 'Operadores aritméticos y precedencia',
      objective:
        'Usar %, **, ++ y la asignación compuesta, y saber en qué orden evalúa JavaScript una expresión.',
      theory: t(
        `Además de \`+ - * /\`, hay tres operadores que se usan mucho. \`%\` (módulo) da el resto de una división entera: \`17 % 5\` es 2, porque 17 = 5·3 + 2. Sirve para saber si un número es par (\`n % 2 === 0\`) o para "dar la vuelta" (posiciones en un carrusel). \`**\` es la potencia: \`2 ** 3\` es 8.`,
        `\`++\` suma 1 a una variable y \`--\` resta 1. La trampa está en la posición. Con \`x++\` (postfijo) la expresión devuelve el valor ANTES de sumar; con \`++x\` (prefijo) devuelve el valor DESPUÉS. En ambos casos la variable termina incrementada.`,
        `${C}js
let x = 5;
console.log(x++); // 5  (devuelve el viejo y luego suma)
console.log(x);   // 6
console.log(++x); // 7  (suma y devuelve el nuevo)
let total = 10;
total += 5;       // igual que total = total + 5 -> 15
total *= 2;       // igual que total = total * 2 -> 30
${C}`,
        `La asignación compuesta (\`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\`, \`**=\`) es solo una abreviatura: opera con el valor actual y guarda el resultado en la misma variable. Ojo: \`+=\` con un string concatena, igual que \`+\`.`,
        `Precedencia: igual que en matemáticas, no todo se evalúa de izquierda a derecha. Primero \`**\`, luego \`* / %\`, y después \`+ -\`. Así, \`2 + 3 * 2 ** 2\` es \`2 + 3 * 4\` = 14. Los paréntesis mandan sobre todo: \`(2 + 3) * 4\` es 20.`,
        `Regla práctica: si dudas del orden, pon paréntesis. No cuestan nada y hacen que quien lea el código (tú dentro de un mes) no tenga que adivinar.`,
      ),
      example: 'const n = 7;\nconsole.log(n % 2 === 0 ? "par" : "impar"); // "impar"\nconsole.log((n + 3) / 2);                    // 5',
      concepts: ['módulo %', 'potencia **', 'incremento ++', 'asignación compuesta', 'precedencia'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'x++, módulo y precedencia',
        brief: 'Predice qué imprime un código con incremento postfijo, módulo y potencia.',
        difficulty: 2,
        timeLimitMinutes: 7,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            '¿Qué imprime este código, línea a línea?\n\nlet x = 5;\nconsole.log(x++);\nconsole.log(x);\nconsole.log(17 % 5);\nconsole.log(2 + 3 * 2 ** 2);',
          quiz: {
            options: [
              { id: 'a', text: '5, 6, 2, 14' },
              { id: 'b', text: '6, 6, 2, 14' },
              { id: 'c', text: '5, 6, 3, 14' },
              { id: 'd', text: '5, 6, 2, 100' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'x++ devuelve el valor antiguo (5) y después incrementa, así que la siguiente línea ya ve 6. 17 % 5 es el resto de 17 entre 5: 5·3 = 15, sobran 2 (no 3, que sería el cociente). En 2 + 3 * 2 ** 2 primero va la potencia (4), luego la multiplicación (12) y al final la suma: 14. Daría 100 solo si se evaluase de izquierda a derecha ((2+3)*2 = 10, 10**2 = 100), que no es como funciona la precedencia.',
          },
        },
      },
    },

    // ── L2 ─────────────────────────────────────────────────────────────────
    {
      title: '== frente a ===: compara siempre en estricto',
      objective:
        'Entender qué hace la igualdad débil == y por qué conviene usar siempre === y !==.',
      theory: t(
        `JavaScript tiene dos formas de comparar igualdad. La estricta, \`===\` (y su contraria \`!==\`), compara tipo y valor: si los tipos son distintos, da \`false\` sin más. La débil, \`==\` (y \`!=\`), si los tipos son distintos, primero intenta convertirlos a un tipo común y luego compara.`,
        `Esa conversión previa sigue reglas poco intuitivas, y por eso produce resultados que nadie espera:`,
        `${C}js
console.log('1' == 1);            // true  ("1" se convierte a 1)
console.log('1' === 1);           // false (string vs number)
console.log(0 == '');             // true  ("" se convierte a 0)
console.log(false == '0');        // true  (ambos acaban siendo 0)
console.log(null == undefined);   // true  (regla especial)
console.log(null === undefined);  // false
console.log(null == 0);           // false (otra regla especial)
${C}`,
        `Con \`===\` no hay sorpresas: lo que ves es lo que se compara. Si quieres comparar un texto de un formulario con un número, conviértelo tú antes (\`Number(campo) === 18\`) y así queda claro en el código qué estás haciendo.`,
        `Un caso especial: \`NaN\` no es igual a nada, ni con \`==\` ni con \`===\`, ni siquiera a sí mismo. Para detectarlo usa \`Number.isNaN()\`.`,
        `Regla: usa siempre \`===\` y \`!==\`. La única excepción que verás en código profesional es \`valor == null\`, que es un atajo para "es null o undefined". Si no estás seguro, no la uses. Los linters (ESLint) marcan \`==\` como aviso justo por esto.`,
      ),
      example: 'const edadTexto = "18";\nconsole.log(edadTexto === 18);         // false\nconsole.log(Number(edadTexto) === 18); // true',
      concepts: ['igualdad estricta ===', 'igualdad débil ==', 'coerción', '!==', 'NaN'],
      tools: ['DevTools', 'VS Code'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Cuáles dan true?',
        brief: 'Identifica qué comparaciones devuelven true teniendo en cuenta la conversión de ==.',
        difficulty: 2,
        timeLimitMinutes: 7,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: '¿Cuáles de estas comparaciones devuelven true? Marca todas las correctas.',
          quiz: {
            options: [
              { id: 'a', text: "0 == ''" },
              { id: 'b', text: "0 === ''" },
              { id: 'c', text: 'null == undefined' },
              { id: 'd', text: 'null === undefined' },
              { id: 'e', text: "'1' == 1" },
            ],
            correctIds: ['a', 'c', 'e'],
            multiple: true,
            explanation:
              "Con ==, si los tipos difieren se convierten antes de comparar: '' pasa a 0, así que 0 == '' es true; '1' pasa a 1, así que '1' == 1 es true. null == undefined es true por una regla especial del lenguaje. En cambio, === no convierte nada: 0 === '' compara number con string y da false, y null === undefined da false porque son tipos distintos.",
          },
        },
      },
    },

    // ── L3 ─────────────────────────────────────────────────────────────────
    {
      title: 'Operadores lógicos y cortocircuito',
      objective:
        'Entender que && y || devuelven uno de sus operandos (no siempre un booleano) y que se detienen en cuanto saben el resultado.',
      theory: t(
        `\`&&\` (Y), \`||\` (O) y \`!\` (NO) sirven para combinar condiciones: \`edad >= 18 && tieneDni\`. Hasta aquí, lo que esperas. Lo que casi nadie te cuenta es cómo funcionan por dentro, y eso explica muchísimo código que verás.`,
        `\`||\` evalúa de izquierda a derecha y devuelve el primer operando truthy que encuentra; si no hay ninguno, devuelve el último. \`&&\` devuelve el primer operando falsy; si todos son truthy, devuelve el último. Fíjate: devuelven el valor del operando, no \`true\` o \`false\`. Solo \`!\` devuelve siempre un booleano.`,
        `${C}js
console.log('' || 'invitado');   // "invitado" (el '' es falsy, sigue)
console.log('Ana' || 'invitado'); // "Ana"
console.log('Ana' && 'Luis');    // "Luis" (todo truthy: el último)
console.log(0 && 'nunca');       // 0 (el primer falsy)
console.log(!'hola');            // false
console.log(!!'hola');           // true (doble ! = convertir a booleano)
${C}`,
        `Cortocircuito: en cuanto el operador sabe el resultado, deja de evaluar. Si el lado izquierdo de \`||\` es truthy, el derecho ni se ejecuta. Si el izquierdo de \`&&\` es falsy, tampoco. Por eso se usa \`usuario && usuario.nombre\` para no leer \`.nombre\` de algo que no existe, y \`nombre || 'invitado'\` para poner un valor por defecto.`,
        `Precedencia: \`!\` va primero, luego \`&&\` y después \`||\`. Así, \`a || b && c\` es \`a || (b && c)\`. Si mezclas \`&&\` y \`||\` en la misma expresión, pon paréntesis aunque no hagan falta.`,
        `Error típico: escribir \`if (x == 1 || 2)\` pensando "si x es 1 o 2". Eso es \`(x == 1) || 2\`, y como \`2\` es truthy, la condición es siempre verdadera. Hay que repetir la comparación: \`x === 1 || x === 2\`.`,
      ),
      example: 'const nombreUsuario = "";\nconst mostrado = nombreUsuario || "Anónimo";\nconsole.log(mostrado); // "Anónimo"',
      concepts: ['&&', '||', '!', 'cortocircuito', 'valor por defecto'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Qué devuelven && y ||',
        brief: 'Predice el resultado de varios operadores lógicos aplicados a valores que no son booleanos.',
        difficulty: 2,
        timeLimitMinutes: 7,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "¿Qué imprime este código, línea a línea?\n\nconsole.log('' || 'invitado');\nconsole.log('Ana' && 'Luis');\nconsole.log(0 && 'nunca');\nconsole.log(!'hola');",
          quiz: {
            options: [
              { id: 'a', text: 'invitado, Luis, 0, false' },
              { id: 'b', text: 'true, true, false, false' },
              { id: 'c', text: 'invitado, Ana, nunca, false' },
              { id: 'd', text: 'invitado, true, false, hola' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              "|| devuelve el primer valor truthy: '' es falsy, así que devuelve 'invitado'. && devuelve el primer falsy o, si no hay, el último: 'Ana' y 'Luis' son truthy, devuelve 'Luis'. En 0 && 'nunca', 0 ya es falsy y && se detiene ahí devolviéndolo. ! siempre devuelve booleano: 'hola' es truthy, así que !'hola' es false. La b falla porque && y || no convierten a booleano; la c confunde qué operando devuelve cada uno; la d también.",
          },
        },
      },
    },

    // ── L4 ─────────────────────────────────────────────────────────────────
    {
      title: '?? frente a ||: cuando 0 y "" son valores válidos',
      objective:
        'Usar el operador ?? para poner valores por defecto sin perder 0, "" o false.',
      theory: t(
        `En la lección anterior viste \`valor || 'por defecto'\`. Funciona, pero tiene un fallo: \`||\` salta al valor por defecto con cualquier falsy, y entre los falsy están \`0\`, \`''\` y \`false\`, que muchas veces son valores perfectamente válidos.`,
        `Imagina un selector de cantidad: si el usuario elige 0 unidades, \`cantidad || 1\` te devuelve 1. Has cambiado su elección sin que nadie se entere. Lo mismo con un volumen a 0 o un comentario vacío a propósito.`,
        `El operador \`??\` (nullish coalescing) solo usa el valor de la derecha si el de la izquierda es \`null\` o \`undefined\`, es decir, si de verdad "no hay valor". Con cualquier otra cosa, incluidos \`0\`, \`''\` y \`false\`, se queda con el de la izquierda.`,
        `${C}js
const unidades = 0;
const descuento = null;
console.log(unidades || 1);   // 1   (¡ha machacado el 0!)
console.log(unidades ?? 1);   // 0   (0 es un valor válido)
console.log(descuento ?? 10); // 10  (null = no hay valor)
console.log('' ?? 'x');       // ""  (string vacío se respeta)
${C}`,
        `Regla para elegir: usa \`??\` cuando quieras un valor por defecto "si no viene nada". Usa \`||\` solo cuando de verdad quieras sustituir también los vacíos y los ceros (por ejemplo, un nombre vacío que quieres mostrar como "Anónimo"). En la duda, \`??\`.`,
        `También existe la versión de asignación: \`config.volumen ??= 50\` asigna 50 solo si \`config.volumen\` es null o undefined.`,
      ),
      example: 'const ajustes = { volumen: 0 };\nconsole.log(ajustes.volumen || 50); // 50 (mal)\nconsole.log(ajustes.volumen ?? 50); // 0 (bien)',
      concepts: ['??', 'nullish', 'valor por defecto', '||', '??='],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Valores por defecto sin perder el 0',
        brief: 'Compara || y ?? con un valor 0 y otro null, e imprime los resultados.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Tienes unidades = 0 y descuento = null. Imprime, cada uno en su línea:\n1) unidades con valor por defecto 1 usando || (verás que sale 1, el error)\n2) unidades con valor por defecto 1 usando ?? (debe salir 0)\n3) descuento con valor por defecto 10 usando ?? (debe salir 10)',
          starterCode:
            'const unidades = 0;\nconst descuento = null;\n\n// TODO: 1) unidades || 1\n// TODO: 2) unidades ?? 1\n// TODO: 3) descuento ?? 10\n',
          solution:
            'const unidades = 0;\nconst descuento = null;\n\nconsole.log(unidades || 1);   // 1\nconsole.log(unidades ?? 1);   // 0\nconsole.log(descuento ?? 10); // 10',
        },
      },
    },

    // ── L5 ─────────────────────────────────────────────────────────────────
    {
      title: 'if, else if y else',
      objective:
        'Escribir cadenas de decisiones con if / else if / else en el orden correcto.',
      theory: t(
        `\`if\` ejecuta un bloque solo si la condición es truthy. \`else\` recoge el caso contrario. Y \`else if\` permite encadenar varias condiciones: JavaScript las comprueba de arriba abajo y ejecuta solo el primer bloque cuya condición se cumple; el resto se salta, aunque también se cumplieran.`,
        `${C}js
const nota = 6;
if (nota < 5) {
  console.log('Suspenso');
} else if (nota < 7) {
  console.log('Aprobado');   // entra aquí y no sigue mirando
} else if (nota < 9) {
  console.log('Notable');
} else {
  console.log('Sobresaliente');
}
${C}`,
        `Por eso el orden importa. Fíjate en que en el segundo \`else if\` no hace falta escribir \`nota >= 5 && nota < 7\`: si has llegado ahí es porque la condición anterior (\`nota < 5\`) fue falsa. Si pusieras \`nota < 9\` primero, un 3 entraría en "Notable".`,
        `Comprueba primero los casos raros (datos no válidos) y luego los normales. Así te los quitas de en medio y el resto del código puede dar por hecho que el dato es correcto.`,
        `Errores típicos: escribir \`if (nota = 10)\` con un solo \`=\` (eso asigna 10 y la condición siempre es truthy; usa \`===\`), y poner \`;\` justo después del paréntesis (\`if (x > 0);\`), que deja el \`if\` vacío y hace que el bloque siguiente se ejecute siempre. Usa siempre llaves, aunque el bloque tenga una sola línea.`,
      ),
      example: 'const temperatura = 30;\nif (temperatura > 25) {\n  console.log("Calor");\n} else {\n  console.log("Se está bien");\n}',
      concepts: ['if', 'else if', 'else', 'orden de las condiciones', 'bloque'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Calcula la calificación',
        brief: 'Escribe una función con if / else if / else que convierta una nota numérica en su calificación.',
        difficulty: 2,
        timeLimitMinutes: 12,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Completa la función calificacion(nota) con if / else if / else para que devuelva:\n- "Nota no válida" si la nota es menor que 0 o mayor que 10\n- "Suspenso" si es menor que 5\n- "Aprobado" si es menor que 7\n- "Notable" si es menor que 9\n- "Sobresaliente" en el resto de casos\nEl código ya imprime los resultados para 4, 5, 6.9, 9 y 11. Deben salir: Suspenso, Aprobado, Aprobado, Sobresaliente, Nota no válida.',
          starterCode:
            'function calificacion(nota) {\n  // TODO: usa if / else if / else y devuelve el texto con return\n}\n\nconsole.log(calificacion(4));\nconsole.log(calificacion(5));\nconsole.log(calificacion(6.9));\nconsole.log(calificacion(9));\nconsole.log(calificacion(11));',
          solution:
            'function calificacion(nota) {\n  if (nota < 0 || nota > 10) {\n    return "Nota no válida";\n  } else if (nota < 5) {\n    return "Suspenso";\n  } else if (nota < 7) {\n    return "Aprobado";\n  } else if (nota < 9) {\n    return "Notable";\n  } else {\n    return "Sobresaliente";\n  }\n}\n\nconsole.log(calificacion(4));   // Suspenso\nconsole.log(calificacion(5));   // Aprobado\nconsole.log(calificacion(6.9)); // Aprobado\nconsole.log(calificacion(9));   // Sobresaliente\nconsole.log(calificacion(11));  // Nota no válida',
        },
      },
    },

    // ── L6 ─────────────────────────────────────────────────────────────────
    {
      title: 'El operador ternario',
      objective:
        'Escribir decisiones sencillas que producen un valor con condición ? siTrue : siFalse.',
      theory: t(
        `El ternario es un \`if/else\` comprimido que devuelve un valor: \`condición ? valorSiTruthy : valorSiFalsy\`. Se llama así porque es el único operador de JavaScript con tres partes.`,
        `${C}js
const edad = 20;
const tipo = edad >= 18 ? 'mayor' : 'menor';
console.log(tipo); // "mayor"
// Equivale a:
let tipo2;
if (edad >= 18) { tipo2 = 'mayor'; } else { tipo2 = 'menor'; }
${C}`,
        `La diferencia clave con \`if\`: el ternario es una expresión (produce un valor), mientras que \`if\` es una sentencia (ejecuta código). Por eso el ternario se puede poner donde se espera un valor: en una asignación, dentro de un template literal (\`\${n === 1 ? 'alumno' : 'alumnos'}\`) o como argumento de una función. Y con él puedes usar \`const\`, cosa que con el \`if\` del ejemplo no (hay que declarar \`let\` vacío y asignar después).`,
        `Cuándo NO usarlo: si cada rama tiene que hacer varias cosas, o si te ves anidando ternarios (\`a ? b : c ? d : e\`). Se puede, pero se lee fatal. En esos casos, \`if\` o \`switch\`. Regla: un ternario por línea y solo para elegir entre dos valores.`,
      ),
      example: 'const n = 1;\nconsole.log(`Hay ${n} ${n === 1 ? "alumno" : "alumnos"}`); // Hay 1 alumno',
      concepts: ['ternario', 'expresión', 'sentencia', 'condición ? a : b'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 10,
      challenge: {
        title: 'Pasa un if/else a ternario',
        brief: 'Reescribe un if/else sencillo como una sola línea con el operador ternario.',
        difficulty: 1,
        timeLimitMinutes: 6,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'short',
          runner: 'none',
          prompt:
            'Reescribe este código en una sola línea, usando const y el operador ternario:\n\nlet mensaje;\nif (stock > 0) {\n  mensaje = "Disponible";\n} else {\n  mensaje = "Agotado";\n}\n\nDespués explica en una frase por qué aquí el ternario permite usar const y el if no.',
          solution:
            'const mensaje = stock > 0 ? "Disponible" : "Agotado";\n\nEl ternario es una expresión que produce un valor, así que se puede asignar directamente al declarar la constante. Con if hay que declarar la variable antes (vacía, con let) y asignarla después dentro de cada rama, y una const no se puede declarar sin valor ni reasignar.',
        },
      },
    },

    // ── L7 ─────────────────────────────────────────────────────────────────
    {
      title: 'switch y el fall-through',
      objective:
        'Usar switch para comparar un valor con varios casos y entender qué pasa si olvidas el break.',
      theory: t(
        `\`switch\` compara un valor con una lista de casos. Es más legible que una cadena larga de \`else if\` cuando todas las condiciones son "¿vale exactamente esto?". La comparación que hace es estricta, como \`===\`: \`case 1\` no coincide con el texto \`'1'\`.`,
        `${C}js
const dia = 'martes';
switch (dia) {
  case 'sabado':
  case 'domingo':
    console.log('Fin de semana');
    break;
  default:
    console.log('Laborable'); // entra aquí
}
${C}`,
        `Cómo funciona por dentro: el motor busca el primer \`case\` que coincide y empieza a ejecutar desde ahí hacia abajo, línea a línea, hasta encontrar un \`break\` o el final del \`switch\`. No se para al llegar al siguiente \`case\`. Eso es el fall-through ("caer a través").`,
        `A veces es útil y se hace a propósito, como en el ejemplo: \`'sabado'\` no tiene código propio, así que cae en el de \`'domingo'\`, y los dos casos comparten bloque. Pero si se te olvida un \`break\`, el código de un caso se ejecuta también en el siguiente sin que lo pidas. Es el bug clásico de \`switch\`.`,
        `\`default\` es el "si no coincide ninguno", como el \`else\` final. Ponlo siempre, aunque solo sea para avisar de un valor inesperado. Si dentro de una función devuelves con \`return\` en cada caso, no hace falta \`break\`: \`return\` ya sale de la función.`,
      ),
      example: 'function precio(talla) {\n  switch (talla) {\n    case "S": return 10;\n    case "M": return 12;\n    default: return 15;\n  }\n}\nconsole.log(precio("M")); // 12',
      concepts: ['switch', 'case', 'break', 'fall-through', 'default'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'El break olvidado',
        brief: 'Predice qué imprime un switch en el que un caso no tiene break.',
        difficulty: 2,
        timeLimitMinutes: 6,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "¿Qué imprime este código?\n\nconst dia = 'sabado';\nswitch (dia) {\n  case 'sabado':\n    console.log('finde');\n  case 'domingo':\n    console.log('descanso');\n    break;\n  default:\n    console.log('laborable');\n}",
          quiz: {
            options: [
              { id: 'a', text: "Solo 'finde'" },
              { id: 'b', text: "'finde' y después 'descanso'" },
              { id: 'c', text: "'finde', 'descanso' y 'laborable'" },
              { id: 'd', text: 'Nada, porque falta el break' },
            ],
            correctIds: ['b'],
            multiple: false,
            explanation:
              "El switch entra por case 'sabado' e imprime 'finde'. Como no hay break, sigue ejecutando hacia abajo (fall-through) y también imprime 'descanso', aunque dia no sea 'domingo'. Ahí encuentra un break y sale, por eso nunca llega a 'laborable'. Solo 'finde' sería lo correcto si hubiera un break tras el primer console.log; y que falte un break no impide ejecutar nada, solo hace que no se pare.",
          },
        },
      },
    },

    // ── L8 ─────────────────────────────────────────────────────────────────
    {
      title: 'Encadenamiento opcional ?.',
      objective:
        'Leer propiedades de objetos que pueden no existir sin que el programa se rompa, usando ?.',
      theory: t(
        `Uno de los errores más frecuentes en JavaScript es este: \`TypeError: Cannot read properties of null (reading 'ciudad')\`. Significa que intentaste leer una propiedad (\`.ciudad\`) de algo que era \`null\` o \`undefined\`. Pasa mucho con datos que vienen de un servidor, donde un campo puede faltar.`,
        `El operador \`?.\` (optional chaining) lo evita: \`a?.b\` mira si \`a\` es \`null\` o \`undefined\`; si lo es, para ahí y devuelve \`undefined\` sin error; si no, lee \`b\` con normalidad.`,
        `${C}js
const usuario = { nombre: 'Ana', direccion: null };
console.log(usuario.direccion?.ciudad);  // undefined
console.log(usuario.telefono?.length);   // undefined
console.log(usuario.saludar?.());        // undefined (llama solo si existe)
console.log(usuario.direccion.ciudad);   // TypeError: Cannot read properties of null
${C}`,
        `Se combina muy bien con \`??\`: \`usuario.direccion?.ciudad ?? 'Sin ciudad'\` da un valor por defecto si cualquier eslabón de la cadena falta. Antes de que existiera \`?.\` había que escribir \`usuario.direccion && usuario.direccion.ciudad\`, que hace lo mismo con cortocircuito pero es más largo.`,
        `Cuidado con abusar: pon \`?.\` solo donde el valor puede faltar de verdad. Si \`usuario\` siempre debería existir y un día no existe, prefieres que el programa falle con un error claro a que siga funcionando con \`undefined\` por todas partes y el fallo aparezca diez líneas más abajo.`,
      ),
      example: 'const pedido = { cliente: { nombre: "Luis" } };\nconsole.log(pedido.envio?.direccion ?? "Recogida en tienda"); // "Recogida en tienda"\nconsole.log(pedido.cliente?.nombre);                         // "Luis"',
      concepts: ['?.', 'optional chaining', 'TypeError', 'null', 'undefined'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Leer lo que puede no existir',
        brief: 'Predice qué imprime un código que lee propiedades de un null con y sin ?.',
        difficulty: 2,
        timeLimitMinutes: 6,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "¿Qué ocurre al ejecutar este código?\n\nconst usuario = { nombre: 'Ana', direccion: null };\nconsole.log(usuario.direccion?.ciudad);\nconsole.log(usuario.telefono?.length);\nconsole.log(usuario.direccion.ciudad);",
          quiz: {
            options: [
              { id: 'a', text: 'Imprime undefined, undefined y luego lanza un TypeError' },
              { id: 'b', text: 'Imprime undefined tres veces' },
              { id: 'c', text: 'Imprime null, undefined y luego lanza un TypeError' },
              { id: 'd', text: 'Lanza un TypeError en la primera línea' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'usuario.direccion es null, así que ?. corta la cadena y devuelve undefined (no null: ?. siempre devuelve undefined al cortar). usuario.telefono no existe, es undefined, y ?. vuelve a devolver undefined. En la tercera línea no hay ?., así que se intenta leer .ciudad de null y salta TypeError: Cannot read properties of null. Por eso no puede ser "undefined tres veces", y la primera línea no falla precisamente gracias a ?.',
          },
        },
      },
    },
  ],
};
