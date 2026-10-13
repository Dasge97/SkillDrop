import { type PhaseSeed } from '../content-types.js';

// Bloque de código para la teoría: una línea por elemento, sin líneas en blanco.
const code = (...lines: string[]): string => '```js\n' + lines.join('\n') + '\n```';

const RUBRIC = [{ name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true }];

export const dwecPasoP05: PhaseSeed = {
  code: 'FASE 5',
  title: 'Funciones',
  objective:
    'Escribir funciones que reciben datos y devuelven resultados, entender el ámbito de las variables y usar funciones como valores (callbacks).',
  unlockedSkills: ['js-fundamentos'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'Qué es una función y qué devuelve',
      objective: 'Distinguir definir de llamar una función y entender `return` (y el `undefined` cuando falta).',
      theory: [
        'Una función es un bloque de código con nombre que puedes ejecutar cuando quieras, las veces que quieras. Existe por tres motivos: no repetir código (lo escribes una vez y lo llamas diez), dar nombre a una idea (`calcularIVA(precio)` se entiende mejor que la fórmula suelta) y poder cambiarla en un solo sitio.',
        'Hay dos momentos distintos. DEFINIR la función solo la guarda en memoria; no ejecuta nada. LLAMARLA, escribiendo su nombre seguido de paréntesis, es lo que la ejecuta. Sin paréntesis no se llama: `saludar` es la función en sí (un valor), `saludar()` es ejecutarla.',
        '`return` hace dos cosas a la vez: termina la función en ese momento y entrega un valor a quien la llamó. Ese valor sustituye a la llamada, así que puedes guardarlo en una variable o usarlo en una expresión. Lo que haya después de un `return` ejecutado no se ejecuta.',
        code(
          'function doble(n) {',
          '  return n * 2;',
          '}',
          'const r = doble(4);',
          'console.log(r);            // 8',
          'console.log(doble(4) + 1); // 9',
        ),
        'Si una función no tiene `return`, o tiene `return;` sin valor, devuelve `undefined`. Error típico: calcular el resultado pero olvidar el `return`, por ejemplo `function doble(n) { n * 2; }`. La cuenta se hace, pero el resultado se tira a la basura y la llamada vale `undefined`.',
        'Otro error típico: confundir imprimir con devolver. `console.log` dentro de la función muestra el valor en consola, pero NO lo devuelve. Si luego haces `const x = miFuncion()`, `x` será `undefined`. Regla: las funciones que calculan algo deberían devolverlo, y quien las llama decide si lo imprime.',
      ].join('\n\n'),
      example: `function areaRectangulo(base, altura) {
  return base * altura;
}
console.log(areaRectangulo(3, 4)); // 12`,
      concepts: ['función', 'llamada', 'return', 'undefined', 'valor de retorno'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'La función que no devuelve nada',
        brief: '¿Qué vale la llamada a una función sin return?',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

function doble(n) {
  n * 2;
}
console.log(doble(3));`,
          quiz: {
            options: [
              { id: 'seis', text: '6' },
              { id: 'undef', text: 'undefined' },
              { id: 'tres', text: '3' },
              { id: 'err', text: 'Un error, porque falta return' },
            ],
            correctIds: ['undef'],
            explanation:
              'La multiplicación se calcula, pero sin return su resultado no sale de la función. Una función sin return devuelve undefined, y eso es lo que imprime console.log. No da error: olvidar el return es legal, solo que casi nunca es lo que quieres. Para obtener 6 habría que escribir return n * 2;.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'Declaración, expresión de función y hoisting',
      objective: 'Reconocer las dos formas de crear una función y por qué solo una se puede llamar antes de escribirla.',
      theory: [
        'Declaración de función: empieza por la palabra `function` y lleva nombre, `function sumar(a, b) { return a + b; }`. Expresión de función: creas una función como un valor y la guardas en una variable, `const restar = function (a, b) { return a - b; };`. Al llamarlas, las dos se usan igual: `sumar(2, 3)`, `restar(5, 1)`.',
        'La diferencia está en el hoisting ("elevación"). Antes de ejecutar tu código, el motor de JavaScript lo recorre una vez y registra las declaraciones. Las declaraciones de función se registran COMPLETAS, así que puedes llamarlas en una línea anterior a donde las escribiste.',
        'Una expresión de función es solo el valor de una variable. Con `const` o `let`, la variable existe pero no se puede usar hasta llegar a su línea (es la llamada "zona muerta temporal"). Si la llamas antes, obtienes un error.',
        code(
          'console.log(sumar(2, 3)); // 5 (la declaración se eleva)',
          'function sumar(a, b) { return a + b; }',
          'restar(5, 1);',
          "// ReferenceError: Cannot access 'restar' before initialization",
          'const restar = function (a, b) { return a - b; };',
        ),
        '¿Cuál usar? Las dos son correctas. Las declaraciones se leen bien para funciones principales; las expresiones (y las funciones flecha, que verás después) son habituales cuando la función se pasa como valor. Lo que importa es que, si ves ese ReferenceError, sepas que estás usando una función guardada en una variable antes de su línea.',
      ].join('\n\n'),
      example: `// Declaración
function saludar(nombre) {
  return 'Hola, ' + nombre;
}
// Expresión
const despedir = function (nombre) {
  return 'Adiós, ' + nombre;
};`,
      concepts: ['declaración de función', 'expresión de función', 'hoisting', 'ReferenceError'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Llamar antes de definir',
        brief: 'Predice qué pasa al usar una declaración y una expresión antes de su línea.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué ocurre al ejecutar este código?

console.log(sumar(2, 3));
console.log(restar(5, 1));

function sumar(a, b) {
  return a + b;
}
const restar = function (a, b) {
  return a - b;
};`,
          quiz: {
            options: [
              { id: 'ambas', text: 'Imprime 5 y luego 4' },
              { id: 'error1', text: 'Da error ya en la primera línea, porque sumar aún no existe' },
              { id: 'mixto', text: 'Imprime 5 y luego da ReferenceError en la segunda línea' },
              { id: 'undef', text: 'Imprime 5 y luego undefined' },
            ],
            correctIds: ['mixto'],
            explanation:
              'sumar es una declaración de función: el motor la registra completa antes de ejecutar, así que la primera línea imprime 5. restar es una variable const que guarda una función; hasta llegar a su línea no se puede usar, y la segunda línea lanza ReferenceError (Cannot access \'restar\' before initialization). No imprime undefined porque const no se inicializa a undefined como var.',
          },
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'Parámetros, argumentos y valores por defecto',
      objective: 'Diferenciar parámetros de argumentos y saber cuándo se aplica un valor por defecto.',
      theory: [
        'Los parámetros son los nombres que pones entre paréntesis al DEFINIR la función: son variables locales vacías esperando datos. Los argumentos son los valores concretos que pasas al LLAMARLA. En `function saludar(nombre)` el parámetro es `nombre`; en `saludar("Ana")` el argumento es `"Ana"`. Se emparejan por posición: el primer argumento va al primer parámetro, y así.',
        'JavaScript no comprueba cuántos argumentos pasas. Si pasas menos, los parámetros que sobran valen `undefined`. Si pasas más, los que sobran se ignoran (no da error).',
        code(
          'function mostrar(a, b) { console.log(a, b); }',
          'mostrar(1);       // 1 undefined',
          'mostrar(1, 2, 3); // 1 2',
        ),
        'Un parámetro por defecto da un valor de reserva: `function saludar(nombre = "invitado")`. Se usa cuando el argumento no llega o llega exactamente como `undefined`. OJO: solo con `undefined`. Si pasas `null`, `0` o `""`, son valores válidos y se respetan, no se sustituyen.',
        code(
          'function saludar(nombre = "invitado") { return "Hola " + nombre; }',
          'saludar();          // "Hola invitado"',
          'saludar(undefined); // "Hola invitado"',
          'saludar(null);      // "Hola null"',
          'saludar("");        // "Hola "',
        ),
      ].join('\n\n'),
      example: `function precioFinal(precio, iva = 0.21) {
  return precio * (1 + iva);
}
console.log(precioFinal(100));     // 121
console.log(precioFinal(200, 0.5)); // 300`,
      concepts: ['parámetro', 'argumento', 'parámetro por defecto', 'undefined'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Cuándo salta el valor por defecto?',
        brief: 'Distingue undefined de null en un parámetro por defecto.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

function saludo(n = 'invitado') {
  return 'Hola ' + n;
}
console.log(saludo(undefined));
console.log(saludo(null));`,
          quiz: {
            options: [
              { id: 'a', text: 'Hola invitado / Hola invitado' },
              { id: 'b', text: 'Hola invitado / Hola null' },
              { id: 'c', text: 'Hola undefined / Hola null' },
              { id: 'd', text: 'Hola undefined / Hola invitado' },
            ],
            correctIds: ['b'],
            explanation:
              'El valor por defecto solo se aplica cuando el argumento es undefined (o no se pasa). Con undefined sale "Hola invitado". null es un valor que tú has pasado a propósito, así que se respeta y al concatenarlo sale "Hola null". La opción a supone que null también activa el valor por defecto, y no es así.',
          },
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: 'Parámetros rest y desestructuración de parámetros',
      objective: 'Recibir un número variable de argumentos con `...args` y sacar propiedades de un objeto directamente en los parámetros.',
      theory: [
        'A veces no sabes cuántos argumentos te van a pasar: `sumarTodo(1, 2)` o `sumarTodo(5, 10, 20, 40)`. El parámetro rest, escrito con tres puntos delante (`...nums`), recoge todos los argumentos que lleguen en un ARRAY de verdad, que puedes recorrer con `for...of`. Si no llega ninguno, es un array vacío.',
        code(
          'function contar(...cosas) {',
          '  return cosas.length;',
          '}',
          'console.log(contar("a", "b", "c")); // 3',
          'console.log(contar());              // 0',
        ),
        'Reglas del rest: solo puede haber uno y tiene que ser el ÚLTIMO parámetro (`function f(primero, ...resto)`). Tiene sentido: recoge "todo lo que sobra", y eso solo se puede saber al final.',
        'Cuando una función recibe un objeto, en lugar de escribir `persona.nombre` y `persona.edad` dentro, puedes desestructurarlo en los propios parámetros: `function ficha({ nombre, edad })`. El motor busca en el objeto recibido las propiedades con esos nombres y crea variables locales con ellas. Las propiedades que no nombras se ignoran.',
        code(
          'function ficha({ nombre, edad }) {',
          '  return nombre + " tiene " + edad + " años";',
          '}',
          'ficha({ nombre: "Ana", edad: 20, ciudad: "Valencia" });',
          '// "Ana tiene 20 años"',
        ),
        'Ventaja: el orden deja de importar y la llamada se lee sola (`crearUsuario({ nombre: "Ana", admin: true })` frente a `crearUsuario("Ana", true)`). Error típico: llamar a la función sin pasar objeto (`ficha()`); desestructurar `undefined` lanza un TypeError.',
      ].join('\n\n'),
      example: `function media(...notas) {
  let total = 0;
  for (const n of notas) total += n;
  return total / notas.length;
}
console.log(media(6, 8, 10)); // 8`,
      concepts: ['parámetro rest', '...args', 'desestructuración', 'objeto como parámetro'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 18,
      challenge: {
        title: 'sumarTodo y ficha',
        brief: 'Escribe una función con parámetro rest y otra que desestructura un objeto.',
        difficulty: 2,
        timeLimitMinutes: 12,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            "1) Escribe sumarTodo(...nums), que devuelva la suma de todos los números que reciba (0 si no recibe ninguno). 2) Escribe ficha({ nombre, edad }), que devuelva el texto 'NOMBRE tiene EDAD años'. Las llamadas del código de partida deben imprimir: 6, 15, 0 y 'Ana tiene 20 años'.",
          starterCode: `function sumarTodo(...nums) {
  // TODO: recorre nums y devuelve la suma
}

function ficha(/* TODO: desestructura nombre y edad */) {
  // TODO: devuelve 'Ana tiene 20 años'
}

console.log(sumarTodo(1, 2, 3));
console.log(sumarTodo(5, 10));
console.log(sumarTodo());
console.log(ficha({ nombre: 'Ana', edad: 20, ciudad: 'Valencia' }));`,
          solution: `function sumarTodo(...nums) {
  let total = 0;
  for (const n of nums) {
    total += n;
  }
  return total;
}

function ficha({ nombre, edad }) {
  return nombre + ' tiene ' + edad + ' años';
}

console.log(sumarTodo(1, 2, 3)); // 6
console.log(sumarTodo(5, 10));   // 15
console.log(sumarTodo());        // 0
console.log(ficha({ nombre: 'Ana', edad: 20, ciudad: 'Valencia' })); // Ana tiene 20 años`,
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'Funciones flecha',
      objective: 'Escribir funciones flecha, usar el return implícito y devolver objetos sin caer en la trampa de las llaves.',
      theory: [
        'Una función flecha es una forma corta de escribir una expresión de función: quitas la palabra `function` y pones `=>` entre los parámetros y el cuerpo. `const doble = (n) => { return n * 2; };` hace lo mismo que la versión con `function`.',
        'Atajos: si hay un solo parámetro puedes quitar sus paréntesis (`n => ...`); si no hay ninguno, los paréntesis son obligatorios (`() => ...`). Y si el cuerpo es una sola expresión, puedes quitar las llaves y el `return`: el valor de la expresión se devuelve solo. Es el "return implícito".',
        code(
          'const doble = n => n * 2;',
          'const sumar = (a, b) => a + b;',
          'const saludar = () => "hola";',
          'console.log(doble(4), sumar(1, 2), saludar()); // 8 3 hola',
        ),
        'Ojo: el return implícito SOLO existe sin llaves. Si pones llaves, el cuerpo es un bloque normal y necesitas `return`; si no, devuelve `undefined`. `const doble = n => { n * 2 };` devuelve `undefined`.',
        'La trampa clásica es devolver un objeto. En `() => { valor: 1 }` el motor interpreta las llaves como un BLOQUE de código, no como un objeto: `valor:` lo toma como una etiqueta y `1` como una expresión suelta. Resultado: `undefined`. Para devolver un objeto con return implícito, envuélvelo en paréntesis: `() => ({ valor: 1 })`.',
        'Las flechas no son solo azúcar sintáctico: tampoco tienen su propio `this`, lo que importará al ver objetos y eventos. De momento, úsalas sobre todo para funciones cortas que pasas a otras funciones.',
      ].join('\n\n'),
      example: `const crearPunto = (x, y) => ({ x, y });
console.log(crearPunto(2, 5)); // { x: 2, y: 5 }`,
      concepts: ['función flecha', 'return implícito', '=>', 'devolver objeto'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Llaves que engañan',
        brief: '¿Qué devuelve una flecha cuyo cuerpo parece un objeto?',
        difficulty: 2,
        timeLimitMinutes: 6,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

const crear = () => { valor: 1 };
console.log(crear());`,
          quiz: {
            options: [
              { id: 'obj', text: '{ valor: 1 }' },
              { id: 'undef', text: 'undefined' },
              { id: 'uno', text: '1' },
              { id: 'err', text: 'SyntaxError' },
            ],
            correctIds: ['undef'],
            explanation:
              'Tras => las llaves se interpretan como el bloque de la función, no como un objeto. Dentro, "valor:" es una etiqueta y 1 una expresión que no se usa; no hay return, así que la función devuelve undefined. No es SyntaxError porque ese código es válido. Para devolver el objeto hay que escribir () => ({ valor: 1 }).',
          },
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'Ámbito: global, de función y de bloque',
      objective: 'Saber desde dónde se puede ver cada variable y por qué `let`/`const` no se comportan como `var`.',
      theory: [
        'El ámbito (scope) de una variable es la zona del código donde existe y se puede usar. Hay tres niveles. Global: declarada fuera de cualquier función o bloque, se ve desde todas partes. De función: declarada dentro de una función, solo existe dentro de ella. De bloque: declarada con `let` o `const` dentro de unas llaves (`if`, `for`, `{ }`), solo existe dentro de esas llaves.',
        'Cuando usas una variable, el motor la busca primero en el ámbito actual; si no está, sube al ámbito que lo contiene, y así hasta el global. Si no la encuentra en ninguno, lanza `ReferenceError: x is not defined`. Esta búsqueda va siempre de dentro hacia fuera, nunca al revés: desde fuera no puedes ver lo que se declaró dentro.',
        code(
          'const app = "SkillDrop";      // global',
          'function f() {',
          '  const local = "solo aquí";  // de función',
          '  console.log(app);           // SkillDrop (sube a buscarla)',
          '}',
          'f();',
          'console.log(local);           // ReferenceError',
        ),
        '`var` es la forma antigua y NO respeta los bloques: una `var` declarada dentro de un `if` existe en toda la función. `let` y `const` sí se quedan dentro de su bloque. Por eso hoy se usa `let`/`const` siempre: las variables viven solo donde hacen falta y no "se escapan".',
        'Sombreado (shadowing): si declaras dentro una variable con el mismo nombre que una de fuera, la de dentro tapa a la de fuera mientras estás dentro, pero no la modifica. Al salir del bloque, vuelves a ver la de fuera con su valor original.',
      ].join('\n\n'),
      example: `let contador = 0;
function incrementar() {
  contador++; // modifica la global: no hay otra con ese nombre aquí
}
incrementar();
console.log(contador); // 1`,
      concepts: ['ámbito', 'scope global', 'scope de función', 'scope de bloque', 'var vs let', 'sombreado'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 18,
      challenge: {
        title: 'Variables que se ven y que no',
        brief: 'Predice qué variable ve console.log con let, var y sombreado.',
        difficulty: 3,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

let x = 'global';
function prueba() {
  if (true) {
    let x = 'bloque';
    var y = 'var';
  }
  console.log(x, y);
}
prueba();`,
          quiz: {
            options: [
              { id: 'a', text: 'bloque var' },
              { id: 'b', text: 'global var' },
              { id: 'c', text: 'global undefined' },
              { id: 'd', text: 'ReferenceError: y is not defined' },
            ],
            correctIds: ['b'],
            explanation:
              "La x 'bloque' se declaró con let dentro del if, así que solo existe dentro de esas llaves; fuera del if, console.log sube y encuentra la x global: 'global'. La y se declaró con var, que no respeta bloques: existe en toda la función y ya tiene el valor 'var' al llegar al console.log. Si y fuera let, entonces sí habría ReferenceError.",
          },
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'Funciones como valores: callbacks',
      objective: 'Pasar una función como argumento a otra y entender quién la llama y cuándo.',
      theory: [
        'En JavaScript las funciones son valores, igual que un número o un string: se pueden guardar en variables, meter en arrays y pasar como argumento a otra función. Una función que se pasa a otra para que esta la llame cuando le toque se llama callback.',
        'Así se separa el "qué hacer" del "cómo recorrer". Una función genérica se encarga de recorrer los datos, y el callback dice qué hacer con cada uno. Con la misma función recorres y, cambiando el callback, haces cosas distintas.',
        code(
          'function repetir(veces, accion) {',
          '  for (let i = 0; i < veces; i++) {',
          '    accion(i);              // aquí se llama al callback',
          '  }',
          '}',
          'repetir(2, n => console.log("vuelta " + n));',
          '// vuelta 0',
          '// vuelta 1',
        ),
        'Error típico: pasar la función CON paréntesis. `repetir(2, saludar())` no pasa la función: la ejecuta en ese momento y pasa lo que devuelve (normalmente `undefined`), y luego `accion(i)` falla con "accion is not a function". Para pasar la función, escribe solo su nombre: `repetir(2, saludar)`.',
        'Usarás callbacks todo el tiempo: los métodos `map`, `filter` y `forEach` de los arrays, `setTimeout` y, sobre todo, los eventos del DOM (`boton.addEventListener("click", miFuncion)`). En todos ellos tú das la función y es el otro quien decide cuándo llamarla.',
      ].join('\n\n'),
      example: `const operar = (a, b, operacion) => operacion(a, b);
console.log(operar(6, 3, (x, y) => x + y)); // 9
console.log(operar(6, 3, (x, y) => x * y)); // 18`,
      concepts: ['callback', 'función como valor', 'función de orden superior', 'pasar vs llamar'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 18,
      challenge: {
        title: 'Tu propio map',
        brief: 'Escribe una función que aplica un callback a cada elemento de un array.',
        difficulty: 2,
        timeLimitMinutes: 12,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            "Escribe aplicarATodos(arr, fn), que devuelva un array NUEVO con el resultado de llamar a fn con cada elemento de arr (sin usar map). Después llámala dos veces e imprime los resultados: con una flecha que multiplica por 10 sobre [1, 2, 3] debe salir [10, 20, 30]; con una flecha que añade '!' sobre ['hola', 'adiós'] debe salir ['hola!', 'adiós!'].",
          starterCode: `function aplicarATodos(arr, fn) {
  const resultado = [];
  // TODO: recorre arr, llama a fn con cada elemento y guarda lo que devuelve en resultado
  return resultado;
}

// TODO: imprime aplicarATodos([1, 2, 3], ...) con una flecha que multiplique por 10
// TODO: imprime aplicarATodos(['hola', 'adiós'], ...) con una flecha que añada '!'`,
          solution: `function aplicarATodos(arr, fn) {
  const resultado = [];
  for (const elemento of arr) {
    resultado.push(fn(elemento));
  }
  return resultado;
}

console.log(aplicarATodos([1, 2, 3], n => n * 10));        // [10, 20, 30]
console.log(aplicarATodos(['hola', 'adiós'], s => s + '!')); // ['hola!', 'adiós!']`,
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'Funciones que devuelven funciones',
      objective: 'Entender que una función puede fabricar otras funciones y que estas recuerdan los datos con los que se crearon.',
      theory: [
        'Si una función puede recibir funciones, también puede devolverlas. Una función que devuelve otra funciona como una "fábrica": la llamas con una configuración y te entrega una función nueva ya preparada.',
        code(
          'function crearMultiplicador(factor) {',
          '  return n => n * factor;',
          '}',
          'const triple = crearMultiplicador(3);',
          'console.log(triple(5));                // 15',
          'console.log(crearMultiplicador(2)(10)); // 20',
        ),
        'Lo sorprendente: cuando llamas a `triple(5)`, `crearMultiplicador` ya terminó hace rato. ¿De dónde sale `factor`? La función interna se creó dentro del ámbito de `crearMultiplicador` y conserva el acceso a sus variables aunque esa llamada ya haya acabado. A esto se le llama clausura (closure): una función más el ámbito donde nació.',
        'Cada llamada a la fábrica crea un ámbito nuevo, con su propio `factor`. Por eso `crearMultiplicador(2)` y `crearMultiplicador(3)` dan funciones independientes: no se pisan.',
        'Error típico: escribir `const triple = crearMultiplicador;` (sin argumentos ni paréntesis). Eso no fabrica nada; solo copia la fábrica. Entonces `triple(5)` devuelve una función (la multiplicadora con `factor = 5`), no un número.',
      ].join('\n\n'),
      example: `function crearSaludo(saludo) {
  return nombre => saludo + ', ' + nombre;
}
const enIngles = crearSaludo('Hello');
console.log(enIngles('Ana')); // Hello, Ana`,
      concepts: ['función que devuelve función', 'clausura', 'closure', 'fábrica de funciones'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿Cómo recuerda el 3?',
        brief: 'Explica qué devuelve una fábrica de funciones y por qué recuerda su argumento.',
        difficulty: 3,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'short',
          runner: 'none',
          prompt: `Fíjate en este código:

function crearMultiplicador(factor) {
  return n => n * factor;
}
const triple = crearMultiplicador(3);
console.log(triple(5));

1) ¿Qué tipo de valor hay guardado en triple? 2) ¿Qué imprime la última línea? 3) Cuando se ejecuta triple(5), crearMultiplicador ya ha terminado: ¿cómo sabe que factor vale 3?`,
          solution:
            '1) triple guarda una función (la flecha n => n * factor), no un número. 2) Imprime 15. 3) La función interna se creó dentro del ámbito de crearMultiplicador y conserva el acceso a sus variables (factor = 3) aunque esa llamada ya haya terminado. Eso es una clausura (closure): la función recuerda el ámbito donde se creó. Cada llamada a crearMultiplicador crea un ámbito nuevo con su propio factor.',
        },
      },
    },
  ],
};
