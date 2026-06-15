import { type PhaseSeed } from '../content-types.js';

export const dwesP00: PhaseSeed = {
  code: 'FASE 0',
  title: 'Cómo funciona la web (HTTP)',
  objective: 'Entender el modelo cliente-servidor y preparar el entorno PHP para construir el backend de ReseñApp.',
  unlockedSkills: ['http', 'php'],
  projects: ['Entorno PHP configurado', 'Repo backend inicializado', 'Endpoint de diagnóstico JSON'],
  lessons: [
    {
      title: 'Cliente, servidor y HTTP',
      objective: 'Comprender qué ocurre desde que el navegador pide una URL hasta que recibe la respuesta.',
      theory:
        'Cuando escribes una URL en el navegador, éste actúa como cliente: abre una conexión TCP, envía una petición HTTP al servidor y espera la respuesta. La petición incluye un método (GET, POST, PUT, DELETE…), una ruta, cabeceras y, opcionalmente, un cuerpo. El servidor procesa la petición, ejecuta lógica y devuelve una respuesta con un código de estado (200 OK, 404 Not Found, 500 Internal Server Error…), cabeceras y el cuerpo.\n\nEl método indica la intención: GET recupera datos sin efectos secundarios, POST envía datos para crear o procesar, PUT actualiza un recurso completo y DELETE lo elimina. Los códigos de estado se agrupan: 2xx éxito, 3xx redirección, 4xx error del cliente, 5xx error del servidor. Conocer estos convenios es la base de cualquier API REST.\n\nEl servidor web (Apache, Nginx) recibe la petición, la enruta al intérprete PHP si la extensión es .php y devuelve la salida que el script genere. PHP puede emitir HTML, JSON, XML o cualquier tipo de contenido que se indique en la cabecera Content-Type.',
      concepts: ['HTTP request/response', 'Métodos HTTP', 'Códigos de estado', 'Cliente vs servidor', 'Servidor web', 'Content-Type'],
      tools: ['Navegador (DevTools → Red)', 'curl', 'Postman / Insomnia'],
      estimatedTimeMinutes: 30,
    },
    {
      title: 'Entorno PHP y primer script',
      objective: 'Instalar XAMPP o Docker, ejecutar un script PHP y entender la estructura inicial del repo de ReseñApp.',
      theory:
        'Para desarrollar en local necesitas un servidor web con soporte PHP y, más adelante, MySQL. XAMPP agrupa Apache + MySQL + PHP en un instalador sencillo para Windows/Mac/Linux; la alternativa Docker permite levantar el mismo stack con un archivo docker-compose.yml y olvidarte de instalaciones globales.\n\nEl primer script PHP más simple es un echo o un var_dump, pero en un backend real casi siempre querrás devolver JSON. La función json_encode() serializa arrays y objetos PHP a JSON; antes de cualquier salida debes enviar la cabecera correcta con header(\'Content-Type: application/json\'). PHP también expone la superglobal $_SERVER donde puedes leer el método de la petición ($_SERVER[\'REQUEST_METHOD\']) y la ruta ($_SERVER[\'REQUEST_URI\']).\n\nEl repo del backend de ReseñApp seguirá una estructura limpia desde el principio: carpeta public/ como document root (solo index.php y assets públicos), src/ para la lógica PHP, y archivos de configuración en la raíz. Inicializa el repositorio con git init, añade un .gitignore para PHP y documenta el arranque en el README.',
      example:
        '<?php\nheader(\'Content-Type: application/json\');\n$method = $_SERVER[\'REQUEST_METHOD\'];\n$uri    = parse_url($_SERVER[\'REQUEST_URI\'], PHP_URL_PATH);\necho json_encode([\'method\' => $method, \'path\' => $uri, \'time\' => date(\'H:i:s\')]);',
      concepts: ['XAMPP', 'Docker', 'document root', '$_SERVER', 'json_encode', 'header()', '.gitignore'],
      tools: ['XAMPP', 'Docker Desktop', 'VS Code + PHP Intelephense', 'Git'],
      estimatedTimeMinutes: 45,
      challenge: {
        title: 'Entorno listo y endpoint de diagnóstico',
        brief:
          'Monta el entorno local (XAMPP o Docker), crea el repo Git del backend de ReseñApp y escribe un script PHP que responda de forma distinta según el método HTTP y la ruta, devolviendo siempre JSON.',
        context:
          'El primer paso de cualquier proyecto backend es tener el entorno funcionando y un punto de entrada que demuestre que PHP recibe la petición correctamente. En ReseñApp este script será el germen del router.',
        objective:
          'Que PHP reciba peticiones HTTP, distinga método y ruta, y devuelva una respuesta JSON coherente con esa información.',
        targetUser: 'El propio desarrollador, verificando que el stack funciona.',
        restrictions: [
          'El script debe estar en public/index.php.',
          'Solo se puede usar PHP puro (sin frameworks).',
          'La respuesta debe tener Content-Type: application/json en todos los casos.',
          'El repo debe tener al menos un commit con .gitignore incluido.',
        ],
        deliverables: [
          'Enlace al repositorio GitHub (público o acceso compartido) con el código.',
          'Captura de pantalla de la respuesta JSON en el navegador o en Postman para GET y POST.',
        ],
        checklist: [
          'El servidor arranca sin errores.',
          'GET / devuelve JSON con método, ruta y hora.',
          'POST / devuelve JSON con un mensaje distinto.',
          'Una ruta desconocida devuelve JSON con status 404 y mensaje de error.',
          'El repo tiene .gitignore y al menos un commit inicial.',
        ],
        commonMistakes: [
          'Olvidar la cabecera Content-Type antes de cualquier echo.',
          'Mezclar HTML y JSON en la misma respuesta.',
          'Poner los archivos fuera de public/ y que el servidor no los encuentre.',
          'No hacer git init o no añadir el .gitignore antes del primer commit.',
        ],
        difficulty: 1,
        timeLimitMinutes: 60,
        skills: ['http', 'php'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'El script responde JSON válido con método, ruta y código de estado correcto en todos los casos probados.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Código legible, sin mezcla de responsabilidades, variables con nombres claros.',
          },
          {
            name: 'Buenas prácticas PHP',
            description: 'Cabecera Content-Type enviada antes de cualquier salida; uso correcto de $_SERVER; sin warnings.',
          },
          {
            name: 'Claridad / organización',
            description: 'Estructura de carpetas coherente, .gitignore presente y commits con mensajes descriptivos.',
          },
        ],
      },
    },
  ],
};
