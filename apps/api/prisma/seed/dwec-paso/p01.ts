import { type PhaseSeed } from '../content-types.js';

const RUBRIC = [
  { name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true },
];

export const dwecPasoP01: PhaseSeed = {
  code: 'FASE 1',
  title: 'Depurar: encontrar y arreglar errores',
  objective:
    'Dejar de adivinar: leer los mensajes de error, usar las DevTools y VS Code para ver qué pasa de verdad y seguir un método para encontrar cualquier fallo.',
  unlockedSkills: ['js-fundamentos', 'testing-front'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'Tipos de error: no todos gritan',
      objective:
        'Clasificar un fallo como error de sintaxis, de lógica, de datos, de integración o visual para saber dónde buscar.',
      theory: `Antes de arreglar un error conviene saber de qué tipo es, porque cada tipo se busca en un sitio distinto. Hay cinco familias.

Error de sintaxis: has escrito algo que no es JavaScript válido (un paréntesis sin cerrar, una coma de más). El motor no puede ni empezar a ejecutar el fichero, así que no funciona nada y la consola muestra un \`SyntaxError\` con la línea. Es el más fácil: la consola te dice dónde.

Error de lógica: el código se ejecuta sin quejarse, pero hace otra cosa de la que querías. Una suma que debía ser resta, un \`>\` que debía ser \`>=\`, un bucle que empieza en 1 en vez de en 0. La consola no dice nada. Es el más traicionero, y se encuentra comparando lo que esperabas con lo que realmente vale cada variable.

Error de datos: el código está bien, pero le llega algo que no esperaba: un texto en vez de un número, un campo vacío, un \`null\`. Error de integración: cada pieza funciona sola, pero al juntarlas falla (el servidor devuelve \`precio\` y tu código lee \`price\`, o el fichero JS no se carga). Error visual: todo funciona, pero se ve mal; está en el HTML o el CSS, no en el JavaScript.

Error típico del alumno: creer que si la consola no muestra nada en rojo, el código está bien. Los errores de lógica, datos y los visuales no se ven en rojo. Silencio no significa correcto.`,
      example: `Sintaxis:    if (x > 3 {        -> SyntaxError, no se ejecuta nada
Lógica:      total = precio - iva  -> sin error, pero el total está mal
Datos:       '20' + 1              -> '201', esperabas 21
Integración: lees data.price y el servidor manda data.precio -> undefined
Visual:      el botón sale debajo del menú por un z-index`,
      concepts: ['error de sintaxis', 'error de lógica', 'error de datos', 'error de integración', 'error visual'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'Clasifica el fallo',
        brief: 'Identifica el tipo de error a partir de lo que ves.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'Una aplicación de facturas carga sin problemas y la consola no muestra ningún error, pero el total sale 10 € más bajo de lo que debería porque el código resta el IVA en lugar de sumarlo. ¿Qué tipo de error es?',
          quiz: {
            options: [
              { id: 'sintaxis', text: 'Error de sintaxis' },
              { id: 'logica', text: 'Error de lógica' },
              { id: 'visual', text: 'Error visual' },
              { id: 'integracion', text: 'Error de integración' },
            ],
            correctIds: ['logica'],
            multiple: false,
            explanation:
              'El código se ejecuta y no hay mensaje de error, pero el cálculo hace otra cosa de la que se quería: eso es un error de lógica. No es de sintaxis porque entonces no se ejecutaría y la consola lo diría; no es visual porque lo que falla es el valor, no cómo se ve; y no es de integración porque el fallo está en una sola pieza (la operación), no en cómo se comunican dos partes.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'Leer un mensaje de error',
      objective:
        'Entender qué dicen TypeError, ReferenceError y SyntaxError, y usar la línea y la pila para ir al sitio exacto.',
      theory: `Un mensaje de error no es un castigo, es una pista con dirección incluida. Tiene tres partes: el tipo de error, una frase que explica qué pasó y el lugar (fichero y línea, a la derecha en la consola de Chrome, en azul y clicable).

Los tres que más vas a ver: \`ReferenceError: x is not defined\` significa que usas un nombre que no existe (lo escribiste mal o no lo declaraste). \`TypeError\` significa que el nombre existe, pero el valor no permite lo que intentas: leer una propiedad de \`null\` o \`undefined\`, o llamar como función a algo que no lo es. \`SyntaxError\` significa que el código está mal escrito y el motor ni lo ha podido ejecutar.

\`\`\`js
console.log(totl);
// ReferenceError: totl is not defined
const usuario = null;
console.log(usuario.nombre);
// TypeError: Cannot read properties of null (reading 'nombre')
\`\`\`

Lee el segundo con calma: no dice que \`nombre\` esté mal, dice que intentaste leer \`nombre\` de algo que vale \`null\`. El problema está en \`usuario\`, en lo que hay a la izquierda del punto. La pregunta correcta es "¿por qué usuario vale null?".

Debajo del mensaje aparece la pila de llamadas (stack trace): la lista de funciones por las que pasó el programa hasta fallar, de la más reciente a la más antigua. La primera línea te dice dónde explotó; las siguientes, quién llamó a quién. Error típico: buscar el fallo en la línea donde explota cuando el valor malo se creó antes. La pila te ayuda a subir hasta el origen.`,
      example: `Uncaught TypeError: Cannot read properties of undefined (reading 'length')
    at contarLetras (app.js:12:20)
    at procesar (app.js:25:3)
    at app.js:30:1`,
      concepts: ['TypeError', 'ReferenceError', 'SyntaxError', 'stack trace', 'línea del error'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿Qué error salta?',
        brief: 'Predice el tipo de error que lanza un código.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `¿Qué ocurre al ejecutar este código?

const usuario = null;
console.log(usuario.nombre);`,
          quiz: {
            options: [
              { id: 'undef', text: 'Imprime undefined' },
              { id: 'type', text: 'TypeError: Cannot read properties of null (reading \'nombre\')' },
              { id: 'ref', text: 'ReferenceError: nombre is not defined' },
              { id: 'syntax', text: 'SyntaxError, porque no se puede declarar una constante con null' },
            ],
            correctIds: ['type'],
            multiple: false,
            explanation:
              'usuario existe (por eso no es ReferenceError) pero vale null, y null no tiene propiedades: intentar leer .nombre lanza un TypeError. Solo imprimiría undefined si usuario fuera un objeto sin la propiedad nombre, por ejemplo {}. Y const usuario = null es perfectamente válido, así que no hay SyntaxError.',
          },
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'Las DevTools: paneles y DOM en vivo',
      objective:
        'Saber para qué sirve cada panel de las DevTools y entender la diferencia entre el código fuente y el DOM en vivo.',
      theory: `Las DevTools (F12) son un taller con varias herramientas. Cada panel responde a una pregunta distinta, y saber cuál abrir te ahorra mucho tiempo.

Elements: ¿cómo es la página ahora mismo? Muestra el DOM y los estilos aplicados a cada elemento; puedes editarlos en directo para probar. Console: ¿qué errores hay y qué valen las cosas? Muestra mensajes y te deja ejecutar JavaScript. Sources: ¿qué hace mi código paso a paso? Aquí ves tus ficheros y pones puntos de parada. Network: ¿qué se ha pedido al servidor y qué ha respondido? Cada fichero y cada petición, con su código de estado. Application: ¿qué hay guardado? Cookies, \`localStorage\`, \`sessionStorage\`.

Hay una diferencia clave que confunde a todo el mundo. "Ver código fuente" (Ctrl+U) muestra el HTML original tal como llegó del servidor, y nunca cambia. El panel Elements muestra el DOM en vivo: el árbol de objetos que el navegador construyó a partir de ese HTML y que tu JavaScript ha ido modificando.

\`\`\`js
// En el HTML original hay <ul id="lista"></ul> vacía
const li = document.createElement('li');
li.textContent = 'Pan';
document.querySelector('#lista').append(li);
// Ctrl+U: la lista sigue vacía. Elements: aparece <li>Pan</li>
\`\`\`

Error típico: mirar con Ctrl+U para comprobar si tu JavaScript añadió algo y concluir que "no funciona". Para ver el resultado de tu código, mira siempre Elements. Y recuerda que lo que editas a mano en Elements se pierde al recargar: es para probar, luego hay que llevarlo a tus ficheros.`,
      example: `Elements    -> el DOM en vivo y sus estilos
Console     -> errores y pruebas rápidas
Sources     -> tu código y los breakpoints
Network     -> peticiones y códigos de estado
Application -> cookies, localStorage, sessionStorage`,
      concepts: ['DevTools', 'Elements', 'Sources', 'Application', 'DOM en vivo', 'código fuente'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'El elemento invisible',
        brief: 'Explica por qué el código fuente no muestra lo que añadió JavaScript.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos', 'testing-front'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'Tu JavaScript añade un <li> a una lista. En el panel Elements lo ves, pero con "Ver código fuente" (Ctrl+U) la lista aparece vacía. ¿Por qué?',
          quiz: {
            options: [
              { id: 'a', text: 'Porque Ctrl+U muestra el HTML original descargado del servidor, y Elements muestra el DOM actual, ya modificado por JavaScript' },
              { id: 'b', text: 'Porque el código JavaScript tiene un error y el <li> no se ha añadido de verdad' },
              { id: 'c', text: 'Porque Ctrl+U necesita recargar la página para mostrar los cambios del JavaScript' },
              { id: 'd', text: 'Porque Elements muestra una versión antigua guardada en caché' },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'El código fuente es el texto HTML que llegó del servidor y no cambia nunca. JavaScript no modifica ese texto: modifica el DOM, que es lo que muestra Elements. Si el <li> se ve en Elements, se añadió bien (descarta la b). Recargar no ayuda: el HTML original seguiría sin el <li> (descarta la c). Y Elements es justo lo contrario de una caché: es el estado actual (descarta la d).',
          },
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: 'Depurar CSS: por qué no se aplica mi estilo',
      objective:
        'Usar el panel Styles para descubrir si un estilo no se aplica por el selector, por otra regla que gana o por el box model.',
      theory: `Cuando un estilo "no funciona", el CSS casi nunca está roto: o tu regla no llega al elemento, o llega pero otra la pisa. Para saber cuál de las dos, haz clic derecho sobre el elemento, "Inspeccionar", y mira el panel Styles a la derecha de Elements.

Si tu regla no aparece en la lista, el selector no coincide con el elemento: escribiste \`.boton\` y la clase es \`btn\`, usaste \`#menu\` y el id es \`menu-principal\`, o el fichero CSS ni siquiera se cargó (míralo en Network). Si tu regla aparece pero la propiedad está tachada, otra regla la ha sobrescrito. Las DevTools ponen arriba la que gana.

Gana la regla más específica (un id pesa más que una clase, y una clase más que una etiqueta) y, a igual especificidad, la que está escrita después. Ejemplo: \`#cabecera a { color: blue }\` gana a \`.enlace { color: red }\` aunque esta vaya después, porque tiene un id.

El tercer sospechoso es el box model. En Elements, abajo del todo en Styles (o en la pestaña Computed), hay una caja con el margin, el border, el padding y el contenido del elemento. Si algo "ocupa más de lo que debería" o "no se separa", ahí ves de un vistazo qué margen o relleno tiene realmente.

Error típico: arreglarlo todo con \`!important\`. Funciona hoy y te complica mañana, porque luego necesitarás otro \`!important\` para ganarle a ese. Busca qué regla gana y por qué, y ajusta el selector o el orden.`,
      example: `Styles (de arriba abajo, la de arriba gana):
#cabecera a   { color: blue; }
.enlace       { color: red; }   <- "color" aparece tachado`,
      concepts: ['panel Styles', 'especificidad', 'cascada', 'propiedad tachada', 'box model'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'La propiedad tachada',
        brief: 'Explica qué significa una propiedad tachada y cómo lo resolverías.',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['testing-front'],
        rubric: RUBRIC,
        concept: {
          kind: 'short',
          runner: 'none',
          prompt:
            'Escribes .boton { color: red; } pero el botón sigue saliendo azul. Al inspeccionarlo, ves tu regla en el panel Styles con "color: red" tachado. ¿Qué significa que esté tachado y qué pasos seguirías para arreglarlo sin usar !important?',
          solution:
            'Tachado significa que la regla sí se aplica al elemento (el selector coincide), pero otra regla que también le afecta gana y sobrescribe esa propiedad. Pasos: 1) mirar en Styles qué regla está por encima con color sin tachar (la ganadora) y en qué fichero/línea está; 2) entender por qué gana: tiene más especificidad (por ejemplo un id o más clases) o tiene la misma y está escrita después; 3) arreglarlo haciendo mi selector un poco más específico, cambiando el orden de las reglas o modificando la regla ganadora si es la que está mal. !important se evita porque obliga a usar más !important después.',
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'Los errores de siempre',
      objective:
        'Reconocer al momento los fallos más frecuentes: variable no definida, elemento que da null y fichero JS que no se carga.',
      theory: `La mayoría de los errores al empezar en DWEC son siempre los mismos tres. Si los reconoces por su síntoma, los arreglas en un minuto.

Variable no definida: \`ReferenceError: totl is not defined\`. Casi siempre es una errata o una mayúscula: JavaScript distingue mayúsculas, así que \`nombre\` y \`Nombre\` son variables distintas. Otra causa: declarar la variable dentro de una función o un bloque \`{ }\` y usarla fuera. Y ojo: el primer error detiene el script, así que si hay dos erratas solo verás la primera hasta que la arregles.

Elemento no encontrado: \`document.querySelector('#botn')\` no lanza error si no encuentra nada, devuelve \`null\`. El error salta en la línea siguiente, cuando haces \`null.addEventListener(...)\`: \`TypeError: Cannot read properties of null\`. Causas: el selector está mal escrito (falta \`#\` o \`.\`, errata en el id) o el script se ejecuta antes de que exista el elemento (falta \`defer\`).

\`\`\`js
const boton = document.querySelector('#enviar');
console.log(boton); // si sale null, el problema está AQUÍ, no en la línea siguiente
boton.addEventListener('click', enviar);
\`\`\`

Fichero JS que no se carga: no pasa nada al pulsar, ni siquiera tus \`console.log\`. Abre Network y busca \`app.js\`: si sale en rojo con un \`404\`, la ruta del \`src\` está mal (\`js/app.js\` frente a \`app.js\`, mayúsculas en el nombre). La consola también lo avisa con \`Failed to load resource: 404\`.`,
      example: `Síntoma                                  Causa probable
ReferenceError: x is not defined         errata, mayúscula o variable fuera de su bloque
TypeError: ... of null                   querySelector no encontró el elemento
No sale ni un console.log                el .js no se ha cargado (404 en Network)`,
      concepts: ['ReferenceError', 'mayúsculas', 'querySelector devuelve null', '404', 'primer error detiene el script'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Caza las erratas',
        brief: 'Arregla dos ReferenceError para que el programa imprima lo correcto.',
        difficulty: 1,
        timeLimitMinutes: 8,
        skills: ['js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Este código tiene dos errores de nombre que lanzan ReferenceError. Ejecútalo, lee el error, arréglalo y vuelve a ejecutar hasta que imprima exactamente:\nTotal: 30\nHola, Ana\nNo cambies las declaraciones de las variables, solo las líneas que fallan.',
          starterCode: `const precio = 10;
const cantidad = 3;
const total = precio * cantidad;
let nombre = 'Ana';
// TODO: estas dos líneas tienen errores de nombre
console.log('Total: ' + totl);
console.log('Hola, ' + Nombre);`,
          solution: `const precio = 10;
const cantidad = 3;
const total = precio * cantidad;
let nombre = 'Ana';
console.log('Total: ' + total);
console.log('Hola, ' + nombre);`,
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'Breakpoints: parar el tiempo',
      objective:
        'Pausar el código con breakpoints o debugger y avanzar con step over, step into y step out; usar breakpoints condicionales y logpoints en VS Code.',
      theory: `Con \`console.log\` solo ves lo que decidiste imprimir. Con un breakpoint (punto de parada) el programa se congela en una línea y puedes ver el valor de todas las variables en ese instante. En Chrome: panel Sources, abre tu fichero y haz clic en el número de línea. Recarga o repite la acción y el código se detendrá ahí, antes de ejecutar esa línea.

También puedes escribir \`debugger;\` en tu código: si las DevTools están abiertas, el programa se para en esa línea como si hubiera un breakpoint. Es cómodo, pero acuérdate de borrarlo.

Una vez parado, tienes los botones para avanzar. Step over (F10) ejecuta la línea actual entera y pasa a la siguiente; si la línea llama a una función, la ejecuta sin entrar. Step into (F11) entra dentro de la función que se llama en esa línea, para seguirla por dentro. Step out (Mayús+F11) termina la función en la que estás y vuelve a quien la llamó. Resume (F8) sigue hasta el siguiente breakpoint.

\`\`\`js
function calcularIVA(precio) {
  return precio * 0.21;         // Step into te trae aquí
}
const iva = calcularIVA(100);   // <- parado aquí
console.log(iva);               // Step over te trae aquí
\`\`\`

En VS Code (y también en Chrome, con clic derecho en el número de línea) hay dos variantes muy útiles. El breakpoint condicional solo se para si se cumple una condición, por ejemplo \`i === 734\`: perfecto cuando un bucle falla en una vuelta concreta de entre mil. El logpoint no para el programa: imprime un mensaje en la consola, como un \`console.log\` que no ensucia tu código.`,
      example: `F8         Resume: sigue hasta el próximo breakpoint
F10        Step over: ejecuta la línea sin entrar en funciones
F11        Step into: entra en la función de esta línea
Mayús+F11  Step out: acaba la función y vuelve a quien la llamó`,
      concepts: ['breakpoint', 'debugger', 'step over', 'step into', 'step out', 'breakpoint condicional', 'logpoint'],
      tools: ['DevTools', 'VS Code'],
      estimatedTimeMinutes: 18,
      challenge: {
        title: 'Entrar en la función',
        brief: 'Elige el botón correcto para seguir el código por dentro de una función.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['js-fundamentos', 'testing-front'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: `El depurador está parado en la línea marcada. Sospechas que el fallo está dentro de calcularIVA y quieres ver sus líneas una a una. ¿Qué botón pulsas?

function calcularIVA(precio) {
  return precio * 0.21;
}
const iva = calcularIVA(100);   // <- parado aquí
console.log(iva);`,
          quiz: {
            options: [
              { id: 'over', text: 'Step over (F10)' },
              { id: 'into', text: 'Step into (F11)' },
              { id: 'out', text: 'Step out (Mayús+F11)' },
              { id: 'resume', text: 'Resume (F8)' },
            ],
            correctIds: ['into'],
            multiple: false,
            explanation:
              'Step into entra dentro de la función que se llama en la línea actual, así que te lleva a return precio * 0.21. Step over ejecutaría calcularIVA entera sin enseñártela y pararía en console.log. Step out sirve para salir de la función en la que ya estás, y aquí no estás dentro de ninguna. Resume seguiría hasta el siguiente breakpoint sin detenerse dentro.',
          },
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'El panel Network y los códigos de estado',
      objective:
        'Usar el panel Network para ver cada petición y entender qué significa su código de estado.',
      theory: `Cuando tu página habla con un servidor (para cargar un fichero o pedir datos con \`fetch\`), el panel Network es el único sitio donde ves la conversación real: qué se pidió, a qué URL, con qué método, qué respondió el servidor y cuánto tardó. Ábrelo antes de recargar; si lo abres después, no habrá registrado nada.

Cada fila es una petición. Al hacer clic en una ves sus pestañas: Headers (URL, método y código de estado), Payload (lo que enviaste), Preview y Response (lo que te devolvió). Si tu código "no recibe datos", aquí descubres si es que el servidor no los mandó o si es que tu código los lee mal.

El código de estado es un número de tres cifras, y la primera cifra ya te dice de quién es la culpa. 2xx: todo bien (\`200 OK\`, \`201 Created\`). 3xx: redirección, el recurso está en otro sitio (\`301\`, \`304 Not Modified\` si se usó la caché). 4xx: el error es del cliente, de tu petición (\`400\` datos mal formados, \`401\` no has iniciado sesión, \`403\` no tienes permiso, \`404\` no existe). 5xx: el error es del servidor (\`500\` su código ha fallado, \`503\` no está disponible).

Error típico: ver un \`404\` y ponerse a revisar el servidor. Un 404 casi siempre es una URL mal escrita en tu código (\`/api/producto\` en vez de \`/api/productos\`). Y al revés: con un \`500\` no tiene sentido cambiar tu JavaScript una y otra vez; el fallo está en el servidor y hay que mirar sus logs.`,
      example: `200 OK            todo bien
201 Created       se creó el recurso
304 Not Modified  usa la copia de la caché
400 Bad Request   datos de la petición mal formados
401 / 403         sin sesión / sin permiso
404 Not Found     la URL no existe
500               falló el código del servidor`,
      concepts: ['panel Network', 'código de estado', '2xx', '4xx', '5xx', '404'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: '¿De quién es la culpa?',
        brief: 'Interpreta un código de estado del panel Network.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['testing-front'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'En el panel Network ves que la petición a /api/productos ha devuelto un código 500. ¿Qué significa?',
          quiz: {
            options: [
              { id: 'url', text: 'Que la URL no existe: hay una errata en la ruta' },
              { id: 'srv', text: 'Que el servidor recibió la petición pero su propio código falló al procesarla' },
              { id: 'auth', text: 'Que no has iniciado sesión' },
              { id: 'ok', text: 'Que todo ha ido bien y los datos están en la respuesta' },
            ],
            correctIds: ['srv'],
            multiple: false,
            explanation:
              'Los códigos 5xx indican un fallo del servidor; el 500 en concreto es un error interno de su código. Una URL inexistente daría 404, no haber iniciado sesión daría 401, y que todo vaya bien daría 200. Con un 500 hay que revisar el servidor y sus logs, no tu JavaScript.',
          },
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'Un método para cualquier error',
      objective:
        'Seguir los pasos reproducir, aislar, formular una hipótesis y comprobarla en vez de cambiar cosas al azar.',
      theory: `La diferencia entre quien depura rápido y quien se pasa la tarde cambiando cosas a ver si suena la flauta no es el talento: es el método. Cuatro pasos.

1. Reproducir: consigue que el error ocurra siempre, con unos pasos concretos. "A veces falla" no se puede arreglar; "falla al añadir un producto con cantidad 0" sí. 2. Aislar: reduce el sitio donde puede estar. Pon un \`console.log\` o un breakpoint a mitad del camino: si ahí el valor ya está mal, el fallo está antes; si está bien, está después. Repite partiendo por la mitad.

3. Hipótesis: di en una frase qué crees que pasa ("el bucle se salta el primer elemento"). 4. Comprobar: haz una prueba que confirme o descarte esa hipótesis antes de tocar nada. Si se confirma, arregla y vuelve a reproducir para ver que ya no falla. Si no, nueva hipótesis.

\`\`\`js
function media(notas) {
  let suma = 0;
  for (let i = 1; i < notas.length; i++) {
    suma += notas[i];
  }
  return suma / notas.length;
}
console.log(media([4, 6, 8])); // 4.666666666666667 (esperabas 6)
\`\`\`

Aplicado: reproduces con \`[4, 6, 8]\`. Aíslas poniendo \`console.log(suma)\` antes del \`return\`: sale \`14\` en vez de \`18\`, así que la división está bien y el fallo está en la suma. Hipótesis: falta un número, el 4, el primero. Compruebas imprimiendo \`i\` en el bucle: empieza en 1. Arreglas (\`let i = 0\`) y vuelves a ejecutar.

Error típico: cambiar tres cosas a la vez. Si se arregla, no sabes cuál fue; si se rompe otra cosa, tampoco. Un cambio, una comprobación.`,
      example: `Reproducir -> pasos exactos que provocan el fallo
Aislar     -> ¿el valor ya está mal aquí? parte el camino por la mitad
Hipótesis  -> "creo que pasa X porque Y"
Comprobar  -> una prueba que lo confirme o lo descarte; luego, un solo cambio`,
      concepts: ['reproducir', 'aislar', 'hipótesis', 'comprobar', 'búsqueda binaria'],
      tools: ['DevTools', 'VS Code'],
      estimatedTimeMinutes: 18,
      challenge: {
        title: 'La media que no cuadra',
        brief: 'Usa console.log para encontrar el fallo de la función media y arréglalo.',
        difficulty: 2,
        timeLimitMinutes: 12,
        skills: ['js-fundamentos', 'testing-front'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'media([4, 6, 8]) debería dar 6 pero da otra cosa. Añade console.log para ver qué vale suma antes del return, localiza el fallo, arréglalo y deja el programa imprimiendo solo el resultado correcto: 6. Explica en un comentario cuál era el fallo.',
          starterCode: `function media(notas) {
  let suma = 0;
  for (let i = 1; i < notas.length; i++) {
    suma += notas[i];
  }
  // TODO: comprueba qué vale suma aquí
  return suma / notas.length;
}
console.log(media([4, 6, 8])); // debería ser 6`,
          solution: `function media(notas) {
  let suma = 0;
  // Fallo: el bucle empezaba en i = 1 y se saltaba el primer elemento (suma daba 14, no 18)
  for (let i = 0; i < notas.length; i++) {
    suma += notas[i];
  }
  return suma / notas.length;
}
console.log(media([4, 6, 8])); // 6`,
        },
      },
    },
  ],
};
