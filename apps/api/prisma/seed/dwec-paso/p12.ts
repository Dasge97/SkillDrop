import { type PhaseSeed } from '../content-types.js';

// Une párrafos de teoría (la página los separa por línea en blanco).
const p = (...parrafos: string[]): string => parrafos.join('\n\n');
// Bloque de código: cada argumento es una línea (ninguna debe ir vacía).
const code = (...lineas: string[]): string => '```js\n' + lineas.join('\n') + '\n```';

const RUBRIC = [{ name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true }];

export const dwecPasoP12: PhaseSeed = {
  code: 'FASE 12',
  title: 'APIs del navegador y librerías',
  objective:
    'Distinguir el lenguaje de lo que te da el navegador, guardar datos en localStorage, usar Math, Date e Intl sin caer en sus trampas y entender cómo se meten librerías con CDN o con npm y Vite.',
  unlockedSkills: ['js-fundamentos', 'dom'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'Qué es una API web: lo que te presta el navegador',
      objective: 'Separar lo que es JavaScript (el lenguaje) de lo que añade el navegador (las APIs web).',
      theory: p(
        "JavaScript, el lenguaje, es bastante pequeño: variables, funciones, objetos, arrays, `Math`, `JSON`, `Promise`… Eso es lo que define el estándar ECMAScript y funciona igual en el navegador que en Node.js. Pero el lenguaje por sí solo no sabe pintar nada en pantalla, ni guardar datos, ni saber dónde estás.",
        "Todo eso lo pone el entorno donde se ejecuta tu código. El navegador te presta un montón de objetos y funciones ya hechos: `document` (el DOM), `localStorage`, `setTimeout`, `fetch`, `navigator.geolocation`, `navigator.clipboard`… A cada uno de esos paquetes de funcionalidad se le llama API web: una interfaz que el navegador expone para que tu JavaScript le pida cosas.",
        "Por dentro, muchas de estas APIs no están escritas en JavaScript, sino en C++ dentro del propio navegador. Tú llamas a `localStorage.setItem(...)` y el navegador se encarga de escribir en disco. Por eso hay cosas que funcionan en Chrome y no en Node: Node no tiene `document` ni `localStorage` porque no es un navegador (tiene sus propias APIs, como `fs`).",
        code(
          "Math.max(3, 8);          // lenguaje: funciona en Node y en el navegador",
          "JSON.parse('[1,2]');     // lenguaje",
          "document.title;          // API web: en Node da ReferenceError",
          "localStorage.getItem('x'); // API web",
        ),
        "Error típico: ver `ReferenceError: document is not defined` al ejecutar un fichero con `node archivo.js`. No es que tu código esté mal: es que estás usando una API del navegador en un entorno que no la tiene.",
      ),
      example: 'MDN agrupa todo esto en "Web APIs": Storage, Geolocation, Clipboard, Notifications, Fetch, DOM…',
      concepts: ['API web', 'ECMAScript', 'entorno de ejecución', 'navigator', 'window'],
      tools: ['DevTools', 'Node.js'],
      estimatedTimeMinutes: 10,
      challenge: {
        title: '¿Lenguaje o navegador?',
        brief: 'Identifica cuál de estas cosas la da el navegador y no el lenguaje.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos', 'dom'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            '¿Cuál de estas cosas NO forma parte del lenguaje JavaScript, sino que es una API web que aporta el navegador (y por eso no existe al ejecutar con Node.js)?',
          quiz: {
            options: [
              { id: 'map', text: 'El método map de los arrays' },
              { id: 'json', text: 'JSON.parse' },
              { id: 'ls', text: 'localStorage' },
              { id: 'math', text: 'Math.max' },
            ],
            correctIds: ['ls'],
            explanation:
              'localStorage es una API web: la implementa el navegador y Node.js no la tiene. map, JSON.parse y Math.max forman parte del estándar del lenguaje (ECMAScript) y funcionan igual en cualquier entorno de JavaScript.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'localStorage y sessionStorage: solo guardan texto',
      objective: 'Saber qué guardan localStorage y sessionStorage, en qué se diferencian y qué no se debe guardar ahí.',
      theory: p(
        "`localStorage` y `sessionStorage` son dos almacenes clave-valor que el navegador guarda para cada origen (protocolo + dominio + puerto). Se usan igual: `setItem(clave, valor)` para guardar, `getItem(clave)` para leer (devuelve `null` si no existe), `removeItem(clave)` para borrar una y `clear()` para borrarlas todas.",
        "La diferencia está en cuánto duran. Lo que metes en `localStorage` sigue ahí aunque cierres el navegador y apagues el ordenador, hasta que lo borres tú o el usuario. Lo de `sessionStorage` vive solo mientras esa pestaña siga abierta: al cerrarla, desaparece, y otra pestaña de la misma web tiene su propio `sessionStorage`.",
        "La trampa clave: solo guardan strings. Si le pasas otra cosa, el navegador la convierte a texto con `String(valor)` antes de guardarla. Con un número no pasa nada grave (vuelve como `'5'`), pero con un objeto obtienes el texto `'[object Object]'` y los datos se pierden para siempre.",
        code(
          "localStorage.setItem('edad', 20);",
          "typeof localStorage.getItem('edad'); // 'string'",
          "localStorage.setItem('user', { nombre: 'Ana' });",
          "localStorage.getItem('user');        // '[object Object]'",
        ),
        "Límites: unos 5 MB por origen, y las operaciones son síncronas (bloquean mientras escriben), así que no es para guardar cosas grandes. Y nunca guardes secretos (contraseñas, tokens importantes, datos bancarios): cualquier script que se ejecute en tu página puede leerlo, y el usuario lo ve en DevTools > Application > Local Storage.",
      ),
      example:
        "sessionStorage.setItem('paso', '2');   // se pierde al cerrar la pestaña\nlocalStorage.setItem('tema', 'oscuro'); // sigue ahí mañana",
      concepts: ['localStorage', 'sessionStorage', 'setItem / getItem', 'origen', 'clave-valor'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Qué devuelve getItem?',
        brief: 'Predice qué se lee de localStorage tras guardar un objeto tal cual.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos', 'dom'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "En el navegador ejecutas esto. ¿Qué imprime?\n\nlocalStorage.setItem('user', { nombre: 'Ana' });\nconsole.log(localStorage.getItem('user'));",
          quiz: {
            options: [
              { id: 'obj', text: "{ nombre: 'Ana' }" },
              { id: 'json', text: '{"nombre":"Ana"}' },
              { id: 'objobj', text: '[object Object]' },
              { id: 'null', text: 'null' },
            ],
            correctIds: ['objobj'],
            explanation:
              'localStorage solo guarda strings: convierte el objeto con String(), y String de un objeto normal es "[object Object]". No devuelve el objeto (no guarda objetos), ni JSON (eso solo ocurre si tú llamas a JSON.stringify antes), ni null (la clave sí existe, solo que con un texto inútil).',
          },
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'Guardar objetos de verdad: JSON.stringify y JSON.parse',
      objective: 'Guardar y recuperar arrays y objetos en el almacenamiento usando JSON.',
      theory: p(
        "Como el almacenamiento solo guarda texto, para guardar un objeto o un array lo conviertes tú a texto en formato JSON con `JSON.stringify(dato)`. Al leerlo, haces el camino inverso con `JSON.parse(texto)` y recuperas un objeto nuevo con los mismos datos.",
        code(
          "const carrito = [{ nombre: 'Teclado', precio: 25 }];",
          "localStorage.setItem('carrito', JSON.stringify(carrito));",
          "const texto = localStorage.getItem('carrito'); // '[{\"nombre\":\"Teclado\",\"precio\":25}]'",
          "const recuperado = JSON.parse(texto);",
          "console.log(recuperado[0].nombre); // Teclado",
        ),
        "Ojo con la primera visita: si la clave no existe, `getItem` devuelve `null`. `JSON.parse(null)` devuelve `null`, y luego `null.length` revienta. El patrón habitual es dar un valor por defecto: `JSON.parse(localStorage.getItem('carrito')) ?? []`.",
        "Otro detalle: JSON no sabe guardar funciones, `undefined` ni fechas como objeto `Date` (las convierte a texto). Lo que recuperas es una copia de los datos, no el mismo objeto: si lo modificas, tienes que volver a guardarlo con `setItem`.",
        "Error típico: hacer `JSON.parse` de algo que no es JSON (por ejemplo, un texto que guardaste sin `stringify`). Salta `SyntaxError: Unexpected token`. Si ves ese error, mira en DevTools > Application qué texto hay realmente guardado.",
      ),
      example: "const prefs = JSON.parse(localStorage.getItem('prefs')) ?? { tema: 'claro' };",
      concepts: ['JSON.stringify', 'JSON.parse', 'serializar', 'valor por defecto', '??'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Ida y vuelta de un carrito',
        brief: 'Convierte un carrito a texto, guárdalo en un almacén simulado y recupéralo.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Aquí no hay localStorage, así que lo simulamos con un objeto almacen (que, igual que localStorage, debe guardar solo texto). 1) Guarda en almacen.carrito el carrito convertido a JSON e imprime ese texto. 2) Imprime typeof almacen.carrito. 3) Recupera el carrito con JSON.parse en una variable recuperado e imprime en una línea cuántos productos tiene y el nombre del primero. Salida esperada:\n[{"nombre":"Teclado","precio":25},{"nombre":"Ratón","precio":10}]\nstring\n2 Teclado',
          starterCode:
            "const carrito = [\n  { nombre: 'Teclado', precio: 25 },\n  { nombre: 'Ratón', precio: 10 },\n];\nconst almacen = {}; // hace de localStorage\n\n// TODO 1: guarda el carrito como texto JSON en almacen.carrito e imprímelo\n\n// TODO 2: imprime el tipo de almacen.carrito\n\n// TODO 3: recupera el carrito con JSON.parse e imprime cuántos productos hay y el nombre del primero\n",
          solution:
            "const carrito = [\n  { nombre: 'Teclado', precio: 25 },\n  { nombre: 'Ratón', precio: 10 },\n];\nconst almacen = {};\n\nalmacen.carrito = JSON.stringify(carrito);\nconsole.log(almacen.carrito);\n\nconsole.log(typeof almacen.carrito);\n\nconst recuperado = JSON.parse(almacen.carrito);\nconsole.log(recuperado.length, recuperado[0].nombre);\n",
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: 'Math: redondeos y números aleatorios entre min y max',
      objective: 'Usar round, floor y ceil sabiendo qué hace cada uno, y generar un entero aleatorio en un rango.',
      theory: p(
        "`Math` es un objeto del lenguaje con funciones matemáticas ya hechas. No se crea con `new`: se usa directamente, `Math.max(2, 9)`, `Math.abs(-3)`, `Math.PI`…",
        "Los tres redondeos que más se confunden: `Math.round` va al entero más cercano (y si está justo en la mitad, hacia arriba: `Math.round(4.5)` es 5); `Math.floor` va siempre hacia abajo, al suelo (`Math.floor(4.7)` es 4); `Math.ceil` va siempre hacia arriba, al techo (`Math.ceil(4.1)` es 5). Ojo con los negativos: `Math.floor(-4.2)` es -5, porque -5 está \"más abajo\" que -4.",
        "`Math.random()` devuelve un decimal entre 0 (incluido) y 1 (excluido), algo como 0.7302… Para sacar un entero entre `min` y `max`, ambos incluidos, se escala y se redondea hacia abajo:",
        code(
          "function entero(min, max) {",
          "  // random * cuántos valores posibles, al suelo, y desplazado a min",
          "  return Math.floor(Math.random() * (max - min + 1)) + min;",
          "}",
          "entero(1, 6); // un dado: 1, 2, 3, 4, 5 o 6",
        ),
        "¿Por qué `max - min + 1`? Entre 1 y 6 hay 6 valores posibles. `Math.random() * 6` da algo entre 0 y 5.999…, `floor` lo deja en 0..5 y al sumar `min` queda en 1..6. Error típico: usar `Math.round` en vez de `floor`, que hace que los extremos salgan la mitad de veces que los demás, u olvidar el `+ 1` y que nunca salga el 6.",
      ),
      example: 'Math.round(4.5) // 5\nMath.floor(4.7) // 4\nMath.ceil(4.1)  // 5',
      concepts: ['Math.random', 'Math.floor', 'Math.ceil', 'Math.round', 'rango'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Un dado justo',
        brief: 'Implementa entero(min, max) y comprueba que un dado da de 1 a 6.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Primero imprime en una línea Math.round(4.5), Math.floor(4.7) y Math.ceil(4.1). Después completa entero(min, max) para que devuelva un entero aleatorio entre min y max (ambos incluidos). El código de abajo tira un dado 1000 veces y guarda el valor más bajo y el más alto que han salido. Salida esperada:\n5 4 5\nmínimo: 1 máximo: 6',
          starterCode:
            "// TODO: imprime en una línea Math.round(4.5), Math.floor(4.7) y Math.ceil(4.1)\n\nfunction entero(min, max) {\n  // TODO: devuelve un entero aleatorio entre min y max, ambos incluidos\n}\n\nlet menor = Infinity;\nlet mayor = -Infinity;\nfor (let i = 0; i < 1000; i++) {\n  const tirada = entero(1, 6);\n  if (tirada < menor) menor = tirada;\n  if (tirada > mayor) mayor = tirada;\n}\nconsole.log('mínimo:', menor, 'máximo:', mayor);\n",
          solution:
            "console.log(Math.round(4.5), Math.floor(4.7), Math.ceil(4.1));\n\nfunction entero(min, max) {\n  return Math.floor(Math.random() * (max - min + 1)) + min;\n}\n\nlet menor = Infinity;\nlet mayor = -Infinity;\nfor (let i = 0; i < 1000; i++) {\n  const tirada = entero(1, 6);\n  if (tirada < menor) menor = tirada;\n  if (tirada > mayor) mayor = tirada;\n}\nconsole.log('mínimo:', menor, 'máximo:', mayor);\n",
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'Date e Intl: fechas con meses desde 0 y formatos bonitos',
      objective: 'Crear fechas con Date sin equivocarse de mes y formatearlas (y formatear dinero) con Intl.',
      theory: p(
        "`Date` representa un instante concreto. `new Date()` es ahora mismo; `new Date(2025, 1, 10)` es una fecha concreta pasando año, mes y día; `new Date('2025-02-10')` la crea a partir de un texto en formato ISO. Para leer las partes tienes `getFullYear()`, `getMonth()`, `getDate()` (día del mes), `getDay()` (día de la semana, 0 = domingo), `getHours()`…",
        "La trampa más famosa de JavaScript: los meses empiezan en 0. Enero es 0, febrero es 1… diciembre es 11. Los días del mes, en cambio, empiezan en 1. Así que `new Date(2025, 1, 10)` es el 10 de febrero, no el 10 de enero, y para mostrar el mes \"humano\" tienes que sumar 1.",
        code(
          "const d = new Date(2025, 1, 10); // 10 de febrero de 2025",
          "d.getMonth();     // 1",
          "d.getDate();      // 10",
          "d.getMonth() + 1; // 2  -> el que enseñas al usuario",
        ),
        "Además, `Date` corrige solo las fechas imposibles: `new Date(2025, 0, 32)` no da error, se convierte en el 1 de febrero. Es útil para sumar días, pero también esconde fallos si te equivocas de mes.",
        "Para enseñar fechas y números al usuario no montes el texto a mano: usa `Intl`, la API de internacionalización. Sabe el formato de cada país (separadores, nombres de meses, símbolo de moneda):",
        code(
          "new Intl.DateTimeFormat('es-ES').format(d);                       // '10/2/2025'",
          "new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(d); // '10 de febrero de 2025'",
          "new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(12345.5); // '12.345,50 €'",
        ),
      ),
      example: "const hoy = new Date();\nconsole.log(hoy.getMonth() + 1); // mes actual, de 1 a 12",
      concepts: ['Date', 'getMonth', 'meses desde 0', 'Intl.DateTimeFormat', 'Intl.NumberFormat'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'El mes que no es',
        brief: 'Predice qué devuelve getMonth de una fecha creada a mano.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: '¿Qué imprime este código?\n\nconst d = new Date(2025, 1, 10);\nconsole.log(d.getMonth(), d.getFullYear());',
          quiz: {
            options: [
              { id: 'a', text: '2 2025' },
              { id: 'b', text: '1 2025' },
              { id: 'c', text: '0 2025' },
              { id: 'd', text: '10 2025' },
            ],
            correctIds: ['b'],
            explanation:
              'Los meses en Date van de 0 a 11: el 1 que pasas al constructor es febrero, y getMonth() devuelve ese mismo número, 1. "2" sería el mes humano (habría que sumar 1 tú). "0" sería enero. "10" es el día del mes, que se lee con getDate(), no con getMonth().',
          },
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'Temporizadores y APIs que piden permiso',
      objective: 'Usar setTimeout y setInterval, y entender cómo funcionan las APIs con permiso: Geolocation, Clipboard y Notification.',
      theory: p(
        "Los temporizadores también son una API del navegador. `setTimeout(fn, ms)` ejecuta `fn` una vez cuando pasen al menos `ms` milisegundos; `setInterval(fn, ms)` la ejecuta cada `ms` hasta que la pares. Ambos devuelven un número identificador que sirve para cancelarlos con `clearTimeout(id)` o `clearInterval(id)`.",
        code(
          "let segundos = 0;",
          "const id = setInterval(() => {",
          "  segundos++;",
          "  console.log(segundos); // 1, 2, 3",
          "  if (segundos === 3) clearInterval(id); // si no, sigue para siempre",
          "}, 1000);",
        ),
        "El tiempo es un mínimo, no una cita exacta: si el navegador está ocupado, la función espera. Esto lo entenderás del todo en la fase de asincronía.",
        "Hay APIs que tocan cosas delicadas del usuario: su ubicación (`navigator.geolocation`), su portapapeles (`navigator.clipboard`) o sus notificaciones del sistema (`Notification`). Para ellas el navegador hace de guardián: la primera vez muestra un aviso pidiendo permiso al usuario, y además solo funcionan en páginas seguras (HTTPS o `localhost`).",
        code(
          "navigator.geolocation.getCurrentPosition(",
          "  (pos) => console.log(pos.coords.latitude, pos.coords.longitude), // permiso concedido",
          "  (err) => console.log('Sin ubicación:', err.message),             // denegado o fallo",
          ");",
          "await navigator.clipboard.writeText('copiado');  // escribir en el portapapeles",
          "const permiso = await Notification.requestPermission(); // 'granted' | 'denied' | 'default'",
        ),
        "Como el usuario puede decir que no, tu código siempre debe contemplar el caso de error. Error típico: escribir solo la función de éxito de `getCurrentPosition` y quedarse esperando para siempre cuando el usuario bloquea el permiso. Otro: pedir permisos nada más cargar la página; los navegadores los bloquean o el usuario dice que no. Pídelos cuando el usuario pulse un botón que lo justifique.",
      ),
      example: "const id = setTimeout(() => console.log('tarde'), 2000);\nclearTimeout(id); // cancelado: nunca se imprime",
      concepts: ['setTimeout', 'setInterval', 'clearInterval', 'permisos', 'Geolocation', 'Clipboard'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'El usuario dice que no',
        brief: 'Qué ocurre cuando el usuario bloquea el permiso de ubicación.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos', 'dom'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "Tu web ejecuta:\n\nnavigator.geolocation.getCurrentPosition(exito, error);\n\nEl navegador muestra el aviso de permiso y el usuario pulsa \"Bloquear\". ¿Qué ocurre?",
          quiz: {
            options: [
              { id: 'error', text: 'Se ejecuta la función error, que recibe un objeto con el motivo (permiso denegado).' },
              { id: 'exito-null', text: 'Se ejecuta exito con la posición a null.' },
              { id: 'ip', text: 'El navegador devuelve una ubicación aproximada por la IP en exito.' },
              { id: 'crash', text: 'Se lanza una excepción que detiene todo el script de la página.' },
            ],
            correctIds: ['error'],
            explanation:
              'Si el permiso se deniega, el navegador llama a la segunda función (la de error) con un GeolocationPositionError cuyo código es PERMISSION_DENIED. Nunca llama a la de éxito, ni con null ni con una ubicación inventada por IP, y tampoco lanza una excepción: por eso tienes que pasar siempre la función de error y mostrar algo útil al usuario.',
          },
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'Qué es una librería y cómo se mete en tu web',
      objective: 'Entender qué es una librería y las dos formas de usarla: CDN con <script> y npm con import.',
      theory: p(
        "Una librería es código que ha escrito otra persona para resolver un problema común, y que tú reutilizas en vez de programarlo desde cero. Por ejemplo, Day.js sirve para manejar y formatear fechas sin pelearte con `Date`, y Chart.js dibuja gráficas a partir de tus datos. No es magia: es JavaScript normal que, al cargarse, te deja disponibles unas funciones nuevas.",
        "Forma 1, por CDN: un CDN es un servidor público que aloja ficheros de librerías. Pones una etiqueta `<script>` apuntando al fichero, antes de tu propio script. Al cargarse, la librería crea una variable global (en Day.js, `dayjs`) que ya puedes usar.",
        "```html\n<script src=\"https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js\"></script>\n<script>\n  console.log(dayjs().format('DD/MM/YYYY')); // la fecha de hoy, p. ej. 13/10/2026\n  console.log(dayjs().add(7, 'day').format('DD/MM/YYYY')); // dentro de una semana\n</script>\n```",
        "Forma 2, con npm y módulos: instalas la librería en tu proyecto con `npm install dayjs` y la importas en tu código con `import dayjs from 'dayjs'`. Así no hay variables globales: cada fichero importa lo que usa. Es la forma habitual en proyectos con Vite, Vue o React.",
        "Fíjate en el `@1.11.13` de la URL: fijar la versión evita que la librería cambie por debajo y te rompa la web un día cualquiera. Error típico con CDN: poner tu `<script>` antes que el de la librería, y ver `ReferenceError: dayjs is not defined`, porque cuando tu código se ejecuta la librería aún no se ha cargado.",
      ),
      example: "// Con npm (en un proyecto con Vite):\nimport dayjs from 'dayjs';\nconsole.log(dayjs('2025-02-10').format('D [de] MMMM'));",
      concepts: ['librería', 'CDN', 'variable global', 'npm install', 'import'],
      tools: ['VS Code', 'DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Day.js por CDN',
        brief: 'Carga Day.js desde un CDN y úsalo para imprimir la fecha de hoy.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['js-fundamentos', 'dom'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'none',
          prompt:
            'Completa el HTML para cargar Day.js desde el CDN https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js y, en tu propio script, imprime por consola la fecha de hoy con formato DD/MM/YYYY. Después, en un comentario, escribe las dos líneas que usarías para hacer lo mismo con npm (el comando y el import).',
          starterCode:
            '<!DOCTYPE html>\n<html lang="es">\n<body>\n  <!-- TODO: carga aquí Day.js desde el CDN -->\n\n  <script>\n    // TODO: imprime la fecha de hoy con formato DD/MM/YYYY\n\n    // TODO: comenta cómo sería con npm\n  </script>\n</body>\n</html>\n',
          solution:
            '<!DOCTYPE html>\n<html lang="es">\n<body>\n  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js"></script>\n  <script>\n    console.log(dayjs().format(\'DD/MM/YYYY\'));\n\n    // Con npm:\n    // npm install dayjs          (en la terminal, en la carpeta del proyecto)\n    // import dayjs from \'dayjs\';  (en el fichero JS, que debe ser un módulo)\n  </script>\n</body>\n</html>\n',
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'npm, package.json y Vite sin misterio',
      objective: 'Saber qué es package.json, qué hace npm install, qué es node_modules y para qué sirve una herramienta como Vite.',
      theory: p(
        "npm es el gestor de paquetes de Node.js: un programa de terminal que descarga librerías del registro público npmjs.com. Aunque tu código vaya a ejecutarse en el navegador, para usar npm necesitas Node instalado en tu ordenador.",
        "`package.json` es la ficha de tu proyecto: nombre, versión, scripts (`npm run dev`, `npm run build`) y la lista de librerías de las que depende. Hay dos listas: dependencies, lo que tu web necesita para funcionar en el navegador del usuario (Chart.js, Day.js, Vue…), y devDependencies, lo que solo necesitas tú mientras programas (Vite, ESLint, herramientas de tests). `npm install chart.js` la apunta en la primera; `npm install -D vite`, en la segunda.",
        "```json\n{\n  \"scripts\": { \"dev\": \"vite\", \"build\": \"vite build\" },\n  \"dependencies\": { \"chart.js\": \"^4.4.0\" },\n  \"devDependencies\": { \"vite\": \"^5.4.0\" }\n}\n```",
        "Las librerías descargadas se guardan en la carpeta `node_modules`, que puede pesar cientos de megas. No se sube a git (va en `.gitignore`): quien clone el proyecto ejecuta `npm install` y npm lee `package.json` (y `package-lock.json`, que fija las versiones exactas) para volver a descargarlo todo igual.",
        "¿Y Vite? Es una herramienta de build. Mientras programas (`npm run dev`) levanta un servidor local que recarga la página al guardar y sabe resolver los `import 'dayjs'` buscando en `node_modules`, algo que el navegador por sí solo no sabe hacer. Al terminar (`npm run build`) junta y comprime todo tu código y el de las librerías en unos pocos ficheros dentro de `dist/`, que son los que subes al servidor. Vite no viaja con tu web: por eso es devDependency.",
      ),
      example: 'npm create vite@latest mi-app\ncd mi-app\nnpm install\nnpm run dev',
      concepts: ['npm', 'package.json', 'node_modules', 'dependencies', 'devDependencies', 'Vite'],
      tools: ['Node.js', 'VS Code'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿dependencies o devDependencies?',
        brief: 'Coloca Chart.js y Vite en la lista correcta de package.json.',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'Tu web usa Chart.js para dibujar gráficas que ve el usuario, y tú usas Vite para el servidor de desarrollo y para generar la versión final. Siguiendo la convención de npm, ¿dónde va cada una en package.json?',
          quiz: {
            options: [
              { id: 'ambas-dep', text: 'Las dos en dependencies' },
              { id: 'correcta', text: 'Chart.js en dependencies y Vite en devDependencies' },
              { id: 'al-reves', text: 'Chart.js en devDependencies y Vite en dependencies' },
              { id: 'ambas-dev', text: 'Las dos en devDependencies' },
            ],
            correctIds: ['correcta'],
            explanation:
              'Chart.js forma parte de lo que la web necesita para funcionar en el navegador del usuario: dependencies. Vite solo lo usas tú para desarrollar y construir; no se ejecuta en la web final: devDependencies (se instala con npm install -D vite). Las otras opciones mezclan esos dos papeles.',
          },
        },
      },
    },
  ],
};
