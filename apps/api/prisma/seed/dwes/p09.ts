import { type PhaseSeed } from '../content-types.js';

export const dwesP09: PhaseSeed = {
  code: 'FASE 9',
  title: 'Despliegue',
  objective: 'Llevar el backend de ReseñApp a un servidor de producción, configurar HTTPS y conectarlo con el cliente Vue.',
  unlockedSkills: ['despliegue'],
  projects: ['Backend de ReseñApp desplegado en producción', 'Configuración HTTPS y CORS', 'Cliente Vue conectado a la API en producción'],
  lessons: [
    {
      title: 'Preparar el backend para producción',
      objective: 'Conocer las diferencias entre entorno de desarrollo y producción, y configurar correctamente variables de entorno y el servidor web.',
      theory:
        'Un backend en producción no es igual que en local: los errores no deben mostrarse al usuario (display_errors = Off en php.ini), las credenciales nunca van en el código (se leen de variables de entorno o de un archivo .env excluido del repositorio con .gitignore), y el servidor web debe estar configurado para enrutar todas las peticiones a public/index.php. En Apache esto se consigue con un archivo .htaccess que active mod_rewrite; en Nginx, con un bloque location que redirija a index.php.\n\nLas variables de entorno en PHP se pueden leer con getenv() o con $_ENV después de cargarlas mediante una librería como vlucas/phpdotenv. El archivo .env define pares CLAVE=VALOR (DB_HOST, DB_NAME, DB_USER, DB_PASS, JWT_SECRET…) y el .env.example (sin valores reales) se sube al repo como referencia. Nunca commits el .env real.\n\nPara el despliegue puedes usar un VPS (DigitalOcean, Hetzner, AWS Lightsail…) con LAMP o LEMP, un servicio de hosting compartido con soporte PHP, o contenedores Docker. En todos los casos, el proceso es: subir el código (git pull o FTP), instalar dependencias con composer install --no-dev, configurar las variables de entorno en el servidor y verificar que la base de datos de producción está migrada.',
      concepts: ['Variables de entorno', '.env / .env.example', 'display_errors', '.htaccess', 'mod_rewrite', 'VPS', 'composer install --no-dev'],
      tools: ['SSH', 'Apache / Nginx', 'Composer', 'phpdotenv', 'FileZilla / rsync'],
      estimatedTimeMinutes: 50,
      challenge: {
        title: 'Despliega la API de ReseñApp y conéctala con el cliente Vue',
        brief:
          'Despliega el backend PHP de ReseñApp en un servidor real, configura HTTPS y ajusta la URL de producción en el cliente Vue para que ambos se comuniquen correctamente.',
        context:
          'El backend funciona en local y está documentado. Ahora hay que publicarlo para que el cliente Vue (ya desplegado o que desplegarás en un servicio como Vercel/Netlify) pueda consumirlo desde cualquier navegador. Hay que resolver CORS, HTTPS y las variables de entorno de producción.',
        objective:
          'Que un usuario real pueda abrir el cliente Vue, registrarse, crear una reseña y verla, todo en producción.',
        targetUser: 'Cualquier usuario con acceso a internet que abra la URL del cliente Vue.',
        restrictions: [
          'El servidor debe tener HTTPS habilitado (certificado Let\'s Encrypt o equivalente).',
          'Las credenciales de la base de datos deben estar en variables de entorno del servidor, nunca en el código.',
          'La cabecera CORS debe permitir solo el origen del cliente Vue en producción (no "* " en producción).',
          'El archivo .env no puede estar en el repositorio.',
          'Se debe poder hacer composer install en el servidor sin errores.',
        ],
        deliverables: [
          'Enlace al repositorio GitHub con el código actualizado.',
          'URL de la API en producción (ej. https://api.resenapp.example.com/api/resenas).',
          'URL del cliente Vue en producción conectado a la API.',
          'Captura de pantalla del candado HTTPS en el navegador al acceder a la API.',
          'Captura de pantalla del flujo completo en producción: login + crear reseña + listar reseñas.',
        ],
        checklist: [
          'La API responde en HTTPS sin advertencias de certificado.',
          'Los endpoints protegidos requieren token y devuelven 401 si no se envía.',
          'El cliente Vue llama a la URL de producción (sin localhost).',
          'CORS permite el origen del cliente Vue y bloquea orígenes no autorizados.',
          'Las variables de entorno de producción están configuradas en el servidor (no en el repo).',
          'El flujo registro → login → crear reseña → listar reseñas funciona de extremo a extremo.',
        ],
        commonMistakes: [
          'Dejar display_errors activado en producción (expone rutas y lógica interna).',
          'Configurar CORS con * en producción (cualquier origen puede llamar a la API).',
          'Olvidar ejecutar composer install en el servidor tras el despliegue.',
          'No migrar o sembrar la base de datos de producción.',
          'Mezclar la URL de la API local y la de producción en el cliente Vue sin usar variables de entorno de Vue.',
        ],
        difficulty: 4,
        timeLimitMinutes: 180,
        skills: ['despliegue', 'seguridad-web'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'La API responde en producción con HTTPS y el cliente Vue la consume correctamente; el flujo completo funciona sin errores.',
            isCritical: true,
          },
          {
            name: 'Seguridad',
            description: 'HTTPS activado, CORS restrictivo al origen del cliente, credenciales en variables de entorno y display_errors desactivado.',
          },
          {
            name: 'Documentación / claridad',
            description: 'El README incluye instrucciones de despliegue paso a paso y referencias a las variables de entorno necesarias (sin valores reales).',
          },
          {
            name: 'Profesionalidad',
            description: 'El servidor está limpio (sin archivos de desarrollo innecesarios), el .env.example está actualizado y las URLs de producción no aparecen hardcodeadas en el código.',
          },
        ],
      },
    },
  ],
};
