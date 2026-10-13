import { type PhaseSeed } from '../content-types.js';

const RUBRIC = [
  { name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true },
];

export const dwecPasoP06: PhaseSeed = {
  code: 'FASE 6',
  title: 'Closures y métodos de arrays',
  objective:
    'Entender qué es un closure (una función que recuerda las variables de donde nació) y dominar los métodos de arrays que usarás a diario: map, filter, find, some, every, reduce y sort.',
  unlockedSkills: ['js-fundamentos', 'js-datos'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'Closures: la función que recuerda',
      objective:
        'Entender que una función recuerda las variables del sitio donde se creó, aunque ese sitio ya haya terminado de ejecutarse.',
      theory: `Hasta ahora has visto que las variables declaradas dentro de una función "desaparecen" cuando la función termina. Eso es casi verdad, pero tiene una excepción muy importante: si dentro de esa función se crea OTRA función que usa esas variables, y esa función interna sale fuera (porque la devuelves, por ejemplo), las variables siguen vivas. A eso se le llama **closure** (clausura).

\`\`\`js
function crearSaludo(nombre) {
  const saludo = 'Hola, ' + nombre;
  return function () {
    console.log(saludo);
  };
}
const saludaAna = crearSaludo('Ana');
saludaAna(); // Hola, Ana
\`\`\`

¿Qué pasa por dentro? Cuando el motor ejecuta \`crearSaludo('Ana')\` crea un "cajón" con sus variables (\`nombre\` y \`saludo\`). La función interna se crea dentro de ese cajón y guarda una referencia a él. \`crearSaludo\` termina, pero como la función devuelta sigue apuntando al cajón, el recolector de basura no lo borra. Cuando más tarde llamas a \`saludaAna()\`, busca \`saludo\`, no lo encuentra en su propio cuerpo, y lo busca en el cajón que recuerda.

Cada llamada a \`crearSaludo\` crea un cajón NUEVO. Por eso si haces \`crearSaludo('Ana')\` y \`crearSaludo('Luis')\` obtienes dos funciones que recuerdan cosas distintas y no se pisan entre sí.

Detalle clave: el closure recuerda la **variable**, no una foto de su valor. Si la variable cambia después, la función verá el valor nuevo cuando se ejecute. Error típico del alumno: pensar que la función "copia" el valor en el momento de crearse.

No es algo exótico: cada vez que pasas una función flecha a \`setTimeout\`, a un \`addEventListener\` o a un \`map\` y usas dentro una variable de fuera, estás usando un closure.`,
      example: `function crearSaludo(nombre) {
  return () => console.log('Hola, ' + nombre);
}
const hola = crearSaludo('Marta');
hola(); // Hola, Marta  (nombre sigue vivo)`,
      concepts: ['closure', 'ámbito léxico', 'función interna', 'variables capturadas'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿Qué recuerda cada función?',
        brief: 'Predice la salida de dos funciones creadas por la misma fábrica.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

function crearSaludo(nombre) {
  const saludo = 'Hola, ' + nombre;
  return function () {
    console.log(saludo);
  };
}
const saludaAna = crearSaludo('Ana');
const saludaLuis = crearSaludo('Luis');
saludaAna();
saludaLuis();
saludaAna();`,
          quiz: {
            options: [
              { id: 'a', text: 'Hola, Ana / Hola, Luis / Hola, Ana' },
              { id: 'b', text: 'Hola, Luis / Hola, Luis / Hola, Luis' },
              { id: 'c', text: 'Hola, undefined tres veces, porque crearSaludo ya terminó' },
              { id: 'd', text: 'Un ReferenceError: saludo no existe fuera de crearSaludo' },
            ],
            correctIds: ['a'],
            explanation:
              'Cada llamada a crearSaludo crea su propio "cajón" de variables, y la función devuelta lo recuerda (closure). saludaAna recuerda saludo = "Hola, Ana" y saludaLuis recuerda "Hola, Luis"; no se pisan. No sale undefined ni ReferenceError porque la función interna sigue teniendo acceso a las variables del sitio donde nació aunque crearSaludo haya terminado. Tampoco sale "Luis" tres veces: la segunda llamada no sobrescribe el cajón de la primera.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'Un contador con estado privado',
      objective:
        'Usar un closure para guardar un estado que solo se puede cambiar a través de una función.',
      theory: `Uno de los usos más prácticos de los closures es tener **estado privado**: una variable que nadie de fuera puede tocar directamente, solo a través de la función que tú expones.

\`\`\`js
function crearContador() {
  let cuenta = 0;
  return function () {
    cuenta++;
    return cuenta;
  };
}
const siguiente = crearContador();
console.log(siguiente()); // 1
console.log(siguiente()); // 2
console.log(cuenta); // ReferenceError: cuenta is not defined
\`\`\`

\`cuenta\` vive en el cajón de \`crearContador\`. Desde fuera no existe (por eso el \`ReferenceError\`), pero la función devuelta sí la ve y la puede modificar. Y como el cajón no se destruye, la cuenta se mantiene entre llamadas.

Compáralo con usar una variable global \`let cuenta = 0\`: cualquier parte del programa podría hacer \`cuenta = 999\` por error. Con el closure, la única forma de cambiar la cuenta es llamar a la función, así que controlas qué se puede hacer con ella (solo sumar de uno en uno).

Si llamas dos veces a \`crearContador()\` obtienes dos contadores independientes, cada uno con su propia \`cuenta\`. Error típico: declarar \`let cuenta = 0\` DENTRO de la función devuelta; entonces se reinicia a 0 en cada llamada y siempre devuelve 1.`,
      example: `const a = crearContador();
const b = crearContador();
a(); a();
console.log(a()); // 3
console.log(b()); // 1  (b tiene su propia cuenta)`,
      concepts: ['estado privado', 'closure', 'encapsulación', 'instancias independientes'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Dos contadores independientes',
        brief: 'Crea una fábrica de contadores y comprueba que cada uno lleva su propia cuenta.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Escribe la función crearContador(): debe guardar una variable cuenta que empieza en 0 y devolver una función que, cada vez que se llama, suma 1 a la cuenta y la devuelve. Crea dos contadores a y b. Llama a a() dos veces sin imprimir nada; después imprime con console.log el resultado de a() (debe salir 3) y el de b() (debe salir 1).',
          starterCode: `function crearContador() {
  // TODO: variable privada cuenta = 0
  // TODO: devuelve una función que suma 1 y devuelve la cuenta
}

const a = crearContador();
const b = crearContador();
// TODO: llama dos veces a a() y luego imprime a() y b()
`,
          solution: `function crearContador() {
  let cuenta = 0;
  return function () {
    cuenta++;
    return cuenta;
  };
}

const a = crearContador();
const b = crearContador();
a();
a();
console.log(a()); // 3
console.log(b()); // 1`,
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'Fábricas de funciones',
      objective:
        'Crear funciones "preconfiguradas" a partir de otra función, fijando parte de sus datos.',
      theory: `Una **fábrica de funciones** es una función que fabrica y devuelve otras funciones. Gracias al closure, cada función fabricada viene "preconfigurada" con los datos que le pasaste a la fábrica.

\`\`\`js
function crearMultiplicador(factor) {
  return function (numero) {
    return numero * factor;
  };
}
const doble = crearMultiplicador(2);
const triple = crearMultiplicador(3);
console.log(doble(5));  // 10
console.log(triple(5)); // 15
\`\`\`

Fíjate en que \`crearMultiplicador\` recibe un dato (\`factor\`) y la función que devuelve recibe otro (\`numero\`). Hemos partido una operación de dos datos en dos pasos: primero fijas uno, y más tarde das el otro. A esto se le llama **aplicación parcial**: la función se aplica "a medias" y queda esperando el resto.

¿Para qué sirve? Para no repetir datos. Imagina \`crearValidadorLongitud(8)\` que devuelve una función para comprobar contraseñas, o \`crearFormateador('€')\` que devuelve una función para pintar precios. Fabricas la función una vez con la configuración y luego la usas en muchos sitios solo con el dato que cambia.

Error típico: llamar a la fábrica cada vez (\`crearMultiplicador(2)(5)\`) cuando querías guardarla. Funciona, pero pierdes la gracia de tener la función lista con un nombre claro como \`doble\`. Otro error: olvidar el \`return\` de la función interna, con lo que \`doble\` vale \`undefined\` y al llamarla sale "doble is not a function".`,
      example: `const crearSufijo = (sufijo) => (texto) => texto + sufijo;
const exclamar = crearSufijo('!');
console.log(exclamar('Hola')); // Hola!`,
      concepts: ['fábrica de funciones', 'aplicación parcial', 'función de orden superior', 'closure'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿Por qué doble y triple no se pisan?',
        brief: 'Explica con tus palabras qué recuerda cada función fabricada.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'short',
          runner: 'none',
          prompt: `Mira este código:

function crearMultiplicador(factor) {
  return function (numero) {
    return numero * factor;
  };
}
const doble = crearMultiplicador(2);
const triple = crearMultiplicador(3);
console.log(doble(5));  // 10
console.log(triple(5)); // 15

Explica con tus palabras: 1) por qué doble y triple dan resultados distintos si salen de la misma función, y 2) por qué factor sigue existiendo cuando llamamos a doble(5), si crearMultiplicador ya terminó hace rato.`,
          solution:
            '1) Cada llamada a crearMultiplicador crea un ámbito nuevo con su propia variable factor: en la primera vale 2 y en la segunda 3. La función que se devuelve en cada llamada queda ligada a SU ámbito, así que doble recuerda factor = 2 y triple recuerda factor = 3. No comparten la variable, por eso no se pisan. 2) Porque la función devuelta es un closure: guarda una referencia al ámbito donde se creó. Mientras doble exista y apunte a ese ámbito, el motor no lo libera, y cuando ejecutamos doble(5) busca factor en ese ámbito recordado y lo encuentra.',
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: 'El clásico: var en un bucle con setTimeout',
      objective:
        'Entender por qué var en un bucle con setTimeout imprime siempre el último valor y por qué let lo arregla.',
      theory: `Esta es una pregunta de examen y de entrevista de trabajo de toda la vida. Mira este bucle:

\`\`\`js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3
// 3
// 3
\`\`\`

Pasan dos cosas a la vez. Primero, \`setTimeout\` no ejecuta la función en ese momento: la apunta para "más tarde", cuando el código actual haya terminado (aunque pongas 0 ms). Así que el bucle da sus 3 vueltas completas y \`i\` acaba valiendo 3 (por eso sale del bucle). Solo entonces se ejecutan las tres funciones.

Segundo, \`var\` tiene ámbito de **función**, no de bloque: solo existe UNA variable \`i\` para todo el bucle. Las tres funciones flecha son closures que recuerdan la misma variable (recuerda: el closure guarda la variable, no una foto del valor). Cuando por fin se ejecutan, las tres miran esa única \`i\`, que ya vale 3.

Con \`let\` el resultado es 0, 1, 2. ¿Por qué? \`let\` tiene ámbito de **bloque**, y en los bucles \`for\` el motor crea una \`i\` NUEVA en cada vuelta, copiando el valor de la anterior. Cada función flecha captura la \`i\` de su vuelta, así que cada una recuerda un valor distinto.

\`\`\`js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0
// 1
// 2
\`\`\`

Moraleja práctica: usa siempre \`let\` (o \`const\`) y olvídate de \`var\`. Si te encuentras este bug en código antiguo, la pista es "todas las funciones ven el mismo valor final".`,
      example: `// Con var: una sola i compartida -> 3 3 3
// Con let: una i nueva por vuelta  -> 0 1 2`,
      concepts: ['var vs let', 'ámbito de bloque', 'setTimeout', 'closure en bucles'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿Qué imprime el bucle con var?',
        brief: 'Predice la salida del clásico bucle con var y setTimeout.',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
          quiz: {
            options: [
              { id: 'a', text: '0, 1, 2' },
              { id: 'b', text: '3, 3, 3' },
              { id: 'c', text: '2, 2, 2' },
              { id: 'd', text: '0, 0, 0' },
            ],
            correctIds: ['b'],
            explanation:
              'Con var solo hay UNA variable i para todo el bucle. setTimeout aplaza las funciones hasta que termina el código actual, así que cuando se ejecutan el bucle ya ha acabado e i vale 3 (el valor que hizo que i < 3 fuera falso). Las tres funciones recuerdan esa misma variable e imprimen 3. "0, 1, 2" sería la salida con let, que crea una i nueva en cada vuelta. "2, 2, 2" es el error de pensar que i se queda en el último valor válido, pero el i++ final la lleva a 3. "0, 0, 0" no tiene sentido porque i sí cambia.',
          },
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'forEach y map: recorrer frente a transformar',
      objective:
        'Distinguir forEach (hacer algo con cada elemento) de map (crear un array nuevo transformado).',
      theory: `Los arrays traen métodos que reciben una función (un **callback**) y la llaman por ti con cada elemento. Así no tienes que escribir el \`for\` con su índice a mano. El callback recibe \`(elemento, indice, array)\`, aunque casi siempre solo usarás el primero.

\`forEach\` recorre el array y ejecuta el callback con cada elemento. Sirve para hacer algo (imprimir, sumar a una variable, pintar en la página). **Siempre devuelve \`undefined\`**: no fabrica nada.

\`map\` también recorre el array, pero con lo que devuelve el callback construye un **array nuevo del mismo tamaño**. El array original no se toca.

\`\`\`js
const precios = [10, 20, 30];
const conIva = precios.map(p => p * 1.21);
console.log(conIva);  // [ 12.1, 24.2, 36.3 ]
console.log(precios); // [ 10, 20, 30 ] (intacto)
precios.forEach(p => console.log(p)); // 10, 20, 30
\`\`\`

Regla para elegir: si quieres un array nuevo, \`map\`; si solo quieres hacer algo con cada elemento, \`forEach\`. Error típico 1: usar \`map\` sin \`return\` en una flecha con llaves: \`precios.map(p => { p * 2 })\` devuelve \`[undefined, undefined, undefined]\`, porque con llaves hace falta \`return\`. Error típico 2: guardar el resultado de \`forEach\` esperando un array; te llevas \`undefined\`.`,
      example: `const nombres = ['ana', 'luis'];
const mayus = nombres.map(n => n.toUpperCase());
console.log(mayus); // [ 'ANA', 'LUIS' ]`,
      concepts: ['callback', 'forEach', 'map', 'array nuevo', 'inmutabilidad'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'map frente a forEach',
        brief: 'Predice qué devuelve cada método.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

const nums = [1, 2, 3];
const a = nums.map(n => n * 2);
const b = nums.forEach(n => n * 2);
console.log(a);
console.log(b);`,
          quiz: {
            options: [
              { id: 'a', text: '[2, 4, 6] y [2, 4, 6]' },
              { id: 'b', text: '[2, 4, 6] y undefined' },
              { id: 'c', text: 'undefined y [2, 4, 6]' },
              { id: 'd', text: '[1, 2, 3] y [2, 4, 6]' },
            ],
            correctIds: ['b'],
            explanation:
              'map construye un array nuevo con lo que devuelve el callback, así que a es [2, 4, 6]. forEach ejecuta el callback con cada elemento pero siempre devuelve undefined, aunque el callback devuelva algo: por eso b es undefined. Ninguno de los dos modifica nums, que sigue siendo [1, 2, 3].',
          },
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'filter, find, findIndex, some y every',
      objective:
        'Elegir el método adecuado para filtrar, buscar o comprobar condiciones en un array.',
      theory: `Estos cinco métodos reciben un callback que devuelve verdadero o falso (una condición). Lo que cambia es qué te devuelven:

\`\`\`js
const notas = [4, 7, 9, 3];
notas.filter(n => n >= 5);    // [ 7, 9 ]  todos los que cumplen
notas.find(n => n >= 5);      // 7         el PRIMERO que cumple
notas.findIndex(n => n >= 5); // 1         la POSICIÓN del primero
notas.some(n => n < 5);       // true      ¿alguno cumple?
notas.every(n => n >= 5);     // false     ¿todos cumplen?
\`\`\`

\`filter\` devuelve siempre un array (vacío si nadie cumple). \`find\` devuelve el elemento, o \`undefined\` si no hay ninguno. \`findIndex\` devuelve la posición, o \`-1\` si no hay ninguno. \`some\` y \`every\` devuelven un booleano.

Por dentro, \`find\`, \`findIndex\`, \`some\` y \`every\` paran en cuanto saben la respuesta: \`find\` se detiene en el primer acierto, \`some\` en el primer \`true\` y \`every\` en el primer \`false\`. \`filter\` siempre recorre el array entero, porque necesita mirar todos.

Errores típicos: usar \`filter\` cuando buscas UN elemento (te devuelve un array y luego haces \`resultado.nombre\` y sale \`undefined\`; usa \`find\`); comprobar \`if (notas.findIndex(...))\` cuando la posición puede ser 0, que es falsy (compara con \`!== -1\`); y olvidar que \`find\` puede devolver \`undefined\` si no encuentra nada.`,
      example: `const usuarios = ['ana', 'luis', 'eva'];
console.log(usuarios.find(u => u.startsWith('l'))); // luis
console.log(usuarios.findIndex(u => u === 'pepe')); // -1`,
      concepts: ['filter', 'find', 'findIndex', 'some', 'every', 'predicado'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Analiza las notas de la clase',
        brief: 'Usa filter, find, findIndex, some y every sobre un array de notas.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Con el array notas, imprime con console.log, en este orden y una cosa por línea: 1) el array de aprobados (nota >= 5) usando filter; 2) la primera nota de sobresaliente (>= 9) usando find; 3) la posición del primer suspenso (< 5) usando findIndex; 4) si alguien ha sacado un 10, usando some; 5) si han aprobado todos, usando every. Debe salir: [7, 9, 6, 10], 9, 0, true, false.',
          starterCode: `const notas = [4, 7, 9, 3, 6, 10];

// TODO 1: aprobados con filter
// TODO 2: primera nota >= 9 con find
// TODO 3: posición del primer suspenso con findIndex
// TODO 4: ¿alguien tiene un 10? con some
// TODO 5: ¿han aprobado todos? con every
`,
          solution: `const notas = [4, 7, 9, 3, 6, 10];

console.log(notas.filter(n => n >= 5));   // [ 7, 9, 6, 10 ]
console.log(notas.find(n => n >= 9));     // 9
console.log(notas.findIndex(n => n < 5)); // 0
console.log(notas.some(n => n === 10));   // true
console.log(notas.every(n => n >= 5));    // false`,
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'reduce paso a paso',
      objective:
        'Entender cómo reduce va acumulando un resultado recorriendo el array, vuelta a vuelta.',
      theory: `\`reduce\` convierte un array en UN solo valor: una suma, un máximo, un objeto, lo que quieras. Recibe dos cosas: un callback \`(acumulador, elemento) => nuevoAcumulador\` y el **valor inicial** del acumulador.

\`\`\`js
const precios = [12, 3, 5];
const total = precios.reduce((acc, p) => acc + p, 0);
console.log(total); // 20
\`\`\`

Veámoslo vuelta a vuelta. Al empezar, \`acc\` vale el valor inicial, 0. Vuelta 1: \`acc = 0\`, \`p = 12\`, el callback devuelve 12. Vuelta 2: \`acc = 12\` (lo que devolvió la vuelta anterior), \`p = 3\`, devuelve 15. Vuelta 3: \`acc = 15\`, \`p = 5\`, devuelve 20. No quedan elementos, así que \`reduce\` devuelve el último acumulador: 20.

La clave es que **lo que devuelve el callback se convierte en el acumulador de la siguiente vuelta**. Si se te olvida el \`return\` (en una flecha con llaves), el acumulador pasa a ser \`undefined\` y en la siguiente vuelta \`undefined + 3\` da \`NaN\`. Si ves \`NaN\` o \`undefined\` al usar reduce, mira primero eso.

Pon siempre el valor inicial. Sin él, \`reduce\` usa el primer elemento como acumulador y empieza en el segundo; funciona para sumar, pero con un array vacío lanza \`TypeError: Reduce of empty array with no initial value\`, y cuando acumulas en un objeto o en un texto da resultados raros.

\`\`\`js
const maximo = [4, 9, 2].reduce((acc, n) => (n > acc ? n : acc), -Infinity);
console.log(maximo); // 9
\`\`\``,
      example: `// Contar cuántos aprobados hay
const notas = [4, 7, 9, 3];
const aprobados = notas.reduce((acc, n) => (n >= 5 ? acc + 1 : acc), 0);
console.log(aprobados); // 2`,
      concepts: ['reduce', 'acumulador', 'valor inicial', 'NaN por return olvidado'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 20,
      challenge: {
        title: 'Total y máximo con reduce',
        brief: 'Calcula el total del carrito y el precio más alto usando reduce.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Con el array precios, usa reduce para calcular la suma total e imprímela con console.log (debe salir 20). Después usa reduce otra vez para obtener el precio más alto e imprímelo (debe salir 12.5). No uses bucles for ni Math.max.',
          starterCode: `const precios = [12.5, 3, 4.5];

// TODO: total con reduce (empieza el acumulador en 0)

// TODO: máximo con reduce
`,
          solution: `const precios = [12.5, 3, 4.5];

const total = precios.reduce((acc, p) => acc + p, 0);
console.log(total); // 20

const maximo = precios.reduce((acc, p) => (p > acc ? p : acc), precios[0]);
console.log(maximo); // 12.5`,
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'sort, encadenar métodos y mutar frente a no mutar',
      objective:
        'Ordenar bien con una función comparadora, encadenar métodos y saber qué métodos modifican el array original.',
      theory: `\`sort\` sin argumentos tiene una trampa famosa: **convierte los elementos a texto** y los ordena como en un diccionario. Por eso \`[10, 1, 2].sort()\` da \`[1, 10, 2]\`: como textos, "10" va antes que "2" porque se compara carácter a carácter y "1" es menor que "2".

Para ordenar números hay que darle una **función comparadora** \`(a, b) => ...\`. Si devuelve un número negativo, \`a\` va antes; si es positivo, \`b\` va antes; si es 0, se quedan como están. Restar hace exactamente eso:

\`\`\`js
[10, 1, 2].sort();                // [ 1, 10, 2 ]  (orden de texto)
[10, 1, 2].sort((a, b) => a - b); // [ 1, 2, 10 ]  ascendente
[10, 1, 2].sort((a, b) => b - a); // [ 10, 2, 1 ]  descendente
\`\`\`

Segunda trampa: \`sort\` **muta** el array original (lo ordena en el sitio) y además devuelve el mismo array, no una copia. Lo mismo pasa con \`push\`, \`pop\`, \`splice\` y \`reverse\`. En cambio \`map\`, \`filter\`, \`slice\` y \`concat\` **no mutan**: devuelven un array nuevo. Si quieres ordenar sin estropear el original, copia primero (\`[...lista].sort(...)\`) o usa \`toSorted\`, la versión moderna que no muta.

Como \`filter\` y \`map\` devuelven arrays, puedes **encadenar** métodos: el resultado de uno es la entrada del siguiente. Léelo de arriba abajo como una receta:

\`\`\`js
const total = [5, 12, 8, 1]
  .filter(n => n > 4)      // [ 5, 12, 8 ]
  .map(n => n * 10)        // [ 50, 120, 80 ]
  .reduce((a, n) => a + n, 0);
console.log(total); // 250
\`\`\`

Error típico al encadenar: poner \`forEach\` en medio. Como devuelve \`undefined\`, el siguiente método falla con "Cannot read properties of undefined".`,
      example: `const nombres = ['eva', 'Ana', 'luis'];
const ordenados = [...nombres].sort((a, b) => a.localeCompare(b));
console.log(ordenados); // [ 'Ana', 'eva', 'luis' ]
console.log(nombres);   // [ 'eva', 'Ana', 'luis' ] (intacto)`,
      concepts: ['sort', 'función comparadora', 'mutar', 'encadenar métodos', 'toSorted'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 20,
      challenge: {
        title: 'La trampa de sort',
        brief: 'Predice qué hace sort sin comparadora y si toca el array original.',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

const nums = [10, 1, 2, 25];
const ordenados = nums.sort();
console.log(ordenados);
console.log(nums === ordenados);`,
          quiz: {
            options: [
              { id: 'a', text: '[1, 2, 10, 25] y false' },
              { id: 'b', text: '[1, 2, 10, 25] y true' },
              { id: 'c', text: '[1, 10, 2, 25] y true' },
              { id: 'd', text: '[1, 10, 2, 25] y false' },
            ],
            correctIds: ['c'],
            explanation:
              'sort sin comparadora convierte los números a texto y los ordena como palabras: "1" < "10" < "2" < "25", por eso sale [1, 10, 2, 25]. Además sort ordena el array EN EL SITIO y devuelve ese mismo array, así que nums y ordenados son la misma referencia y nums === ordenados es true. Para ordenar números de verdad usa sort((a, b) => a - b), y para no tocar el original copia antes ([...nums]) o usa toSorted.',
          },
        },
      },
    },
  ],
};
