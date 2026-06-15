import { type PhaseSeed } from '../content-types.js';

export const dwesP06: PhaseSeed = {
  code: 'FASE 6',
  title: 'API REST',
  objective: 'Exponer una API REST bien definida que el cliente Vue pueda consumir, gestionando recursos, verbos HTTP, códigos de estado y JSON de forma correcta.',
  unlockedSkills: ['api-rest'],
  projects: ['API REST de ReseñApp (/api/reviews, /api/items, /api/auth)', 'Router de rutas versionadas', 'Validación de entrada en endpoints'],
  lessons: [
    {
      title: 'Principios REST y diseño de recursos',
      objective: 'Entender qué hace RESTful a una API y cómo diseñar sus rutas y verbos antes de escribir una sola línea de PHP.',
      theory:
        'REST (Representational State Transfer) no es un protocolo sino un conjunto de restricciones sobre HTTP. La idea central es que cada URL representa un recurso (/items, /reviews, /users) y los verbos HTTP expresan la acción: GET recupera, POST crea, PUT/PATCH actualiza y DELETE elimina. Una API REST bien diseñada es predecible: un desarrollador que no la conoce puede intuir qué hace GET /api/reviews/3.\n\nLos códigos de estado son contrato: 200 OK para lecturas satisfactorias, 201 Created al crear un recurso (con el Location del nuevo recurso en la cabecera), 204 No Content al borrar sin cuerpo de respuesta, 400 Bad Request cuando la entrada es inválida, 401 Unauthorized cuando falta autenticación, 403 Forbidden cuando el usuario no tiene permiso, 404 Not Found cuando el recurso no existe y 422 Unprocessable Entity para errores de validación. Devolver el código correcto permite al cliente Vue reaccionar sin parsear el cuerpo.\n\nEl versionado de la API (/api/v1/...) protege a los clientes ante cambios de contrato. Aunque en un proyecto académico puede parecer prematuro, es un hábito profesional que evita romper el frontend cuando el backend evoluciona. La forma más sencilla es incluir la versión en el prefijo de ruta y que el router la extraiga.\n\nUna buena práctica complementaria es documentar cada endpoint aunque sea en un README o en una colección Postman: método, ruta, parámetros, cuerpo esperado y respuestas posibles. Esta documentación se convierte en el contrato entre el equipo de backend (DWES) y el de frontend (DWEC).',
      concepts: ['Recurso REST', 'Verbos HTTP (GET, POST, PUT, DELETE)', 'Códigos de estado HTTP', 'Versionado de API (/v1/)', 'Contrato de API', 'JSON como formato de intercambio'],
      tools: ['Postman / Insomnia', 'curl', 'PHP (header, json_encode, json_decode)', 'VS Code'],
      estimatedTimeMinutes: 35,
    },
    {
      title: 'Implementar endpoints REST en PHP: JSON, rutas y validación',
      objective: 'Construir un router PHP que dispatch peticiones a controladores, responda y reciba JSON correctamente, y valide la entrada antes de tocar la base de datos.',
      theory:
        'En PHP puro, el punto de entrada único es public/index.php. El router lee $_SERVER[\'REQUEST_METHOD\'] y parse_url($_SERVER[\'REQUEST_URI\'], PHP_URL_PATH) para decidir qué controlador invocar. Un patrón limpio es una tabla asociativa de rutas o una clase Router con métodos get(), post(), put(), delete() que registran callbacks.\n\nPara recibir JSON en el cuerpo de una petición POST o PUT se usa file_get_contents(\'php://input\') seguido de json_decode(..., true). Siempre hay que comprobar que json_last_error() === JSON_ERROR_NONE antes de usar los datos. Para responder, se envía header(\'Content-Type: application/json\') antes de cualquier salida y se usa echo json_encode($data). Si además se quiere enviar un código de estado distinto de 200, http_response_code(201) o header(\'HTTP/1.1 404 Not Found\') antes del json_encode.\n\nLa validación de entrada es la primera línea de defensa y también la más frecuente fuente de bugs: comprobar que los campos requeridos existen, que los tipos son correctos (is_int, is_string, filter_var para emails y URLs) y que los valores están dentro de rangos aceptables (longitud de cadenas, valores numéricos). Si la validación falla, devolver 422 con un objeto JSON que explique qué campo falló y por qué, para que el cliente Vue pueda mostrar el error de forma específica.\n\nPara la autenticación de los endpoints protegidos, la petición del cliente incluirá una cabecera Authorization: Bearer <token> o una cookie de sesión. El middleware de autenticación debe ejecutarse antes del controlador y cortar la cadena devolviendo 401 si el token es inválido o ha expirado.',
      example:
        '<?php\n// Leer JSON del cuerpo\n$body = json_decode(file_get_contents(\'php://input\'), true);\nif (json_last_error() !== JSON_ERROR_NONE) {\n    http_response_code(400);\n    echo json_encode([\'error\' => \'JSON inválido\']);\n    exit;\n}\n// Validar campo requerido\nif (empty($body[\'content\'])) {\n    http_response_code(422);\n    echo json_encode([\'error\' => \'El campo content es obligatorio\']);\n    exit;\n}\n// Respuesta creada\nhttp_response_code(201);\necho json_encode([\'id\' => 42, \'content\' => $body[\'content\']]);',
      concepts: ['file_get_contents(php://input)', 'json_decode / json_encode', 'http_response_code()', 'Router de rutas', 'Validación de entrada', 'Middleware de autenticación', 'Authorization header'],
      tools: ['PHP', 'Postman / Insomnia', 'MySQL / PDO', 'VS Code'],
      estimatedTimeMinutes: 50,
      challenge: {
        title: 'API REST de ReseñApp',
        brief:
          'Implementa la API REST de ReseñApp con al menos tres grupos de rutas (/api/reviews, /api/items, /api/auth) que devuelvan y reciban JSON correctamente, usen los códigos de estado HTTP adecuados y validen la entrada antes de consultar la base de datos.',
        context:
          'El frontend Vue de ReseñApp necesita consumir un backend real. En este reto construyes ese backend: un router PHP que dispatch las peticiones a controladores, lee JSON del cuerpo, valida los datos y responde con JSON y el código de estado correcto. Es el eje central del proyecto.',
        objective:
          'Que el cliente Vue pueda hacer GET /api/items, POST /api/reviews (con autenticación), PUT /api/reviews/:id y DELETE /api/reviews/:id y recibir respuestas JSON coherentes con el estado de la operación.',
        targetUser: 'El frontend Vue de ReseñApp y cualquier cliente HTTP (Postman, curl).',
        restrictions: [
          'Solo PHP puro y PDO (sin frameworks ni librerías externas).',
          'Todas las respuestas deben tener Content-Type: application/json.',
          'Los códigos de estado deben ser semánticamente correctos (201 al crear, 404 si no existe, 422 si la validación falla, etc.).',
          'Los endpoints protegidos deben requerir autenticación (sesión o token) y devolver 401 si no está presente.',
          'La entrada debe validarse antes de ejecutar cualquier consulta SQL.',
        ],
        deliverables: [
          'Enlace al repositorio GitHub con el código del backend.',
          'Colección Postman (o archivo JSON exportado) con todos los endpoints cubiertos.',
          'Capturas de Postman mostrando: GET /api/items (200), POST /api/reviews (201), intento sin autenticación (401), petición con campo inválido (422), recurso inexistente (404).',
        ],
        checklist: [
          'GET /api/items devuelve un array JSON con los ítems de la base de datos.',
          'POST /api/reviews crea una reseña y devuelve 201 con el recurso creado.',
          'PUT /api/reviews/:id actualiza la reseña y devuelve 200.',
          'DELETE /api/reviews/:id elimina la reseña y devuelve 204.',
          'POST /api/auth/login devuelve un token o inicia sesión correctamente.',
          'Un endpoint protegido sin credenciales devuelve 401.',
          'Un campo requerido ausente devuelve 422 con mensaje de error específico.',
          'Una ruta inexistente devuelve 404.',
          'Todas las respuestas tienen Content-Type: application/json.',
        ],
        commonMistakes: [
          'Enviar cabeceras después de haber hecho echo (el orden importa: primero header(), luego echo).',
          'Devolver siempre 200 aunque la operación falle o no encuentre el recurso.',
          'No validar la entrada y pasar datos del usuario directamente a la consulta SQL.',
          'Olvidar manejar el método OPTIONS para que Postman y el cliente Vue puedan hacer preflight.',
          'Mezclar lógica de base de datos dentro del router en lugar de delegar a controladores.',
        ],
        difficulty: 4,
        timeLimitMinutes: 180,
        skills: ['api-rest', 'mysql-pdo'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Todos los endpoints devuelven el JSON correcto y el código de estado adecuado en los escenarios probados (éxito, recurso no encontrado, no autenticado, validación fallida).',
            isCritical: true,
          },
          {
            name: 'Seguridad',
            description: 'Los endpoints protegidos comprueban la autenticación; las consultas SQL usan sentencias preparadas con PDO; no se expone información sensible en las respuestas de error.',
            isCritical: true,
          },
          {
            name: 'Diseño de la API / REST',
            description: 'Las rutas siguen convenciones REST (sustantivos en plural, verbos HTTP correctos, versionado opcional); los códigos de estado son semánticamente correctos.',
          },
          {
            name: 'Calidad del código',
            description: 'Router y controladores separados, validación centralizada, nombres claros y sin código duplicado.',
          },
        ],
      },
    },
  ],
};
