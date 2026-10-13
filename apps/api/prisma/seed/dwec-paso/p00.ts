import { type PhaseSeed } from '../content-types.js';

const RUBRIC = [
  { name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true },
];

export const dwecPasoP00: PhaseSeed = {
  code: 'FASE 0',
  title: 'Cómo funciona la web y dónde corre JavaScript',
  objective:
    'Entender qué pasa desde que escribes una URL hasta que ves la página, qué parte corre en el navegador y cuál en el servidor, qué es JavaScript y cómo se mete en una página.',
  unlockedSkills: ['http', 'js-fundamentos'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'El viaje de una petición: cliente y servidor',
      objective:
        'Saber en qué orden ocurren las cosas desde que escribes una URL hasta que la página aparece en pantalla.',
      theory: `La web funciona con dos papeles: el cliente (tu navegador) pide cosas y el servidor (un ordenador en algún sitio) las entrega. Nunca es al revés: el servidor no te manda nada si el navegador no lo ha pedido antes. A ese "pedir y recibir" se le llama petición y respuesta, y el idioma que usan para hablar es HTTP.

Cuando escribes \`https://tienda.com/productos\` y pulsas Intro, pasan varias cosas en orden. Primero el navegador pregunta al DNS qué dirección IP tiene \`tienda.com\` (los ordenadores se encuentran por números, no por nombres). Después abre una conexión con esa IP (y, al ser \`https\`, la cifra). Luego envía la petición: \`GET /productos\`.

El servidor recibe la petición, ejecuta su código (PHP, Java, Node…), quizá consulta una base de datos y devuelve una respuesta con un código de estado (\`200\` si todo fue bien, \`404\` si no existe) y un cuerpo, normalmente HTML.

Aquí está lo que mucha gente no sabe: ese HTML suele traer enlaces a otros ficheros (\`estilos.css\`, \`app.js\`, imágenes). El navegador lee el HTML y, por cada uno de esos enlaces, hace una petición nueva. Una sola página puede generar decenas de peticiones. Lo verás con tus propios ojos en el panel Network de las DevTools.

Error típico: pensar que "la página" llega entera de golpe. No: llega el HTML, y el navegador va pidiendo el resto conforme lo descubre. Por eso, si \`app.js\` falla (un 404), el HTML se ve pero la página "no hace nada".`,
      example: `1. DNS: tienda.com -> 93.184.216.34
2. Conexión segura con el servidor
3. Petición:  GET /productos
4. Respuesta: 200 OK + HTML
5. El navegador lee el HTML y pide estilos.css, app.js, logo.png
6. Pinta la página y ejecuta app.js`,
      concepts: ['cliente', 'servidor', 'HTTP', 'DNS', 'petición y respuesta', 'código de estado'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Ordena el viaje de la petición',
        brief: 'Elige el orden correcto de lo que pasa al abrir una URL.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['http'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'Escribes https://tienda.com/productos en el navegador y pulsas Intro. ¿Cuál es el orden correcto de lo que ocurre?',
          quiz: {
            options: [
              { id: 'a', text: 'DNS → conexión con el servidor → GET /productos → respuesta con HTML → el navegador pide CSS/JS/imágenes → pinta la página' },
              { id: 'b', text: 'GET /productos → DNS → respuesta con HTML → conexión con el servidor → pinta la página' },
              { id: 'c', text: 'El servidor envía la página al navegador → DNS → el navegador pinta la página' },
              { id: 'd', text: 'DNS → conexión → el servidor envía HTML, CSS, JS e imágenes en una sola respuesta → pinta la página' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'Primero hay que saber a qué IP ir (DNS), luego conectar, luego pedir (GET) y recibir la respuesta con el HTML. Al leer ese HTML el navegador descubre los CSS, JS e imágenes y los pide en peticiones nuevas. La b pide antes de saber a dónde; la c hace que el servidor envíe sin que nadie pida (en HTTP siempre pide el cliente); la d supone que todo llega en una sola respuesta, y no es así: cada fichero es una petición distinta.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'Qué hace el cliente y qué hace el servidor',
      objective:
        'Decidir qué tareas tienen sentido en el navegador y cuáles deben hacerse obligatoriamente en el servidor.',
      theory: `El código del servidor corre en una máquina que controla la empresa. El código del cliente (JavaScript en el navegador) corre en el ordenador del usuario. Esa diferencia lo decide casi todo.

Ventajas del cliente: responde al instante (no hay que esperar a la red), descarga trabajo del servidor y permite interfaces vivas: validar un formulario mientras escribes, abrir un menú, filtrar una lista sin recargar.

Inconvenientes del cliente: el usuario tiene el código y lo controla. Puede abrir las DevTools, leer tu JavaScript, cambiar variables, saltarse validaciones o enviar peticiones a mano. Además depende de su dispositivo: un móvil viejo va más lento, y el usuario puede tener JavaScript desactivado.

Por eso la regla de oro es: en el cliente se valida para ayudar al usuario; en el servidor se valida para proteger los datos. Comprobar en el navegador que el email tiene arroba está bien (avisas rápido). Pero el precio de un producto, si un usuario tiene permiso para algo o si quedan existencias, lo tiene que comprobar el servidor, porque es lo único que el usuario no puede tocar.

Error típico: "ya lo valido con JavaScript, no hace falta en el servidor". Falso. Cualquiera puede mandar la petición sin pasar por tu JavaScript. Lo que está en el cliente es una comodidad, nunca una garantía.`,
      example:
        'Cliente: avisar "el email no tiene @" mientras escribes. Servidor: comprobar que el precio pagado coincide con el precio real del producto.',
      concepts: ['código en cliente', 'código en servidor', 'validación', 'confianza', 'rendimiento'],
      tools: [],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Dónde se comprueba el precio?',
        brief: 'Decide dónde tiene que estar una comprobación de seguridad.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['http'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'En una tienda online, el carrito calcula el total con JavaScript y lo envía al pagar. ¿Dónde hay que comprobar, de forma definitiva, que el precio no ha sido manipulado?',
          quiz: {
            options: [
              { id: 'cli', text: 'En el navegador, con JavaScript, justo antes de enviar el formulario' },
              { id: 'srv', text: 'En el servidor, recalculando el total con los precios de la base de datos' },
              { id: 'css', text: 'En el CSS, ocultando el campo del precio para que el usuario no lo vea' },
              { id: 'nada', text: 'En ningún sitio: si el JavaScript lo calcula bien, el total ya es correcto' },
            ],
            correctIds: ['srv'],
            multiple: false,
            explanation:
              'Solo el servidor está fuera del control del usuario. Cualquier comprobación en el navegador se puede saltar con las DevTools o enviando la petición a mano, así que sirve para avisar, no para proteger. Ocultar un campo con CSS no impide modificarlo, y "si el JS calcula bien" no vale porque el usuario puede cambiar ese JS o el valor enviado.',
          },
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'Qué hace el navegador por dentro',
      objective:
        'Conocer las piezas del navegador: motor de JavaScript, motor de renderizado, almacenamiento y red.',
      theory: `El navegador no es "un programa que enseña páginas". Es varias máquinas trabajando juntas, y conviene saber cuáles porque los errores salen de una u otra.

El motor de renderizado (Blink en Chrome, Gecko en Firefox, WebKit en Safari) lee el HTML y construye un árbol de objetos llamado DOM. Lee el CSS, calcula qué estilo tiene cada elemento, dónde va y qué tamaño tiene, y lo pinta en pantalla.

El motor de JavaScript (V8 en Chrome y Edge, SpiderMonkey en Firefox) ejecuta tu código. Tu JavaScript no pinta nada directamente: lo que hace es modificar el DOM, y el motor de renderizado vuelve a pintar lo que ha cambiado.

El navegador también guarda datos en el ordenador del usuario: cookies, \`localStorage\`, \`sessionStorage\` o IndexedDB. Y hace peticiones de red: las que descubre en el HTML y las que tu código pide con \`fetch\`.

Lo que el navegador no puede hacer es entrar directamente en la base de datos del servidor ni leer los ficheros del ordenador del usuario a su antojo. Por seguridad vive en una "caja" (sandbox): para conseguir datos del servidor tiene que pedírselos por HTTP, y el servidor decide qué devuelve.`,
      example: `HTML  --(motor de renderizado)-->  DOM + estilos  -->  píxeles en pantalla
JS    --(motor de JavaScript)-->   cambia el DOM  -->  se repinta
Datos guardados: cookies, localStorage, IndexedDB
Red: peticiones HTTP (las del HTML y las de fetch)`,
      concepts: ['motor de JavaScript', 'motor de renderizado', 'DOM', 'almacenamiento local', 'sandbox'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Las tareas del navegador',
        brief: 'Distingue lo que el navegador hace de lo que no puede hacer.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: '¿Cuáles de estas tareas hace el navegador? Marca todas las correctas.',
          quiz: {
            options: [
              { id: 'js', text: 'Ejecutar el código JavaScript de la página' },
              { id: 'pintar', text: 'Convertir el HTML y el CSS en lo que ves en pantalla' },
              { id: 'guardar', text: 'Guardar datos en el equipo del usuario (cookies, localStorage)' },
              { id: 'red', text: 'Hacer peticiones HTTP a servidores' },
              { id: 'bd', text: 'Consultar directamente la base de datos MySQL del servidor' },
            ],
            correctIds: ['js', 'pintar', 'guardar', 'red'],
            multiple: true,
            explanation:
              'El navegador tiene un motor de JavaScript, un motor de renderizado que convierte HTML+CSS en píxeles, almacenamiento local y capacidad de hacer peticiones HTTP. Lo que no puede es tocar directamente la base de datos del servidor: tiene que pedir los datos por HTTP y es el código del servidor quien consulta la base de datos y decide qué devolver.',
          },
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: 'Qué es JavaScript: un lenguaje dinámico',
      objective:
        'Entender que JavaScript es interpretado, de tipado dinámico, dirigido por eventos y multiparadigma, y qué significa ES6.',
      theory: `JavaScript es el único lenguaje que los navegadores ejecutan de forma nativa. Tiene cuatro rasgos que explican casi todo lo que te sorprenderá de él.

Interpretado (o compilado al vuelo): no hay un paso de compilar que tengas que hacer tú. Entregas el fichero \`.js\` tal cual y el motor del navegador lo lee y lo ejecuta (por dentro V8 lo compila sobre la marcha para ir rápido, pero para ti es invisible). Consecuencia: muchos errores no se ven hasta que esa línea se ejecuta.

Tipado dinámico: las variables no tienen tipo, lo tienen los valores. Una misma variable puede guardar un número y luego un texto. El operador \`typeof\` te dice qué tipo de valor hay dentro en ese momento:

\`\`\`js
let dato = 42;
console.log(typeof dato); // number
dato = 'hola';
console.log(typeof dato); // string
\`\`\`

Dirigido por eventos: en el navegador, la mayor parte del código no se ejecuta de arriba abajo y ya, sino que espera a que pase algo (un clic, una tecla, que llegue una respuesta) y entonces reacciona. Multiparadigma: puedes escribir de forma imperativa (paso a paso), con funciones, o con objetos y clases.

El estándar se llama ECMAScript (ES). ES5 (2009) es el JavaScript "antiguo", con \`var\`. ES6 o ES2015 fue el gran cambio: \`let\`, \`const\`, funciones flecha, clases, módulos, promesas. Desde ES2016 sale una versión cada año (ES2016, ES2017…) con mejoras pequeñas como \`async/await\` o \`?.\`. Cuando leas "JS moderno" quiere decir ES6 en adelante.`,
      example: `let x = 10;          // typeof x -> 'number'
x = 'diez';          // typeof x -> 'string'
x = false;           // typeof x -> 'boolean'`,
      concepts: ['interpretado', 'tipado dinámico', 'typeof', 'dirigido por eventos', 'ECMAScript', 'ES6'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Una variable, tres tipos',
        brief: 'Comprueba con typeof que el tipo lo lleva el valor, no la variable.',
        difficulty: 1,
        timeLimitMinutes: 8,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Declara una variable `dato` con let y el valor 42 e imprime typeof dato. Después asígnale el texto \'hola\' e imprime typeof dato. Por último asígnale true e imprime typeof dato. Deben salir tres líneas: number, string y boolean.',
          starterCode: `let dato = 42;
// TODO: imprime el tipo, cambia el valor a 'hola', imprime el tipo,
// cambia el valor a true e imprime el tipo
`,
          solution: `let dato = 42;
console.log(typeof dato); // number
dato = 'hola';
console.log(typeof dato); // string
dato = true;
console.log(typeof dato); // boolean`,
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'JavaScript no es Java',
      objective:
        'Distinguir JavaScript de Java y anticipar las conversiones automáticas de tipos que hace JavaScript.',
      theory: `El nombre engaña: JavaScript y Java se parecen lo mismo que "coche" y "cochera". El nombre fue una decisión de marketing de 1995, cuando Java estaba de moda. Si vienes de Java en 1º, te ayudará saber dónde están las diferencias.

Java se compila a bytecode y lo ejecuta la JVM; es de tipado estático (\`int edad = 18;\` y \`edad\` siempre será entero, o no compila) y todo vive dentro de clases. JavaScript lo ejecuta el motor del navegador o Node.js sin que tú compiles nada; es de tipado dinámico, y puedes escribir funciones sueltas sin una sola clase.

La diferencia que más errores provoca: cuando mezclas tipos, Java se niega a compilar, pero JavaScript convierte automáticamente (coerción) e intenta seguir. Con \`+\`, si uno de los lados es texto, junta textos. Con \`-\`, \`*\` o \`/\`, que solo tienen sentido con números, convierte el texto a número:

\`\`\`js
console.log('5' + 2); // 52  (texto: '5' y '2' pegados)
console.log('5' - 2); // 3   (número)
console.log('5' * 2); // 10  (número)
\`\`\`

Error típico: leer un número de un formulario (siempre llega como texto) y sumarle algo: \`'20' + 1\` da \`'201'\`. No hay mensaje de error; simplemente el resultado está mal. Por eso en JavaScript conviene convertir a mano con \`Number(...)\` antes de operar.`,
      example: `// Java:        int x = "5" * 2;   -> no compila
// JavaScript:  '5' * 2            -> 10
//              '5' + 2            -> '52'`,
      concepts: ['Java vs JavaScript', 'tipado estático', 'tipado dinámico', 'coerción de tipos', 'Number()'],
      tools: ['Node.js'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Qué imprime la mezcla de tipos?',
        brief: 'Predice qué hace JavaScript al mezclar texto y número.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué imprime este código (las dos líneas, en orden)?

console.log('5' * 2);
console.log('5' + 2);`,
          quiz: {
            options: [
              { id: 'a', text: '10 y 7' },
              { id: 'b', text: '10 y 52' },
              { id: 'c', text: '52 y 52' },
              { id: 'd', text: 'Da error, como en Java, porque no se puede operar texto con número' },
            ],
            correctIds: ['b'],
            multiple: false,
            explanation:
              'El operador * solo tiene sentido con números, así que JavaScript convierte \'5\' en 5 y da 10. El operador + con un texto en uno de los lados significa "juntar textos", así que convierte el 2 en \'2\' y da \'52\'. No da error: JavaScript intenta seguir convirtiendo tipos (coerción), justo al contrario que Java, que no compilaría.',
          },
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'Meter JavaScript en una página: defer y async',
      objective:
        'Saber cargar un fichero JS externo con la etiqueta script y elegir entre defer y async.',
      theory: `Hay dos formas de poner JavaScript en un HTML. En línea: el código dentro de la etiqueta, \`<script>console.log('hola')</script>\`. Sirve para pruebas, pero mezcla HTML y lógica. Externo: el código en un fichero aparte, \`<script src="app.js"></script>\`. Es lo correcto: separado, reutilizable y el navegador lo guarda en caché.

Lo importante es cuándo se ejecuta. El navegador lee el HTML de arriba abajo. Cuando encuentra un \`<script src>\` normal, se para: descarga el fichero, lo ejecuta y solo entonces sigue leyendo. Si ese script está en el \`<head>\` y busca un botón del \`<body>\`, el botón todavía no existe y obtiene \`null\`.

\`\`\`html
<head>
  <script src="app.js"></script>   <!-- se ejecuta YA: el body aún no existe -->
</head>
\`\`\`

defer: descarga el fichero en paralelo sin parar la lectura y lo ejecuta cuando el HTML ya se ha leído entero, respetando el orden en que pusiste los scripts. async: también descarga en paralelo, pero lo ejecuta en cuanto llega, puede interrumpir la lectura del HTML y sin orden garantizado entre varios scripts. \`async\` va bien para scripts independientes (analítica, publicidad); para el código de tu aplicación, que toca el DOM y depende de otros ficheros, usa \`defer\`.

Error típico: poner el script en el \`<head>\` sin \`defer\` y que \`document.querySelector('#boton')\` devuelva \`null\`. La solución antigua era poner el script al final del \`<body>\`; la moderna es \`<script src="app.js" defer></script>\` en el \`<head>\`.`,
      example: `<head>
  <script src="libreria.js" defer></script>
  <script src="app.js" defer></script>   <!-- se ejecuta después de libreria.js y con el DOM completo -->
  <script src="analitica.js" async></script>
</head>`,
      concepts: ['script en línea', 'script externo', 'defer', 'async', 'orden de ejecución'],
      tools: ['VS Code', 'DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Carga bien app.js',
        brief: 'Escribe la etiqueta script para que app.js pueda usar el DOM desde el head.',
        difficulty: 1,
        timeLimitMinutes: 8,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'none',
          prompt:
            'Tu fichero app.js hace document.querySelector(\'#enviar\') y luego le añade un evento. Completa el <head> con la etiqueta que carga app.js de forma que, aun estando en el head, el botón ya exista cuando se ejecute. Añade un comentario breve explicando por qué has elegido ese atributo y no async.',
          starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Formulario</title>
  <!-- TODO: carga app.js -->
</head>
<body>
  <button id="enviar">Enviar</button>
</body>
</html>`,
          solution: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Formulario</title>
  <!-- defer: se descarga en paralelo y se ejecuta cuando todo el HTML se ha leído,
       así #enviar ya existe. async lo ejecutaría en cuanto llegara, quizá antes del body. -->
  <script src="app.js" defer></script>
</head>
<body>
  <button id="enviar">Enviar</button>
</body>
</html>`,
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'La consola: tu primera herramienta',
      objective:
        'Usar console.log y sus variantes para ver qué valen las cosas mientras el programa corre.',
      theory: `La consola es la ventana donde JavaScript te puede hablar. Se abre con F12 (o Ctrl+Mayús+J en Chrome) en la pestaña Console. También puedes escribir JavaScript directamente en ella y pulsar Intro: es el mejor sitio para probar algo en dos segundos.

\`console.log(valor)\` imprime lo que le pases. Puedes pasar varias cosas separadas por comas y las imprime en la misma línea con un espacio, sin tener que juntarlas tú. Con plantillas de texto (comillas invertidas) metes variables dentro de un texto:

\`\`\`js
const nombre = 'Ana';
const nota = 7;
console.log('Nota:', nota);            // Nota: 7
console.log(\`\${nombre} tiene un \${nota}\`); // Ana tiene un 7
\`\`\`

Hay variantes útiles: \`console.error()\` imprime en rojo (sirve para distinguir los errores de los mensajes normales), \`console.warn()\` en amarillo, \`console.table(array)\` muestra un array de objetos como una tabla, y \`console.time('x')\` + \`console.timeEnd('x')\` te dice cuántos milisegundos tardó el código que hay entre medias.

Error típico: poner \`console.log\` y no ver nada. Casi siempre es porque esa línea nunca se ejecutó (el script no se cargó, la función no se llamó o hubo un error antes). Eso ya es información: si no aparece, el programa no pasó por ahí. Otro clásico: dejarte decenas de \`console.log\` en el código entregado; quítalos al terminar.`,
      example: `console.log('Total:', 30);           // Total: 30
console.error('No se encontró el botón');
console.table([{ nombre: 'Ana', nota: 7 }, { nombre: 'Luis', nota: 4 }]);`,
      concepts: ['console.log', 'console.error', 'console.table', 'console.time', 'plantillas de texto'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Informa por consola',
        brief: 'Imprime tres líneas con los datos de una alumna.',
        difficulty: 1,
        timeLimitMinutes: 8,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Con las variables nombre y nota ya declaradas, imprime exactamente estas tres líneas usando console.log:\nAlumna: Ana\nNota: 7\nAprobada: true\nLa tercera debe calcularse con nota >= 5, no escribirse a mano.',
          starterCode: `const nombre = 'Ana';
const nota = 7;
// TODO: imprime las tres líneas
`,
          solution: `const nombre = 'Ana';
const nota = 7;
console.log(\`Alumna: \${nombre}\`);
console.log(\`Nota: \${nota}\`);
console.log(\`Aprobada: \${nota >= 5}\`);`,
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'alert, confirm y prompt: hablar con el usuario',
      objective:
        'Saber qué devuelven alert, confirm y prompt y por qué prompt siempre da texto.',
      theory: `Antes de aprender a manejar formularios, el navegador te da tres ventanas rápidas para hablar con el usuario. Las tres bloquean la página: hasta que el usuario no pulsa, el código no sigue.

\`alert('mensaje')\` muestra un aviso con un botón Aceptar. No devuelve nada útil (\`undefined\`). \`confirm('¿Seguro?')\` muestra Aceptar y Cancelar y devuelve un booleano: \`true\` si acepta, \`false\` si cancela. \`prompt('¿Tu edad?')\` muestra una caja de texto y devuelve lo que escribió, siempre como texto (string), o \`null\` si pulsa Cancelar.

Ese "siempre como texto" es la trampa. Aunque el usuario escriba 20, \`prompt\` devuelve \`'20'\`, y \`'20' + 1\` junta textos:

\`\`\`js
const edad = prompt('¿Cuántos años tienes?'); // el usuario escribe 20
console.log(edad + 1);         // 201
console.log(Number(edad) + 1); // 21
\`\`\`

Úsalas para practicar y para pruebas rápidas, no en una aplicación real: son feas, no se pueden diseñar con CSS, bloquean toda la página y algunos navegadores permiten al usuario desactivarlas. En aplicaciones de verdad usarás formularios y ventanas hechas con HTML.`,
      example: `if (confirm('¿Borrar la tarea?')) {
  console.log('Borrada');     // si pulsa Aceptar
} else {
  console.log('Cancelado');   // si pulsa Cancelar
}`,
      concepts: ['alert', 'confirm', 'prompt', 'valor de retorno', 'Number()'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 10,
      challenge: {
        title: 'La trampa de prompt',
        brief: 'Predice qué pasa al sumar a lo que devuelve prompt.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `El usuario escribe 20 en la caja y pulsa Aceptar. ¿Qué imprime la consola?

const edad = prompt('¿Cuántos años tienes?');
console.log(edad + 1);`,
          quiz: {
            options: [
              { id: 'a', text: '21' },
              { id: 'b', text: '201' },
              { id: 'c', text: 'NaN' },
              { id: 'd', text: 'null' },
            ],
            correctIds: ['b'],
            multiple: false,
            explanation:
              'prompt devuelve siempre un texto: \'20\', no el número 20. Con + y un texto en un lado, JavaScript junta textos: \'20\' + 1 da \'201\'. Daría 21 solo si convirtieras antes con Number(edad). NaN saldría con una operación numérica imposible, y null solo si el usuario pulsara Cancelar (y entonces se imprimiría 1, porque null + 1 es 1).',
          },
        },
      },
    },
  ],
};
