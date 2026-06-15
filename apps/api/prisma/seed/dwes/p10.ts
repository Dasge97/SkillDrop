import { type PhaseSeed } from '../content-types.js';

export const dwesP10: PhaseSeed = {
  code: 'FASE 10',
  title: 'Proyecto integrador servidor',
  objective: 'Entregar el backend completo de ReseñApp integrando MVC, base de datos, autenticación, API REST, seguridad y despliegue, funcionando con el cliente Vue.',
  unlockedSkills: ['api-rest', 'mvc', 'seguridad-web'],
  projects: ['Backend completo de ReseñApp (proyecto integrador)'],
  lessons: [
    {
      title: 'Revisión y cierre del backend',
      objective: 'Repasar los pilares del backend (MVC, PDO, auth, API REST, seguridad, despliegue) e identificar puntos de mejora antes de la entrega final.',
      theory:
        'Un backend de producción es la suma de decisiones que se han ido tomando a lo largo del módulo: la arquitectura MVC separa la lógica de negocio del enrutamiento y de la presentación; PDO con consultas preparadas protege contra inyección SQL; los tokens JWT o las sesiones seguras garantizan que cada petición viene de quien dice ser; las cabeceras de seguridad (CORS restrictivo, Content-Security-Policy, X-Content-Type-Options…) reducen la superficie de ataque; y el despliegue con HTTPS y variables de entorno asegura que las credenciales nunca llegan al repositorio.\n\nAntes de la entrega final vale la pena hacer una revisión sistemática: recorrer cada endpoint y comprobar que valida la entrada, devuelve el código de estado correcto, maneja los errores sin exponer información interna y está cubierto por al menos un caso de prueba en Postman. También conviene revisar el esquema de base de datos: ¿los índices están donde se necesitan? ¿Las relaciones tienen claves foráneas? ¿Se hace alguna consulta N+1 innecesaria?\n\nLa documentación final no es un añadido opcional: es parte del entregable. Un README claro con instrucciones de instalación, variables de entorno, comandos de arranque y referencia de la API permite que otro desarrollador clone el repo y lo ponga en marcha sin preguntas. Incluye también decisiones de diseño relevantes: por qué elegiste esta estructura de carpetas, cómo gestionas los roles, qué estrategia de autenticación usas y por qué.',
      concepts: ['MVC', 'PDO', 'JWT', 'Cabeceras de seguridad', 'CORS', 'Variables de entorno', 'Índices en BD', 'README técnico'],
      tools: ['PHP', 'MySQL', 'Apache / Nginx', 'Postman', 'Composer', 'Git'],
      estimatedTimeMinutes: 60,
      challenge: {
        title: 'Backend completo de ReseñApp (proyecto integrador)',
        brief:
          'Entrega el backend completo de ReseñApp: autenticación de usuarios, gestión de ítems y reseñas, seguridad, documentación y despliegue en producción, funcionando con el cliente Vue.',
        context:
          'A lo largo del módulo DWES has construido el backend de ReseñApp pieza a pieza: el servidor HTTP, el patrón MVC, la base de datos con PDO, la autenticación, la API REST, las pruebas y el despliegue. Este proyecto integrador es la entrega final: el backend completo, limpio, seguro, documentado y en producción.',
        objective:
          'Demostrar que eres capaz de diseñar, construir, asegurar y desplegar un backend PHP profesional que expone una API REST consumida por un cliente Vue.',
        targetUser: 'Usuario final de ReseñApp que crea una cuenta, busca ítems, escribe reseñas y las consulta; y el evaluador técnico que revisa el código y prueba la API.',
        restrictions: [
          'El backend debe seguir el patrón MVC con separación clara de responsabilidades.',
          'Toda interacción con la base de datos debe usar PDO con consultas preparadas.',
          'La autenticación debe usar tokens (JWT recomendado) o sesiones seguras con CSRF.',
          'La API debe devolver JSON con códigos de estado HTTP correctos en todos los casos.',
          'HTTPS obligatorio en producción; CORS configurado solo para el origen del cliente Vue.',
          'Las credenciales deben estar en variables de entorno, nunca en el código fuente.',
          'El repositorio debe incluir .env.example, .gitignore y un README con instrucciones completas.',
          'Se deben entregar capturas del flujo completo funcionando en producción.',
        ],
        deliverables: [
          'Enlace al repositorio GitHub (público o con acceso compartido) con el código completo.',
          'URL de la API en producción con HTTPS.',
          'URL del cliente Vue en producción conectado a la API.',
          'Documentación de todos los endpoints (Markdown o equivalente) en el repo.',
          'Colección Postman exportada con los casos de prueba principales.',
          'Capturas de pantalla del flujo completo en producción: registro, login, crear ítem, escribir reseña, listar reseñas.',
          'README con instrucciones de instalación, variables de entorno y referencia de la API.',
        ],
        checklist: [
          'El registro e inicio de sesión funcionan y devuelven un token válido.',
          'Los endpoints protegidos devuelven 401 sin token y 403 si el rol no tiene permiso.',
          'Se pueden crear, listar y consultar ítems.',
          'Se pueden crear, listar y consultar reseñas asociadas a ítems.',
          'Las consultas SQL usan PDO con parámetros preparados (sin interpolación de variables).',
          'La API responde en HTTPS y el cliente Vue la consume sin errores de CORS.',
          'El .env no está en el repositorio; el .env.example sí.',
          'El README permite a otro desarrollador poner en marcha el proyecto sin preguntas.',
          'La colección Postman cubre al menos registro, login, crear reseña, listar reseñas, error 401 y error 404.',
          'El código está organizado en carpetas según MVC y no hay lógica mezclada en el enrutador.',
        ],
        commonMistakes: [
          'Subir el archivo .env con credenciales reales al repositorio.',
          'Usar consultas SQL concatenando variables (riesgo de inyección SQL).',
          'No validar ni sanear la entrada del usuario antes de procesarla.',
          'Configurar CORS con * en producción.',
          'Devolver mensajes de error detallados (stack trace, consulta SQL) al cliente en producción.',
          'No actualizar la URL de la API en el cliente Vue antes del despliegue final.',
          'README incompleto que no documenta las variables de entorno necesarias.',
        ],
        difficulty: 5,
        timeLimitMinutes: 480,
        skills: ['api-rest', 'mvc', 'seguridad-web'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'El flujo completo (registro, login, ítems, reseñas) funciona en producción sin errores; los códigos de estado HTTP son correctos en todos los casos.',
            isCritical: true,
          },
          {
            name: 'Seguridad',
            description: 'HTTPS, CORS restrictivo, PDO con parámetros preparados, credenciales en variables de entorno y sin información sensible en respuestas de error.',
          },
          {
            name: 'Documentación / claridad',
            description: 'README completo con instrucciones de instalación, documentación de endpoints y referencia al .env.example; colección Postman exportada y funcional.',
          },
          {
            name: 'Arquitectura MVC',
            description: 'Separación clara entre rutas, controladores, modelos y vistas/respuestas; sin lógica de negocio en el enrutador ni consultas SQL fuera del modelo.',
          },
          {
            name: 'Profesionalidad',
            description: 'Código limpio y legible, commits con mensajes descriptivos, estructura de carpetas coherente y entregables completos sin archivos innecesarios.',
          },
        ],
      },
    },
  ],
};
