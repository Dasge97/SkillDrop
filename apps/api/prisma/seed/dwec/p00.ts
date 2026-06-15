import { type PhaseSeed } from '../content-types.js';

export const dwecP00: PhaseSeed = {
  code: 'FASE 0',
  title: 'Entorno y cómo corre JavaScript',
  objective:
    'Entender dónde y cómo se ejecuta JavaScript en el navegador y preparar el repositorio del frontend de ReseñApp.',
  unlockedSkills: ['js-fundamentos'],
  projects: ['Repositorio inicial del frontend de ReseñApp'],
  lessons: [
    {
      title: 'El navegador como entorno de ejecución',
      objective:
        'Comprender qué es el motor JS, cómo se carga un script en el navegador y cómo usar la consola de DevTools.',
      theory:
        'JavaScript no corre en el vacío: lo ejecuta un motor (V8 en Chrome/Node, SpiderMonkey en Firefox). Cuando el navegador parsea un HTML y encuentra una etiqueta <script>, descarga y ejecuta ese código en el hilo principal. Si el script bloquea el hilo, la página se congela, de ahí la importancia de colocar los scripts al final del body o usar los atributos defer/async.\n\nLos módulos ES (type="module") cambian el juego: cada archivo tiene su propio ámbito, las variables no se filtran al global, y se pueden importar y exportar símbolos entre archivos con import/export. Además, los módulos se descargan en diferido por defecto, evitando bloqueos.\n\nDevTools es la primera herramienta del desarrollador front-end. La pestaña Console permite ejecutar expresiones, inspeccionar variables y ver errores con su traza de pila. La pestaña Sources permite poner breakpoints y seguir la ejecución línea a línea. Aprende a usarla desde el primer día: te ahorrará horas de debugging.\n\nGit es la columna vertebral de cualquier proyecto profesional. Un repositorio bien estructurado desde el inicio evita el caos de "versión_final_2_bueno.zip". Para el frontend de ReseñApp usaremos una estructura sencilla: index.html en la raíz, main.js como punto de entrada y carpetas para separar módulos cuando el proyecto crezca.',
      example:
        '<!-- index.html -->\n<script type="module" src="main.js"></script>\n\n// main.js\nconsole.log("ReseñApp cargada");\ndocument.querySelector("#app").textContent = "Bienvenido a ReseñApp";',
      concepts: [
        'Motor JavaScript (V8)',
        'Hilo principal',
        'defer / async',
        'type="module"',
        'Ámbito de módulo',
        'DevTools Console',
        'DevTools Sources / breakpoints',
        'Git init, add, commit, push',
      ],
      tools: ['Navegador (Chrome/Firefox)', 'DevTools', 'Git', 'VS Code'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'Repositorio inicial de ReseñApp',
        brief:
          'Crea el repositorio del frontend de ReseñApp con un index.html y un main.js que imprima datos en consola y muestre un saludo en la página. Haz los primeros commits con una estructura limpia.',
        context:
          'Todo proyecto empieza aquí. Un repo bien estructurado desde el minuto cero facilita el trabajo en equipo y las entregas futuras. ReseñApp será el hilo conductor de todo el curso: este primer commit es su punto de partida.',
        objective:
          'Tener el repo público en GitHub con los ficheros mínimos funcionales, mensajes de commit descriptivos y el script cargado como módulo ES.',
        targetUser: 'El propio alumno como desarrollador del proyecto.',
        restrictions: [
          'El script debe cargarse con <script type="module">.',
          'Prohibido usar frameworks ni librerías externas en esta fase.',
          'Al menos 2 commits con mensajes descriptivos en inglés o español.',
          'El repo debe estar en GitHub (público o privado con acceso al profesor).',
        ],
        deliverables: [
          'Enlace al repositorio de GitHub con el código.',
          'Captura de la consola de DevTools mostrando los datos impresos.',
          'Captura del navegador mostrando el saludo en la página.',
        ],
        checklist: [
          'index.html válido y con <script type="module">.',
          'main.js imprime al menos un objeto con datos de ejemplo (p. ej. una reseña ficticia) en consola.',
          'El saludo aparece en el DOM (no solo en consola).',
          'El repo tiene al menos 2 commits con mensajes claros.',
          'No hay errores en la consola de DevTools.',
          'El README describe brevemente el proyecto.',
        ],
        commonMistakes: [
          'Olvidar type="module" y usar import/export sin que funcione.',
          'Poner el script en el <head> sin defer y que el DOM no esté listo.',
          'Commit único con todo el código sin mensajes descriptivos.',
          'Variables de módulo que se intentan acceder desde la consola global (el ámbito de módulo las oculta).',
        ],
        difficulty: 1,
        timeLimitMinutes: 60,
        skills: ['js-fundamentos'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description:
              'El index.html carga sin errores, el script se ejecuta como módulo, los datos aparecen en consola y el saludo en la página.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description:
              'Código legible, indentado y sin variables innecesarias. main.js hace una sola cosa clara.',
          },
          {
            name: 'Buenas prácticas',
            description:
              'Commits atómicos con mensajes descriptivos; .gitignore presente; estructura de carpetas coherente.',
          },
          {
            name: 'Claridad / organización',
            description:
              'El repositorio es fácil de entender para alguien que llega por primera vez: README breve, nombres de ficheros claros.',
          },
        ],
      },
    },
  ],
};
