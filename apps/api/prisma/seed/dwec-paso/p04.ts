import { type PhaseSeed } from '../content-types.js';

// Bloque de código para la teoría: una línea por elemento, sin líneas en blanco.
const code = (...lines: string[]): string => '```js\n' + lines.join('\n') + '\n```';

const RUBRIC = [{ name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true }];

export const dwecPasoP04: PhaseSeed = {
  code: 'FASE 4',
  title: 'Bucles y arrays',
  objective:
    'Repetir instrucciones sin copiar y pegar, guardar listas de datos en arrays y recorrerlas para sumar, contar o buscar.',
  unlockedSkills: ['js-fundamentos', 'js-datos'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'Para qué sirve un bucle y cómo funciona el for',
      objective: 'Entender las tres partes del `for` y saber trazar a mano qué valores toma la variable.',
      theory: [
        'Un bucle sirve para repetir un bloque de código sin escribirlo varias veces. Si quieres imprimir los números del 1 al 100, no escribes 100 `console.log`: escribes uno dentro de un bucle y le dices cuántas veces repetirlo. Además, el número de repeticiones puede depender de los datos (por ejemplo, de cuántos productos hay en un carrito), cosa que con copiar y pegar es imposible.',
        'El `for` clásico tiene tres partes separadas por punto y coma: `for (inicio; condición; incremento)`. El inicio se ejecuta UNA sola vez, al principio. La condición se comprueba ANTES de cada vuelta: si es `true` se ejecuta el cuerpo, si es `false` el bucle termina. El incremento se ejecuta DESPUÉS de cada vuelta, justo antes de volver a comprobar la condición.',
        code(
          'for (let i = 0; i < 3; i++) {',
          '  console.log(i);',
          '}',
          '// 0',
          '// 1',
          '// 2',
        ),
        'Traza paso a paso: `i = 0` → ¿0 < 3? sí → imprime 0 → `i++` deja `i = 1` → ¿1 < 3? sí → imprime 1 → `i = 2` → ¿2 < 3? sí → imprime 2 → `i = 3` → ¿3 < 3? NO → fin. Fíjate en que `i` llega a valer 3, pero ese valor nunca se imprime porque la condición falla antes de entrar al cuerpo.',
        'Error típico: pensar que `i < 3` incluye el 3, o confundir `<` con `<=`. Si quieres del 1 al 10 incluidos, escribe `for (let i = 1; i <= 10; i++)`. Cuando dudes, haz una tabla con dos columnas (valor de `i` y ¿se cumple la condición?) y rellénala a mano: es exactamente lo que hace el motor de JavaScript.',
      ].join('\n\n'),
      example: `for (let i = 1; i <= 5; i++) {
  console.log('Vuelta número ' + i);
}`,
      concepts: ['bucle', 'for', 'condición', 'incremento', 'iteración'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Traza un for a mano',
        brief: 'Sigue el bucle vuelta a vuelta y di qué se imprime.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

let s = '';
for (let i = 1; i <= 7; i += 2) {
  s += i;
}
console.log(s);`,
          quiz: {
            options: [
              { id: 'a', text: '1357' },
              { id: 'b', text: '16' },
              { id: 'c', text: '13579' },
              { id: 'd', text: '1234567' },
            ],
            correctIds: ['a'],
            explanation:
              'i empieza en 1 y sube de 2 en 2: 1, 3, 5, 7. Con i = 9 la condición 9 <= 7 es falsa y el bucle acaba, así que el 9 no entra. Como s es un string, s += i concatena en vez de sumar: "1357", no 16. "1234567" sería con i++ y "13579" olvidaría que la condición se comprueba antes de cada vuelta.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'while y do...while',
      objective: 'Saber cuándo usar `while` y por qué `do...while` siempre se ejecuta al menos una vez.',
      theory: [
        '`while (condición) { ... }` repite el cuerpo mientras la condición sea verdadera. Es un `for` sin inicio ni incremento en la cabecera: tú los pones fuera y dentro. Se usa cuando no sabes de antemano cuántas vueltas habrá, por ejemplo "sigue tirando el dado hasta que salga un 6".',
        code(
          'let intentos = 0;',
          'let dado = 0;',
          'while (dado !== 6) {',
          '  dado = Math.floor(Math.random() * 6) + 1;',
          '  intentos++;',
          '}',
          'console.log(intentos); // varía en cada ejecución',
        ),
        '`do { ... } while (condición);` es casi igual, pero la condición se comprueba AL FINAL de cada vuelta. Consecuencia: el cuerpo se ejecuta siempre al menos una vez, aunque la condición sea falsa desde el principio. En `while` la pregunta va antes ("¿entro?"); en `do...while` va después ("¿repito?").',
        code(
          'let n = 10;',
          'while (n < 5) { console.log("while", n); }  // no imprime nada',
          'do { console.log("do", n); } while (n < 5); // do 10',
        ),
        'Uso típico de `do...while`: menús o validaciones donde primero hay que pedir el dato y luego comprobar si es válido. Error típico: olvidar el punto y coma tras `while (condición)` en el `do...while`, o creer que si la condición es falsa no se ejecuta nada.',
      ].join('\n\n'),
      example: `let cuenta = 3;
while (cuenta > 0) {
  console.log(cuenta);
  cuenta--;
}
console.log('¡Despegue!');`,
      concepts: ['while', 'do...while', 'condición previa', 'condición posterior'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Entra o no entra?',
        brief: 'Distingue cuándo un do...while ejecuta su cuerpo.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

let n = 10;
do {
  console.log(n);
  n++;
} while (n < 5);`,
          quiz: {
            options: [
              { id: 'nada', text: 'No imprime nada' },
              { id: 'diez', text: '10' },
              { id: 'inf', text: '10, 11, 12... sin parar (bucle infinito)' },
              { id: 'cinco', text: '5' },
            ],
            correctIds: ['diez'],
            explanation:
              'En do...while el cuerpo se ejecuta primero y la condición se mira después. Se imprime 10, n pasa a 11 y entonces se comprueba 11 < 5, que es falso, así que acaba. "No imprime nada" sería lo que pasa con un while normal. No es infinito porque la condición ya es falsa en la primera comprobación.',
          },
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'Bucles infinitos, break y continue',
      objective: 'Reconocer un bucle infinito y controlar el flujo con `break` y `continue`.',
      theory: [
        'Un bucle infinito es un bucle cuya condición nunca llega a ser falsa. JavaScript en el navegador se ejecuta en un solo hilo, así que un bucle infinito congela la pestaña entera: no responde a clics, no se pinta nada y al rato el navegador te ofrece "cerrar la página". No da error: simplemente nunca termina.',
        code(
          'let i = 0;',
          'while (i < 5) {',
          '  console.log(i);',
          '  // falta i++ → i siempre vale 0 → nunca termina',
          '}',
        ),
        'Para evitarlo, comprueba tres cosas en todo bucle: que la variable de control cambia dentro del cuerpo, que cambia en la dirección correcta (si la condición es `i < 5`, `i` tiene que subir, no bajar) y que la condición puede llegar a ser falsa. `for (let i = 0; i < 5; i--)` también es infinito: `i` baja y siempre es menor que 5.',
        '`break` sale del bucle inmediatamente, sin terminar la vuelta actual ni mirar la condición. `continue` salta el resto de la vuelta actual y pasa a la siguiente (en un `for`, se ejecuta el incremento y se vuelve a comprobar la condición).',
        code(
          'for (let i = 1; i <= 6; i++) {',
          '  if (i === 2) continue; // se salta el 2',
          '  if (i === 5) break;    // al llegar a 5, sale',
          '  console.log(i);',
          '}',
          '// 1',
          '// 3',
          '// 4',
        ),
        'Error típico con `continue` en un `while`: si el `i++` está al final del cuerpo y pones `continue` antes, el incremento se salta y el bucle se vuelve infinito. En un `for` no pasa porque el incremento está en la cabecera.',
      ].join('\n\n'),
      example: `const numeros = [3, 8, -1, 5];
for (let i = 0; i < numeros.length; i++) {
  if (numeros[i] < 0) {
    console.log('Negativo encontrado en la posición ' + i);
    break;
  }
}`,
      concepts: ['bucle infinito', 'break', 'continue', 'variable de control'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Saltar y parar',
        brief: 'Usa continue y break dentro de un for.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Escribe un for que recorra los números del 1 al 20. Usa continue para saltarte los múltiplos de 3 y break para salir del bucle en cuanto el número sea mayor que 10. Imprime cada número que no se salte, uno por línea. Debe salir: 1, 2, 4, 5, 7, 8, 10.',
          starterCode: `for (let i = 1; i <= 20; i++) {
  // TODO: si i es mayor que 10, sal del bucle con break
  // TODO: si i es múltiplo de 3, salta a la siguiente vuelta con continue
  // TODO: imprime i
}`,
          solution: `for (let i = 1; i <= 20; i++) {
  if (i > 10) break;
  if (i % 3 === 0) continue;
  console.log(i);
}
// 1
// 2
// 4
// 5
// 7
// 8
// 10`,
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: 'Arrays: índices, length y el último elemento',
      objective: 'Crear arrays, acceder por índice empezando en 0 y saber qué pasa al salirte del rango.',
      theory: [
        'Un array es una lista ordenada de valores guardada en una sola variable. Se crea con corchetes: `const frutas = ["pera", "uva", "kiwi"]`. Puede contener cualquier tipo de dato, incluso mezclados, aunque lo normal es que todos sean del mismo tipo.',
        'Cada elemento tiene una posición llamada índice, y los índices EMPIEZAN EN 0. El primer elemento es `frutas[0]`, el segundo `frutas[1]`. ¿Por qué en 0? Porque el índice indica cuántas posiciones te desplazas desde el principio: el primero está a 0 posiciones del inicio.',
        '`length` dice cuántos elementos hay. Como se empieza a contar en 0, el último índice válido es siempre `length - 1`. Para leer el último elemento se escribe `frutas[frutas.length - 1]` (o `frutas.at(-1)` en navegadores modernos).',
        code(
          'const frutas = ["pera", "uva", "kiwi"];',
          'console.log(frutas[0]);                 // pera',
          'console.log(frutas.length);             // 3',
          'console.log(frutas[frutas.length - 1]); // kiwi',
          'console.log(frutas[3]);                 // undefined',
        ),
        'Si accedes a un índice que no existe, JavaScript NO lanza un error: devuelve `undefined`. Esto es una trampa, porque el fallo aparece más adelante (por ejemplo, "Cannot read properties of undefined" al hacer `frutas[3].length`). Cuando veas `undefined` inesperado al recorrer un array, sospecha de un `<=` donde debería ir `<`.',
        'Aunque declares el array con `const`, puedes cambiar su contenido (`frutas[0] = "manzana"`). `const` solo impide reasignar la variable a otro array distinto, no modificar el que ya tiene.',
      ].join('\n\n'),
      example: `const notas = [7, 5, 9];
notas[1] = 6;
console.log(notas);         // [7, 6, 9]
console.log(notas.length);  // 3`,
      concepts: ['array', 'índice', 'length', 'undefined', 'último elemento'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Fuera de rango',
        brief: '¿Qué devuelve leer una posición que no existe?',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

const letras = ['a', 'b', 'c'];
console.log(letras[letras.length]);`,
          quiz: {
            options: [
              { id: 'c', text: "'c'" },
              { id: 'undef', text: 'undefined' },
              { id: 'err', text: 'Lanza un error de índice fuera de rango' },
              { id: 'tres', text: '3' },
            ],
            correctIds: ['undef'],
            explanation:
              "letras.length vale 3, pero los índices válidos son 0, 1 y 2. letras[3] no existe y JavaScript devuelve undefined sin lanzar error (otros lenguajes como Java sí lanzarían una excepción). Para obtener 'c' habría que escribir letras[letras.length - 1]. El 3 es la longitud, no un elemento.",
          },
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'Añadir, quitar y buscar: push, pop, shift, unshift, indexOf, includes',
      objective: 'Modificar un array por sus extremos y buscar elementos dentro de él.',
      theory: [
        'Los arrays traen métodos para añadir y quitar por los extremos. Por el final: `push(x)` añade y `pop()` quita el último. Por el principio: `unshift(x)` añade y `shift()` quita el primero. Los cuatro MODIFICAN el array original (no crean uno nuevo).',
        'Fíjate en lo que DEVUELVE cada uno, porque es una pregunta clásica: `pop()` y `shift()` devuelven el elemento que han quitado; `push()` y `unshift()` devuelven la nueva longitud del array, no el array.',
        code(
          'const cola = ["Ana", "Luis"];',
          'cola.push("Eva");          // ["Ana", "Luis", "Eva"]',
          'const fuera = cola.shift(); // fuera = "Ana"',
          'cola.unshift("Leo");       // ["Leo", "Luis", "Eva"]',
          'console.log(cola.pop());   // Eva',
          'console.log(cola);         // ["Leo", "Luis"]',
        ),
        'Para buscar: `indexOf(x)` devuelve la posición de la primera aparición de `x`, o `-1` si no está. `includes(x)` devuelve directamente `true` o `false`. Si solo quieres saber si algo está, usa `includes`: es más legible que `indexOf(x) !== -1`.',
        'Error típico: escribir `if (lista.indexOf("Ana"))` para saber si está. Si Ana está en la posición 0, `indexOf` devuelve 0, que es falsy, y el `if` dice que no está. Y si no está, devuelve -1, que es truthy. Justo al revés de lo que querías.',
      ].join('\n\n'),
      example: `const carrito = [];
carrito.push('pan');
carrito.push('leche');
console.log(carrito.includes('pan')); // true
console.log(carrito.indexOf('café')); // -1`,
      concepts: ['push', 'pop', 'shift', 'unshift', 'indexOf', 'includes'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Sigue la lista de la compra',
        brief: 'Encadena push, shift, unshift y pop y di cómo queda el array.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime la última línea?

const lista = ['pan', 'leche'];
lista.push('huevos');
lista.shift();
lista.unshift('café');
const quitado = lista.pop();
console.log(lista, quitado);`,
          quiz: {
            options: [
              { id: 'a', text: "['café', 'leche'] 'huevos'" },
              { id: 'b', text: "['pan', 'leche'] 'huevos'" },
              { id: 'c', text: "['café', 'leche', 'huevos'] 'café'" },
              { id: 'd', text: "['leche', 'huevos'] 'café'" },
            ],
            correctIds: ['a'],
            explanation:
              "Paso a paso: push añade al final → ['pan','leche','huevos']; shift quita el primero → ['leche','huevos']; unshift añade al principio → ['café','leche','huevos']; pop quita el último y lo devuelve → lista queda ['café','leche'] y quitado = 'huevos'. La opción con 'pan' olvida que shift lo quitó; la que devuelve 'café' confunde pop (final) con shift (principio).",
          },
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'slice frente a splice',
      objective: 'Distinguir `slice` (copia un trozo sin tocar el original) de `splice` (corta del original).',
      theory: [
        'Se parecen en el nombre y se confunden siempre, pero hacen cosas muy distintas. `slice(inicio, fin)` devuelve una COPIA de un trozo del array y deja el original intacto. `splice(inicio, cuántos)` QUITA elementos del original (lo modifica) y te devuelve los que ha quitado.',
        'Ojo a los argumentos: en `slice` el segundo número es la posición donde PARAR, y esa posición no se incluye. En `splice` el segundo número es CUÁNTOS elementos borrar. Truco para recordarlo: s-p-lice tiene una "p" de "pica", porque pica el array original.',
        code(
          'const n = [10, 20, 30, 40, 50];',
          'console.log(n.slice(1, 3));  // [20, 30]',
          'console.log(n);              // [10, 20, 30, 40, 50] (intacto)',
          'console.log(n.splice(1, 2)); // [20, 30]',
          'console.log(n);              // [10, 40, 50] (modificado)',
        ),
        '`splice` también sirve para insertar: a partir del tercer argumento, lo que pongas se mete en esa posición. `n.splice(1, 0, 99)` no borra nada y mete un 99 en la posición 1.',
        'Regla práctica: si quieres un trozo SIN alterar los datos, `slice`. Si quieres borrar o insertar en medio del array, `splice`. `slice()` sin argumentos es la forma clásica de hacer una copia superficial de un array.',
      ].join('\n\n'),
      example: `const dias = ['lun', 'mar', 'mié', 'jue', 'vie'];
const finde = dias.slice(3);    // ['jue', 'vie'], dias no cambia
dias.splice(2, 1);              // borra 'mié' de dias
console.log(dias);              // ['lun', 'mar', 'jue', 'vie']`,
      concepts: ['slice', 'splice', 'copia', 'mutación'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Quién toca el original?',
        brief: 'Predice el estado del array después de slice y splice.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime la última línea?

const nums = [10, 20, 30, 40, 50];
const a = nums.slice(1, 3);
const b = nums.splice(1, 2);
console.log(nums);`,
          quiz: {
            options: [
              { id: 'a', text: '[10, 20, 30, 40, 50]' },
              { id: 'b', text: '[10, 40, 50]' },
              { id: 'c', text: '[20, 30]' },
              { id: 'd', text: '[10, 50]' },
            ],
            correctIds: ['b'],
            explanation:
              'slice(1, 3) solo hace una copia ([20, 30]) y no toca nums. splice(1, 2) quita 2 elementos desde la posición 1 (el 20 y el 30) del propio nums, que queda [10, 40, 50]. [20, 30] es lo que valen a y b, no nums. [10, 50] saldría si splice borrara hasta la posición 3 incluida, pero su segundo argumento es la cantidad, no la posición final.',
          },
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'Recorrer arrays con for...of y objetos con for...in',
      objective: 'Usar `for...of` para los valores de un array y `for...in` para las claves de un objeto.',
      theory: [
        'Recorrer un array con el `for` clásico funciona, pero obliga a manejar el índice: `for (let i = 0; i < arr.length; i++) { arr[i] }`. Si solo te interesan los valores, `for...of` es más corto y no se puede equivocar con los límites: en cada vuelta te da directamente el siguiente valor.',
        code(
          'const colores = ["rojo", "verde"];',
          'for (const color of colores) {',
          '  console.log(color);',
          '}',
          '// rojo',
          '// verde',
        ),
        '`for...in` recorre las CLAVES (nombres de propiedad) de un objeto. Es la forma sencilla de ver todo lo que tiene un objeto: en cada vuelta te da el nombre de la propiedad y con `objeto[clave]` lees su valor. Ojo: hay que usar corchetes, porque `objeto.clave` buscaría una propiedad que se llama literalmente "clave".',
        code(
          'const alumno = { nombre: "Ana", edad: 20 };',
          'for (const clave in alumno) {',
          '  console.log(clave, alumno[clave]);',
          '}',
          '// nombre Ana',
          '// edad 20',
        ),
        '¿Por qué no usar `for...in` con arrays? Porque te da los índices, no los valores, y además como STRINGS ("0", "1"...), no como números. Si haces `indice + 1` obtienes "01" en vez de 1. También recorre propiedades extra que alguien haya añadido al array o a su prototipo. Regla: arrays con `for...of` (te da los valores), objetos con `for...in` (te da las claves).',
      ].join('\n\n'),
      example: `const precios = { pan: 1.2, leche: 0.9 };
for (const producto in precios) {
  console.log(producto + ': ' + precios[producto] + ' €');
}`,
      concepts: ['for...of', 'for...in', 'clave', 'valor', 'notación de corchetes'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'for...in con arrays: la trampa',
        brief: 'Explica con tus palabras por qué no conviene recorrer un array con for...in.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'short',
          runner: 'none',
          prompt: `Un compañero escribe esto para imprimir las posiciones de una lista empezando en 1:

const lista = ['a', 'b', 'c'];
for (const i in lista) {
  console.log(i + 1);
}

Esperaba ver 1, 2, 3. ¿Qué ve en realidad y por qué? ¿Qué bucle le recomendarías para recorrer los valores de un array?`,
          solution:
            'Ve "01", "11" y "21". for...in recorre las claves del array, que son los índices pero como strings ("0", "1", "2"), así que i + 1 concatena en lugar de sumar. Además for...in puede recorrer propiedades extra que no son elementos. Para recorrer los valores de un array se usa for...of (o el for clásico si necesitas el índice como número: for (let i = 0; i < lista.length; i++)). for...in se reserva para recorrer las claves de un objeto.',
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'Acumuladores y contadores: sumar, contar y buscar el máximo',
      objective: 'Aplicar los tres patrones de recorrido más habituales: acumular, contar y buscar el mayor.',
      theory: [
        'Casi todos los ejercicios de bucles son variaciones de tres patrones. Los tres siguen el mismo esquema: una variable FUERA del bucle que guarda el resultado, un bucle que recorre los datos y una línea DENTRO que actualiza esa variable.',
        'Acumulador: empieza en 0 (o en "" si acumulas texto) y en cada vuelta le sumas el valor actual. Contador: empieza en 0 y solo suma 1 cuando se cumple una condición. Máximo: empieza con el PRIMER elemento del array y, si encuentras uno mayor, lo sustituye.',
        code(
          'const nums = [4, 9, 2, 7];',
          'let suma = 0, pares = 0, max = nums[0];',
          'for (const n of nums) {',
          '  suma += n;                 // acumulador',
          '  if (n % 2 === 0) pares++;  // contador',
          '  if (n > max) max = n;      // máximo',
          '}',
          'console.log(suma, pares, max); // 22 2 9',
        ),
        'Error típico 1: declarar `let suma = 0` DENTRO del bucle. Entonces se reinicia a 0 en cada vuelta y al final solo vale el último número. Error típico 2: empezar el máximo en 0. Si todos los números son negativos, por ejemplo [-5, -2], el resultado sería 0, que ni siquiera está en el array. Empezar con `nums[0]` lo evita.',
        '`n % 2 === 0` comprueba si un número es par: `%` es el resto de la división, y un número par dividido entre 2 tiene resto 0. Más adelante verás métodos como `reduce` o `Math.max(...nums)` que hacen esto en una línea, pero por dentro hacen exactamente este recorrido.',
      ].join('\n\n'),
      example: `const palabras = ['sol', 'luna', 'mar'];
let letras = 0;
for (const p of palabras) {
  letras += p.length;
}
console.log(letras); // 10`,
      concepts: ['acumulador', 'contador', 'máximo', 'operador %', 'patrón de recorrido'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 18,
      challenge: {
        title: 'Suma, pares y máximo',
        brief: 'Recorre un array una sola vez y calcula tres resultados.',
        difficulty: 2,
        timeLimitMinutes: 12,
        skills: ['js-fundamentos', 'js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            "Recorre el array numeros con un solo bucle y calcula la suma de todos, cuántos son pares y cuál es el mayor (sin usar Math.max). Después imprime exactamente tres líneas: 'Suma: 51', 'Pares: 4' y 'Máximo: 12'.",
          starterCode: `const numeros = [7, 4, 9, 12, 10, 3, 6];
let suma = 0;
let pares = 0;
let maximo = numeros[0];
// TODO: recorre numeros y actualiza suma, pares y maximo
// TODO: imprime 'Suma: ...', 'Pares: ...' y 'Máximo: ...'`,
          solution: `const numeros = [7, 4, 9, 12, 10, 3, 6];
let suma = 0;
let pares = 0;
let maximo = numeros[0];
for (const n of numeros) {
  suma += n;
  if (n % 2 === 0) pares++;
  if (n > maximo) maximo = n;
}
console.log('Suma: ' + suma);     // Suma: 51
console.log('Pares: ' + pares);   // Pares: 4
console.log('Máximo: ' + maximo); // Máximo: 12`,
        },
      },
    },
  ],
};
