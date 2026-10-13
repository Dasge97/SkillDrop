import { type PhaseSeed } from '../content-types.js';

const RUBRIC = [
  { name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true },
];

export const dwecPasoP15: PhaseSeed = {
  code: 'FASE 15',
  title: 'Seguridad en el cliente y proyecto final',
  objective:
    'Asumir que el cliente no es de fiar, evitar los fallos de seguridad típicos del frontend (XSS, tokens, claves, dependencias) y saber montar, versionar y desplegar un proyecto final full-stack.',
  unlockedSkills: ['seguridad-web', 'despliegue'],
  projects: [
    'Proyecto final full-stack: frontend Vue (Vite) + API REST + base de datos, versionado en GitHub con README y frontend desplegado en un hosting estático.',
  ],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: 'Regla de oro: el cliente no es de fiar',
      objective:
        'Entender que todo lo que llega al navegador lo puede ver y cambiar el usuario, y que por eso los secretos nunca van en el frontend.',
      theory: `Todo el código del frontend se descarga en el ordenador del usuario. Eso significa que el usuario puede leerlo (pestaña Fuentes de las DevTools), cambiar variables mientras se ejecuta (Consola), editar el HTML (Elementos), modificar lo que hay en \`localStorage\` y hasta fabricar peticiones a tu API sin usar tu página, con \`curl\` o Postman. Da igual que el código esté minificado: se puede leer con paciencia.

De ahí sale la regla de oro: el cliente no es de fiar. Ocultar un botón con \`v-if\`, desactivar un input o comprobar \`if (usuario.rol === 'admin')\` en el navegador sirve para que la interfaz sea cómoda, pero NO protege nada. La protección de verdad está siempre en el servidor, que es el único sitio que el usuario no controla.

La consecuencia más importante: nunca pongas claves secretas en el frontend (la clave de la API de OpenAI, la de Stripe, la contraseña de la base de datos). Error típico en proyectos con Vite: meter la clave en el \`.env\` como \`VITE_OPENAI_KEY\` creyendo que así está escondida.

\`\`\`js
// .env  ->  VITE_OPENAI_KEY=sk-abc123...
const clave = import.meta.env.VITE_OPENAI_KEY
// Vite SUSTITUYE esto por el texto de la clave al hacer el build.
// La clave acaba dentro de dist/assets/index-xxxx.js, visible para cualquiera.
\`\`\`

Las variables \`VITE_\` son para configuración PÚBLICA (por ejemplo, la URL de tu API). Lo correcto con un servicio de pago es que tu frontend llame a TU servidor, y que sea el servidor (que guarda la clave en su propio \`.env\`, sin publicar) quien llame al servicio externo. Así la clave nunca sale del servidor y además puedes limitar cuántas peticiones hace cada usuario.

Las claves "publicables" sí pueden ir en el frontend (la clave pública de Stripe, la de Google Maps restringida a tu dominio): están diseñadas para eso. Si el proveedor la llama "secret", va al servidor.`,
      example: `// MAL (frontend): fetch('https://api.openai.com/...', { headers: { Authorization: 'Bearer sk-...' } })
// BIEN (frontend): fetch('/api/resumir', { method: 'POST', body: JSON.stringify({ texto }) })
// y el servidor es quien usa la clave secreta`,
      concepts: ['el cliente no es de fiar', 'DevTools', 'claves secretas', 'import.meta.env', 'variables VITE_'],
      tools: ['DevTools', 'Vite'],
      estimatedTimeMinutes: 14,
      challenge: {
        title: '¿Dónde va la clave secreta?',
        brief: 'Decide dónde guardar la clave secreta de una API de pago.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['seguridad-web'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'Tu app Vue usa una API de inteligencia artificial de pago que necesita una clave secreta. ¿Dónde debe estar esa clave para que los usuarios no puedan verla?',
          quiz: {
            options: [
              { id: 'env', text: 'En el .env del proyecto Vite como VITE_API_KEY' },
              { id: 'ofuscada', text: 'En el código del frontend, pero ofuscada o partida en trozos' },
              { id: 'servidor', text: 'Solo en el servidor (backend): el frontend llama a tu API y es el servidor quien llama al servicio con la clave' },
              { id: 'local', text: 'En localStorage, guardada la primera vez que se abre la app' },
            ],
            correctIds: ['servidor'],
            explanation:
              'Todo lo que llega al navegador lo puede leer el usuario. Las variables VITE_ se copian dentro del JavaScript al hacer el build; ofuscar solo retrasa al curioso, porque la clave tiene que acabar en una petición que se ve en la pestaña Red; y localStorage se lee desde la consola. La única opción segura es que la clave viva en el servidor y el frontend nunca la toque.',
          },
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'Validar en el cliente es comodidad; la de verdad, en el servidor',
      objective:
        'Distinguir para qué sirve la validación en el cliente y por qué el servidor tiene que volver a validarlo todo.',
      theory: `En las fases de formularios aprendiste a validar en el navegador: \`required\`, \`minlength\`, \`type="email"\` y comprobaciones con JavaScript. Eso está muy bien, pero hay que tener claro PARA QUÉ sirve: para que el usuario honrado se entere al momento de que se ha equivocado, sin esperar a la respuesta del servidor. Es una mejora de experiencia de usuario, no una medida de seguridad.

¿Por qué no protege? Porque el usuario puede quitar el atributo \`required\` desde Elementos, desactivar JavaScript, o saltarse el formulario entero mandando la petición con \`curl\`. El servidor recibe un JSON y no tiene forma de saber si pasó por tu validación o no. Por eso el servidor tiene que validarlo TODO otra vez, como si el cliente no existiera.

Un caso clásico: una tienda que manda el precio desde el navegador.

\`\`\`js
// El frontend envía:
{ producto: 'camiseta', cantidad: 2, precio: 15 }
// Un usuario lo cambia en DevTools y envía:
{ producto: 'camiseta', cantidad: 2, precio: 0.01 }
// Si el servidor usa ese precio, acabas de vender camisetas a 1 céntimo.
\`\`\`

La solución no es "validar mejor en el cliente", sino que el servidor NO SE CREA datos que puede calcular él: el precio sale de su base de datos, el usuario que hace el pedido sale de su sesión (no de un campo \`userId\` del formulario) y la cantidad se comprueba (número entero, mayor que 0, con un máximo razonable).

Resumen para recordar: misma validación en los dos lados, por motivos distintos. En el cliente, para ayudar al usuario. En el servidor, para protegerte. Si solo puedes hacer una, la del servidor es la obligatoria.`,
      example: `// Cliente: aviso rápido
if (cantidad < 1) mostrarError('Mínimo 1 unidad')
// Servidor: decisión final (el precio lo pone él)
const total = catalogo[producto] * cantidad`,
      concepts: ['validación en cliente', 'validación en servidor', 'experiencia de usuario', 'manipulación de peticiones'],
      tools: ['DevTools', 'Postman'],
      estimatedTimeMinutes: 14,
      challenge: {
        title: 'Valida un pedido como lo haría el servidor',
        brief: 'Escribe la validación del servidor que no se fía del precio que manda el cliente.',
        difficulty: 2,
        timeLimitMinutes: 12,
        skills: ['seguridad-web', 'forms'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Completa validarPedido(pedido) como si fuera el servidor. Debe devolver "ERROR: producto no existe" si el producto no está en CATALOGO, "ERROR: cantidad no válida" si la cantidad no es un número entero entre 1 y 10, y si todo está bien "OK: total " + total, calculando el total con el precio del CATALOGO e IGNORANDO el precio que mande el cliente. Las cuatro llamadas deben imprimir:\nOK: total 30\nOK: total 30\nERROR: cantidad no válida\nERROR: producto no existe',
          starterCode: `const CATALOGO = { camiseta: 15, gorra: 10 };

function validarPedido(pedido) {
  // TODO: comprueba que el producto existe en CATALOGO
  // TODO: comprueba que la cantidad es un entero entre 1 y 10
  // TODO: calcula el total con el precio del CATALOGO
}

console.log(validarPedido({ producto: 'camiseta', cantidad: 2, precio: 15 }));
console.log(validarPedido({ producto: 'camiseta', cantidad: 2, precio: 0.01 }));
console.log(validarPedido({ producto: 'gorra', cantidad: -3 }));
console.log(validarPedido({ producto: 'reloj', cantidad: 1 }));`,
          solution: `const CATALOGO = { camiseta: 15, gorra: 10 };

function validarPedido(pedido) {
  if (!Object.hasOwn(CATALOGO, pedido.producto)) {
    return 'ERROR: producto no existe';
  }
  if (!Number.isInteger(pedido.cantidad) || pedido.cantidad < 1 || pedido.cantidad > 10) {
    return 'ERROR: cantidad no válida';
  }
  // El precio del cliente se ignora: manda el catálogo del servidor
  const total = CATALOGO[pedido.producto] * pedido.cantidad;
  return 'OK: total ' + total;
}

console.log(validarPedido({ producto: 'camiseta', cantidad: 2, precio: 15 }));   // OK: total 30
console.log(validarPedido({ producto: 'camiseta', cantidad: 2, precio: 0.01 })); // OK: total 30
console.log(validarPedido({ producto: 'gorra', cantidad: -3 }));                 // ERROR: cantidad no válida
console.log(validarPedido({ producto: 'reloj', cantidad: 1 }));                  // ERROR: producto no existe`,
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'XSS: cuando innerHTML ejecuta código ajeno',
      objective:
        'Entender cómo se produce un XSS al meter texto del usuario con innerHTML y cómo evitarlo con textContent o escapando.',
      theory: `XSS (Cross-Site Scripting) es cuando un atacante consigue que SU JavaScript se ejecute en TU página, en el navegador de otros usuarios. Desde ahí puede hacer todo lo que haga tu código: leer el \`localStorage\` (y robar el token de sesión), hacer peticiones a tu API en nombre de la víctima o cambiar la página para pedir la contraseña.

¿Cómo ocurre? Casi siempre igual: texto que viene del usuario (un comentario, un nombre, un parámetro de la URL) se mete en la página con \`innerHTML\`. \`innerHTML\` no inserta texto: le pide al navegador que lo INTERPRETE como HTML.

\`\`\`js
const comentario = '<img src="x" onerror="alert(document.cookie)">';
caja.innerHTML = comentario;    // el navegador crea un <img>, falla al cargar "x" y ejecuta onerror
caja.textContent = comentario;  // se ve el texto tal cual, no se ejecuta nada
\`\`\`

Fíjate en que el ataque no usa \`<script>\`: los navegadores no ejecutan los \`<script>\` insertados con \`innerHTML\`, pero sí los atributos de eventos como \`onerror\` u \`onclick\`. Por eso "filtrar la palabra script" no sirve como defensa.

Cómo evitarlo: (1) para mostrar texto usa \`textContent\` o crea los nodos con \`createElement\`; (2) en Vue, \`{{ }}\` ya escapa el texto por ti, el peligro está en \`v-html\`, que es el \`innerHTML\` de Vue; (3) si necesitas construir HTML a mano, escapa los caracteres especiales (\`&\`, \`<\`, \`>\`, \`"\`, \`'\`) convirtiéndolos en entidades como \`&lt;\`. Error típico al escapar: no empezar por \`&\`; si lo haces al final, convertirás el \`&lt;\` que acabas de crear en \`&amp;lt;\`.

Si de verdad necesitas mostrar HTML que escribe un usuario (un editor de texto enriquecido), se pasa por una librería que lo limpia, como DOMPurify. Y recuerda que el servidor también debe tratar esos datos con cuidado: el XSS se guarda en la base de datos y ataca a todos los que vean el comentario.`,
      example: `// Seguro: crear el nodo y meter TEXTO
const li = document.createElement('li');
li.textContent = comentarioDelUsuario;
lista.append(li);`,
      concepts: ['XSS', 'innerHTML', 'textContent', 'escapar HTML', 'v-html', 'entidades HTML'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 16,
      challenge: {
        title: 'Escribe tu función escaparHTML',
        brief: 'Convierte los caracteres peligrosos en entidades HTML.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['seguridad-web', 'dom'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Completa escaparHTML(texto) para que sustituya & por &amp;, < por &lt;, > por &gt;, " por &quot; y \' por &#39; (empezando por &). Las dos llamadas deben imprimir:\n&lt;img src=x onerror=&quot;alert(1)&quot;&gt;\nTom &amp; Jerry',
          starterCode: `function escaparHTML(texto) {
  // TODO: usa replaceAll; el & tiene que ir el primero
}

console.log(escaparHTML('<img src=x onerror="alert(1)">'));
console.log(escaparHTML('Tom & Jerry'));`,
          solution: `function escaparHTML(texto) {
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

console.log(escaparHTML('<img src=x onerror="alert(1)">')); // &lt;img src=x onerror=&quot;alert(1)&quot;&gt;
console.log(escaparHTML('Tom & Jerry'));                    // Tom &amp; Jerry`,
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: '¿Dónde guardo el token? localStorage vs cookies httpOnly',
      objective:
        'Conocer las dos formas habituales de guardar la sesión en el cliente, qué riesgo tiene cada una y cómo se mitiga.',
      theory: `Cuando el usuario inicia sesión, el servidor le da algo que demuestra quién es en las siguientes peticiones: un token (por ejemplo, un JWT) o un identificador de sesión. Ese "algo" es como la llave de su cuenta: quien lo tenga, ES ese usuario. La pregunta es dónde lo guarda el navegador.

Opción 1: \`localStorage\`. Es lo más sencillo: lo guardas tras el login y lo añades tú en cada \`fetch\` con la cabecera \`Authorization: Bearer ...\`. El problema: cualquier JavaScript de tu página puede leerlo con \`localStorage.getItem('token')\`. Si tienes un solo XSS (o una librería de npm comprometida), el atacante se lleva el token y puede usar la cuenta desde su ordenador.

Opción 2: cookie \`httpOnly\`. El servidor la crea con una cabecera de respuesta, y el navegador la guarda y la envía SOLA en cada petición a ese dominio. Con el atributo \`HttpOnly\`, JavaScript NO puede leerla (\`document.cookie\` no la muestra), así que un XSS no puede robarla.

\`\`\`js
// Cabecera que manda el servidor tras el login:
// Set-Cookie: sesion=abc123; HttpOnly; Secure; SameSite=Lax; Path=/
// En el frontend NO tocas la cookie; solo pides que se envíe:
fetch('https://api.mitienda.com/pedidos', { credentials: 'include' })
\`\`\`

Pero no es gratis: como el navegador la manda automáticamente, otra web podría provocar una petición a tu API con la cookie de la víctima (CSRF). Se mitiga con \`SameSite=Lax\` o \`Strict\` (la cookie no se envía desde otros sitios) y, en operaciones delicadas, con un token anti-CSRF. \`Secure\` hace que solo viaje por HTTPS.

Resumen honesto: la cookie \`HttpOnly\` + \`Secure\` + \`SameSite\` es la opción más robusta para webs; \`localStorage\` es aceptable en proyectos sencillos si cuidas mucho el XSS. Lo que nunca protege nada es "esconder" el token: si JS puede leerlo, un XSS también. Y en cualquier caso, un XSS sigue pudiendo hacer peticiones desde la página de la víctima; la cookie evita que se lleve la llave, no que la use mientras está ahí.`,
      example: `// localStorage: tu código añade el token
fetch('/api/pedidos', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
// cookie httpOnly: el navegador la añade solo
fetch('/api/pedidos', { credentials: 'include' })`,
      concepts: ['token / JWT', 'localStorage', 'cookie HttpOnly', 'Secure', 'SameSite', 'CSRF'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 16,
      challenge: {
        title: 'La ventaja de HttpOnly',
        brief: '¿Qué gana una cookie HttpOnly frente a localStorage?',
        difficulty: 2,
        timeLimitMinutes: 6,
        skills: ['seguridad-web', 'http'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            '¿Cuál es la principal ventaja de seguridad de guardar el token de sesión en una cookie con el atributo HttpOnly en lugar de en localStorage?',
          quiz: {
            options: [
              { id: 'cifrada', text: 'La cookie se guarda cifrada en el disco y nadie puede verla' },
              { id: 'js', text: 'JavaScript no puede leerla, así que un ataque XSS no puede robar el token' },
              { id: 'todo', text: 'Protege contra todos los ataques, incluido CSRF, sin hacer nada más' },
              { id: 'espacio', text: 'Cabe más información que en localStorage' },
            ],
            correctIds: ['js'],
            explanation:
              'HttpOnly impide que document.cookie (y cualquier script) lea la cookie, así que un XSS no puede llevarse el token. No la cifra: el propio usuario la ve en DevTools > Aplicación. No protege de CSRF por sí sola (para eso está SameSite o un token anti-CSRF), y una cookie admite unos 4 KB, mucho menos que localStorage.',
          },
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'CORS, CSP y HTTPS: qué protege cada uno',
      objective:
        'Entender qué protege CORS y qué no, y la idea de CSP y HTTPS.',
      theory: `CORS es el error que todos os habéis encontrado: "blocked by CORS policy". Por defecto, el navegador aplica la política del mismo origen: una página de \`https://mitienda.com\` puede HACER una petición a \`https://otra-api.com\`, pero el navegador NO deja que el JavaScript lea la respuesta, salvo que esa API diga expresamente que lo permite con la cabecera \`Access-Control-Allow-Origin\`. Eso es CORS: un mecanismo para que el servidor RELAJE esa restricción para ciertos orígenes.

¿Qué protege? Al usuario. Imagina que estás logueado en tu banco y entras en una web maliciosa: sin esta política, su JavaScript podría hacer \`fetch\` a tu banco (con tus cookies) y leer tus movimientos. El navegador lo impide.

¿Qué NO protege? Tu API. CORS lo aplica el NAVEGADOR, no el servidor. Desde \`curl\`, Postman, un script de Python u otro servidor no existe CORS: la API responde a cualquiera. Error típico: pensar que "como solo permito CORS desde mi dominio, nadie más puede usar mi API". Para eso necesitas autenticación y validación en el servidor. Y el otro error típico: "arreglar" el error poniendo \`Access-Control-Allow-Origin: *\` sin pensar; lo correcto es permitir solo el origen de tu frontend.

\`\`\`js
// Cabeceras de respuesta de la API (las pone el SERVIDOR, no el frontend):
// Access-Control-Allow-Origin: https://mitienda.com
// Access-Control-Allow-Credentials: true
// Content-Security-Policy: default-src 'self'; script-src 'self'
\`\`\`

CSP (Content Security Policy) es una cabecera con la que el servidor le dice al navegador de dónde puede cargar scripts, estilos o imágenes. Con \`script-src 'self'\`, el navegador solo ejecuta scripts de tu propio dominio y bloquea los scripts en línea y los atributos tipo \`onerror\`: aunque un atacante consiga inyectar HTML, su código no se ejecuta. Es una segunda capa contra XSS, no sustituye a usar \`textContent\`.

HTTPS cifra la comunicación entre el navegador y el servidor. Sin él, cualquiera en la misma red (el wifi de una cafetería) puede leer y modificar lo que viaja: contraseñas, tokens, el propio JavaScript. Hoy es obligatorio: los hostings lo dan gratis (Let's Encrypt) y muchas APIs del navegador (geolocalización, service workers, cookies \`Secure\`) solo funcionan con HTTPS.`,
      example: `Error típico en la consola:
Access to fetch at 'https://api.com/datos' from origin 'http://localhost:5173'
has been blocked by CORS policy
-> se arregla en el SERVIDOR (permitiendo ese origen), no en el fetch.`,
      concepts: ['política del mismo origen', 'CORS', 'Access-Control-Allow-Origin', 'CSP', 'HTTPS'],
      tools: ['DevTools', 'Postman'],
      estimatedTimeMinutes: 16,
      challenge: {
        title: 'CORS y Postman',
        brief: '¿CORS impide que alguien use tu API desde fuera del navegador?',
        difficulty: 2,
        timeLimitMinutes: 6,
        skills: ['seguridad-web', 'http'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'Tu API solo permite CORS desde https://mitienda.com (Access-Control-Allow-Origin: https://mitienda.com) y no pide ninguna autenticación. Alguien hace una petición GET a tu API con Postman desde su ordenador. ¿Qué ocurre?',
          quiz: {
            options: [
              { id: 'bloquea', text: 'El servidor rechaza la petición porque no viene de mitienda.com' },
              { id: 'funciona', text: 'La petición funciona y recibe los datos: CORS lo aplica el navegador, no protege la API de otros clientes' },
              { id: 'vacia', text: 'Recibe una respuesta vacía porque falta la cabecera Origin' },
              { id: 'error', text: 'Postman muestra el error "blocked by CORS policy"' },
            ],
            correctIds: ['funciona'],
            explanation:
              'CORS es una regla que aplica el navegador para decidir si el JavaScript de una página puede leer la respuesta. El servidor responde igual a todo el mundo; Postman, curl u otro servidor no aplican CORS, así que reciben los datos. Para proteger la API hace falta autenticación y validación en el servidor, no CORS.',
          },
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'Dependencias de npm y npm audit',
      objective:
        'Entender que cada paquete de npm es código ajeno que se ejecuta en tu app, y cómo revisar vulnerabilidades conocidas con npm audit.',
      theory: `Cuando haces \`npm install vue\`, no instalas un paquete: instalas ese paquete y todas sus dependencias, y las dependencias de esas dependencias (las transitivas). Un proyecto de Vite recién creado ya tiene cientos de carpetas en \`node_modules\`. Todo ese código lo ha escrito gente que no conoces, y lo que acaba en el bundle se ejecuta en el navegador de tus usuarios con los mismos permisos que tu propio código.

Los riesgos reales son dos. Uno: paquetes con vulnerabilidades conocidas (un fallo que permite XSS o que se cuelgue el servidor) que ya están arreglados en una versión más nueva, pero tú sigues con la vieja. Dos: paquetes maliciosos, por ejemplo con nombres casi iguales a los buenos (\`vuee\`, \`expres\`) o paquetes legítimos cuyo autor ha sido hackeado.

\`\`\`js
// En la terminal:
// npm audit          -> lista vulnerabilidades conocidas en tus dependencias
// npm audit fix      -> actualiza a versiones compatibles que las corrigen
// npm outdated       -> muestra qué paquetes tienen versiones más nuevas
// npm ci             -> instala EXACTAMENTE lo del package-lock.json (ideal en despliegue)
\`\`\`

\`npm audit\` compara las versiones de tu \`package-lock.json\` con una base de datos pública de vulnerabilidades y te dice el paquete, la gravedad (low, moderate, high, critical) y si hay arreglo. No revisa TU código ni detecta paquetes maliciosos nuevos: solo fallos ya conocidos y publicados. \`npm audit fix --force\` puede saltar a versiones mayores con cambios incompatibles, así que úsalo con cuidado y prueba la app después.

Buenas costumbres: instala solo lo que necesites (no hace falta una librería para poner un texto en mayúsculas), comprueba el nombre exacto y que el paquete sea conocido antes de instalarlo, sube el \`package-lock.json\` a Git (fija las versiones exactas para todos) y nunca subas \`node_modules\`. Error típico: ver avisos en \`npm install\` y no leerlos nunca.`,
      example: `$ npm audit
# 2 vulnerabilities (1 moderate, 1 high)
# To address all issues, run: npm audit fix`,
      concepts: ['dependencias transitivas', 'npm audit', 'package-lock.json', 'vulnerabilidad conocida', 'typosquatting'],
      tools: ['npm', 'Node.js'],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Qué hace npm audit?',
        brief: 'Saber exactamente qué revisa y qué no revisa npm audit.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['seguridad-web', 'despliegue'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: '¿Qué hace el comando `npm audit`?',
          quiz: {
            options: [
              { id: 'codigo', text: 'Revisa tu propio código buscando errores y fallos de seguridad' },
              { id: 'deps', text: 'Compara tus dependencias (también las indirectas) con una base de datos de vulnerabilidades conocidas y te dice cuáles están afectadas' },
              { id: 'actualiza', text: 'Actualiza todos los paquetes a su última versión mayor' },
              { id: 'borra', text: 'Borra de node_modules los paquetes que no usas' },
            ],
            correctIds: ['deps'],
            explanation:
              'npm audit analiza el árbol de dependencias de tu package-lock.json (directas y transitivas) contra una base de datos pública de vulnerabilidades ya conocidas. No analiza tu código, no actualiza nada por sí solo (eso lo intenta npm audit fix, y sin --force respeta los rangos compatibles) y no borra paquetes.',
          },
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'Proyecto final: cómo se reparte una app y cómo se versiona con Git',
      objective:
        'Entender el reparto de una app full-stack (frontend, API, base de datos) y usar el flujo básico de Git y GitHub.',
      theory: `Una app full-stack típica tiene tres piezas separadas. El frontend (tu app Vue) se ejecuta en el navegador: pinta la interfaz y llama a la API con \`fetch\`. La API (Node con Express, PHP, Java...) se ejecuta en un servidor: valida, aplica las reglas de negocio, comprueba quién es el usuario y habla con la base de datos. La base de datos (MySQL, PostgreSQL, MongoDB) guarda los datos y SOLO la toca la API, nunca el navegador. Con todo lo visto en esta fase entiendes por qué: el navegador no es de fiar.

\`\`\`js
// Navegador (Vue)  --fetch JSON-->  API (servidor)  --SQL-->  Base de datos
// Lo que va en cada sitio:
// Frontend: vistas, componentes, validación cómoda, URL pública de la API
// API: validación de verdad, autenticación, claves secretas, permisos
// BD: los datos; usuario y contraseña de la BD solo en el .env de la API
\`\`\`

Para trabajar con orden (y para que tu profesor vea tu historia) se usa Git. Git guarda "fotos" del proyecto llamadas commits. El ciclo diario es: cambias ficheros, eliges cuáles entran en la foto con \`git add\`, haces la foto con \`git commit -m "mensaje"\` y la subes a GitHub con \`git push\`. Para traerte lo que han subido otros, \`git pull\`.

\`\`\`js
// git init                      -> convierte la carpeta en repositorio (una vez)
// git status                    -> qué ha cambiado
// git add .                     -> prepara los cambios (staging)
// git commit -m "Añade login"   -> crea el commit en TU ordenador
// git push                      -> sube los commits a GitHub
// git switch -c login           -> crea una rama "login" y se cambia a ella
\`\`\`

Las ramas sirven para trabajar en algo nuevo sin romper lo que funciona: haces la funcionalidad en la rama \`login\` y, cuando está lista, la unes a \`main\` (con un merge o un Pull Request en GitHub). Errores típicos: hacer un solo commit gigante el último día (haz commits pequeños con mensajes que digan qué cambia), creer que \`git commit\` ya sube a GitHub (no: hasta el \`push\` solo está en tu ordenador) y subir \`node_modules\` o el \`.env\` con contraseñas. Para evitarlo, crea un \`.gitignore\` con \`node_modules\`, \`dist\` y \`.env\` ANTES del primer commit: si una clave llega a GitHub, considérala robada y cámbiala.`,
      example: `# .gitignore
node_modules
dist
.env`,
      concepts: ['frontend / API / base de datos', 'Git', 'commit', 'push', 'rama', '.gitignore'],
      tools: ['Git', 'GitHub', 'VS Code'],
      estimatedTimeMinutes: 18,
      challenge: {
        title: 'Subir tus cambios a GitHub',
        brief: 'Ordena el flujo básico de Git para subir cambios.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['despliegue'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'Has modificado varios ficheros de tu proyecto, que ya está conectado a un repositorio de GitHub. ¿Qué secuencia de comandos sube esos cambios a GitHub?',
          quiz: {
            options: [
              { id: 'push-solo', text: 'git push' },
              { id: 'commit-push', text: 'git commit -m "mensaje" y después git push, sin más' },
              { id: 'correcta', text: 'git add . → git commit -m "mensaje" → git push' },
              { id: 'push-add', text: 'git push → git add . → git commit -m "mensaje"' },
            ],
            correctIds: ['correcta'],
            explanation:
              'Primero se preparan los cambios con git add (sin eso, git commit no incluye los ficheros modificados y dice que no hay nada preparado), luego se crea el commit en tu ordenador con git commit y por último git push lo sube a GitHub. Un git push sin commits nuevos no sube nada, y hacer push antes del commit sube lo de antes, no tus cambios.',
          },
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'Desplegar el frontend, README y checklist de entrega',
      objective:
        'Saber publicar el build de Vite en un hosting estático, configurar la URL de la API por entorno, escribir un README útil y revisar el proyecto antes de entregarlo.',
      theory: `Tu frontend Vue, una vez construido, son solo ficheros estáticos. \`npm run build\` genera la carpeta \`dist/\` con un \`index.html\` y unos \`.js\` y \`.css\` con nombres tipo \`index-a1b2c3.js\` (el código cambia el nombre para que el navegador no use una versión vieja de la caché). Esa carpeta se puede subir a cualquier hosting estático: Netlify, Vercel, GitHub Pages, Cloudflare Pages o un Nginx. La API y la base de datos van en otro sitio (un servidor o un servicio que ejecute Node).

El fallo más típico al desplegar: en local todo va, y en producción la app no carga datos. Casi siempre es porque la URL de la API está escrita a mano como \`http://localhost:3000\`, que en el ordenador del usuario no existe. Se soluciona con variables de entorno de Vite, que se fijan al hacer el build:

\`\`\`js
// .env.development  ->  VITE_API_URL=http://localhost:3000
// .env.production   ->  VITE_API_URL=https://api.miproyecto.com
const API = import.meta.env.VITE_API_URL
const res = await fetch(API + '/productos')
\`\`\`

Otros dos fallos de despliegue: si usas Vue Router en modo history, al pulsar F5 en \`/perfil\` el hosting busca un fichero que no existe y da 404; hay que configurar que todas las rutas devuelvan \`index.html\` (cada hosting tiene su opción de "SPA fallback" o "rewrites"). Y la API tiene que permitir por CORS el dominio real del frontend, no solo \`localhost:5173\`.

El README.md es la portada del repositorio en GitHub. Debe decir, como mínimo: qué es el proyecto y para qué sirve, enlace a la versión desplegada, tecnologías usadas, cómo instalarlo y arrancarlo en local (\`npm install\`, \`npm run dev\`, qué variables de entorno necesita con un \`.env.example\` sin valores secretos) y capturas de pantalla.

Checklist antes de entregar: (1) el repositorio está en GitHub con commits a lo largo del tiempo; (2) \`.gitignore\` con \`node_modules\`, \`dist\` y \`.env\`, y ninguna clave en el código; (3) README completo; (4) la URL desplegada funciona desde otro ordenador o desde el móvil, también al recargar una ruta interna; (5) la consola del navegador no muestra errores; (6) los formularios validan en cliente Y en servidor; (7) no hay \`innerHTML\` ni \`v-html\` con datos del usuario; (8) \`npm audit\` sin vulnerabilidades altas o críticas.`,
      example: `# Mi Tienda
Tienda online hecha con Vue 3 + API Express + MySQL.
Demo: https://mitienda.netlify.app
## Instalación
npm install
cp .env.example .env
npm run dev`,
      concepts: ['npm run build', 'dist/', 'hosting estático', 'variables de entorno', 'SPA fallback', 'README'],
      tools: ['Vite', 'Netlify', 'GitHub', 'npm'],
      estimatedTimeMinutes: 20,
      challenge: {
        title: 'En local funciona, desplegado no',
        brief: 'Diagnostica por qué el frontend desplegado no carga datos y cómo arreglarlo.',
        difficulty: 3,
        timeLimitMinutes: 12,
        skills: ['despliegue', 'fetch-api'],
        rubric: RUBRIC,
        concept: {
          kind: 'short',
          runner: 'none',
          prompt:
            'Has subido el build de tu app Vue a Netlify. En tu ordenador funcionaba, pero en la versión publicada la lista de productos sale vacía. En el código tienes fetch(\'http://localhost:3000/productos\'). Explica en pocas líneas por qué falla y qué cambios harías para que funcione (en el frontend y en la API).',
          solution:
            'Falla porque "localhost" siempre es el ordenador de quien ejecuta el código: en producción el fetch lo hace el navegador del usuario, que intenta conectar con un puerto 3000 de SU propio ordenador, donde no hay ninguna API (además, una web HTTPS no puede pedir recursos por HTTP: contenido mixto). Arreglo: (1) desplegar la API en un servidor con una URL pública y HTTPS; (2) en el frontend no escribir la URL a mano, sino usar una variable de entorno de Vite, por ejemplo VITE_API_URL en .env.production, y hacer fetch(import.meta.env.VITE_API_URL + \'/productos\'), volviendo a hacer npm run build; (3) en la API, permitir por CORS el dominio real del frontend (https://mitienda.netlify.app). Se comprueba en la pestaña Red/Consola de las DevTools.',
        },
      },
    },
  ],
};
