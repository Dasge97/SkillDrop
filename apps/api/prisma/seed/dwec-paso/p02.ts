import { type PhaseSeed } from '../content-types.js';

// Delimitador de bloque de código y unión de párrafos (separados por línea en blanco).
const C = '```';
const t = (...parrafos: string[]): string => parrafos.join('\n\n');

const RUBRICA = [
  { name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true },
];

export const dwecPasoP02: PhaseSeed = {
  code: 'FASE 2',
  title: 'Variables, tipos y conversiones',
  objective:
    'Entender qué es una variable, qué tipos de datos maneja JavaScript y cómo (y cuándo) convierte un tipo en otro, para dejar de llevarte sorpresas como "5" + 1 = "51".',
  unlockedSkills: ['js-fundamentos'],
  projects: [],
  lessons: [
    // ── L1 ─────────────────────────────────────────────────────────────────
    {
      title: 'Qué es una variable de verdad',
      objective:
        'Entender una variable como un nombre que apunta a un valor, y qué pasa al copiarla y reasignarla.',
      theory: t(
        `Una variable es un nombre que apunta a un valor guardado en memoria. Piensa en una etiqueta pegada a una caja: la etiqueta (\`edad\`) es lo que escribes en el código; la caja es el valor (\`18\`). Cuando usas \`edad\`, el motor de JavaScript busca la etiqueta y te da lo que hay en su caja.`,
        `Declarar es crear la etiqueta (\`let edad\`). Asignar es meter un valor en la caja (\`edad = 18\`). Normalmente se hacen las dos cosas a la vez: \`let edad = 18\`. Si declaras sin asignar, la variable existe pero vale \`undefined\`: la caja está vacía.`,
        `Lo que más confunde al principio es la copia. Cuando escribes \`let b = a\` con un número o un texto, JavaScript copia el valor en ese momento. A partir de ahí \`a\` y \`b\` son independientes: cambiar \`a\` después no toca a \`b\`.`,
        `${C}js
let a = 5;
let b = a;   // b recibe una COPIA del 5
a = 10;      // solo cambia a
console.log(a); // 10
console.log(b); // 5
${C}`,
        `Error típico: pensar que \`b = a\` crea un "enlace" permanente, como una fórmula de Excel. No lo es: la asignación se evalúa una sola vez, en esa línea. Si quieres que algo se recalcule cada vez, necesitarás una función (lo verás más adelante).`,
        `Nombres: usa camelCase (\`precioTotal\`), que digan qué guardan (\`nota\`, no \`x\`), sin espacios ni tildes, y que no empiecen por número. JavaScript distingue mayúsculas: \`nota\` y \`Nota\` son dos variables distintas.`,
      ),
      example: 'let nombre = "Ana";\nlet saludo = nombre;\nnombre = "Luis";\nconsole.log(saludo); // "Ana"',
      concepts: ['variable', 'declaración', 'asignación', 'undefined', 'copia de valor'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 10,
      challenge: {
        title: '¿Qué vale b?',
        brief: 'Predice qué imprime un código que copia una variable y luego cambia la original.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: '¿Qué imprime este código?\n\nlet a = 5;\nlet b = a;\na = 10;\nconsole.log(b);',
          quiz: {
            options: [
              { id: 'a', text: '5' },
              { id: 'b', text: '10' },
              { id: 'c', text: 'undefined' },
              { id: 'd', text: '15' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'En "let b = a" se copia el valor que tenía a en ese momento (5). Después "a = 10" solo cambia la caja de a; b sigue apuntando a su propio 5. No es 10 porque la asignación no crea un enlace permanente; no es undefined porque b sí recibió un valor; y no es 15 porque nadie suma nada.',
          },
        },
      },
    },

    // ── L2 ─────────────────────────────────────────────────────────────────
    {
      title: 'const, let y por qué olvidar var',
      objective:
        'Saber cuándo usar const y let, y entender los dos problemas de var: ámbito de función y hoisting.',
      theory: t(
        `Hay tres formas de declarar variables. La regla práctica: usa \`const\` por defecto, \`let\` solo si vas a reasignar la variable, y no uses \`var\`. Con \`const\` le dices al motor (y a quien lea tu código) "esto no se va a reasignar", y si lo intentas, salta un \`TypeError: Assignment to constant variable\`.`,
        `\`let\` y \`const\` tienen ámbito de bloque: solo existen dentro de las llaves \`{ }\` donde se declaran (un \`if\`, un \`for\`...). \`var\` tiene ámbito de función: ignora las llaves de los \`if\` y \`for\`, así que "se escapa" del bloque y puede pisar otras variables sin que te des cuenta.`,
        `${C}js
if (true) {
  var x = 1;
  let y = 2;
}
console.log(x); // 1  (var se escapa del if)
console.log(y); // ReferenceError: y is not defined
${C}`,
        `El segundo problema es el hoisting (elevación). Antes de ejecutar, el motor recorre el código y registra todas las declaraciones. Con \`var\`, la variable se crea arriba del todo con valor \`undefined\`, así que puedes usarla antes de la línea donde la declaras y no da error: te da \`undefined\` en silencio, que es peor.`,
        `${C}js
console.log(n); // undefined (no error)
var n = 3;
console.log(n); // 3
console.log(m); // ReferenceError: Cannot access 'm' before initialization
let m = 3;
${C}`,
        `Con \`let\` y \`const\` la variable también se registra, pero queda en la "zona muerta temporal" hasta su línea: usarla antes lanza un error claro. Eso es bueno: los errores que saltan pronto se arreglan rápido. Si ves \`var\` en apuntes antiguos, cámbialo mentalmente por \`let\`.`,
      ),
      example: 'const IVA = 0.21;     // no cambia nunca\nlet total = 100;      // va a cambiar\ntotal = total * (1 + IVA);\nconsole.log(total);   // 121',
      concepts: ['const', 'let', 'var', 'ámbito de bloque', 'hoisting', 'zona muerta temporal'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'El hoisting de var',
        brief: 'Predice qué imprime un código que usa una variable var antes de declararla.',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: '¿Qué imprime este código?\n\nconsole.log(n);\nvar n = 3;\nconsole.log(n);',
          quiz: {
            options: [
              { id: 'a', text: 'undefined y luego 3' },
              { id: 'b', text: '3 y luego 3' },
              { id: 'c', text: 'Un ReferenceError en la primera línea' },
              { id: 'd', text: 'null y luego 3' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'Con var, el motor "eleva" la declaración al principio y la inicializa a undefined; la asignación (= 3) se queda en su sitio. Por eso la primera línea imprime undefined y, tras asignar, la segunda imprime 3. No es "3 y 3" porque el valor no se eleva, solo la declaración. El ReferenceError es lo que pasaría con let o const. Y no es null: una variable sin valor vale undefined, nunca null por sí sola.',
          },
        },
      },
    },

    // ── L3 ─────────────────────────────────────────────────────────────────
    {
      title: 'const con objetos: la etiqueta no se mueve, la caja sí cambia',
      objective:
        'Entender que const impide reasignar la variable, pero no modificar el contenido de un objeto o array.',
      theory: t(
        `Con números y textos, \`const\` parece significar "valor fijo". Pero con objetos y arrays hay que afinar: \`const\` fija la referencia, no el contenido. La variable apunta siempre al mismo objeto, pero ese objeto puede cambiar por dentro.`,
        `¿Por qué? Un objeto no se guarda "dentro" de la variable. Se guarda aparte en memoria, y la variable solo contiene su dirección (una referencia). \`const\` prohíbe cambiar esa dirección; cambiar una propiedad no toca la dirección, así que está permitido.`,
        `${C}js
const alumno = { nombre: 'Ana', nota: 6 };
alumno.nota = 8;          // OK: cambia el contenido
alumno.curso = 'DAW';     // OK: añade una propiedad
console.log(alumno);      // { nombre: 'Ana', nota: 8, curso: 'DAW' }
alumno = { nombre: 'Luis' }; // TypeError: Assignment to constant variable
${C}`,
        `Con arrays pasa igual: \`const lista = []\` y luego \`lista.push(3)\` funciona perfectamente; \`lista = [3]\` no.`,
        `Consecuencia importante: si copias un objeto con \`const otro = alumno\`, NO copias el objeto, copias la dirección. Las dos variables apuntan al mismo objeto, y cambiar \`otro.nota\` también cambia \`alumno.nota\`. Esto es justo lo contrario de lo que viste con números en la primera lección, y es una fuente enorme de bugs.`,
        `Error típico: creer que \`const\` hace el objeto "de solo lectura". Si de verdad quieres congelarlo, existe \`Object.freeze(obj)\`, pero en el día a día casi nunca hace falta.`,
      ),
      example: 'const carrito = [];\ncarrito.push("pan");\ncarrito.push("leche");\nconsole.log(carrito.length); // 2',
      concepts: ['referencia', 'const', 'objeto', 'mutación', 'reasignación'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Explica por qué una línea funciona y la otra no',
        brief: 'Explica con tus palabras la diferencia entre cambiar una propiedad y reasignar una constante.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'short',
          runner: 'none',
          prompt:
            'Tienes este código:\n\nconst alumno = { nombre: "Ana" };\nalumno.nombre = "Luis";   // línea A\nalumno = { nombre: "Eva" }; // línea B\n\nLa línea A funciona y la línea B lanza TypeError. Explica con tus palabras por qué.',
          solution:
            'const impide reasignar la variable, es decir, cambiar a qué apunta. La variable alumno guarda una referencia (la dirección) a un objeto en memoria. En la línea A no se cambia esa referencia: se modifica el contenido del mismo objeto, y eso está permitido. En la línea B se intenta que alumno apunte a un objeto nuevo, lo cual es una reasignación y const lo prohíbe, por eso salta TypeError: Assignment to constant variable.',
        },
      },
    },

    // ── L4 ─────────────────────────────────────────────────────────────────
    {
      title: 'Los tipos de datos y typeof',
      objective:
        'Conocer los siete tipos primitivos y los objetos, y usar typeof sabiendo cuáles son sus rarezas.',
      theory: t(
        `Todo valor en JavaScript tiene un tipo. Hay siete tipos primitivos: \`string\` (texto), \`number\` (números, con y sin decimales, todos son el mismo tipo), \`boolean\` (\`true\`/\`false\`), \`undefined\` (sin valor asignado), \`null\` (vacío a propósito), \`bigint\` (enteros enormes, \`10n\`) y \`symbol\` (identificadores únicos, poco habituales). Todo lo demás es un objeto: objetos literales, arrays, funciones, fechas...`,
        `La diferencia clave: los primitivos se copian por valor y no se pueden modificar por dentro; los objetos se manejan por referencia. Por eso en la lección anterior \`const\` se comportaba distinto con unos y otros.`,
        `\`undefined\` y \`null\` parecen lo mismo pero no lo son. \`undefined\` es lo que pone JavaScript cuando algo no tiene valor (variable sin asignar, propiedad que no existe). \`null\` lo pones tú para decir "aquí no hay nada, y lo sé".`,
        `El operador \`typeof\` devuelve un texto con el tipo de un valor. Útil, pero con rarezas que caen en examen:`,
        `${C}js
console.log(typeof 'hola');      // "string"
console.log(typeof 42);          // "number"
console.log(typeof NaN);         // "number"  (¡sí!)
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"  (bug histórico)
console.log(typeof []);          // "object"
console.log(typeof function(){}); // "function"
${C}`,
        `\`typeof null\` devuelve \`"object"\` por un error de la primera versión de JavaScript (1995) que nunca se corrigió para no romper webs existentes. Para comprobar null usa \`valor === null\`, y para saber si algo es un array usa \`Array.isArray(valor)\`, porque \`typeof\` te dirá "object" en ambos casos.`,
      ),
      example: 'let dato = null;\nconsole.log(typeof dato);    // "object"\nconsole.log(dato === null);  // true',
      concepts: ['tipos primitivos', 'objeto', 'typeof', 'null', 'undefined', 'Array.isArray'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Las rarezas de typeof',
        brief: 'Predice qué imprime typeof con null, un array y undefined.',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            '¿Qué imprime este código, línea a línea?\n\nconsole.log(typeof null);\nconsole.log(typeof []);\nconsole.log(typeof undefined);',
          quiz: {
            options: [
              { id: 'a', text: 'object, object, undefined' },
              { id: 'b', text: 'null, array, undefined' },
              { id: 'c', text: 'null, object, undefined' },
              { id: 'd', text: 'object, array, object' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'typeof null devuelve "object" por un bug histórico de JavaScript que se mantiene por compatibilidad. typeof [] también devuelve "object" porque los arrays son objetos (para distinguirlos se usa Array.isArray). typeof undefined devuelve "undefined". typeof nunca devuelve "null" ni "array": esos textos no existen como resultado de typeof, por eso fallan las opciones b, c y d.',
          },
        },
      },
    },

    // ── L5 ─────────────────────────────────────────────────────────────────
    {
      title: 'Conversión explícita y NaN',
      objective:
        'Convertir textos a números (y al revés) con Number, parseInt, parseFloat, String y Boolean, y reconocer NaN.',
      theory: t(
        `Todo lo que llega de un formulario o de la URL es texto, aunque parezca un número. Para operar con ello tienes que convertirlo tú, de forma explícita. Las herramientas principales:`,
        `${C}js
Number('42.5');     // 42.5
Number('');         // 0   (¡ojo!)
Number('12px');     // NaN (todo el texto debe ser número)
parseInt('12px');   // 12  (lee dígitos hasta que no puede)
parseInt('42.9');   // 42  (se queda con la parte entera)
parseFloat('3.5kg'); // 3.5
String(42);         // "42"
(42).toString();    // "42"
Boolean('hola');    // true
${C}`,
        `La diferencia importante: \`Number\` es estricto, o todo el texto es un número válido o devuelve \`NaN\`. \`parseInt\` y \`parseFloat\` leen desde el principio y paran en el primer carácter que no entienden. Por eso \`parseInt('12px')\` da 12. Si el texto ni siquiera empieza por un número (\`parseInt('px12')\`), también dan \`NaN\`.`,
        `\`NaN\` significa "Not a Number", pero curiosamente es de tipo \`number\`: es el resultado de una operación numérica que no tiene sentido. Lo peligroso es que se contagia: cualquier operación con \`NaN\` da \`NaN\`. Si ves \`NaN\` en un total, busca hacia atrás qué conversión falló.`,
        `Otra rareza: \`NaN\` no es igual a nada, ni siquiera a sí mismo (\`NaN === NaN\` es \`false\`). Para comprobarlo usa \`Number.isNaN(valor)\`.`,
        `Error típico: hacer \`Number(campo)\` con un campo vacío y obtener 0 en vez de un error. Si un campo vacío no debe valer 0, compruébalo antes.`,
      ),
      example: 'const edadTexto = "17";\nconst edad = Number(edadTexto);\nconsole.log(edad + 1);            // 18\nconsole.log(Number.isNaN(Number("abc"))); // true',
      concepts: ['Number', 'parseInt', 'parseFloat', 'String', 'NaN', 'Number.isNaN'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Calcula un total a partir de textos',
        brief: 'Convierte dos textos a número correctamente y calcula un precio total.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Tienes precio = "19.99" y unidades = "3 uds" (textos, como llegarían de un formulario). Imprime, en este orden y cada uno en su línea:\n1) Number(unidades) (para ver que da NaN)\n2) las unidades convertidas a número entero con parseInt (3)\n3) el total: precio convertido a número multiplicado por las unidades convertidas (59.97)',
          starterCode:
            'const precio = "19.99";\nconst unidades = "3 uds";\n\n// TODO: 1) imprime Number(unidades)\n// TODO: 2) convierte unidades con parseInt e imprímelo\n// TODO: 3) calcula e imprime el total\n',
          solution:
            'const precio = "19.99";\nconst unidades = "3 uds";\n\nconsole.log(Number(unidades));        // NaN\nconst cantidad = parseInt(unidades);\nconsole.log(cantidad);                // 3\nconst total = Number(precio) * cantidad;\nconsole.log(total);                   // 59.97',
        },
      },
    },

    // ── L6 ─────────────────────────────────────────────────────────────────
    {
      title: 'Conversión implícita: "5" + 1 vs "5" - 1',
      objective:
        'Predecir qué hace JavaScript cuando mezclas tipos en una operación sin convertirlos tú.',
      theory: t(
        `Si mezclas tipos en una operación, JavaScript no da error: convierte uno de ellos por su cuenta. Es la conversión implícita (o coerción). El problema es que el resultado no siempre es el que esperas.`,
        `La regla del \`+\`: si uno de los dos lados es un string, \`+\` concatena (pega textos) y convierte el otro lado a texto. Solo si ninguno es string, suma. Los demás operadores aritméticos (\`-\`, \`*\`, \`/\`, \`%\`) solo saben trabajar con números, así que convierten ambos lados a número.`,
        `${C}js
console.log('5' + 1);   // "51"  (concatena)
console.log('5' - 1);   // 4     (resta numérica)
console.log('5' * '2'); // 10
console.log(1 + 2 + '3'); // "33"  (1+2=3, luego 3+"3")
console.log('1' + 2 + 3); // "123" (izquierda a derecha)
${C}`,
        `Fíjate en las dos últimas: las operaciones se evalúan de izquierda a derecha. En \`1 + 2 + '3'\` primero se suman los números (3) y luego se concatena con "3". En \`'1' + 2 + 3\` el primer paso ya produce texto ("12") y todo lo que viene después se pega.`,
        `Error típico: leer dos números de un formulario y hacer \`a + b\`. Como son strings, obtienes "1020" en vez de 30. La solución es convertir explícitamente antes de sumar: \`Number(a) + Number(b)\`. Regla general: no confíes en la conversión implícita, convierte tú.`,
      ),
      example: 'const a = "10";\nconst b = "20";\nconsole.log(a + b);                 // "1020"\nconsole.log(Number(a) + Number(b)); // 30',
      concepts: ['coerción', 'conversión implícita', 'concatenación', 'operador +'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Mezclando strings y números',
        brief: 'Predice el resultado de sumar, restar y multiplicar strings con números.',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            '¿Qué imprime este código, línea a línea?\n\nconsole.log("5" + 1);\nconsole.log("5" - 1);\nconsole.log("5" * "2");',
          quiz: {
            options: [
              { id: 'a', text: '"51", 4, 10' },
              { id: 'b', text: '6, 4, 10' },
              { id: 'c', text: '"51", "4", "52"' },
              { id: 'd', text: '"51", NaN, NaN' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'Con + y un string de por medio, JavaScript concatena: "5" + 1 da "51". El operador - solo funciona con números, así que convierte "5" a 5 y da 4. Igual con *: convierte ambos lados y da 10. La b falla porque + no suma si hay un string; la c porque - y * devuelven números, no textos; la d porque "5" sí se puede convertir a número, así que no hay NaN.',
          },
        },
      },
    },

    // ── L7 ─────────────────────────────────────────────────────────────────
    {
      title: 'Truthy y falsy',
      objective:
        'Saber qué valores cuentan como falsos en una condición y evitar las trampas de "0", [] y " ".',
      theory: t(
        `Cuando pones un valor donde se espera un booleano (en un \`if\`, por ejemplo), JavaScript lo convierte a \`true\` o \`false\`. Los valores que se convierten en \`false\` se llaman falsy; todos los demás son truthy.`,
        `La lista de falsy es corta y conviene aprendérsela entera: \`false\`, \`0\` (y \`-0\`), \`0n\`, \`''\` (string vacío), \`null\`, \`undefined\` y \`NaN\`. Ya está. Cualquier otro valor es truthy.`,
        `${C}js
console.log(Boolean(0));      // false
console.log(Boolean(''));     // false
console.log(Boolean(NaN));    // false
console.log(Boolean('0'));    // true  (string con un carácter)
console.log(Boolean(' '));    // true  (un espacio no es vacío)
console.log(Boolean([]));     // true  (array vacío)
console.log(Boolean({}));     // true  (objeto vacío)
${C}`,
        `Las trampas: \`'0'\` y \`'false'\` son strings con contenido, así que son truthy. Y los arrays y objetos vacíos también son truthy, porque son objetos (una referencia existe aunque esté vacía). Para saber si un array está vacío, mira \`lista.length === 0\`.`,
        `Esto se usa mucho para comprobar si algo "tiene valor": \`if (nombre) { ... }\` entra si el nombre no es vacío, null ni undefined. Pero cuidado: si la variable es un número, \`if (cantidad)\` no entra cuando la cantidad es 0, aunque 0 sea un valor válido. Volverás a ver este problema con el operador \`??\`.`,
      ),
      example: 'const nombre = "";\nif (nombre) {\n  console.log("Hola " + nombre);\n} else {\n  console.log("Falta el nombre"); // entra aquí\n}',
      concepts: ['truthy', 'falsy', 'Boolean', 'conversión a booleano'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Caza los valores falsy',
        brief: 'Identifica qué valores son falsy de una lista.',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: '¿Cuáles de estos valores son falsy (se convierten en false en un if)? Marca todas las correctas.',
          quiz: {
            options: [
              { id: 'a', text: '0' },
              { id: 'b', text: '"0" (el texto cero)' },
              { id: 'c', text: '[] (array vacío)' },
              { id: 'd', text: '"" (string vacío)' },
              { id: 'e', text: 'NaN' },
            ],
            correctIds: ['a', 'd', 'e'],
            multiple: true,
            explanation:
              'Los falsy son solo false, 0, -0, 0n, "", null, undefined y NaN. Por eso 0, "" y NaN son falsy. "0" es un string con un carácter, así que es truthy aunque "parezca" cero. [] es un objeto (aunque esté vacío), y todos los objetos son truthy.',
          },
        },
      },
    },

    // ── L8 ─────────────────────────────────────────────────────────────────
    {
      title: 'Template literals y métodos de string',
      objective:
        'Construir textos con template literals y manipularlos con length, toUpperCase, includes, slice, trim y split.',
      theory: t(
        `Un template literal es un string escrito entre comillas invertidas (en el teclado español, la tecla que hay a la derecha de la P, seguida de espacio). Tiene dos ventajas sobre las comillas normales: puedes meter expresiones dentro con \`\${ }\`, y puedes escribir en varias líneas sin trucos.`,
        `${C}js
const nombre = 'Ana';
const nota = 7;
console.log(\`\${nombre} tiene un \${nota}\`);     // Ana tiene un 7
console.log(\`El doble es \${nota * 2}\`);       // El doble es 14
const html = \`<p>
  Hola
</p>\`;                                          // respeta los saltos de línea
${C}`,
        `Dentro de \`\${ }\` va cualquier expresión: una variable, una operación, una llamada a función. El motor la evalúa, convierte el resultado a texto y lo pega. Error típico: usar comillas simples o dobles con \`\${nombre}\` dentro; entonces no se sustituye nada y se imprime literalmente "\${nombre}".`,
        `Los strings tienen métodos útiles. Ninguno modifica el string original (los strings son inmutables): todos devuelven un valor nuevo, así que guarda el resultado si lo necesitas.`,
        `${C}js
const s = '  JavaScript  ';
console.log(s.trim());              // "JavaScript" (quita espacios de los extremos)
console.log(s.trim().length);       // 10
console.log(s.toUpperCase());       // "  JAVASCRIPT  "
console.log(s.includes('Script'));  // true
console.log('JavaScript'.slice(0, 4)); // "Java" (desde 0 hasta 4, sin incluir el 4)
console.log('JavaScript'.slice(-6));   // "Script" (negativo = desde el final)
console.log('ana,luis,eva'.split(',')); // [ 'ana', 'luis', 'eva' ]
${C}`,
        `Fíjate en que \`length\` es una propiedad, no un método: se escribe sin paréntesis. Y que los métodos se pueden encadenar (\`s.trim().toUpperCase()\`), porque cada uno devuelve un string nuevo sobre el que se llama el siguiente.`,
      ),
      example: 'const email = "  Ana@Correo.ES ";\nconst limpio = email.trim().toLowerCase();\nconsole.log(limpio);               // "ana@correo.es"\nconsole.log(limpio.includes("@")); // true',
      concepts: ['template literal', 'interpolación', 'trim', 'slice', 'split', 'inmutabilidad'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Limpia un nombre y saluda',
        brief: 'Limpia un texto con métodos de string y construye un saludo con un template literal.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos'],
        rubric: RUBRICA,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Tienes nombre = "  ana garcía  " y curso = "DWEC". Imprime, cada uno en su línea:\n1) el nombre sin espacios en los extremos y en mayúsculas: ANA GARCÍA\n2) la longitud de ese texto limpio: 10\n3) usando un template literal: Hola, ANA GARCÍA, estás en DWEC',
          starterCode:
            'const nombre = "  ana garcía  ";\nconst curso = "DWEC";\n\n// TODO: guarda en una constante el nombre limpio y en mayúsculas\n// TODO: imprime el nombre limpio, su longitud y el saludo con un template literal\n',
          solution:
            'const nombre = "  ana garcía  ";\nconst curso = "DWEC";\n\nconst limpio = nombre.trim().toUpperCase();\nconsole.log(limpio);          // ANA GARCÍA\nconsole.log(limpio.length);   // 10\nconsole.log(`Hola, ${limpio}, estás en ${curso}`); // Hola, ANA GARCÍA, estás en DWEC',
        },
      },
    },
  ],
};
