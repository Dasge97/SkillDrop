import { type PhaseSeed } from '../content-types.js';

// Une párrafos de teoría (la página los separa por línea en blanco).
const p = (...parrafos: string[]): string => parrafos.join('\n\n');
// Bloque de código: cada argumento es una línea (ninguna debe ir vacía).
const code = (...lineas: string[]): string => '```js\n' + lineas.join('\n') + '\n```';

const RUBRIC = [{ name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true }];

export const dwecPasoP13: PhaseSeed = {
  code: 'FASE 13',
  title: 'Asincronía: promesas, async/await y fetch',
  objective:
    'Entender por qué JavaScript no espera, predecir en qué orden se ejecuta el código asíncrono y pedir datos a un servidor con fetch tratando bien los errores y los estados de la interfaz.',
  unlockedSkills: ['async', 'fetch-api', 'http'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'Síncrono y asíncrono: por qué el navegador no puede esperar',
      objective: 'Entender qué significa que una operación sea asíncrona y por qué JavaScript no se queda esperando.',
      theory: p(
        "JavaScript en el navegador tiene un solo hilo principal: hace una cosa detrás de otra. Ese mismo hilo ejecuta tu código, responde a los clics y repinta la página. Si una línea tarda 5 segundos, durante esos 5 segundos la página entera se congela: no se puede hacer scroll, los botones no responden y el navegador acaba mostrando \"La página no responde\".",
        "Código síncrono es el que se ejecuta de principio a fin sin soltar el hilo: cada línea espera a que termine la anterior. Pedir datos a un servidor puede tardar cientos de milisegundos o varios segundos, así que no puede hacerse así. Por eso las operaciones lentas (temporizadores, peticiones de red, leer ficheros) son asíncronas: tú las lanzas, el navegador se encarga de ellas por su cuenta, y tu código sigue con la siguiente línea sin esperar.",
        "Cuando la operación termina, el navegador avisa ejecutando la función que le dejaste preparada. Esa función no corre \"en medio\" de tu código: corre después, cuando el hilo está libre.",
        code(
          "console.log('A');",
          "setTimeout(() => console.log('B'), 0); // se apunta para luego",
          "console.log('C');",
          "// Imprime: A, C, B",
        ),
        "Aunque el retraso sea 0, `B` sale el último: `setTimeout` no ejecuta la función, la deja programada y el código sigue. Error típico: intentar usar un dato asíncrono en la línea siguiente, como si ya hubiera llegado, y encontrarse `undefined`.",
      ),
      example:
        "let datos;\nsetTimeout(() => { datos = 'listo'; }, 1000);\nconsole.log(datos); // undefined: aún no ha pasado el segundo",
      concepts: ['hilo principal', 'síncrono', 'asíncrono', 'bloquear', 'setTimeout'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'setTimeout con 0',
        brief: 'Predice el orden de impresión con un setTimeout de 0 ms.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['async'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "¿En qué orden se imprime?\n\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nconsole.log('C');",
          quiz: {
            options: [
              { id: 'abc', text: 'A, B, C' },
              { id: 'acb', text: 'A, C, B' },
              { id: 'ac', text: 'A, C (B nunca se imprime)' },
              { id: 'bac', text: 'B, A, C' },
            ],
            correctIds: ['acb'],
            explanation:
              'setTimeout no ejecuta la función en ese momento: la deja programada y el código sigue. Primero termina todo el código síncrono (A y C) y solo cuando el hilo queda libre se ejecuta la función pendiente (B). Con 0 ms no va "inmediatamente", va "en cuanto se pueda", que es después. Y sí se imprime: simplemente, más tarde.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'El event loop paso a paso: pila, tareas y microtareas',
      objective: 'Saber cómo decide el motor qué ejecutar después: pila de llamadas, cola de tareas y cola de microtareas.',
      theory: p(
        "Para predecir el orden del código asíncrono hay que conocer cuatro piezas. La pila de llamadas (call stack) es lo que se está ejecutando ahora mismo. Las APIs del navegador son las que llevan la cuenta de temporizadores y peticiones fuera de tu código. La cola de tareas (task queue) es donde esperan las funciones de `setTimeout`, `setInterval` y de los eventos cuando les toca. Y la cola de microtareas es donde esperan los `then` de las promesas y el código que sigue a un `await`.",
        "El event loop (bucle de eventos) aplica siempre la misma regla: 1) ejecuta el código hasta que la pila se vacía; 2) ejecuta todas las microtareas pendientes, una detrás de otra (y las que se añadan mientras tanto); 3) el navegador puede repintar; 4) saca una sola tarea de la cola de tareas y vuelve al paso 1.",
        "Consecuencia práctica: un `then` siempre se ejecuta antes que un `setTimeout(..., 0)` que se programó a la vez, porque las microtareas tienen prioridad sobre las tareas.",
        code(
          "console.log('1');                               // pila: se imprime ya",
          "setTimeout(() => console.log('2'), 0);          // a la cola de TAREAS",
          "Promise.resolve().then(() => console.log('3')); // a la cola de MICROTAREAS",
          "console.log('4');                               // pila: se imprime ya",
          "// Pila vacía -> microtareas (3) -> una tarea (2)",
          "// Imprime: 1, 4, 3, 2",
        ),
        "Truco para resolver estos ejercicios: haz tres columnas en un papel (\"ahora\", \"microtareas\", \"tareas\"), ve leyendo línea a línea apuntando cada función en su columna y al final léelas en ese orden. Error típico: pensar que el orden depende de qué línea está escrita antes; lo que manda es a qué cola va cada cosa.",
      ),
      example: 'Orden de prioridad: código síncrono > microtareas (then, await) > tareas (setTimeout, eventos)',
      concepts: ['event loop', 'call stack', 'cola de tareas', 'microtareas', 'prioridad'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Promesa contra setTimeout',
        brief: 'Predice el orden cuando compiten un setTimeout y un then.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['async'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "¿En qué orden se imprime?\n\nconsole.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
          quiz: {
            options: [
              { id: 'a', text: '1, 2, 3, 4' },
              { id: 'b', text: '1, 4, 2, 3' },
              { id: 'c', text: '1, 4, 3, 2' },
              { id: 'd', text: '1, 3, 4, 2' },
            ],
            correctIds: ['c'],
            explanation:
              'Primero todo el código síncrono: 1 y 4. Con la pila vacía, el event loop vacía la cola de microtareas (el then: 3) y solo después saca una tarea de la cola de tareas (el setTimeout: 2). "1, 2, 3, 4" ignora la asincronía; "1, 4, 2, 3" da prioridad a setTimeout, que es al revés; "1, 3, 4, 2" ejecuta el then antes de terminar el código síncrono, y eso nunca ocurre.',
          },
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'Callbacks y el callback hell',
      objective: 'Entender qué es un callback, cómo se usaba para la asincronía y por qué anidarlos se vuelve inmanejable.',
      theory: p(
        "Un callback es simplemente una función que le pasas a otra función para que esta la llame cuando le convenga. Ya los has usado: el de `addEventListener`, el de `setTimeout`, el de `map` o `forEach`. No todos son asíncronos: el de `map` se ejecuta en el momento; el de `setTimeout`, más tarde.",
        code(
          "function operar(a, b, callback) {",
          "  return callback(a, b); // operar no sabe qué operación es: la decide quien llama",
          "}",
          "operar(3, 4, (x, y) => x + y); // 7",
        ),
        "Antes de las promesas, toda la asincronía se hacía con callbacks: \"cuando termines, llama a esta función\". El problema llega cuando una operación depende de la anterior: pedir el usuario, con él pedir sus pedidos, con ellos pedir el detalle del primero… Cada paso va dentro del callback del anterior y el código se va desplazando a la derecha. A esa pirámide se le llama callback hell.",
        code(
          "getUsuario(1, (usuario) => {",
          "  getPedidos(usuario.id, (pedidos) => {",
          "    getDetalle(pedidos[0].id, (detalle) => {",
          "      console.log(detalle); // y el manejo de errores, repetido en cada nivel",
          "    });",
          "  });",
          "});",
        ),
        "Además de ser difícil de leer, cada nivel tiene que gestionar sus propios errores, y si se te olvida uno el fallo desaparece en silencio. Las promesas nacieron para aplanar esta pirámide y centralizar los errores, como verás en la siguiente lección.",
      ),
      example: "[1, 2, 3].forEach((n) => console.log(n * 2)); // el callback se llama una vez por elemento",
      concepts: ['callback', 'función de orden superior', 'callback hell', 'anidamiento'],
      tools: [],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Una función que recibe otra',
        brief: 'Usa operar(a, b, callback) con tres callbacks distintos.',
        difficulty: 1,
        timeLimitMinutes: 10,
        skills: ['async', 'js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Completa operar(a, b, callback) para que devuelva el resultado de llamar al callback con a y b. Define las funciones suma y multiplica, e imprime (una por línea) operar(3, 4, suma), operar(3, 4, multiplica) y operar(3, 4, ...) pasando directamente una función flecha que reste. Salida esperada:\n7\n12\n-1',
          starterCode:
            "function operar(a, b, callback) {\n  // TODO: llama al callback con a y b y devuelve su resultado\n}\n\n// TODO: define suma y multiplica\n\n// TODO: imprime operar(3, 4, suma)\n// TODO: imprime operar(3, 4, multiplica)\n// TODO: imprime operar(3, 4, <una flecha que reste>)\n",
          solution:
            "function operar(a, b, callback) {\n  return callback(a, b);\n}\n\nfunction suma(x, y) {\n  return x + y;\n}\nconst multiplica = (x, y) => x * y;\n\nconsole.log(operar(3, 4, suma));\nconsole.log(operar(3, 4, multiplica));\nconsole.log(operar(3, 4, (x, y) => x - y));\n",
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: 'Promesas: estados, then, catch y finally',
      objective: 'Saber qué es una promesa, sus tres estados y cómo encadenar then, catch y finally.',
      theory: p(
        "Una promesa es un objeto que representa un resultado que todavía no tienes pero tendrás (o fallará). Siempre está en uno de tres estados: pending (pendiente, aún no se sabe), fulfilled (cumplida, con un valor) o rejected (rechazada, con un motivo de error). Pasa de pending a uno de los otros dos una sola vez y ya no cambia más.",
        "En lugar de pasar un callback a la operación, la operación te devuelve una promesa y tú le cuelgas funciones: `then(fn)` se ejecuta si se cumple y recibe el valor; `catch(fn)` se ejecuta si se rechaza y recibe el error; `finally(fn)` se ejecuta siempre, vaya bien o mal (ideal para quitar un \"Cargando…\").",
        "La clave para encadenar: cada `then` devuelve una promesa nueva con lo que devuelva su función. Así el resultado de un paso pasa al siguiente, y el código queda plano en vez de en pirámide. Si en cualquier paso se lanza un error, la cadena se salta todos los `then` siguientes hasta el primer `catch`.",
        code(
          "Promise.resolve(2)",
          "  .then((x) => x * 3)                 // devuelve 6 -> pasa al siguiente",
          "  .then((x) => { console.log(x); throw new Error('ups'); }) // 6",
          "  .then(() => console.log('no llego')) // se salta",
          "  .catch((e) => console.log('error:', e.message)) // error: ups",
          "  .finally(() => console.log('fin'));  // fin",
        ),
        "Error típico: olvidar el `return` dentro de un `then` con llaves. Si escribes `.then((x) => { x * 3 })`, la función devuelve `undefined` y el siguiente `then` recibe `undefined`. Otro: no poner `catch`, y que el error aparezca como \"Uncaught (in promise)\" en la consola.",
      ),
      example: "fetch('/api/datos')\n  .then((res) => res.json())\n  .then((datos) => console.log(datos))\n  .catch((err) => console.log('Falló:', err.message));",
      concepts: ['Promise', 'pending / fulfilled / rejected', 'then', 'catch', 'finally', 'encadenar'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Sigue la cadena',
        brief: 'Predice qué imprime una cadena de promesas con un error en medio.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['async'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "¿Qué imprime este código (en orden)?\n\nPromise.resolve(2)\n.then((x) => x * 3)\n.then((x) => { console.log(x); throw new Error('ups'); })\n.then(() => console.log('no llego'))\n.catch((e) => console.log('error:', e.message))\n.finally(() => console.log('fin'));",
          quiz: {
            options: [
              { id: 'a', text: '6, error: ups, fin' },
              { id: 'b', text: '6, no llego, error: ups, fin' },
              { id: 'c', text: '2, error: ups, fin' },
              { id: 'd', text: '6, error: ups' },
            ],
            correctIds: ['a'],
            explanation:
              'El primer then convierte 2 en 6 y el segundo lo imprime y lanza un error. Desde ese momento la promesa está rechazada y se saltan los then hasta el catch, así que "no llego" nunca se imprime. El catch imprime "error: ups" y finally se ejecuta siempre, por eso sale "fin". Se imprime 6 y no 2 porque el valor ya pasó por el primer then.',
          },
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'Crear promesas con new Promise y esperar varias con Promise.all',
      objective: 'Construir una promesa propia con resolve y reject, y lanzar varias en paralelo con Promise.all.',
      theory: p(
        "Casi siempre usarás promesas que ya te dan hechas (`fetch`, por ejemplo), pero conviene saber construirlas. `new Promise` recibe una función, llamada ejecutor, que a su vez recibe dos funciones: `resolve(valor)` para cumplirla y `reject(error)` para rechazarla.",
        code(
          "function esperar(ms) {",
          "  return new Promise((resolve) => {",
          "    setTimeout(() => resolve(`han pasado ${ms} ms`), ms);",
          "  });",
          "}",
          "esperar(1000).then((msg) => console.log(msg)); // al segundo: han pasado 1000 ms",
        ),
        "Un detalle que cae en examen: el ejecutor se ejecuta en el momento, de forma síncrona, al hacer `new Promise`. Lo asíncrono son los `then`, que siempre van a la cola de microtareas aunque la promesa ya esté resuelta.",
        "Si tienes varias operaciones independientes (cargar usuarios, productos y categorías), no hace falta hacerlas una detrás de otra. `Promise.all([p1, p2, p3])` las lanza todas a la vez y devuelve una promesa que se cumple con un array de resultados, en el mismo orden en que las pasaste, cuando terminan todas.",
        code(
          "Promise.all([esperar(300), esperar(100)])",
          "  .then((res) => console.log(res)); // ['han pasado 300 ms', 'han pasado 100 ms'] a los 300 ms",
        ),
        "Ojo: en cuanto una sola se rechaza, `Promise.all` se rechaza entero con ese error y pierdes los resultados de las demás. Si quieres los resultados aunque alguna falle, existe `Promise.allSettled`.",
      ),
      example: "const moneda = new Promise((resolve, reject) => {\n  Math.random() < 0.5 ? resolve('cara') : reject(new Error('cruz'));\n});",
      concepts: ['new Promise', 'resolve', 'reject', 'ejecutor', 'Promise.all'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿Cuándo corre el ejecutor?',
        brief: 'Predice el orden cuando se mezclan new Promise, then y código normal.',
        difficulty: 3,
        timeLimitMinutes: 8,
        skills: ['async'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "¿En qué orden se imprime?\n\nconsole.log('A');\nconst p = new Promise((resolve) => {\nconsole.log('B');\nresolve('C');\n});\np.then((v) => console.log(v));\nconsole.log('D');",
          quiz: {
            options: [
              { id: 'abcd', text: 'A, B, C, D' },
              { id: 'abdc', text: 'A, B, D, C' },
              { id: 'adbc', text: 'A, D, B, C' },
              { id: 'adcb', text: 'A, D, C, B' },
            ],
            correctIds: ['abdc'],
            explanation:
              'El ejecutor de new Promise se ejecuta en el acto, de forma síncrona: por eso B sale justo después de A. Llamar a resolve no ejecuta el then en ese momento: lo deja en la cola de microtareas. El código síncrono sigue (D) y, cuando la pila se vacía, se ejecuta el then (C). Las opciones con D antes de B suponen que el ejecutor es asíncrono, y no lo es; "A, B, C, D" supone que el then es síncrono, y tampoco.',
          },
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'async/await y try/catch: promesas que se leen como código normal',
      objective: 'Escribir código con promesas usando async/await y capturar los errores con try/catch.',
      theory: p(
        "`async/await` no es un mecanismo nuevo: es otra forma de escribir lo mismo que con `then`, pero que se lee de arriba abajo como si fuera síncrono. Una función marcada con `async` siempre devuelve una promesa. Dentro de ella, `await promesa` pausa esa función (solo esa, no la página) hasta que la promesa se resuelve, y te da directamente su valor.",
        code(
          "async function cargar() {",
          "  try {",
          "    const res = await fetch('/api/posts'); // espera la respuesta",
          "    const posts = await res.json();        // espera a leer el cuerpo",
          "    console.log(posts.length);",
          "  } catch (err) {",
          "    console.log('Error:', err.message);    // equivale al .catch",
          "  } finally {",
          "    console.log('fin');                    // equivale al .finally",
          "  }",
          "}",
        ),
        "Por dentro, cuando el motor llega a un `await`, guarda dónde estaba, sale de la función y deja libre el hilo. Cuando la promesa se resuelve, el resto de la función se mete en la cola de microtareas y continúa por donde iba. Por eso el código que hay después de llamar a `cargar()` se ejecuta antes que lo que hay después del `await`.",
        "Si la promesa se rechaza, `await` lanza el error como si fuera un `throw`, y lo capturas con un `try/catch` normal. Sin `try/catch`, la promesa que devuelve la función queda rechazada y verás \"Uncaught (in promise)\" en la consola.",
        "Errores típicos: usar `await` fuera de una función `async` (en un script normal da `SyntaxError`; solo se permite suelto en módulos); olvidar el `await` y trabajar con la promesa en lugar del valor (`posts.length` da `undefined` porque `posts` es una `Promise`); y creer que `await` congela la página, cuando solo pausa esa función.",
      ),
      example: "async function saludo() { return 'hola'; }\nsaludo().then(console.log); // hola (una función async siempre devuelve promesa)",
      concepts: ['async', 'await', 'try/catch', 'finally', 'Uncaught (in promise)'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'De then a async/await',
        brief: 'Reescribe una cadena de then/catch usando async/await y try/catch.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['async', 'fetch-api'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'none',
          prompt:
            'Reescribe cargarPosts usando async/await y try/catch, sin ningún .then ni .catch. Debe hacer lo mismo: imprimir cuántos posts hay o, si algo falla, "Error:" seguido del mensaje; y al final, pase lo que pase, imprimir "fin".',
          starterCode:
            "function cargarPosts() {\n  fetch('https://jsonplaceholder.typicode.com/posts')\n    .then((res) => res.json())\n    .then((posts) => console.log(posts.length))\n    .catch((err) => console.log('Error:', err.message))\n    .finally(() => console.log('fin'));\n}\n\n// TODO: escribe aquí la versión con async/await\n",
          solution:
            "async function cargarPosts() {\n  try {\n    const res = await fetch('https://jsonplaceholder.typicode.com/posts');\n    const posts = await res.json();\n    console.log(posts.length);\n  } catch (err) {\n    console.log('Error:', err.message);\n  } finally {\n    console.log('fin');\n  }\n}\n\ncargarPosts();\n",
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'fetch: GET, response.ok y por qué un 404 no es un error',
      objective: 'Hacer peticiones GET y POST con fetch, comprobar response.ok y entender cuándo fetch rechaza.',
      theory: p(
        "`fetch(url)` hace una petición HTTP y devuelve una promesa que se cumple con un objeto `Response` en cuanto llegan las cabeceras de la respuesta. Ese objeto trae `status` (el código: 200, 404, 500…), `ok` (`true` si el código está entre 200 y 299) y métodos para leer el cuerpo, como `await response.json()`, que también es asíncrono porque el cuerpo puede seguir llegando.",
        "La trampa número uno: fetch NO rechaza la promesa con un 404 ni con un 500. Para fetch, si el servidor ha contestado, la petición ha ido bien (ha habido respuesta, aunque sea \"no existe\"). Solo rechaza cuando no hay respuesta: sin conexión, dominio que no existe, petición bloqueada por CORS. Por eso tienes que mirar `response.ok` tú y lanzar el error a mano.",
        code(
          "async function cargarUsuario(id) {",
          "  const res = await fetch(`https://api.ejemplo.com/usuarios/${id}`);",
          "  if (!res.ok) {",
          "    throw new Error(`Error HTTP ${res.status}`); // ahora sí irá al catch",
          "  }",
          "  return await res.json();",
          "}",
        ),
        "Por defecto fetch hace GET. Para enviar datos (crear algo) usas un segundo argumento con `method`, `headers` y `body`. El cuerpo debe ser texto, así que el objeto se convierte con `JSON.stringify`, y la cabecera `Content-Type: application/json` le dice al servidor cómo leerlo.",
        code(
          "const res = await fetch('https://api.ejemplo.com/tareas', {",
          "  method: 'POST',",
          "  headers: { 'Content-Type': 'application/json' },",
          "  body: JSON.stringify({ titulo: 'Estudiar fetch', hecha: false }),",
          "});",
          "console.log(res.status); // 201 si el servidor la ha creado",
        ),
        "Errores típicos: olvidar el `await` delante de `res.json()` (tienes una promesa, no los datos); pasar el objeto en `body` sin `JSON.stringify` (llega \"[object Object]\"); y no mirar `res.ok`, de modo que con un 404 tu código intenta pintar datos que no existen.",
      ),
      example: "const res = await fetch('https://jsonplaceholder.typicode.com/users/1');\nconsole.log(res.ok, res.status); // true 200\nconst usuario = await res.json();",
      concepts: ['fetch', 'Response', 'response.ok', 'response.status', 'response.json()', 'POST'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 20,
      challenge: {
        title: 'El 404 que no salta',
        brief: 'Predice qué rama se ejecuta cuando el servidor responde 404.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['fetch-api', 'http', 'async'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            "El servidor responde a esta URL con un 404 (el usuario no existe). ¿Qué imprime?\n\nasync function cargar() {\ntry {\nconst res = await fetch('https://api.ejemplo.com/usuarios/999');\nconsole.log('try', res.ok, res.status);\n} catch (e) {\nconsole.log('catch');\n}\n}\ncargar();",
          quiz: {
            options: [
              { id: 'try404', text: 'try false 404' },
              { id: 'catch', text: 'catch' },
              { id: 'trytrue', text: 'try true 404' },
              { id: 'both', text: 'try false 404 y después catch' },
            ],
            correctIds: ['try404'],
            explanation:
              'fetch solo rechaza si no hay respuesta (error de red, CORS…). Un 404 es una respuesta válida del servidor, así que la promesa se cumple, no se entra en el catch, y res.ok vale false porque 404 no está entre 200 y 299. Para tratar el 404 como error tienes que comprobar res.ok y lanzar tú el error con throw.',
          },
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'Estados de la interfaz y CORS',
      objective: 'Pintar siempre uno de los cuatro estados (cargando, error, vacío, datos) y entender qué es CORS.',
      theory: p(
        "Mientras una petición está en marcha, el usuario está mirando la pantalla. Una interfaz bien hecha no se queda en blanco: en cada momento muestra uno de cuatro estados. Cargando (un spinner o un texto mientras esperas), error (un mensaje claro y, si se puede, un botón de reintentar), vacío (la petición fue bien pero no hay nada: \"Aún no tienes tareas\") y datos (la lista de verdad).",
        "La forma más limpia es guardar el estado en un objeto y decidir qué pintar a partir de él, siempre en el mismo orden de preguntas: ¿estoy cargando? ¿hubo error? ¿la lista está vacía? Si no, hay datos.",
        code(
          "const estado = { cargando: true, error: null, datos: [] };",
          "pintar(estado);                 // muestra 'Cargando…'",
          "try {",
          "  estado.datos = await cargarTareas();",
          "} catch (e) {",
          "  estado.error = e.message;",
          "} finally {",
          "  estado.cargando = false;",
          "  pintar(estado);               // error, vacío o datos",
          "}",
        ),
        "CORS (Cross-Origin Resource Sharing) es la otra cosa que te va a aparecer. Por seguridad, el navegador no deja que el JavaScript de una página lea la respuesta de otro origen (otro dominio, protocolo o puerto) salvo que ese servidor lo permita expresamente con la cabecera `Access-Control-Allow-Origin`. Si tu web en `http://localhost:5173` pide datos a `https://api.otra.com` y esa API no devuelve la cabecera, el navegador bloquea la respuesta y `fetch` rechaza con un `TypeError`.",
        "Lo importante: CORS lo aplica el navegador y se arregla en el servidor (configurándolo para que envíe la cabecera), no en tu JavaScript. Por eso la misma URL funciona desde Postman o desde Node, que no aplican CORS, y falla en tu web. En DevTools > Console lo verás como \"blocked by CORS policy\".",
      ),
      example: "if (estado.cargando) mostrar('Cargando…');\nelse if (estado.error) mostrar('No se pudo cargar: ' + estado.error);\nelse if (estado.datos.length === 0) mostrar('No hay tareas todavía');\nelse mostrarLista(estado.datos);",
      concepts: ['estado de carga', 'estado vacío', 'manejo de errores', 'CORS', 'origen', 'Access-Control-Allow-Origin'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Los cuatro estados',
        brief: 'Escribe una función que diga qué estado de la interfaz toca mostrar.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['async', 'fetch-api'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Completa estadoVista(estado). Debe devolver "cargando" si estado.cargando es true; si no, "error: " seguido del mensaje si estado.error tiene algo; si no, "vacío" si estado.datos está vacío; y si no, "datos: " seguido de cuántos elementos hay. Las cuatro llamadas de abajo deben imprimir:\ncargando\nerror: Error HTTP 500\nvacío\ndatos: 2',
          starterCode:
            "function estadoVista(estado) {\n  // TODO: decide qué estado mostrar (cargando, error, vacío o datos)\n}\n\nconsole.log(estadoVista({ cargando: true, error: null, datos: [] }));\nconsole.log(estadoVista({ cargando: false, error: 'Error HTTP 500', datos: [] }));\nconsole.log(estadoVista({ cargando: false, error: null, datos: [] }));\nconsole.log(estadoVista({ cargando: false, error: null, datos: ['Ana', 'Luis'] }));\n",
          solution:
            "function estadoVista(estado) {\n  if (estado.cargando) return 'cargando';\n  if (estado.error) return 'error: ' + estado.error;\n  if (estado.datos.length === 0) return 'vacío';\n  return 'datos: ' + estado.datos.length;\n}\n\nconsole.log(estadoVista({ cargando: true, error: null, datos: [] }));\nconsole.log(estadoVista({ cargando: false, error: 'Error HTTP 500', datos: [] }));\nconsole.log(estadoVista({ cargando: false, error: null, datos: [] }));\nconsole.log(estadoVista({ cargando: false, error: null, datos: ['Ana', 'Luis'] }));\n",
        },
      },
    },
  ],
};
