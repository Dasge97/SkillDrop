import { type PhaseSeed } from '../content-types.js';

export const dwecP03: PhaseSeed = {
  code: 'FASE 3',
  title: 'Funciones y módulos',
  objective: 'Organizar el código de ReseñApp con funciones bien definidas y módulos ES para separar responsabilidades.',
  unlockedSkills: ['js-poo'],
  projects: ['Módulo reseñas.js', 'Módulo formato.js', 'Módulo almacen.js', 'Punto de entrada main.js'],
  lessons: [
    {
      title: 'Funciones: arrow, parámetros y scope',
      objective: 'Definir funciones arrow con parámetros por defecto, entender el scope y usar callbacks.',
      theory:
        'Una función en JavaScript es un bloque de código reutilizable con un nombre, parámetros y un valor de retorno explícito (o `undefined`). Las funciones arrow (`const fn = (a, b) => a + b`) tienen una sintaxis más compacta y no crean su propio `this`, lo que las hace idóneas como callbacks y para código funcional.\n\nLos parámetros por defecto (`function buscar(texto = "")`) evitan comprobaciones de `undefined` dentro del cuerpo. El scope (ámbito) determina qué variables son visibles en cada punto del código: `let` y `const` tienen scope de bloque, mientras que `var` tiene scope de función y da lugar a comportamientos inesperados. Preferir `const` por defecto y `let` solo cuando la variable cambia es la práctica moderna.\n\nUn callback es una función que se pasa como argumento a otra función para ser invocada más tarde. Son la base de métodos como `filter` o `addEventListener`. En ReseñApp los usaremos para encapsular la lógica de transformación y pasarla a funciones genéricas de utilidad.\n\nEntender el scope y el orden de ejecución evita los errores más comunes en proyectos reales: variables no definidas, comportamiento inesperado de closures y pérdida accidental del contexto `this`.',
      example:
        'const filtrar = (resenas, predicado = () => true) => resenas.filter(predicado);\nconst sonPopulares = filtrar(catalogo, r => r.puntuacion >= 8);\n\nfunction crearContador() {\n  let cuenta = 0;\n  return () => ++cuenta; // closure: recuerda "cuenta"\n}\nconst siguiente = crearContador();\nconsole.log(siguiente()); // 1\nconsole.log(siguiente()); // 2',
      concepts: ['Función arrow', 'parámetros por defecto', 'valor de retorno', 'scope de bloque', 'closure', 'callback', 'const vs let'],
      tools: ['Consola del navegador', 'Node.js REPL', 'VS Code'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'Funciones de utilidad para ReseñApp',
        brief: 'Implementa un conjunto de funciones de utilidad para el catálogo de ReseñApp usando arrow functions, parámetros por defecto y callbacks.',
        context: 'Antes de modularizar el proyecto, es necesario que cada pieza de lógica viva en su propia función con una firma clara. Este reto prepara las funciones que luego se exportarán como módulos.',
        objective: 'Escribir funciones puras, bien nombradas y con parámetros por defecto que encapsulen la lógica de filtrado, ordenación y formato del catálogo de ReseñApp.',
        targetUser: 'Alumno de DAW preparando la base funcional del cliente ReseñApp.',
        restrictions: [
          'Usar únicamente funciones arrow.',
          'Al menos dos funciones deben tener parámetros por defecto.',
          'Al menos una función debe aceptar un callback como parámetro.',
          'Sin uso de var; usar const y let según corresponda.',
        ],
        deliverables: [
          'Repositorio GitHub con el código (enlace en la entrega).',
          'Archivo utilidades.js con las funciones implementadas.',
          'Captura de consola mostrando los resultados de al menos tres llamadas distintas.',
        ],
        checklist: [
          'filtrarCatalogo(resenas, predicado) aplica el callback predicado y devuelve el subconjunto.',
          'ordenarPor(resenas, campo, ascendente = true) ordena sin mutar el array original.',
          'formatearPuntuacion(puntuacion, maximo = 10) devuelve el string "9/10".',
          'Los parámetros por defecto funcionan correctamente cuando se omite el argumento.',
          'Ninguna función usa var.',
        ],
        commonMistakes: [
          'Mutar el array dentro de ordenarPor (sort muta in-place; hay que clonar antes).',
          'Confundir el scope de variables declaradas dentro de callbacks.',
          'Pasar el callback sin invocarlo: escribir predicado en vez de predicado(elemento).',
          'Usar function declaration cuando el enunciado pide arrow function.',
        ],
        difficulty: 2,
        timeLimitMinutes: 50,
        skills: ['js-fundamentos', 'js-poo'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Las funciones producen los resultados correctos; los parámetros por defecto y callbacks funcionan como se espera.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Arrow functions bien aplicadas, firmas claras, sin código duplicado.',
          },
          {
            name: 'Buenas prácticas',
            description: 'const por defecto, sin var, funciones puras donde corresponde, nombres descriptivos.',
          },
          {
            name: 'Claridad',
            description: 'La intención de cada función es evidente por su nombre y firma sin necesidad de comentarios adicionales.',
          },
        ],
      },
    },
    {
      title: 'Módulos ES: import y export',
      objective: 'Dividir el código de ReseñApp en módulos ES con import/export y separar responsabilidades.',
      theory:
        'Los módulos ES (ESModules) permiten dividir una aplicación en archivos independientes donde cada uno exporta lo que necesitan los demás e importa solo lo que usa. `export` puede ser nombrado (`export const fn = ...`) o por defecto (`export default clase`). `import` recibe los nombres exactos entre llaves para exports nombrados, o cualquier nombre para el default.\n\nLa separación de responsabilidades significa que cada módulo tiene un propósito único: un módulo gestiona los datos, otro formatea la presentación, otro persiste en localStorage. Esta división hace el código más fácil de mantener, testear y reutilizar. En un proyecto Vue o con bundler (Vite, Webpack) los módulos se resuelven en tiempo de compilación; en el navegador puro se activan con `<script type="module">`.\n\nEl módulo `almacen.js` encapsula el acceso a localStorage: el resto del código no sabe si los datos vienen de memoria, localStorage o una API. Esta abstracción es el primer paso hacia la arquitectura que usará Vue en fases posteriores.\n\nUna importación circular (A importa B que importa A) provoca errores difíciles de depurar. La solución es identificar un módulo base sin dependencias internas y construir hacia arriba: datos → lógica → presentación → entrada.',
      example:
        '// reseñas.js\nexport const obtenerTodas = (almacen) => almacen.cargar();\nexport const agregar = (almacen, resena) => almacen.guardar([...almacen.cargar(), resena]);\n\n// main.js\nimport { obtenerTodas, agregar } from \'./reseñas.js\';\nimport { formatearResena } from \'./formato.js\';\nimport almacen from \'./almacen.js\';',
      concepts: ['export nombrado', 'export default', 'import', 'separación de responsabilidades', 'módulo base', 'importación circular', 'type="module"'],
      tools: ['VS Code', 'Navegador con DevTools', 'Node.js (con .mjs o type:module en package.json)'],
      estimatedTimeMinutes: 45,
      challenge: {
        title: 'Refactorizar ReseñApp en módulos',
        brief: 'Toma el código de los retos anteriores y refactorízalo en tres módulos ES: reseñas.js, formato.js y almacen.js, orquestados desde main.js.',
        context: 'El cliente JS de ReseñApp ha crecido y todo el código vive en un único archivo. Antes de integrar Vue es imprescindible estructurarlo en módulos con responsabilidades claras: uno para la lógica de negocio (reseñas), otro para la presentación (formato) y otro para la persistencia (almacen).',
        objective: 'Dividir la lógica de ReseñApp en módulos ES con imports y exports correctos, de forma que main.js sea el único punto de entrada y no contenga lógica de negocio.',
        targetUser: 'Alumno de DAW preparando la arquitectura del cliente ReseñApp antes de introducir Vue.',
        restrictions: [
          'Exactamente cuatro archivos: reseñas.js, formato.js, almacen.js y main.js.',
          'Cero lógica de negocio en main.js (solo importar y llamar).',
          'almacen.js debe usar localStorage para persistir las reseñas entre recargas.',
          'Sin imports circulares.',
          'Ejecutar en el navegador con <script type="module">.',
        ],
        deliverables: [
          'Repositorio GitHub con los cuatro archivos y un index.html que los carga (enlace en la entrega).',
          'Captura del navegador mostrando las reseñas persistidas tras recargar la página.',
          'Captura de la pestaña Application > localStorage en DevTools con los datos guardados.',
        ],
        checklist: [
          'reseñas.js exporta funciones para obtener, agregar, actualizar y eliminar reseñas del almacén.',
          'formato.js exporta funciones que convierten un objeto reseña en strings para mostrar en pantalla.',
          'almacen.js exporta (por defecto o nombrado) un objeto con métodos cargar y guardar usando localStorage.',
          'main.js importa los tres módulos y orquesta el flujo sin contener lógica propia.',
          'Las reseñas persisten al recargar la página.',
          'No hay imports circulares (comprobado revisando las dependencias).',
        ],
        commonMistakes: [
          'Poner lógica de negocio en main.js por comodidad.',
          'Olvidar type="module" en el script tag y que los imports fallen silenciosamente.',
          'Importar con ruta sin extensión .js en entorno de navegador puro.',
          'Mezclar responsabilidades: formatear dentro de reseñas.js o acceder a localStorage desde reseñas.js.',
          'Generar una importación circular entre reseñas.js y almacen.js.',
        ],
        difficulty: 2,
        timeLimitMinutes: 70,
        skills: ['js-fundamentos', 'js-poo'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Los cuatro archivos cargan sin errores; las reseñas se persisten y recuperan correctamente desde localStorage.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Exports e imports usados correctamente; sin código muerto ni exports sin usar.',
          },
          {
            name: 'Buenas prácticas',
            description: 'Cada módulo tiene una única responsabilidad; sin imports circulares; main.js solo orquesta.',
          },
          {
            name: 'Claridad',
            description: 'La estructura de archivos refleja la arquitectura; los nombres de módulos y funciones exportadas son autodescriptivos.',
          },
        ],
      },
    },
  ],
};
