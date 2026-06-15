import { type PhaseSeed } from '../content-types.js';

export const dwesP05: PhaseSeed = {
  code: 'FASE 5',
  title: 'Autenticación y sesiones',
  objective: 'Implementar un sistema de registro, login y control de acceso en ReseñApp usando sesiones PHP y almacenamiento seguro de contraseñas, de forma que sólo los usuarios autenticados puedan crear o editar reseñas.',
  unlockedSkills: ['auth-sesiones'],
  projects: [
    'Sistema de registro y login para ReseñApp',
    'Hashing de contraseñas con password_hash / password_verify',
    'Gestión de sesiones PHP ($_SESSION)',
    'Protección de rutas por rol',
    'Cierre de sesión seguro',
  ],
  lessons: [
    {
      title: 'Sesiones y contraseñas seguras en PHP',
      objective: 'Comprender cómo PHP gestiona las sesiones de usuario y por qué nunca se deben guardar contraseñas en texto plano.',
      theory:
        'HTTP es un protocolo sin estado: cada petición llega al servidor sin recordar la anterior. Las sesiones PHP resuelven esto guardando datos en el servidor (en `$_SESSION`) y entregando al navegador una cookie con el identificador de sesión. En cada petición posterior, PHP lee esa cookie, recupera los datos del servidor y el código puede saber quién está haciendo la petición.\n\nLa función `session_start()` debe llamarse antes de cualquier salida HTML. A partir de ahí, `$_SESSION[\'user_id\']` o `$_SESSION[\'role\']` persisten entre peticiones. Para cerrar la sesión de forma segura hay que destruir los datos del servidor (`session_destroy()`), limpiar el array `$_SESSION` y borrar la cookie del navegador.\n\nGuardar contraseñas en texto plano o con MD5 es un error crítico: si la base de datos se filtra, todas las cuentas quedan comprometidas. PHP incluye `password_hash($password, PASSWORD_BCRYPT)` que aplica un algoritmo lento con sal aleatoria, e `password_verify($input, $hash)` para comprobar la contraseña sin exponer el hash. Nunca uses `md5()` ni `sha1()` para contraseñas.\n\nEl control de acceso consiste en comprobar al inicio de cada acción protegida si la sesión contiene los datos esperados (`isset($_SESSION[\'user_id\'])`). Si no, se redirige al login con `header(\'Location: /login\')` y `exit`. Los roles (por ejemplo `admin` vs `usuario`) permiten afinar aún más qué puede hacer cada perfil.',
      example:
        '// Registro — guardar contraseña con hash\n$hash = password_hash($_POST[\'password\'], PASSWORD_BCRYPT);\n$stmt = $pdo->prepare(\'INSERT INTO users (email, password_hash) VALUES (?, ?)\');\n$stmt->execute([$_POST[\'email\'], $hash]);\n\n// Login — verificar y arrancar sesión\n$stmt = $pdo->prepare(\'SELECT * FROM users WHERE email = ?\');\n$stmt->execute([$_POST[\'email\']]);\n$user = $stmt->fetch();\nif ($user && password_verify($_POST[\'password\'], $user[\'password_hash\'])) {\n    session_start();\n    $_SESSION[\'user_id\'] = $user[\'id\'];\n    $_SESSION[\'role\']    = $user[\'role\'];\n    header(\'Location: /resenas\');\n    exit;\n}\n\n// Proteger una ruta\nsession_start();\nif (!isset($_SESSION[\'user_id\'])) {\n    header(\'Location: /login\');\n    exit;\n}',
      concepts: [
        'Sesiones PHP ($_SESSION)',
        'session_start / session_destroy',
        'password_hash / password_verify',
        'Control de acceso por sesión',
        'Roles de usuario',
        'Cierre de sesión seguro',
      ],
      tools: ['PHP 8', 'PDO', 'MySQL'],
      estimatedTimeMinutes: 45,
    },
    {
      title: 'Reto: auth completa en ReseñApp',
      objective: 'Añadir registro, login y protección de rutas a ReseñApp para que sólo los usuarios autenticados puedan crear o editar reseñas, almacenando las contraseñas siempre con hashing.',
      theory:
        'Añadir autenticación a un proyecto MVC existente requiere tres piezas: un Modelo `User` que gestione el registro y la verificación de credenciales, un `AuthController` con las acciones `register`, `login` y `logout`, y un mecanismo de protección de rutas que el router aplique antes de llamar a los controladores que lo necesitan.\n\nEl flujo de registro es: validar los datos del formulario (email único, contraseña mínima), hacer el hash con `password_hash` y guardar el usuario en la tabla `users`. El flujo de login es: buscar el usuario por email, verificar la contraseña con `password_verify`, arrancar la sesión y redirigir. El flujo de cierre de sesión es: limpiar `$_SESSION`, llamar a `session_destroy()` y redirigir al inicio.\n\nLa tabla `users` necesita al menos: `id`, `email` (UNIQUE), `password_hash` y `role` (por defecto `\'usuario\'`). La clave foránea `user_id` en la tabla `reviews` permitirá saber quién creó cada reseña y si puede editarla o borrarla.',
      concepts: [
        'Modelo User con PDO',
        'AuthController (register / login / logout)',
        'Protección de rutas en el router',
        'Tabla users con password_hash',
        'Clave foránea user_id en reviews',
        'Validación de formularios de auth',
      ],
      tools: ['PHP 8', 'PDO', 'MySQL', 'Apache / .htaccess'],
      estimatedTimeMinutes: 100,
      challenge: {
        title: 'Auth en ReseñApp',
        brief: 'Implementa registro, login y logout en ReseñApp con `password_hash`/`password_verify` y sesiones PHP. Protege las rutas de creación y edición de reseñas para que sólo accedan los usuarios autenticados.',
        context:
          'ReseñApp ya tiene estructura MVC (Fase 4). Ahora cualquier visitante anónimo puede crear o borrar reseñas, lo cual no es aceptable. La dirección quiere que sólo los usuarios registrados y con sesión activa puedan escribir reseñas; el listado y el detalle siguen siendo públicos.',
        objective:
          'Que un visitante anónimo vea reseñas pero no pueda crearlas ni editarlas; que un usuario registrado pueda hacer login, gestionar sus reseñas y cerrar sesión; que ninguna contraseña se almacene en texto plano.',
        targetUser: 'Usuario registrado de ReseñApp que quiere escribir o gestionar sus reseñas.',
        restrictions: [
          'Las contraseñas DEBEN almacenarse con `password_hash(…, PASSWORD_BCRYPT)`. Prohibido MD5, SHA1 o texto plano.',
          'El control de acceso debe aplicarse en el router o en los Controladores, no en las Vistas.',
          'El cierre de sesión debe destruir los datos del servidor con `session_destroy()`.',
          'La tabla `users` debe tener columna `password_hash`, nunca `password`.',
          'Las rutas de registro y login deben ser accesibles sin sesión activa.',
        ],
        deliverables: [
          'Repositorio Git con el código de auth (rama `feat/auth` o commit descriptivo).',
          'Fichero `src/Models/User.php` con métodos `register()` y `findByEmail()`.',
          'Fichero `src/Controllers/AuthController.php` con acciones `showRegister()`, `register()`, `showLogin()`, `login()` y `logout()`.',
          'Migración SQL o script con la tabla `users` (id, email UNIQUE, password_hash, role, created_at).',
          'Captura de pantalla: formulario de registro, formulario de login y listado de reseñas con sesión activa mostrando el nombre del usuario.',
          'Captura que demuestre que intentar acceder a `/resenas/nueva` sin sesión redirige al login.',
        ],
        checklist: [
          'Un usuario nuevo puede registrarse con email y contraseña.',
          'El hash guardado en la base de datos NO es el texto plano de la contraseña.',
          'El login funciona con credenciales correctas y falla con credenciales incorrectas.',
          'Acceder a `/resenas/nueva` sin sesión redirige a `/login`.',
          'El botón de logout destruye la sesión y redirige al inicio.',
          'El nombre o email del usuario aparece en algún lugar de la interfaz cuando hay sesión activa.',
          'No hay SQL de auth mezclado en las Vistas ni en los Controladores (está en el Modelo).',
        ],
        commonMistakes: [
          'Guardar la contraseña en texto plano o con `md5()` en lugar de `password_hash()`.',
          'Olvidar llamar a `session_start()` antes de leer o escribir `$_SESSION`, lo que genera headers ya enviados.',
          'Proteger la Vista pero no la acción del Controlador: el usuario malicioso llama a la ruta de creación directamente.',
          'No redirigir con `exit` después de `header(\'Location: …\')`, permitiendo que el código siga ejecutándose.',
          'Confundir `session_destroy()` con `unset($_SESSION)`: hay que hacer ambos para un cierre limpio.',
        ],
        difficulty: 4,
        timeLimitMinutes: 150,
        skills: ['auth-sesiones', 'seguridad-web'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Registro, login y logout funcionan correctamente; las rutas protegidas redirigen a usuarios no autenticados.',
            isCritical: true,
          },
          {
            name: 'Seguridad en contraseñas y sesiones',
            description: 'Las contraseñas se almacenan con `password_hash` + bcrypt; la sesión se destruye correctamente en el logout; no hay texto plano en la base de datos.',
            isCritical: true,
          },
          {
            name: 'Arquitectura / organización',
            description: 'La lógica de auth reside en `User` y `AuthController`; las Vistas no contienen comprobaciones de sesión de negocio; el router aplica la protección de rutas de forma centralizada.',
          },
          {
            name: 'Calidad del código',
            description: 'Código limpio, sin duplicación, con manejo básico de errores (email ya existente, contraseña incorrecta) y mensajes de error visibles al usuario.',
          },
        ],
      },
    },
  ],
};
