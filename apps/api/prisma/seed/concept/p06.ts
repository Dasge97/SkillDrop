import { type PhaseSeed } from '../content-types.js';

export const conceptP06: PhaseSeed = {
  code: 'FASE 6',
  title: 'Autenticación',
  objective:
    'Cómo sabe el servidor quién eres tras el login, sin volver a pedir la contraseña.',
  unlockedSkills: ['auth-sesiones'],
  projects: [],
  lessons: [
    {
      title: 'El problema de la identidad en HTTP',
      objective:
        'Entender por qué HTTP es sin estado y cómo el cliente demuestra su identidad en cada petición.',
      theory:
        'HTTP es un protocolo sin estado (stateless): cada petición es independiente y el servidor no recuerda nada de las anteriores. Eso significa que, aunque te hayas identificado con éxito hace un segundo, en la siguiente petición el servidor no sabe quién eres a menos que tú mismo se lo indiques.\n\nPara resolver esto, después del login el servidor entrega al cliente algún tipo de credencial —un token o un identificador de sesión— que el cliente deberá adjuntar en todas las peticiones posteriores. El servidor comprueba esa credencial en cada llamada y, si es válida, procesa la petición como si fuera tuya.\n\nEste mecanismo es el corazón de la autenticación en cualquier aplicación web. Sin él, habría que pedir el usuario y la contraseña en cada clic, lo que sería inutilizable e inseguro.\n\nEl reto de diseño está en que esa credencial sea difícil de falsificar, tenga una vida útil limitada y viaje por el canal correcto (siempre HTTPS para que no pueda ser interceptada).',
      concepts: ['stateless', 'autenticacion', 'token', 'sesion'],
      tools: [],
      estimatedTimeMinutes: 12,
      challenge: {
        title: '¿Cómo demuestra el cliente quién es?',
        brief:
          'Tras iniciar sesión, ¿cómo demuestra el cliente quién es en CADA petición?',
        difficulty: 1,
        timeLimitMinutes: 5,
        skills: ['auth-sesiones'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'quiz',
          prompt:
            'Tras iniciar sesión, ¿cómo demuestra el cliente quién es en CADA petición posterior?',
          quiz: {
            options: [
              {
                id: 'a',
                text: 'Enviando un token o credencial en cada petición (por ejemplo en la cabecera Authorization).',
              },
              {
                id: 'b',
                text: 'Reenviando el usuario y la contraseña en cada petición.',
              },
              {
                id: 'c',
                text: 'El servidor recuerda al usuario automáticamente sin que el cliente haga nada.',
              },
              {
                id: 'd',
                text: 'No hace falta hacer nada; el servidor asocia la IP al usuario.',
              },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'HTTP es sin estado: el servidor no recuerda nada entre peticiones. Por eso el cliente debe enviar una prueba de identidad en cada llamada —normalmente un token en la cabecera Authorization. Reenviar la contraseña sería inseguro y lento; confiar en la IP es poco fiable (las IPs cambian y varias personas pueden compartir una).',
          },
        },
      },
    },
    {
      title: 'Tokens vs. sesiones',
      objective:
        'Distinguir los dos grandes enfoques de autenticación: sesiones en servidor y tokens en cliente.',
      theory:
        'Hay dos formas clásicas de mantener la identidad del usuario. En el modelo de sesión, el servidor crea un registro en memoria o base de datos con los datos del usuario y le asigna un identificador único (session ID). El cliente guarda solo ese ID (normalmente en una cookie) y lo envía en cada petición; el servidor lo busca en su almacén y recupera los datos del usuario.\n\nEn el modelo de token (el más representativo es JWT, JSON Web Token), el servidor no guarda nada. Tras el login genera un token firmado que contiene la información del usuario y se lo entrega al cliente. El cliente guarda el token (en memoria o en localStorage) y lo incluye en cada petición. El servidor solo verifica la firma del token para saber que no ha sido manipulado.\n\nCada modelo tiene ventajas: las sesiones son fáciles de invalidar (basta borrar el registro del servidor), pero requieren almacenamiento centralizado. Los tokens son más escalables (cualquier servidor puede verificarlos sin acceder a una base de datos común), pero invalidarlos antes de que expiren es más complicado.\n\nEn la práctica, muchas aplicaciones combinan ambos enfoques o eligen uno según sus necesidades de escala y seguridad.',
      concepts: ['sesion', 'session-id', 'jwt', 'token', 'stateless', 'cookie'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Diferencia clave entre TOKEN y SESIÓN',
        brief:
          '¿Cuál es la diferencia clave entre el modelo de TOKEN y el modelo de SESIÓN?',
        difficulty: 2,
        timeLimitMinutes: 5,
        skills: ['auth-sesiones'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'quiz',
          prompt:
            '¿Cuál es la diferencia clave entre autenticación por TOKEN y autenticación por SESIÓN?',
          quiz: {
            options: [
              {
                id: 'a',
                text: 'Con sesión el estado se guarda en el SERVIDOR y el cliente lleva solo un identificador; con token el cliente guarda el token completo y lo envía en cada petición.',
              },
              {
                id: 'b',
                text: 'Con token el estado se guarda en el SERVIDOR y el cliente solo guarda un ID; con sesión el cliente guarda todo el estado.',
              },
              {
                id: 'c',
                text: 'Tokens y sesiones son exactamente lo mismo, solo cambia el nombre.',
              },
              {
                id: 'd',
                text: 'Las sesiones son más modernas que los tokens y siempre más seguras.',
              },
            ],
            correctIds: ['a'],
            multiple: false,
            explanation:
              'La diferencia clave es dónde vive el estado. Con sesión, el servidor mantiene un registro con los datos del usuario; el cliente solo lleva el session ID (un puntero a ese registro). Con token (por ejemplo JWT), el servidor no guarda nada: el propio token contiene la información del usuario firmada, y el servidor solo verifica la firma para confiar en él.',
          },
        },
      },
    },
    {
      title: 'El flujo de autenticación de principio a fin',
      objective:
        'Describir paso a paso qué ocurre desde que el usuario hace login hasta que accede a un recurso protegido.',
      theory:
        'El flujo de autenticación siempre sigue el mismo esqueleto, independientemente del modelo elegido. Primero, el usuario envía sus credenciales (usuario y contraseña) al endpoint de login mediante una petición POST. El servidor las valida contra la base de datos —comparando el hash almacenado con el hash de la contraseña introducida— y, si son correctas, genera una prueba de identidad (un token firmado o un session ID) y la devuelve al cliente.\n\nA partir de ese momento, el cliente almacena esa credencial y la adjunta en las cabeceras de cada petición posterior, típicamente como Authorization: Bearer <token> o como cookie automática en el caso de sesiones. El servidor comprueba la credencial en cada llamada antes de responder con los datos protegidos.\n\nSi la credencial caduca o es inválida, el servidor responde con 401 Unauthorized. El cliente debe entonces redirigir al usuario a la pantalla de login para que vuelva a autenticarse y obtenga una nueva credencial.\n\nEste ciclo —login, credencial, comprobación en cada petición, expiración, nuevo login— es la base de la seguridad en cualquier aplicación web moderna.',
      concepts: [
        'login',
        'hash',
        'bearer-token',
        'authorization-header',
        '401',
        'expiracion',
      ],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Explica el flujo de autenticación paso a paso',
        brief:
          'Describe con tus propias palabras el flujo completo: el usuario hace login → ¿qué recibe el cliente? → ¿qué envía en las siguientes peticiones?',
        difficulty: 2,
        timeLimitMinutes: 8,
        skills: ['auth-sesiones'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'short',
          runner: 'none',
          prompt:
            'Explica el flujo de autenticación paso a paso: el usuario hace login → ¿qué recibe el cliente? → ¿qué envía en las siguientes peticiones? ¿Qué pasa si la credencial caduca?',
          solution:
            '1. El usuario envía usuario y contraseña al endpoint POST /login.\n2. El servidor valida las credenciales (compara el hash). Si son correctas, genera un token firmado (o un session ID) y lo devuelve al cliente.\n3. El cliente guarda ese token (en memoria, localStorage o cookie).\n4. En cada petición posterior, el cliente incluye el token en la cabecera Authorization: Bearer <token> (o la cookie se envía automáticamente).\n5. El servidor verifica el token en cada petición. Si es válido, devuelve los datos protegidos (200). Si es inválido o ha caducado, responde con 401 Unauthorized.\n6. Cuando el token caduca, el cliente redirige al usuario al login para obtener uno nuevo.',
        },
      },
    },
  ],
};
