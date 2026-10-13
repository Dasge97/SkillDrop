import { type PhaseSeed } from '../content-types.js';

const RUBRIC = [
  { name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true },
];

export const dwecPasoP14: PhaseSeed = {
  code: 'FASE 14',
  title: 'Frameworks: Vue y Electron',
  objective:
    'Entender qué problema resuelve un framework como Vue, manejar su reactividad, plantillas, directivas, formularios y componentes, crear un proyecto con Vite y saber qué es Electron y cuándo usarlo.',
  unlockedSkills: ['vue', 'spa'],
  projects: [],
  lessons: [
    // ── LECCIÓN 1 ─────────────────────────────────────────────────────────────
    {
      title: '¿Para qué sirve un framework?',
      objective:
        'Entender que el problema de fondo es mantener la interfaz sincronizada con los datos, y que un framework lo hace por ti.',
      theory: `Hasta ahora has trabajado con el DOM "a mano": cambias un dato y luego tienes que acordarte de actualizar TODOS los sitios de la página que lo muestran. Con un contador es fácil; con una tienda que muestra el número de productos en el icono del carrito, en el resumen y en el botón de pagar, es muy fácil que se te olvide uno. Ese es el problema real: mantener la interfaz y los datos sincronizados.

\`\`\`js
let total = 0;
function anadir() {
  total++;
  document.querySelector('#badge').textContent = total;
  document.querySelector('#resumen').textContent = total + ' productos';
  // ...y si se te olvida el botón de pagar, la página miente
}
\`\`\`

Este estilo se llama imperativo: tú dices paso a paso QUÉ tocar del DOM. Un framework como Vue, React o Angular cambia el enfoque a declarativo: tú describes CÓMO debe verse la interfaz en función de los datos (el "estado"), y el framework se encarga de actualizar el DOM cuando el estado cambia. La idea clave es: interfaz = función(estado).

Por dentro, Vue guarda una copia ligera de cómo debería ser el DOM (el DOM virtual). Cuando cambia un dato, vuelve a calcular esa copia, la compara con la anterior y solo toca en el DOM real lo que ha cambiado. Por eso no tienes que escribir \`querySelector\` ni \`textContent\` para cada cosa.

Un framework no es magia ni es obligatorio: para una página con dos botones, JavaScript a pelo basta. Compensa cuando la interfaz tiene mucho estado que cambia (formularios, listas, filtros, varias vistas). Error típico: pensar que Vue "sustituye" a JavaScript. Vue ES JavaScript; todo lo que has aprendido (arrays, objetos, funciones, fetch, async) lo vas a seguir usando dentro de los componentes.`,
      example: `// Enfoque declarativo: la vista se calcula a partir del estado
const estado = { total: 3 };
const vista = () => 'Carrito (' + estado.total + ')';
console.log(vista()); // Carrito (3)
estado.total = 4;
console.log(vista()); // Carrito (4)`,
      concepts: ['framework', 'estado', 'imperativo vs declarativo', 'DOM virtual', 'sincronizar vista y datos'],
      tools: [],
      estimatedTimeMinutes: 12,
      challenge: {
        title: 'La vista como función del estado',
        brief: 'Escribe una función render que construya el texto de la vista a partir del estado.',
        difficulty: 1,
        timeLimitMinutes: 8,
        skills: ['vue', 'js-fundamentos'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Escribe una función render(estado) que devuelva el texto "NOMBRE tiene N productos: A, B" a partir del estado. Imprime render(estado). Después añade "huevos" a estado.items y vuelve a imprimir render(estado). Debe salir:\nAna tiene 2 productos: pan, leche\nAna tiene 3 productos: pan, leche, huevos',
          starterCode: `const estado = { nombre: 'Ana', items: ['pan', 'leche'] };

function render(estado) {
  // TODO: devuelve el texto a partir del estado (usa .length y .join(', '))
}

// TODO: imprime render(estado)
// TODO: añade 'huevos' a estado.items
// TODO: imprime render(estado) otra vez`,
          solution: `const estado = { nombre: 'Ana', items: ['pan', 'leche'] };

function render(estado) {
  return \`\${estado.nombre} tiene \${estado.items.length} productos: \${estado.items.join(', ')}\`;
}

console.log(render(estado)); // Ana tiene 2 productos: pan, leche
estado.items.push('huevos');
console.log(render(estado)); // Ana tiene 3 productos: pan, leche, huevos`,
        },
      },
    },

    // ── LECCIÓN 2 ─────────────────────────────────────────────────────────────
    {
      title: 'Reactividad: ref, reactive y el famoso .value',
      objective:
        'Saber crear estado reactivo con ref y reactive, y cuándo se escribe .value y cuándo no.',
      theory: `En Vue 3 con Composition API, un dato normal (\`let contador = 0\`) NO es reactivo: si lo cambias, Vue no se entera y la pantalla no se actualiza. Para que Vue vigile un dato lo creas con \`ref()\` o con \`reactive()\`. Todo esto se escribe dentro de \`<script setup>\` en un fichero \`.vue\`.

\`\`\`vue
<script setup>
import { ref, reactive } from 'vue'
const contador = ref(0)                         // para un valor suelto
const usuario = reactive({ nombre: 'Ana', edad: 20 }) // para un objeto
function sumar() {
  contador.value++        // en el script: con .value
  usuario.edad++          // reactive: sin .value
}
</script>
<template>
  <button @click="sumar">{{ contador }}</button>  <!-- en la plantilla: SIN .value -->
</template>
\`\`\`

¿Por qué \`.value\`? JavaScript no puede "vigilar" una variable suelta como \`0\`, pero sí un objeto. \`ref(0)\` te devuelve una caja \`{ value: 0 }\` con un getter y un setter: cuando LEES \`.value\`, Vue apunta qué parte de la vista depende de ese dato; cuando lo ESCRIBES, Vue sabe qué tiene que volver a pintar. \`reactive()\` hace lo mismo con todas las propiedades de un objeto usando un \`Proxy\`.

En la plantilla Vue desenvuelve los ref automáticamente, por eso escribes \`{{ contador }}\` y no \`{{ contador.value }}\`. Errores típicos: escribir \`contador++\` en el script (no hace nada útil, porque \`contador\` es la caja, no el número), o desestructurar un reactive (\`const { edad } = usuario\`), que copia el valor y pierde la reactividad.

Regla práctica: usa \`ref\` para casi todo (números, textos, booleanos, arrays e incluso objetos) y acuérdate del \`.value\` en el script. Verás también código antiguo con Options API (\`data() { return { contador: 0 } }\` y \`this.contador\`): es la forma clásica de Vue, conviene reconocerla, pero aquí usamos \`<script setup>\`.`,
      example: `const contador = ref(0)
contador.value = 5     // script: .value
// plantilla: <p>{{ contador }}</p>  -> muestra 5`,
      concepts: ['ref', 'reactive', '.value', 'reactividad', 'getter/setter', 'Proxy'],
      tools: ['Vue Devtools'],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Construye un mini ref',
        brief: 'Imita cómo funciona ref por dentro con un getter y un setter.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['vue', 'js-poo'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Completa miniRef(inicial) para que devuelva un objeto con una propiedad value: al leerla devuelve el valor guardado y al escribirla guarda el nuevo valor e imprime "actualizo la vista: " + nuevo. Luego el código de abajo debe imprimir:\nactualizo la vista: 1\nactualizo la vista: 2\n2',
          starterCode: `function miniRef(inicial) {
  let interno = inicial;
  return {
    // TODO: get value() { ... }
    // TODO: set value(nuevo) { ... }
  };
}

const contador = miniRef(0);
contador.value++;
contador.value++;
console.log(contador.value);`,
          solution: `function miniRef(inicial) {
  let interno = inicial;
  return {
    get value() {
      return interno;
    },
    set value(nuevo) {
      interno = nuevo;
      console.log('actualizo la vista: ' + nuevo);
    },
  };
}

const contador = miniRef(0);
contador.value++; // actualizo la vista: 1
contador.value++; // actualizo la vista: 2
console.log(contador.value); // 2`,
        },
      },
    },

    // ── LECCIÓN 3 ─────────────────────────────────────────────────────────────
    {
      title: 'Plantillas: {{ }}, v-bind y v-on',
      objective:
        'Mostrar datos con interpolación, enlazar atributos con v-bind (:) y escuchar eventos con v-on (@).',
      theory: `La plantilla (\`<template>\`) es HTML con superpoderes. Hay tres piezas que vas a usar en todos los componentes: la interpolación para mostrar texto, \`v-bind\` para atributos y \`v-on\` para eventos.

\`\`\`vue
<script setup>
import { ref } from 'vue'
const nombre = ref('Ana')
const foto = ref('ana.png')
const activo = ref(true)
function saludar() { alert('Hola ' + nombre.value) }
</script>
<template>
  <h1>Hola, {{ nombre }}</h1>
  <img :src="foto" :alt="'Foto de ' + nombre">
  <button :disabled="!activo" @click="saludar">Saludar</button>
</template>
\`\`\`

\`{{ nombre }}\` mete el valor como TEXTO dentro de una etiqueta. Por dentro Vue lo pone con algo equivalente a \`textContent\`, así que si \`nombre\` contiene \`<b>\` se ve literalmente, no se interpreta como HTML (esto te protege de XSS). Dentro de las llaves puedes poner cualquier expresión de JS (\`{{ precio * 2 }}\`), pero no sentencias como \`if\` o \`let\`.

\`v-bind:src="foto"\` (abreviado \`:src="foto"\`) le dice a Vue: "lo que hay entre comillas es JavaScript, evalúalo". Sin los dos puntos, \`src="foto"\` es HTML normal y el valor es el texto literal \`foto\`. Las llaves NO funcionan dentro de atributos: \`src="{{ foto }}"\` es un error típico.

\`v-on:click="saludar"\` (abreviado \`@click="saludar"\`) es el \`addEventListener\` de Vue. Puedes pasar el nombre de la función o una expresión corta (\`@click="contador++"\`). Tiene modificadores muy útiles, como \`@submit.prevent\`, que hace el \`event.preventDefault()\` por ti.`,
      example: `<a :href="'/productos/' + id">Ver</a>
<input @keyup.enter="buscar">`,
      concepts: ['interpolación {{ }}', 'v-bind (:)', 'v-on (@)', 'modificadores', 'expresión'],
      tools: [],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Qué imagen carga?',
        brief: 'Distingue un atributo normal de uno enlazado con v-bind.',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['vue'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'En un componente tienes `const foto = ref(\'gato.png\')` y en la plantilla escribes:\n\n<img src="foto">\n\n¿Qué imagen intenta cargar el navegador?',
          quiz: {
            options: [
              { id: 'gato', text: 'gato.png, porque Vue sustituye foto por su valor' },
              { id: 'literal', text: 'Un fichero llamado literalmente "foto"' },
              { id: 'error', text: 'Ninguna: Vue da un error de compilación' },
              { id: 'llaves', text: 'Un fichero llamado "{{ foto }}"' },
            ],
            correctIds: ['literal'],
            explanation:
              'Sin v-bind (los dos puntos), src="foto" es un atributo HTML normal y su valor es el texto "foto", así que el navegador pide un fichero con ese nombre (y falla). Para usar la variable hay que escribir :src="foto". Vue no da error porque es HTML válido, y las llaves no aparecen porque no se han escrito.',
          },
        },
      },
    },

    // ── LECCIÓN 4 ─────────────────────────────────────────────────────────────
    {
      title: 'Condiciones y listas: v-if, v-show y v-for con :key',
      objective:
        'Mostrar u ocultar elementos con v-if o v-show sabiendo la diferencia, y pintar listas con v-for y :key.',
      theory: `Para mostrar algo solo si se cumple una condición tienes dos directivas que en pantalla parecen iguales pero por dentro son muy distintas. \`v-if\` CREA o DESTRUYE el elemento en el DOM. \`v-show\` lo crea siempre y solo le cambia \`style="display: none"\`.

\`\`\`vue
<p v-if="cargando">Cargando...</p>
<p v-else-if="error">Algo ha fallado</p>
<p v-else>Datos listos</p>
<div v-show="menuAbierto">Menú</div>   <!-- siempre en el DOM -->
\`\`\`

¿Cuál usar? \`v-if\` cuando la condición cambia poco o cuando el contenido no debe existir (por ejemplo, el panel de admin de un usuario que no es admin: con \`v-if\` ni se crea). \`v-show\` cuando algo se abre y cierra muchas veces (un menú desplegable), porque cambiar un estilo es más barato que crear y destruir elementos. Ojo: ocultar algo con \`v-if\` o \`v-show\` NO es seguridad; el usuario puede ver el código. La seguridad está en el servidor.

Para listas se usa \`v-for\`, que es como un \`for...of\` en la plantilla. Siempre con \`:key\`, un valor único y estable para cada elemento (normalmente el \`id\`):

\`\`\`vue
<ul>
  <li v-for="tarea in tareas" :key="tarea.id">
    {{ tarea.texto }}
  </li>
</ul>
\`\`\`

La \`key\` sirve para que Vue sepa qué elemento es cuál cuando la lista cambia: si borras el segundo, Vue quita exactamente ese \`<li>\` en vez de reescribirlos todos. Error típico: usar el índice como key (\`:key="i"\`) en listas donde se borra o reordena, porque al borrar uno los índices se desplazan y Vue confunde elementos (se nota en inputs que "cambian" de contenido). Otro error: poner \`v-if\` y \`v-for\` en la misma etiqueta; filtra antes la lista con un computed.`,
      example: `<li v-for="p in productos" :key="p.id">
  {{ p.nombre }} - {{ p.precio }} €
</li>`,
      concepts: ['v-if / v-else', 'v-show', 'v-for', ':key', 'display: none'],
      tools: ['DevTools'],
      estimatedTimeMinutes: 14,
      challenge: {
        title: 'v-show por dentro',
        brief: '¿Qué le pasa en el DOM a un elemento con v-show en false?',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['vue'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'En la plantilla tienes:\n\n<p v-show="false">Hola</p>\n\nSi abres la pestaña Elementos de las DevTools, ¿qué encuentras?',
          quiz: {
            options: [
              { id: 'nada', text: 'Nada: el párrafo no existe en el DOM' },
              { id: 'display', text: 'El párrafo está en el DOM con style="display: none;"' },
              { id: 'visible', text: 'El párrafo está y se ve "Hola"' },
              { id: 'comentario', text: 'Solo un comentario vacío <!--v-show-->' },
            ],
            correctIds: ['display'],
            explanation:
              'v-show siempre crea el elemento y lo oculta con display: none, por eso aparece en Elementos aunque no se vea. El que NO crea el elemento (y deja solo un comentario <!--v-if--> como marcador) es v-if. No se ve "Hola" porque la condición es false.',
          },
        },
      },
    },

    // ── LECCIÓN 5 ─────────────────────────────────────────────────────────────
    {
      title: 'Formularios con v-model, computed y watch',
      objective:
        'Enlazar inputs en las dos direcciones con v-model, calcular valores derivados con computed y reaccionar a cambios con watch.',
      theory: `\`v-model\` enlaza un input con una variable en las dos direcciones: si escribes en el input, cambia la variable; si cambias la variable desde el código, cambia el input. Por dentro no es más que un atajo de \`:value="nombre"\` + \`@input="nombre = $event.target.value"\`. Funciona con \`input\`, \`textarea\`, \`select\`, checkboxes y radios. Modificadores útiles: \`v-model.trim\` (quita espacios) y \`v-model.number\` (convierte a número; sin él, un input siempre te da texto, y \`"2" + 1\` es \`"21"\`).

Muchas veces necesitas un valor que se calcula a partir de otros: el total del carrito, si el formulario es válido, la lista filtrada. Para eso está \`computed\`:

\`\`\`vue
<script setup>
import { ref, computed, watch } from 'vue'
const email = ref('')
const esValido = computed(() => email.value.includes('@'))
watch(email, (nuevo, viejo) => {
  console.log('email cambió de', viejo, 'a', nuevo)
})
</script>
<template>
  <input v-model.trim="email" type="email">
  <button :disabled="!esValido">Enviar</button>
</template>
\`\`\`

¿Por qué \`computed\` y no una función normal (\`esValido()\`)? Las dos sirven en la plantilla, pero el computed guarda en caché su resultado y solo se recalcula cuando cambia alguno de los ref que lee. Una función se ejecuta en CADA repintado del componente, aunque no haya cambiado nada. Regla: si es un valor derivado, computed; si es una acción (enviar, borrar), función. Un computed debe ser puro: calcula y devuelve, sin modificar otros datos ni hacer peticiones.

\`watch\` es para efectos secundarios: "cuando cambie X, haz algo" (guardar en localStorage, hacer un fetch al cambiar la búsqueda, escribir un log). Recibe el valor nuevo y el viejo. Error típico: usar \`watch\` para mantener actualizada otra variable (\`watch(a, () => b.value = a.value * 2)\`); eso es un computed.

Recuerda que la validación en el cliente es para la comodidad del usuario (avisarle rápido). Quien manda es el servidor, que debe volver a validarlo todo.`,
      example: `const precio = ref(10)
const cantidad = ref(3)
const total = computed(() => precio.value * cantidad.value) // 30`,
      concepts: ['v-model', 'two-way binding', 'computed', 'watch', 'modificadores .trim .number'],
      tools: ['Vue Devtools'],
      estimatedTimeMinutes: 18,
      challenge: {
        title: 'Formulario de registro reactivo',
        brief: 'Escribe un componente con v-model, un computed de validación y un watch.',
        difficulty: 2,
        timeLimitMinutes: 15,
        skills: ['vue', 'forms'],
        rubric: RUBRIC,
        concept: {
          kind: 'code',
          runner: 'none',
          prompt:
            'Escribe un componente Vue con <script setup> que tenga: (1) un input enlazado con v-model a un ref `nombre`; (2) un párrafo que muestre "Hola, " seguido del nombre; (3) un computed `valido` que sea true si el nombre, sin espacios al principio ni al final, tiene al menos 3 caracteres; (4) un botón "Enviar" deshabilitado mientras no sea válido; (5) un watch que haga console.log del nombre cada vez que cambie. El formulario no debe recargar la página al enviarse.',
          starterCode: `<script setup>
import { ref, computed, watch } from 'vue'
// TODO: ref nombre
// TODO: computed valido
// TODO: watch de nombre
function enviar() {
  alert('Enviado')
}
</script>

<template>
  <form>
    <!-- TODO: input con v-model, párrafo con el saludo y botón -->
  </form>
</template>`,
          solution: `<script setup>
import { ref, computed, watch } from 'vue'

const nombre = ref('')
const valido = computed(() => nombre.value.trim().length >= 3)

watch(nombre, (nuevo) => {
  console.log('nombre:', nuevo)
})

function enviar() {
  alert('Enviado: ' + nombre.value)
}
</script>

<template>
  <form @submit.prevent="enviar">
    <input v-model="nombre" placeholder="Tu nombre">
    <p>Hola, {{ nombre }}</p>
    <button type="submit" :disabled="!valido">Enviar</button>
  </form>
</template>`,
        },
      },
    },

    // ── LECCIÓN 6 ─────────────────────────────────────────────────────────────
    {
      title: 'Componentes: props hacia abajo, emits hacia arriba',
      objective:
        'Dividir la interfaz en componentes y comunicarlos: el padre pasa datos con props y el hijo avisa con eventos (emits).',
      theory: `Un componente es una pieza reutilizable de interfaz con su propio script, plantilla y estilos, en un fichero \`.vue\` (por ejemplo \`TarjetaProducto.vue\`). Una app Vue es un árbol de componentes: \`App.vue\` contiene una \`ListaProductos\`, que contiene muchas \`TarjetaProducto\`. Para usarlo basta con importarlo en \`<script setup>\` y escribirlo como etiqueta.

La comunicación sigue una regla muy estricta: los datos BAJAN por props y los avisos SUBEN por eventos. El padre le pasa datos al hijo como si fueran atributos; el hijo los declara con \`defineProps\`:

\`\`\`vue
<!-- TarjetaProducto.vue (hijo) -->
<script setup>
const props = defineProps({ nombre: String, precio: Number })
const emit = defineEmits(['comprar'])
</script>
<template>
  <h3>{{ nombre }} - {{ precio }} €</h3>
  <button @click="emit('comprar', nombre)">Comprar</button>
</template>
\`\`\`

\`\`\`vue
<!-- Padre -->
<TarjetaProducto :nombre="p.nombre" :precio="p.precio" @comprar="anadirAlCarrito" />
\`\`\`

Las props son de SOLO LECTURA para el hijo. ¿Por qué? Porque el dato pertenece al padre; si el hijo pudiera cambiarlo, cualquier componente podría modificar datos ajenos y sería imposible saber quién cambió qué. Si el hijo necesita que algo cambie, emite un evento (\`emit('comprar', nombre)\`) y es el PADRE, el dueño del dato, quien decide qué hacer en su función \`anadirAlCarrito\`.

Errores típicos: olvidar los dos puntos al pasar un número o una variable (\`precio="p.precio"\` pasa el texto literal); intentar hacer \`props.precio = 0\` en el hijo; y escribir \`defineProps\` con \`import\`, cuando en realidad son macros de \`<script setup>\` que no hace falta importar.`,
      example: `<!-- El padre escucha y decide -->
<Contador :valor="puntos" @incrementar="puntos++" />`,
      concepts: ['componente', 'props', 'defineProps', 'emits', 'defineEmits', 'flujo de datos unidireccional'],
      tools: ['Vue Devtools'],
      estimatedTimeMinutes: 16,
      challenge: {
        title: 'El hijo cambia una prop',
        brief: '¿Qué ocurre si un componente hijo intenta modificar una prop?',
        difficulty: 2,
        timeLimitMinutes: 6,
        skills: ['vue'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'El padre usa <Titulo :texto="titulo" /> y en el hijo Titulo.vue, al pulsar un botón, se ejecuta:\n\nprops.texto = \'Otro\'\n\n¿Qué ocurre (en modo desarrollo)?',
          quiz: {
            options: [
              { id: 'ambos', text: 'Cambia en el hijo y también en el padre' },
              { id: 'hijo', text: 'Cambia solo en el hijo; el padre conserva su valor' },
              { id: 'readonly', text: 'No cambia: las props son de solo lectura y Vue muestra un aviso en la consola' },
              { id: 'borra', text: 'La prop se borra y el hijo se queda sin título' },
            ],
            correctIds: ['readonly'],
            explanation:
              'Las props son de solo lectura para el hijo: Vue bloquea la asignación y avisa en la consola de que el objeto es de solo lectura. El dato pertenece al padre, así que ni cambia en el padre ni en el hijo. Lo correcto es que el hijo emita un evento (emit(\'cambiar\', \'Otro\')) y que el padre actualice su propio ref.',
          },
        },
      },
    },

    // ── LECCIÓN 7 ─────────────────────────────────────────────────────────────
    {
      title: 'Un proyecto real: Vite, estructura y Vue Router (SPA)',
      objective:
        'Crear un proyecto Vue con Vite, entender su estructura de carpetas y qué es una SPA con Vue Router.',
      theory: `En un proyecto real no se mete Vue con un \`<script>\` suelto: se usa una herramienta de construcción. La oficial es Vite. Para crear un proyecto se usa el asistente de Vue, que te pregunta qué quieres incluir (Router, Pinia, TypeScript, tests...):

\`\`\`js
// En la terminal (necesitas Node.js instalado):
// npm create vue@latest     -> crea la carpeta del proyecto
// cd mi-proyecto
// npm install               -> descarga las dependencias en node_modules
// npm run dev               -> servidor de desarrollo en http://localhost:5173
// npm run build             -> genera la versión final en dist/
\`\`\`

La estructura que te queda: \`index.html\` (la única página HTML, con un \`<div id="app">\`), \`src/main.js\` (crea la app con \`createApp(App).mount('#app')\`), \`src/App.vue\` (el componente raíz), \`src/components/\` (componentes reutilizables), \`src/views/\` (una vista por página, si usas Router), \`src/router/index.js\` (las rutas), \`src/assets/\` (imágenes y CSS que se procesan) y \`public/\` (ficheros que se copian tal cual). \`package.json\` lista dependencias y scripts; \`node_modules\` no se sube nunca a Git.

¿Por qué hace falta Vite? El navegador no entiende ficheros \`.vue\`. Vite los traduce a JavaScript normal, recarga la página al instante cuando guardas (HMR) y, con \`npm run build\`, junta y minifica todo en \`dist/\`, que son ficheros estáticos (HTML, JS, CSS) listos para subir a cualquier hosting.

Una SPA (Single Page Application) es una web con UNA sola página HTML en la que JavaScript cambia el contenido al navegar, sin pedir páginas nuevas al servidor. Vue Router asocia URLs a componentes:

\`\`\`js
const routes = [
  { path: '/', component: InicioView },
  { path: '/perfil', component: PerfilView },
  { path: '/productos/:id', component: ProductoView }, // :id es un parámetro
]
\`\`\`

En la plantilla se navega con \`<RouterLink to="/perfil">\` (no con \`<a href>\`, que recargaría la página) y \`<RouterView />\` marca dónde se pinta el componente de la ruta actual. Por dentro, el Router usa la History API (\`history.pushState\`) para cambiar la URL sin recargar. Consecuencia importante al desplegar: si el usuario pulsa F5 en \`/perfil\`, el navegador SÍ pide \`/perfil\` al servidor, y si el hosting no está configurado para devolver siempre \`index.html\`, dará un 404.`,
      example: `<nav>
  <RouterLink to="/">Inicio</RouterLink>
  <RouterLink to="/perfil">Perfil</RouterLink>
</nav>
<RouterView />`,
      concepts: ['Vite', 'npm create vue@latest', 'estructura de proyecto', 'SPA', 'Vue Router', 'RouterLink / RouterView'],
      tools: ['Node.js', 'npm', 'Vite', 'VS Code'],
      estimatedTimeMinutes: 18,
      challenge: {
        title: '¿Qué pasa al pulsar un RouterLink?',
        brief: 'Entiende cómo navega una SPA sin recargar la página.',
        difficulty: 2,
        timeLimitMinutes: 6,
        skills: ['spa', 'vue'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'En una SPA hecha con Vue y Vue Router, el usuario está en "/" y pulsa <RouterLink to="/perfil">Perfil</RouterLink>. ¿Qué ocurre?',
          quiz: {
            options: [
              { id: 'html', text: 'El navegador pide al servidor un fichero perfil.html y lo carga' },
              { id: 'recarga', text: 'La página se recarga entera y Vue vuelve a arrancar en /perfil' },
              { id: 'spa', text: 'JavaScript cambia la URL a /perfil sin recargar y Vue pinta el componente de esa ruta en <RouterView />' },
              { id: 'pestana', text: 'Se abre /perfil en una pestaña nueva' },
            ],
            correctIds: ['spa'],
            explanation:
              'Vue Router intercepta el clic, cambia la URL con la History API (history.pushState) y sustituye el componente que se muestra en <RouterView />, sin pedir ninguna página nueva al servidor: eso es una SPA. No existe ningún perfil.html; solo hay un index.html. Una recarga completa pasaría con un <a href> normal o pulsando F5, no con RouterLink, y no se abre ninguna pestaña.',
          },
        },
      },
    },

    // ── LECCIÓN 8 ─────────────────────────────────────────────────────────────
    {
      title: 'Electron: apps de escritorio con tecnologías web',
      objective:
        'Saber qué es Electron, la diferencia entre el proceso main y el renderer, para qué sirven el preload y el IPC, y cuándo tiene sentido usarlo.',
      theory: `Electron permite hacer aplicaciones de escritorio (Windows, macOS, Linux) con HTML, CSS y JavaScript. Por dentro mete en un ejecutable un navegador Chromium (para pintar la interfaz) y Node.js (para acceder al sistema: ficheros, menús, notificaciones). VS Code, Slack, Discord o Postman están hechos con Electron.

Una app Electron tiene dos tipos de proceso. El proceso main (principal) es uno solo, corre en Node.js, crea las ventanas y tiene acceso total al sistema (\`fs\`, rutas, programas). Cada ventana es un proceso renderer, que es básicamente una pestaña de Chromium: ahí va tu interfaz, que puede ser perfectamente una app Vue. Por seguridad, el renderer NO tiene acceso a Node: si cargas contenido con un XSS y el renderer pudiera usar \`fs\`, el atacante podría borrar el disco del usuario.

¿Cómo pide entonces la interfaz algo al sistema? Con el preload y el IPC (comunicación entre procesos). El preload es un script que se ejecuta antes de la página y expone, con \`contextBridge\`, SOLO las funciones concretas que quieres permitir:

\`\`\`js
// preload.js
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
  leerNotas: () => ipcRenderer.invoke('leer-notas'),
})
// main.js
ipcMain.handle('leer-notas', () => fs.readFileSync(rutaNotas, 'utf8'))
// En el renderer (tu app Vue)
const texto = await window.api.leerNotas()
\`\`\`

El flujo es: el renderer llama a \`window.api.leerNotas()\`, el preload manda un mensaje por IPC, el main lo recibe, lee el fichero y devuelve el resultado. Error típico (y grave): exponer en el preload todo \`ipcRenderer\` o \`fs\`, o activar \`nodeIntegration: true\`, porque cualquier script de la página tendría acceso al sistema.

¿Cuándo tiene sentido? Cuando necesitas una app instalable que funcione sin conexión, acceda a ficheros locales o al hardware, y quieres reutilizar lo que sabes de web. Inconvenientes: cada app pesa 100 MB o más (lleva un navegador entero dentro) y consume bastante RAM. Si basta con una web, mejor una web (o una PWA).`,
      example: `// main.js: crear la ventana
const win = new BrowserWindow({
  webPreferences: { preload: path.join(__dirname, 'preload.js') },
})
win.loadFile('index.html')`,
      concepts: ['Electron', 'proceso main', 'proceso renderer', 'preload', 'contextBridge', 'IPC'],
      tools: ['Electron', 'Node.js'],
      estimatedTimeMinutes: 16,
      challenge: {
        title: '¿Dónde va el código que lee el disco?',
        brief: 'Coloca cada responsabilidad en el proceso correcto de Electron.',
        difficulty: 2,
        timeLimitMinutes: 6,
        skills: ['vue'],
        rubric: RUBRIC,
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt:
            'En una app Electron con la interfaz hecha en Vue, al pulsar un botón hay que leer un fichero del disco del usuario. ¿Cuál es la forma correcta y segura?',
          quiz: {
            options: [
              { id: 'vue', text: 'Hacer require(\'fs\') directamente en el componente Vue' },
              { id: 'main', text: 'Leerlo en el proceso main con fs, exponer en el preload una función concreta con contextBridge y llamarla desde Vue (IPC)' },
              { id: 'exponer', text: 'Exponer el módulo fs entero en el preload para que Vue lo use como quiera' },
              { id: 'node', text: 'Activar nodeIntegration: true para que el renderer pueda usar Node' },
            ],
            correctIds: ['main'],
            explanation:
              'El acceso al sistema se hace en el proceso main, que corre en Node. El renderer (la interfaz) solo recibe, a través del preload y contextBridge, las funciones concretas que tú decides, y se comunica con el main por IPC. Usar require en el renderer no funciona con la configuración segura por defecto; exponer fs entero o activar nodeIntegration daría a cualquier script de la página (por ejemplo, uno inyectado por XSS) acceso total al disco.',
          },
        },
      },
    },
  ],
};
