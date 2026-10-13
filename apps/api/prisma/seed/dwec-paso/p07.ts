import { type PhaseSeed } from '../content-types.js';

const RUBRIC = [
  { name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true },
];

export const dwecPasoP07: PhaseSeed = {
  code: 'FASE 7',
  title: 'Objetos y spread',
  objective:
    'Manejar objetos con soltura (propiedades, métodos, this, desestructuración y spread) y entender que las variables guardan referencias, no copias.',
  unlockedSkills: ['js-datos'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'Objetos literales: punto y corchetes',
      objective:
        'Crear objetos y leer sus propiedades con punto o con corchetes, sabiendo cuándo hace falta cada forma.',
      theory: `Un **objeto** agrupa datos relacionados en pares **clave: valor**. Se escribe con llaves y es la forma de representar "una cosa" con varias características: un alumno, un producto, un pedido.

\`\`\`js
const alumno = {
  nombre: 'Ana',
  nota: 8,
  'curso actual': '2DAW',
};
console.log(alumno.nombre);          // Ana
console.log(alumno['nota']);         // 8
console.log(alumno['curso actual']); // 2DAW
\`\`\`

Hay dos formas de leer una propiedad. Con **punto** (\`alumno.nombre\`) escribes el nombre tal cual; es la forma normal. Con **corchetes** (\`alumno['nombre']\`) pones dentro una **expresión** que da un texto, y ese texto es la clave. Los corchetes son obligatorios cuando la clave tiene espacios o guiones, o cuando la clave está guardada en una variable.

\`\`\`js
const campo = 'nota';
console.log(alumno[campo]); // 8  (usa el VALOR de campo)
console.log(alumno.campo);  // undefined (busca una clave llamada "campo")
\`\`\`

Este es el error típico del alumno: escribir \`objeto.variable\` esperando que use el valor de la variable. El punto nunca evalúa nada: busca literalmente la clave con ese nombre. Y si una clave no existe, JavaScript no da error, devuelve \`undefined\`.

Con corchetes también puedes crear **claves dinámicas** al definir el objeto: \`{ [campo]: 10 }\` crea \`{ nota: 10 }\`. Es muy útil en formularios, donde el nombre del campo te llega en una variable.`,
      example: `const campo = 'color';
const coche = { marca: 'Seat', [campo]: 'rojo' };
console.log(coche); // { marca: 'Seat', color: 'rojo' }
console.log(coche[campo]); // rojo`,
      concepts: ['objeto literal', 'clave y valor', 'notación punto', 'notación corchetes', 'clave dinámica'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿Punto o corchetes?',
        brief: 'Predice qué devuelve leer una propiedad con punto y con corchetes usando una variable.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

const alumno = { nombre: 'Ana', nota: 8 };
const campo = 'nota';
console.log(alumno.campo);
console.log(alumno[campo]);`,
          quiz: {
            options: [
              { id: 'a', text: '8 y 8' },
              { id: 'b', text: 'undefined y 8' },
              { id: 'c', text: '8 y undefined' },
              { id: 'd', text: 'Un error, porque campo no es una propiedad de alumno' },
            ],
            correctIds: ['b'],
            explanation:
              'alumno.campo busca literalmente una clave llamada "campo", que no existe, así que devuelve undefined (leer una propiedad que no existe no da error). alumno[campo] evalúa lo de dentro de los corchetes: campo vale "nota", así que lee alumno.nota, que es 8. Por eso, cuando la clave está en una variable, hay que usar corchetes.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'Añadir, modificar y borrar propiedades',
      objective:
        'Cambiar un objeto después de crearlo: añadir y modificar con asignación y borrar con delete.',
      theory: `Los objetos no tienen una forma fija: puedes cambiarlos cuando quieras. **Asignar** a una clave que no existe la crea; asignar a una que ya existe la sobrescribe. Es la misma sintaxis para las dos cosas.

\`\`\`js
const coche = { marca: 'Seat', km: 1000 };
coche.color = 'rojo'; // no existía: la añade
coche.km = 1500;      // existía: la modifica
delete coche.marca;   // la borra
console.log(coche);   // { km: 1500, color: 'rojo' }
\`\`\`

\`delete\` quita la propiedad entera (clave y valor). No es lo mismo que \`coche.marca = undefined\`: en ese caso la clave sigue ahí con valor \`undefined\`, y aparecerá al recorrer el objeto. Para saber si una clave existe usa el operador \`in\`: \`'marca' in coche\` devuelve \`true\` o \`false\`.

Pregunta típica: "si el objeto es \`const\`, ¿cómo es que puedo cambiarlo?". Porque \`const\` impide **reasignar la variable** (hacer \`coche = otraCosa\` da \`TypeError: Assignment to constant variable\`), pero no impide cambiar el **contenido** del objeto al que apunta. La variable sigue apuntando al mismo objeto; lo que cambia es lo que hay dentro.

Error típico: escribir mal el nombre de la clave al modificar (\`coche.Km = 2000\` con mayúscula). JavaScript no avisa: simplemente crea una propiedad nueva \`Km\` y la \`km\` original sigue igual. Si un cambio "no se aplica", revisa mayúsculas y tildes.`,
      example: `const perfil = { usuario: 'ana99' };
perfil.edad = 20;
console.log('edad' in perfil); // true
delete perfil.edad;
console.log('edad' in perfil); // false`,
      concepts: ['añadir propiedades', 'modificar propiedades', 'delete', 'operador in', 'const y objetos'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Retoca el coche',
        brief: 'Añade, modifica y borra propiedades de un objeto.',
        difficulty: 1,
        timeLimitMinutes: 8,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            "Partiendo del objeto coche: añade la propiedad color con valor 'rojo', cambia km a 1500 y borra la propiedad modelo con delete. Después imprime con console.log el objeto coche (debe quedar marca 'Seat', km 1500 y color 'rojo') y, en otra línea, el resultado de comprobar con el operador in si 'modelo' sigue en coche (debe salir false).",
          starterCode: `const coche = { marca: 'Seat', modelo: 'Ibiza', km: 1000 };

// TODO: añade color = 'rojo'
// TODO: cambia km a 1500
// TODO: borra modelo
// TODO: imprime coche y si 'modelo' está en coche
`,
          solution: `const coche = { marca: 'Seat', modelo: 'Ibiza', km: 1000 };

coche.color = 'rojo';
coche.km = 1500;
delete coche.modelo;

console.log(coche);              // { marca: 'Seat', km: 1500, color: 'rojo' }
console.log('modelo' in coche);  // false`,
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'Métodos y this',
      objective:
        'Entender que this, dentro de un método, es el objeto que aparece a la izquierda del punto al llamarlo.',
      theory: `Una propiedad puede guardar una función. Entonces se llama **método**. Para escribirlo hay una forma corta: \`saludar() { ... }\` en lugar de \`saludar: function () { ... }\`.

\`\`\`js
const ana = {
  nombre: 'Ana',
  saludar() {
    return 'Hola, soy ' + this.nombre;
  },
};
console.log(ana.saludar()); // Hola, soy Ana
\`\`\`

Dentro de un método, \`this\` es **el objeto con el que se ha llamado**. La regla práctica: mira lo que hay a la izquierda del punto en la llamada. En \`ana.saludar()\`, a la izquierda está \`ana\`, así que \`this\` es \`ana\` y \`this.nombre\` es 'Ana'.

Lo importante es que \`this\` se decide **al llamar**, no al escribir la función. Por eso la misma función puede servir a varios objetos:

\`\`\`js
function presentarse() {
  return 'Soy ' + this.nombre;
}
const luis = { nombre: 'Luis', presentarse: presentarse };
const eva = { nombre: 'Eva', presentarse: presentarse };
console.log(luis.presentarse()); // Soy Luis
console.log(eva.presentarse());  // Soy Eva
\`\`\`

¿Por qué usar \`this.nombre\` y no \`ana.nombre\` dentro del método? Porque así el método funciona aunque el objeto cambie de nombre o se copie a otro. Error típico: olvidar el \`this\` y escribir solo \`nombre\`; entonces JavaScript busca una variable \`nombre\` normal y da \`ReferenceError\` (o, peor, encuentra otra variable con ese nombre). Otro error: sacar el método del objeto (\`const f = ana.saludar; f()\`); al llamarlo sin punto, \`this\` ya no es \`ana\`.`,
      example: `const cuenta = {
  saldo: 100,
  ingresar(cantidad) {
    this.saldo += cantidad;
    return this.saldo;
  },
};
console.log(cuenta.ingresar(50)); // 150`,
      concepts: ['método', 'this', 'objeto receptor', 'sintaxis corta de métodos'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿Quién es this?',
        brief: 'Una función compartida por dos objetos: ¿qué this recibe?',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

function presentarse() {
  return 'Soy ' + this.nombre;
}
const ana = { nombre: 'Ana', presentarse: presentarse };
const luis = { nombre: 'Luis', presentarse: presentarse };
console.log(luis.presentarse());`,
          quiz: {
            options: [
              { id: 'a', text: 'Soy Ana' },
              { id: 'b', text: 'Soy Luis' },
              { id: 'c', text: 'Soy undefined' },
              { id: 'd', text: 'Un error, porque presentarse no está dentro de ningún objeto' },
            ],
            correctIds: ['b'],
            explanation:
              'this se decide en el momento de la llamada: es el objeto que hay a la izquierda del punto. En luis.presentarse() ese objeto es luis, así que this.nombre es "Luis". No importa que la función se escribiera fuera de los objetos ni que ana también la tenga: cada objeto guarda una referencia a la misma función, y this cambia según quién la llame.',
          },
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: 'this en las funciones flecha',
      objective:
        'Saber que una función flecha no tiene this propio y por qué no sirve como método, pero sí dentro de uno.',
      theory: `Las funciones flecha tienen una diferencia importante con las normales: **no tienen \`this\` propio**. Cuando dentro de una flecha escribes \`this\`, la flecha no mira cómo la han llamado: usa el \`this\` del sitio donde se escribió, igual que haría con cualquier otra variable de fuera (es un closure más).

Por eso una flecha NO sirve como método:

\`\`\`js
const perro = {
  nombre: 'Toby',
  ladrar: () => {
    console.log(this.nombre + ' dice guau');
  },
};
perro.ladrar(); // undefined dice guau
\`\`\`

Las llaves del objeto NO crean un ámbito para \`this\`. La flecha se escribió a nivel global, así que su \`this\` es el de fuera (en un script normal del navegador, el objeto global), que no tiene \`nombre\`. Da igual que la llames con \`perro.\` delante: la flecha ignora ese punto. La solución es usar la sintaxis de método: \`ladrar() { ... }\`.

Donde la flecha brilla es **dentro** de un método, como callback. Ahí te interesa justo que use el \`this\` de fuera, el del método:

\`\`\`js
const clase = {
  nombre: '2DAW',
  alumnos: ['Ana', 'Luis'],
  listar() {
    this.alumnos.forEach(a => console.log(a + ' de ' + this.nombre));
  },
};
clase.listar(); // Ana de 2DAW / Luis de 2DAW
\`\`\`

Regla sencilla para no liarte: **métodos con la sintaxis normal, callbacks dentro de métodos con flecha**. Si ves "undefined" donde esperabas una propiedad del objeto, comprueba si el método es una flecha.`,
      example: `const reloj = {
  hora: '10:00',
  mostrar() {
    setTimeout(() => console.log(this.hora), 0); // 10:00 (flecha: this del método)
  },
};
reloj.mostrar();`,
      concepts: ['función flecha', 'this léxico', 'método', 'callback'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'El perro que no sabe su nombre',
        brief: 'Explica por qué un método escrito como flecha no encuentra this.nombre.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'short',
          runner: 'none',
          prompt: `En un script normal del navegador, este código imprime "undefined dice guau" en lugar de "Toby dice guau":

const perro = {
  nombre: 'Toby',
  ladrar: () => {
    console.log(this.nombre + ' dice guau');
  },
};
perro.ladrar();

Explica con tus palabras por qué pasa y cómo lo arreglarías.`,
          solution:
            'Porque ladrar es una función flecha, y las flechas no tienen this propio: usan el this del sitio donde se escribieron. Las llaves del objeto no crean un ámbito para this, así que la flecha toma el this de fuera del objeto (en un script normal, el objeto global), que no tiene propiedad nombre; por eso this.nombre es undefined. Que se llame con perro. delante no cambia nada, porque la flecha ignora cómo la llaman. Se arregla escribiendo el método con la sintaxis normal, ladrar() { console.log(this.nombre + " dice guau"); } (o ladrar: function () {...}), porque así this es el objeto que hay a la izquierda del punto, perro.',
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'Object.keys, Object.values y Object.entries',
      objective:
        'Recorrer un objeto convirtiéndolo en un array de claves, de valores o de pares clave-valor.',
      theory: `Los objetos no tienen \`map\`, \`filter\` ni \`forEach\`. Para recorrerlos, lo habitual es convertirlos primero en un array con uno de estos tres métodos, y luego usar los métodos de arrays que ya conoces.

\`\`\`js
const stock = { manzanas: 5, peras: 0 };
Object.keys(stock);    // [ 'manzanas', 'peras' ]
Object.values(stock);  // [ 5, 0 ]
Object.entries(stock); // [ [ 'manzanas', 5 ], [ 'peras', 0 ] ]
\`\`\`

\`Object.keys\` da las claves, \`Object.values\` los valores, y \`Object.entries\` un array de pares \`[clave, valor]\` (cada par es a su vez un array de dos elementos). Se llaman así, \`Object.keys(stock)\`, y no \`stock.keys()\`: son funciones del objeto global \`Object\` que reciben tu objeto como argumento. Escribir \`stock.keys()\` da "stock.keys is not a function", un error muy típico.

Combinados con lo de la fase anterior dan mucho juego: \`Object.values(stock).reduce((a, n) => a + n, 0)\` suma todo el stock, y \`Object.keys(stock).length\` te dice cuántas propiedades tiene el objeto (los objetos no tienen \`.length\`).

Para recorrer las entradas se usa mucho \`for...of\` desestructurando cada par (la desestructuración la verás en detalle en la siguiente lección):

\`\`\`js
for (const [fruta, cantidad] of Object.entries(stock)) {
  console.log(fruta + ': ' + cantidad);
}
// manzanas: 5
// peras: 0
\`\`\``,
      example: `const notas = { ana: 8, luis: 6, eva: 9 };
console.log(Object.keys(notas).length); // 3
const media = Object.values(notas).reduce((a, n) => a + n, 0) / 3;
console.log(media); // 7.666666666666667`,
      concepts: ['Object.keys', 'Object.values', 'Object.entries', 'recorrer objetos', 'for...of'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Inventario de la frutería',
        brief: 'Saca las claves, suma los valores y recorre las entradas de un objeto.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            "Con el objeto stock, imprime con console.log: 1) el array de claves usando Object.keys (['manzanas', 'peras', 'platanos']); 2) el total de unidades sumando Object.values con reduce (17); 3) una línea por fruta con el formato 'fruta: cantidad' recorriendo Object.entries (manzanas: 5, peras: 0, platanos: 12).",
          starterCode: `const stock = { manzanas: 5, peras: 0, platanos: 12 };

// TODO 1: claves con Object.keys
// TODO 2: total con Object.values + reduce
// TODO 3: recorre Object.entries e imprime "fruta: cantidad"
`,
          solution: `const stock = { manzanas: 5, peras: 0, platanos: 12 };

console.log(Object.keys(stock)); // [ 'manzanas', 'peras', 'platanos' ]

const total = Object.values(stock).reduce((acc, n) => acc + n, 0);
console.log(total); // 17

for (const [fruta, cantidad] of Object.entries(stock)) {
  console.log(fruta + ': ' + cantidad);
}
// manzanas: 5
// peras: 0
// platanos: 12`,
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'Desestructuración de objetos y arrays',
      objective:
        'Sacar valores de objetos y arrays a variables en una sola línea, con renombrado y valores por defecto.',
      theory: `La **desestructuración** es un atajo para sacar valores de un objeto o array y guardarlos en variables. Con objetos, las variables se emparejan **por nombre de clave**:

\`\`\`js
const usuario = { nombre: 'Ana', edad: 20 };
const { nombre, edad } = usuario;
console.log(nombre, edad); // Ana 20
\`\`\`

Equivale a escribir \`const nombre = usuario.nombre; const edad = usuario.edad;\`. Si pides una clave que no existe, la variable vale \`undefined\`. Puedes dar un **valor por defecto** con \`=\`, que solo se usa si el valor es \`undefined\`. Y puedes **renombrar** con dos puntos: \`{ nombre: n }\` significa "coge la clave nombre y guárdala en una variable llamada n".

\`\`\`js
const { nombre: n, ciudad = 'Madrid' } = usuario;
console.log(n, ciudad); // Ana Madrid
console.log(nombre);    // ReferenceError si no la habías declarado antes
\`\`\`

Ojo con el renombrado, que confunde mucho: en \`{ nombre: n }\` la variable que se crea es \`n\`, NO \`nombre\`. Es al revés de lo que parece porque se lee "de la clave nombre, a la variable n".

Con arrays, el emparejamiento es **por posición**, y se usan corchetes. Puedes saltarte posiciones dejando un hueco con comas: \`const [primero, , tercero] = lista\`. También admite valores por defecto.

Donde más la verás es en los parámetros de funciones: \`function saludar({ nombre, edad = 18 }) { ... }\` recibe un objeto y saca directamente lo que necesita. Y para intercambiar dos variables sin auxiliar: \`[a, b] = [b, a]\`.`,
      example: `const [x, , z = 0] = [1, 2];
console.log(x, z); // 1 0
function ficha({ titulo, nota = 5 }) {
  return titulo + ': ' + nota;
}
console.log(ficha({ titulo: 'Inception' })); // Inception: 5`,
      concepts: ['desestructuración', 'renombrado', 'valor por defecto', 'desestructuración de arrays'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Desestructura sin perderte',
        brief: 'Predice el resultado de una desestructuración con renombrado, valores por defecto y huecos.',
        difficulty: 3,
        timeLimitMinutes: 8,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

const usuario = { nombre: 'Ana', edad: 20 };
const { nombre: n, ciudad = 'Madrid', edad } = usuario;
const [primero, , tercero = 'z'] = ['a', 'b'];
console.log(n, ciudad, edad, primero, tercero);`,
          quiz: {
            options: [
              { id: 'a', text: 'Ana Madrid 20 a z' },
              { id: 'b', text: 'Ana undefined 20 a b' },
              { id: 'c', text: 'n Madrid 20 a b' },
              { id: 'd', text: 'Ana Madrid 20 a b' },
            ],
            correctIds: ['a'],
            explanation:
              '{ nombre: n } guarda usuario.nombre en la variable n, así que n es "Ana". ciudad no existe en el objeto, vale undefined y por eso se usa el valor por defecto "Madrid". edad es 20. En el array, primero toma la posición 0 ("a"), el hueco entre comas se salta la posición 1 ("b"), y tercero toma la posición 2, que no existe (undefined), así que usa su valor por defecto "z". Por eso la opción con "b" al final es incorrecta: "b" está en la posición que nos hemos saltado.',
          },
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'Referencias: dos variables, un mismo objeto',
      objective:
        'Entender que asignar un objeto no lo copia, y que === entre objetos compara si son el mismo, no si se parecen.',
      theory: `Esta es probablemente la idea más importante de la fase. Los valores primitivos (números, textos, booleanos) se guardan tal cual en la variable. Los objetos y arrays no: la variable guarda una **referencia**, algo así como la dirección donde vive el objeto en memoria.

\`\`\`js
const a = { x: 1 };
const b = a;   // NO copia el objeto: copia la referencia
b.x = 5;
console.log(a.x); // 5
\`\`\`

\`const b = a\` no crea un objeto nuevo. Ahora hay dos variables apuntando al **mismo** objeto, como dos llaves de la misma casa. Si cambias algo usando \`b\`, lo verás también desde \`a\`, porque solo hay una casa. Este es el origen de muchísimos bugs del tipo "yo no he tocado ese objeto y ha cambiado".

Lo mismo pasa al pasar un objeto a una función: la función recibe la referencia, así que si modifica el objeto, modifica el original de quien la llamó.

Y por la misma razón, \`===\` entre objetos **compara referencias**, no contenido. Dos objetos con exactamente los mismos datos, pero creados por separado, no son iguales:

\`\`\`js
const c = { x: 1 };
const d = { x: 1 };
console.log(c === d); // false (dos objetos distintos)
console.log(c === c); // true  (el mismo objeto)
console.log([1, 2] === [1, 2]); // false
\`\`\`

Error típico: comprobar \`if (lista === [])\` para ver si un array está vacío; siempre es \`false\`, porque \`[]\` crea un array nuevo. Usa \`lista.length === 0\`. Para comparar el contenido de dos objetos hay que mirar sus propiedades (o, en casos sencillos, comparar sus \`JSON.stringify\`).`,
      example: `function aprobar(alumno) {
  alumno.nota = 5; // modifica el objeto original
}
const ana = { nota: 3 };
aprobar(ana);
console.log(ana.nota); // 5`,
      concepts: ['referencia', 'primitivo vs objeto', 'mutación compartida', 'igualdad de referencias'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Dos llaves de la misma casa',
        brief: 'Predice qué pasa al copiar una referencia y al comparar objetos con ===.',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código?

const a = { x: 1 };
const b = a;
const c = { x: 1 };
b.x = 5;
console.log(a.x, a === b, a === c);`,
          quiz: {
            options: [
              { id: 'a', text: '1 true true' },
              { id: 'b', text: '5 true false' },
              { id: 'c', text: '1 false false' },
              { id: 'd', text: '5 true true' },
            ],
            correctIds: ['b'],
            explanation:
              'const b = a no copia el objeto: a y b apuntan al mismo objeto, así que b.x = 5 también se ve en a.x, que vale 5. a === b es true porque son la misma referencia. a === c es false porque c es otro objeto distinto creado aparte, aunque tenga el mismo contenido ({ x: 1 } al crearse): === entre objetos compara referencias, no contenido.',
          },
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'Spread, copia superficial y structuredClone',
      objective:
        'Copiar y combinar arrays y objetos con spread, y saber cuándo hace falta una copia profunda con structuredClone.',
      theory: `El operador **spread** (\`...\`) "desparrama" el contenido de un array u objeto dentro de otro nuevo. Sirve para copiar y para combinar:

\`\`\`js
const a = [1, 2];
const b = [...a, 3];               // [ 1, 2, 3 ]  array nuevo
const base = { tema: 'claro', idioma: 'es' };
const prefs = { ...base, tema: 'oscuro' };
console.log(prefs); // { tema: 'oscuro', idioma: 'es' }
console.log(base);  // { tema: 'claro', idioma: 'es' } (intacto)
\`\`\`

Al combinar objetos, si una clave se repite **gana la última** que aparece. Por eso se escribe \`{ ...base, tema: 'oscuro' }\`: primero copias todo y luego sobrescribes lo que cambia. Si lo pones al revés, \`{ tema: 'oscuro', ...base }\`, el spread pisa tu cambio.

Ahora la trampa: el spread hace una **copia superficial**. Copia el primer nivel, pero si una propiedad es a su vez un objeto o un array, copia su **referencia** (lo que viste en la lección anterior). La copia y el original comparten ese objeto interior:

\`\`\`js
const original = { nombre: 'Ana', notas: [7, 8] };
const copia = { ...original };
copia.nombre = 'Luis';  // no afecta al original
copia.notas.push(10);   // ¡sí afecta! notas es compartido
console.log(original.nombre, original.notas); // Ana [ 7, 8, 10 ]
\`\`\`

Para una **copia profunda** (que copie también todo lo de dentro, a cualquier nivel) usa \`structuredClone(original)\`, que viene en el navegador y en Node. Después de eso, la copia y el original no comparten nada. Antes se usaba el truco \`JSON.parse(JSON.stringify(obj))\`, pero pierde fechas, funciones y \`undefined\`; \`structuredClone\` es la forma correcta hoy (eso sí, tampoco copia funciones: da error si las hay).

Regla práctica: para objetos planos (sin objetos dentro), spread basta y es lo más cómodo. Si hay objetos o arrays anidados y vas a modificarlos, \`structuredClone\`.`,
      example: `const config = { tema: 'claro', atajos: { guardar: 'Ctrl+S' } };
const copia = structuredClone(config);
copia.atajos.guardar = 'Cmd+S';
console.log(config.atajos.guardar); // Ctrl+S (no se ha tocado)`,
      concepts: ['spread', 'copia superficial', 'copia profunda', 'structuredClone', 'combinar objetos'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 20,
      challenge: {
        title: 'La copia que no era copia',
        brief: 'Comprueba el fallo de la copia superficial con spread y arréglalo con structuredClone.',
        difficulty: 3,
        timeLimitMinutes: 12,
        skills: ['js-datos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            "Parte del objeto original. 1) Crea copia con spread, cambia copia.nombre a 'Luis' y añade un 10 a copia.notas con push. Imprime en una línea original.nombre y original.notas: debe salir Ana y [7, 8, 10], demostrando que notas se comparte. 2) Crea profunda con structuredClone(original), añade un 1 a profunda.notas e imprime en una línea original.notas y profunda.notas: deben salir [7, 8, 10] y [7, 8, 10, 1].",
          starterCode: `const original = { nombre: 'Ana', notas: [7, 8] };

// TODO 1: copia superficial con spread, cambia nombre y haz push en notas
// imprime original.nombre y original.notas

// TODO 2: copia profunda con structuredClone, haz push en sus notas
// imprime original.notas y profunda.notas
`,
          solution: `const original = { nombre: 'Ana', notas: [7, 8] };

const copia = { ...original };
copia.nombre = 'Luis';
copia.notas.push(10);
console.log(original.nombre, original.notas); // Ana [ 7, 8, 10 ]

const profunda = structuredClone(original);
profunda.notas.push(1);
console.log(original.notas, profunda.notas); // [ 7, 8, 10 ] [ 7, 8, 10, 1 ]`,
        },
      },
    },
  ],
};
