import { type PhaseSeed } from '../content-types.js';

export const dwesP07: PhaseSeed = {
  code: 'FASE 7',
  title: 'Seguridad',
  objective: 'Proteger la API de ReseñApp contra las amenazas más comunes: inyección SQL, XSS, entrada maliciosa, exposición de errores, acceso no autorizado y peticiones de orígenes no permitidos.',
  unlockedSkills: ['seguridad-web'],
  projects: ['API de ReseñApp endurecida con CORS, validación estricta y manejo seguro de errores', 'Hashing de contraseñas con password_hash', 'Política de CORS para el cliente Vue'],
  lessons: [
    {
      title: 'Inyección SQL, XSS y sanitización de entrada',
      objective: 'Identificar y neutralizar las vulnerabilidades de inyección más frecuentes en aplicaciones PHP con base de datos.',
      theory:
        'La inyección SQL ocurre cuando datos del usuario se concatenan directamente en una consulta SQL. Si un atacante envía \' OR 1=1 -- como valor de un campo, puede leer toda la tabla o saltarse la autenticación. La solución es usar sentencias preparadas con PDO: $stmt = $pdo->prepare(\'SELECT * FROM users WHERE email = ?\'); $stmt->execute([$email]);. El driver escapa los valores automáticamente y los trata como datos, nunca como código SQL.\n\nXSS (Cross-Site Scripting) ocurre cuando datos no escapados del usuario se insertan en una respuesta HTML y el navegador los ejecuta como JavaScript. En una API REST que solo devuelve JSON el riesgo de XSS directo es menor, pero puede aparecer si algún endpoint devuelve HTML o si los datos almacenados se muestran después en una plantilla. La defensa es escapar la salida con htmlspecialchars() en contexto HTML y asegurarse de que el Content-Type siempre es application/json cuando corresponde.\n\nLa sanitización y validación de entrada son dos cosas distintas: validar comprueba que el dato cumple las reglas del negocio (el email tiene formato correcto, la puntuación está entre 1 y 5); sanitizar elimina o transforma caracteres peligrosos. En PHP, filter_var($email, FILTER_VALIDATE_EMAIL) valida; strip_tags($input) sanitiza (aunque para APIs es mejor rechazar la entrada inválida con un 422 en lugar de silenciosamente modificarla).\n\nEl hashing de contraseñas es no negociable: nunca se almacena la contraseña en texto plano ni con MD5 o SHA1. La función password_hash($password, PASSWORD_BCRYPT) genera un hash seguro con sal aleatoria incluida; password_verify($input, $hash) comprueba si coincide sin necesidad de conocer la sal. Esta pareja es el estándar en PHP moderno.',
      concepts: ['Inyección SQL', 'Sentencias preparadas PDO', 'XSS (Cross-Site Scripting)', 'htmlspecialchars()', 'Validación vs sanitización', 'filter_var()', 'password_hash / password_verify', 'BCRYPT'],
      tools: ['PHP (PDO, filter_var, password_hash)', 'MySQL', 'Postman', 'OWASP Top 10'],
      estimatedTimeMinutes: 40,
    },
    {
      title: 'CORS, manejo seguro de errores y control de acceso',
      objective: 'Configurar CORS para que solo el cliente Vue autorizado pueda consumir la API, manejar errores sin filtrar información interna y aplicar control de acceso por rol.',
      theory:
        'CORS (Cross-Origin Resource Sharing) es el mecanismo por el que un navegador permite o bloquea peticiones entre orígenes distintos. Cuando el cliente Vue (http://localhost:5173) llama a la API (http://localhost:8000), el navegador envía una petición preflight OPTIONS y comprueba si la respuesta incluye Access-Control-Allow-Origin con el origen permitido. Si la cabecera no está o el origen no coincide, el navegador bloquea la petición aunque el servidor haya respondido.\n\nEn PHP se configuran las cabeceras CORS al inicio de index.php, antes de cualquier salida: header(\'Access-Control-Allow-Origin: http://localhost:5173\'), header(\'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\') y header(\'Access-Control-Allow-Headers: Content-Type, Authorization\'). Para el preflight hay que detectar OPTIONS y responder 204 inmediatamente. En producción el origen permitido debe ser el dominio real del frontend, no un comodín *, salvo en APIs públicas sin credenciales.\n\nEl manejo de errores seguro implica dos principios: nunca exponer detalles internos al cliente (rutas de fichero, stack traces, nombres de tablas) y siempre registrar esos detalles en un log del servidor. En PHP se puede desactivar la exposición con display_errors = Off en php.ini o ini_set(\'display_errors\', 0) y capturar errores con set_exception_handler() y set_error_handler() que escriben en error_log. Al cliente solo llega un JSON genérico con el código de estado y un mensaje amigable.\n\nEl control de acceso comprueba que el usuario autenticado tiene permiso para la operación concreta, no solo que está autenticado. Un usuario puede estar logueado y aun así no poder borrar la reseña de otro. Este principio —autorización además de autenticación— se implementa comparando el user_id del recurso con el del token o la sesión activa antes de ejecutar UPDATE o DELETE.',
      concepts: ['CORS', 'Access-Control-Allow-Origin', 'Preflight OPTIONS', 'display_errors', 'error_log', 'set_exception_handler', 'Control de acceso (autorización)', 'Autenticación vs autorización'],
      tools: ['PHP (header, ini_set, error_log)', 'Postman (ver cabeceras de respuesta)', 'DevTools del navegador (pestaña Red)', 'VS Code'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'API de ReseñApp endurecida',
        brief:
          'Aplica un conjunto de medidas de seguridad sobre la API REST de ReseñApp: CORS estricto para el origen del cliente Vue, validación y sanitización de toda la entrada, sentencias preparadas en todas las consultas, hashing de contraseñas con bcrypt, manejo de errores que no filtre información interna y control de acceso que impida que un usuario modifique recursos de otro.',
        context:
          'La API que construiste en la Fase 6 funciona pero no está protegida. Un atacante podría inyectar SQL, obtener stack traces con información de la base de datos o llamar a la API desde cualquier origen. En este reto blindas esas vulnerabilidades siguiendo el OWASP Top 10 aplicado a PHP.',
        objective:
          'Que la API resista los vectores de ataque más comunes: inyección SQL, entrada maliciosa, errores filtrados, CORS permisivo y acceso no autorizado a recursos de otros usuarios.',
        targetUser: 'El equipo de seguridad que auditará la API y los usuarios finales de ReseñApp.',
        restrictions: [
          'Todas las consultas SQL deben usar sentencias preparadas con PDO (prohibido concatenar variables en el SQL).',
          'Las contraseñas deben almacenarse con password_hash(PASSWORD_BCRYPT) y verificarse con password_verify().',
          'CORS debe permitir solo el origen del cliente Vue (no el comodín *).',
          'Los errores no deben exponer rutas de fichero, nombres de tabla ni stack traces al cliente.',
          'Un usuario solo puede editar o eliminar sus propias reseñas.',
        ],
        deliverables: [
          'Enlace al repositorio GitHub con los cambios de seguridad aplicados sobre la rama de la Fase 6.',
          'Capturas de Postman mostrando: intento de inyección SQL bloqueado (respuesta segura), intento de CORS desde origen no permitido (cabecera ausente o rechazada), intento de borrar reseña ajena (403), error interno que devuelve mensaje genérico (sin stack trace).',
          'Breve anotación en el README (5-10 líneas) explicando qué vulnerabilidades se han mitigado y cómo.',
        ],
        checklist: [
          'Ninguna consulta SQL concatena variables: todas usan prepare() y execute().',
          'Las contraseñas en la base de datos son hashes bcrypt.',
          'La cabecera Access-Control-Allow-Origin solo aparece con el origen del cliente Vue.',
          'Las peticiones OPTIONS reciben 204 con las cabeceras CORS correctas.',
          'display_errors está desactivado; los errores se escriben en el log del servidor.',
          'Un intento de UPDATE/DELETE sobre una reseña ajena devuelve 403.',
          'La entrada inválida (campos vacíos, email mal formado, puntuación fuera de rango) devuelve 422 con mensaje específico.',
          'El README documenta las medidas de seguridad aplicadas.',
        ],
        commonMistakes: [
          'Usar Access-Control-Allow-Origin: * creyendo que es suficiente para desarrollo (rompe el envío de cookies/credenciales).',
          'Desactivar display_errors en php.ini pero olvidar ini_set() en el script, que puede sobreescribirlo.',
          'Validar la entrada pero seguir concatenando variables en el SQL (las dos cosas son necesarias).',
          'Confundir autenticación (¿quién eres?) con autorización (¿puedes hacer esto?) y omitir la segunda comprobación.',
          'Devolver el mensaje de excepción de PDO directamente al cliente, exponiendo la estructura de la base de datos.',
        ],
        difficulty: 4,
        timeLimitMinutes: 150,
        skills: ['seguridad-web', 'api-rest'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Las medidas de seguridad están activas y la API sigue respondiendo correctamente a peticiones legítimas; ninguna funcionalidad previa se ha roto.',
            isCritical: true,
          },
          {
            name: 'Seguridad',
            description: 'Sentencias preparadas en todas las consultas, bcrypt en contraseñas, CORS restrictivo, errores sin información interna y control de acceso por propietario implementados y verificables.',
            isCritical: true,
          },
          {
            name: 'Diseño de la API / REST',
            description: 'Los códigos de estado de error (401, 403, 422) se usan con precisión y las respuestas de error siguen un formato JSON consistente.',
          },
          {
            name: 'Calidad del código',
            description: 'Las comprobaciones de seguridad están centralizadas (middleware, helpers), no duplicadas en cada endpoint; el código es legible y sin lógica mezclada.',
          },
        ],
      },
    },
  ],
};
