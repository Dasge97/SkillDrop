import { type PhaseSeed } from '../content-types.js';

export const dwesP08: PhaseSeed = {
  code: 'FASE 8',
  title: 'Tests y documentación',
  objective: 'Validar y documentar la API REST de ReseñApp mediante pruebas manuales, colecciones Postman y documentación técnica de endpoints.',
  unlockedSkills: ['api-rest'],
  projects: ['Colección Postman de ReseñApp', 'Tabla de endpoints documentada', 'Suite de pruebas manuales con casos de éxito y error'],
  lessons: [
    {
      title: 'Pruebas manuales con Postman y cURL',
      objective: 'Diseñar y ejecutar casos de prueba manuales para verificar que los endpoints de la API se comportan correctamente.',
      theory:
        'Probar una API no es solo comprobar que "funciona": hay que cubrir el camino feliz (datos válidos, usuario autenticado) y los casos límite (datos incorrectos, token expirado, recurso inexistente). Herramientas como Postman o Insomnia permiten guardar peticiones en colecciones organizadas, añadir variables de entorno (para alternar entre local y producción sin reescribir URLs) y ejecutar flujos encadenados donde el token de login se reutiliza automáticamente en peticiones posteriores.\n\ncURL es la alternativa de línea de comandos: útil para scripting y para documentar ejemplos reproducibles sin depender de una interfaz gráfica. Un ejemplo mínimo: curl -X POST http://localhost/api/resenas -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d \'{"item_id":1,"puntuacion":4,"texto":"Muy bueno"}\'. Copiar estos comandos en la documentación facilita que otros desarrolladores reproduzcan los mismos escenarios.\n\nUn caso de prueba bien definido tiene: método + ruta, datos de entrada (si los hay), estado HTTP esperado y estructura del cuerpo de respuesta esperado. Documenta al menos un caso positivo y uno negativo por endpoint crítico: crear reseña con datos válidos vs. sin token, obtener reseñas de un ítem existente vs. uno inexistente, etc.',
      concepts: ['Colección Postman', 'Variables de entorno', 'Casos de prueba', 'cURL', 'Caso positivo / caso negativo', 'Código de estado esperado'],
      tools: ['Postman', 'cURL', 'Navegador DevTools'],
      estimatedTimeMinutes: 40,
    },
    {
      title: 'Documentar endpoints y pruebas unitarias básicas',
      objective: 'Producir documentación técnica de la API y conocer el enfoque introductorio de PHPUnit para pruebas unitarias.',
      theory:
        'La documentación de una API REST describe, para cada endpoint: método HTTP, ruta, parámetros de ruta y query, cuerpo de la petición (con tipos y campos obligatorios/opcionales), posibles respuestas (código de estado + estructura JSON de éxito y error) y si requiere autenticación. Una tabla Markdown o un archivo OpenAPI/Swagger son los formatos más habituales. Sin documentación, una API solo la entiende quien la escribió.\n\nPHPUnit es el framework de tests estándar en PHP. En un nivel introductorio, permite escribir métodos de prueba que llaman a funciones de la lógica de negocio y verifican el resultado con aserciones (assertEquals, assertNotEmpty, assertTrue…). En ReseñApp puedes probar funciones puras como la validación de datos de entrada o el cálculo de la puntuación media, sin necesidad de arrancar el servidor. Instala PHPUnit con Composer (composer require --dev phpunit/phpunit) y crea una carpeta tests/ con al menos una clase de prueba.\n\nLa cobertura de tests no tiene que ser del 100 % en este nivel: el objetivo es entender el flujo (escribir la prueba, ejecutar phpunit, leer el resultado) y tener al menos dos o tres pruebas que cubran validaciones críticas. Lo más valioso es el hábito: cualquier función que valide datos o transforme información es candidata a un test unitario.',
      example:
        '<?php\nuse PHPUnit\\Framework\\TestCase;\n\nclass ResenaValidadorTest extends TestCase\n{\n    public function test_puntuacion_fuera_de_rango_es_invalida(): void\n    {\n        $this->assertFalse(validarPuntuacion(6));\n        $this->assertFalse(validarPuntuacion(0));\n    }\n\n    public function test_puntuacion_valida(): void\n    {\n        $this->assertTrue(validarPuntuacion(3));\n    }\n}',
      concepts: ['Documentación de endpoints', 'OpenAPI / Swagger', 'PHPUnit', 'Aserción', 'Composer', 'Tests unitarios', 'Cobertura'],
      tools: ['PHPUnit', 'Composer', 'Postman', 'Markdown'],
      estimatedTimeMinutes: 45,
      challenge: {
        title: 'Documenta y prueba la API de ReseñApp',
        brief:
          'Crea una tabla de documentación con todos los endpoints de la API de ReseñApp y una colección Postman que verifique al menos 6 casos de prueba (éxito y error) cubriendo los flujos de autenticación y reseñas.',
        context:
          'La API de ReseñApp ya tiene los endpoints de autenticación (registro/login), gestión de ítems y reseñas. Antes del despliegue hay que asegurarse de que todo funciona tal como se especificó y dejar documentación que el equipo frontend pueda consultar sin preguntar al backend.',
        objective:
          'Que cualquier desarrollador pueda entender la API leyendo la documentación y reproducir los casos de prueba importando la colección Postman.',
        targetUser: 'Desarrollador frontend o nuevo integrante del equipo que necesita consumir la API.',
        restrictions: [
          'La tabla de endpoints debe cubrir todos los recursos: auth, ítems y reseñas.',
          'Cada endpoint documentado debe incluir: método, ruta, autenticación requerida (sí/no), parámetros, respuesta de éxito y al menos un caso de error.',
          'La colección Postman debe usar una variable de entorno {{base_url}} para la URL base.',
          'Incluir al menos 2 pruebas unitarias con PHPUnit sobre funciones de validación.',
          'No se puede usar documentación generada automáticamente sin revisión manual.',
        ],
        deliverables: [
          'Enlace al repositorio GitHub con el código actualizado.',
          'Archivo de documentación de la API (Markdown o equivalente) en la raíz del repo.',
          'Colección Postman exportada (JSON) subida al repo o compartida con el enlace de importación.',
          'Captura de pantalla de los tests de Postman en verde y de la ejecución de PHPUnit.',
        ],
        checklist: [
          'La tabla documenta todos los endpoints con método, ruta, auth, parámetros y respuestas.',
          'La colección Postman cubre al menos: registro, login, listar ítems, crear reseña (éxito), crear reseña sin token (error 401) y obtener reseña de ítem inexistente (error 404).',
          'La variable {{base_url}} funciona en todos los requests de la colección.',
          'PHPUnit ejecuta sin errores y las aserciones pasan.',
          'El archivo de documentación está en el repo y se lee con claridad.',
        ],
        commonMistakes: [
          'Documentar solo el camino feliz y omitir los errores esperados.',
          'Usar URLs absolutas en Postman en lugar de la variable de entorno.',
          'Confundir pruebas de integración (Postman llama al servidor) con unitarias (PHPUnit prueba funciones aisladas).',
          'No exportar la colección Postman antes de entregar.',
          'Pruebas que pasan solo porque no afirman nada (test vacío o con assertTrue(true)).',
        ],
        difficulty: 3,
        timeLimitMinutes: 120,
        skills: ['api-rest'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'La colección Postman ejecuta sin errores y todos los casos de prueba devuelven el código de estado y la estructura JSON esperados.',
            isCritical: true,
          },
          {
            name: 'Seguridad',
            description: 'Los endpoints protegidos devuelven 401 cuando se llaman sin token; no se exponen datos sensibles en las respuestas de error.',
          },
          {
            name: 'Documentación / claridad',
            description: 'La tabla de endpoints está completa, es legible y permite a un desarrollador nuevo usar la API sin consultar el código fuente.',
          },
          {
            name: 'Profesionalidad',
            description: 'La colección tiene variables de entorno, los tests PHPUnit tienen nombres descriptivos y el repo tiene commits con mensajes claros.',
          },
        ],
      },
    },
  ],
};
