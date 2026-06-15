import { type PhaseSeed } from '../content-types.js';

export const dwesP04: PhaseSeed = {
  code: 'FASE 4',
  title: 'Arquitectura MVC',
  objective: 'Organizar el backend de ReseñApp en capas separadas (Modelo, Vista, Controlador) para que la lógica de negocio, el acceso a datos y la presentación no se mezclen en el mismo fichero.',
  unlockedSkills: ['mvc'],
  projects: [
    'Refactorización de ReseñApp a estructura MVC',
    'Router de entrada (front controller)',
    'Modelo Review con PDO',
    'Controlador ReviewController',
    'Vistas PHP separadas de la lógica',
  ],
  lessons: [
    {
      title: 'El patrón MVC explicado sin rodeos',
      objective: 'Entender qué responsabilidad tiene cada capa del patrón MVC y cómo se comunican entre sí.',
      theory:
        'MVC (Model-View-Controller) es una convención para repartir responsabilidades dentro de una aplicación web. El Modelo accede a los datos (base de datos, lógica de negocio); la Vista sólo muestra HTML con los datos que le llegan; el Controlador recibe la petición HTTP, llama al Modelo y pasa el resultado a la Vista. Si cada fichero hace una sola cosa, los cambios son más seguros y el código se puede leer de arriba abajo.\n\nEl punto de entrada habitual es un único fichero `index.php` —llamado front controller— que recibe todas las peticiones (gracias a un `.htaccess` o la configuración de Nginx) y decide qué Controlador ejecutar según la URL. Esto evita tener un `detalle.php`, un `listado.php` y un `borrar.php` sueltos en la raíz, que es el caos que ya conoces de las fases anteriores.\n\nEl autoloading de clases (mediante `spl_autoload_register` o Composer) permite que PHP cargue automáticamente el fichero correcto cuando instancias una clase, sin escribir un `require` por cada modelo o controlador. La convención de nombres PSR-4 (cada espacio de nombres coincide con un directorio) hace que esto funcione de forma predecible.\n\nUna estructura de carpetas limpia podría ser: `public/` (sólo `index.php` y assets), `src/Models/`, `src/Controllers/`, `src/Views/` y `src/Core/` (router, base de datos). Todo lo que no deba ser accesible desde el navegador vive fuera de `public/`.',
      example:
        '// public/index.php — front controller mínimo\nrequire_once __DIR__ . \'/../vendor/autoload.php\';\n\n$uri = parse_url($_SERVER[\'REQUEST_URI\'], PHP_URL_PATH);\n\nmatch ($uri) {\n    \'/resenas\'      => (new App\\Controllers\\ReviewController())->index(),\n    \'/resenas/nueva\' => (new App\\Controllers\\ReviewController())->create(),\n    default         => http_response_code(404),\n};',
      concepts: [
        'Patrón MVC',
        'Front controller',
        'Separación de responsabilidades',
        'Autoloading PSR-4',
        'Estructura de carpetas',
        'Router básico',
      ],
      tools: ['PHP 8', 'Composer', 'Apache / .htaccess'],
      estimatedTimeMinutes: 40,
    },
    {
      title: 'Reto: refactoriza ReseñApp a MVC',
      objective: 'Aplicar el patrón MVC reorganizando el código existente de ReseñApp en Modelos, Controladores y Vistas con un router de entrada.',
      theory:
        'Refactorizar no es reescribir desde cero: es mover responsabilidades sin cambiar el comportamiento externo. El primer paso es identificar qué código toca la base de datos (→ Modelo), qué código genera HTML (→ Vista) y qué código decide qué hacer según la petición (→ Controlador).\n\nEn esta práctica extraerás la lógica de acceso a datos a una clase `Review` y, si el proyecto lo tiene, a una clase `Item`. Los Controladores sólo instancian Modelos, recogen datos y los pasan a las Vistas mediante variables. Las Vistas son ficheros `.php` que sólo contienen HTML con `<?= $variable ?>` para mostrar datos —sin consultas SQL, sin lógica de enrutado.\n\nEl router de entrada puede ser tan simple como un `match` o un `switch` sobre la URI, sin necesidad de ningún framework. Lo importante es que exista un único punto de entrada y que el resto del código no pueda accederse directamente desde el navegador.',
      concepts: [
        'Refactorización',
        'Modelo de datos con PDO',
        'Controlador sin lógica de presentación',
        'Vistas como plantillas PHP',
        'Router de entrada único',
      ],
      tools: ['PHP 8', 'PDO', 'Composer autoload', 'Apache / .htaccess'],
      estimatedTimeMinutes: 90,
      challenge: {
        title: 'ReseñApp MVC',
        brief: 'Reorganiza el código de ReseñApp en una estructura MVC: un modelo `Review` (y `Item` si aplica), un `ReviewController`, vistas separadas y un front controller que enruta por URI.',
        context:
          'Hasta ahora el proyecto mezcla consultas SQL, HTML y lógica en los mismos ficheros. Antes de añadir autenticación y una API REST, necesitas una base limpia donde cada cambio toque sólo la capa que corresponde.',
        objective:
          'Que la aplicación siga funcionando igual que antes pero con el código repartido en capas MVC bien definidas y un único punto de entrada.',
        targetUser: 'Desarrollador/a que va a mantener y ampliar el proyecto.',
        restrictions: [
          'El directorio `public/` sólo puede contener `index.php` y assets estáticos.',
          'Los modelos no pueden generar HTML.',
          'Las vistas no pueden contener consultas SQL ni lógica de negocio.',
          'Debe existir un router de entrada que reciba todas las peticiones.',
          'Usar autoloading (Composer PSR-4 o `spl_autoload_register`).',
        ],
        deliverables: [
          'Repositorio Git con la nueva estructura de carpetas (rama `feat/mvc` o commit descriptivo).',
          'Fichero `src/Models/Review.php` con métodos `getAll()`, `getById()`, `create()` y `delete()`.',
          'Fichero `src/Controllers/ReviewController.php` con métodos `index()`, `show()`, `new()` y `store()`.',
          'Vistas en `src/Views/` sin SQL ni lógica de negocio.',
          'Capturas de pantalla del listado de reseñas y del formulario funcionando.',
        ],
        checklist: [
          'El navegador sigue mostrando el listado y el detalle de reseñas.',
          'Acceder directamente a `src/` desde el navegador devuelve 403 o 404.',
          'No hay consultas SQL fuera de los Modelos.',
          'No hay HTML generado con `echo` en los Controladores.',
          'El router de entrada funciona para al menos tres rutas distintas.',
          'El autoloading carga las clases sin `require` manuales.',
        ],
        commonMistakes: [
          'Dejar `echo "<html>"` dentro del Controlador en vez de delegarlo a la Vista.',
          'Hacer la conexión PDO dentro de cada método del Modelo en lugar de inyectarla o centralizarla.',
          'Olvidar el `.htaccess` que redirige todo a `index.php`, haciendo que el router nunca se ejecute.',
          'Poner la carpeta `src/` dentro de `public/`, dejando los ficheros PHP accesibles directamente.',
        ],
        difficulty: 3,
        timeLimitMinutes: 120,
        skills: ['mvc', 'php'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'La aplicación sigue mostrando correctamente el listado, el detalle y el formulario de creación de reseñas tras la refactorización.',
            isCritical: true,
          },
          {
            name: 'Arquitectura MVC',
            description: 'Modelo, Vista y Controlador están claramente separados; ninguna capa hace el trabajo de otra; existe un único punto de entrada.',
            isCritical: true,
          },
          {
            name: 'Organización de carpetas y autoloading',
            description: '`public/` sólo expone lo necesario; el autoloading funciona sin `require` manuales esparcidos.',
          },
          {
            name: 'Calidad del código',
            description: 'Nombres de clases y métodos descriptivos, sin código comentado ni duplicado, PDO bien utilizado.',
          },
        ],
      },
    },
  ],
};
