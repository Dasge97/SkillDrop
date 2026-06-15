import { type PhaseSeed } from '../content-types.js';

export const dwesP03: PhaseSeed = {
  code: 'FASE 3',
  title: 'Bases de datos con MySQL',
  objective: 'Persistir los datos de ReseñApp de forma segura usando MySQL, modelar el esquema relacional y acceder a la base de datos desde PHP mediante PDO con sentencias preparadas.',
  unlockedSkills: ['sql', 'mysql-pdo'],
  projects: [
    'Esquema de base de datos de ReseñApp (users, items, reviews)',
    'CRUD de reseñas con PDO y consultas preparadas',
  ],
  lessons: [
    {
      title: 'Modelar la base de datos de ReseñApp',
      objective: 'Diseñar el esquema relacional de ReseñApp y escribir el SQL necesario para crear las tablas con integridad referencial.',
      theory:
        'Antes de escribir una sola línea de PHP hay que diseñar el modelo de datos. Para ReseñApp necesitamos al menos tres entidades: usuarios (users), elementos reseñables (items, por ejemplo lugares o productos) y reseñas (reviews). Cada entidad se convierte en una tabla; las relaciones entre ellas se expresan mediante claves foráneas (FOREIGN KEY). Un buen modelo define claramente las cardinalidades: un usuario puede escribir muchas reseñas, pero cada reseña pertenece a un único usuario y a un único ítem.\n\nSQL (Structured Query Language) es el lenguaje estándar para interactuar con bases de datos relacionales. Las instrucciones DDL (Data Definition Language) como CREATE TABLE, ALTER TABLE y DROP TABLE definen la estructura. Las instrucciones DML (Data Manipulation Language) como INSERT, SELECT, UPDATE y DELETE manipulan los datos. Un buen hábito es escribir el esquema en un archivo schema.sql versionado en el repositorio para que cualquier miembro del equipo pueda recrear la base de datos desde cero.\n\nLa integridad referencial garantiza que no pueden existir reseñas huérfanas (sin usuario o sin ítem). Se consigue declarando FOREIGN KEY con la opción ON DELETE CASCADE o ON DELETE RESTRICT según la lógica de negocio. MySQL requiere que ambas tablas usen el motor InnoDB para que las claves foráneas se apliquen de verdad. Definir también los tipos de columna correctos (VARCHAR, TEXT, TINYINT, DATETIME) y las restricciones NOT NULL y UNIQUE desde el principio evita errores difíciles de depurar después.\n\nLas consultas JOIN (INNER JOIN, LEFT JOIN) permiten combinar datos de varias tablas en una sola consulta. Para ReseñApp es habitual necesitar el nombre del usuario y el nombre del ítem junto a cada reseña, lo que requiere un JOIN entre las tres tablas. Dominar el JOIN es fundamental porque reduce el número de consultas al servidor y simplifica el código PHP que procesa los resultados.',
      concepts: [
        'Modelo relacional y entidad-relación',
        'CREATE TABLE, tipos de datos y restricciones',
        'PRIMARY KEY y FOREIGN KEY',
        'Integridad referencial (ON DELETE CASCADE / RESTRICT)',
        'INSERT, SELECT, UPDATE, DELETE',
        'INNER JOIN y LEFT JOIN',
        'InnoDB y soporte de claves foráneas',
      ],
      tools: ['sql', 'mysql-pdo'],
      estimatedTimeMinutes: 50,
      challenge: {
        title: 'Esquema y consultas SQL de ReseñApp',
        brief:
          'Diseña y crea el esquema de base de datos de ReseñApp (tablas users, items y reviews con integridad referencial) y escribe consultas SQL para las operaciones básicas: insertar una reseña, listar reseñas de un ítem con datos del autor y calcular la nota media por ítem.',
        context:
          'Es el cimiento del proyecto: sin un buen modelo de datos, todo lo que se construya encima será frágil. Las consultas que se escriban aquí se convertirán en las sentencias preparadas del CRUD de la fase siguiente.',
        objective:
          'Demostrar que sabes modelar un esquema relacional con integridad referencial y escribir consultas SQL que combinen datos de varias tablas.',
        targetUser: 'Desarrollador backend que tomará este esquema como base para construir la API REST de ReseñApp.',
        restrictions: [
          'Las tres tablas (users, items, reviews) deben existir con las claves foráneas declaradas.',
          'El motor de las tablas debe ser InnoDB.',
          'reviews debe tener FOREIGN KEY a users y a items.',
          'La nota de la reseña debe tener una restricción CHECK entre 1 y 5.',
          'El archivo schema.sql debe poder ejecutarse limpiamente en una base de datos vacía (usar IF NOT EXISTS o DROP IF EXISTS).',
        ],
        deliverables: [
          'Archivo schema.sql con la definición completa de las tablas.',
          'Archivo queries.sql con las consultas de inserción, listado con JOIN y cálculo de media.',
          'Captura del resultado de SHOW CREATE TABLE reviews en MySQL Workbench o terminal.',
          'Enlace al repositorio o carpeta comprimida con los archivos SQL.',
        ],
        checklist: [
          'Las tres tablas se crean sin errores al ejecutar schema.sql.',
          'Las claves foráneas están declaradas y MySQL las reconoce (SHOW CREATE TABLE).',
          'La restricción de nota entre 1 y 5 funciona (probar insertar nota 6 debe fallar).',
          'El SELECT con JOIN devuelve el título del ítem y el nombre del usuario junto a cada reseña.',
          'La consulta de media usa GROUP BY y AVG() correctamente.',
          'El archivo schema.sql es idempotente (se puede ejecutar varias veces sin error).',
        ],
        commonMistakes: [
          'Usar el motor MyISAM en vez de InnoDB (las FOREIGN KEY se declaran pero no se aplican).',
          'Olvidar declarar el índice en la columna referenciada por la clave foránea.',
          'Confundir INNER JOIN (solo filas con coincidencia) con LEFT JOIN (incluye filas sin coincidencia).',
          'No hacer el esquema idempotente y tener que borrar la base de datos manualmente en cada prueba.',
        ],
        difficulty: 3,
        timeLimitMinutes: 90,
        skills: ['sql', 'mysql-pdo'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'El esquema se crea sin errores, las claves foráneas funcionan y las consultas devuelven los datos esperados.',
            isCritical: true,
          },
          {
            name: 'Integridad y seguridad de datos',
            description: 'Las restricciones (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) previenen datos incoherentes en la base de datos.',
            isCritical: true,
          },
          {
            name: 'Calidad del código SQL',
            description: 'SQL con nombres de tabla y columna coherentes, indentado legible y sin redundancias.',
          },
          {
            name: 'Buenas prácticas',
            description: 'Schema idempotente, motor InnoDB declarado explícitamente y consultas con alias claros.',
          },
        ],
      },
    },
    {
      title: 'Acceso seguro con PDO y sentencias preparadas',
      objective: 'Conectar PHP a MySQL mediante PDO, ejecutar operaciones CRUD con sentencias preparadas y entender por qué evitan la inyección SQL.',
      theory:
        'PDO (PHP Data Objects) es la capa de abstracción de acceso a datos recomendada en PHP moderno. Proporciona una interfaz uniforme para trabajar con distintos motores de base de datos y, lo más importante, soporta sentencias preparadas de forma nativa. La conexión se crea instanciando la clase PDO con el DSN (Data Source Name), el usuario y la contraseña; es conveniente activar el modo de errores ERRMODE_EXCEPTION para que los fallos lancen excepciones en vez de fallar silenciosamente.\n\nLas sentencias preparadas son la defensa fundamental contra la inyección SQL. En vez de concatenar variables del usuario directamente en la cadena SQL, se escribe un marcador de posición (? o :nombre) y PDO sustituye el valor de forma segura antes de enviar la consulta al motor. MySQL trata el valor siempre como dato, nunca como parte de la sintaxis SQL, por lo que un atacante que introduzca \'OR 1=1-- no consigue nada. Usar prepare() y execute() en lugar de query() con concatenación es un hábito no negociable.\n\nEl flujo básico de una operación CRUD con PDO es: preparar la sentencia con $pdo->prepare(), enlazar los parámetros con execute([...]) y obtener resultados con fetch() o fetchAll(). Para selects es habitual usar fetchAll(PDO::FETCH_ASSOC) para obtener un array de arrays asociativos cómodamente iterable en PHP. Para inserciones se puede recuperar el ID generado automáticamente con $pdo->lastInsertId().\n\nGuardar las credenciales de la base de datos en variables de entorno (o en un archivo de configuración fuera del directorio público del servidor web) es una práctica de seguridad básica. Nunca deben incluirse en el repositorio. Un archivo config.php cargado con require al principio del script centraliza la conexión y evita duplicar credenciales por todo el código.',
      concepts: [
        'PDO y DSN de conexión',
        'ERRMODE_EXCEPTION',
        'Sentencias preparadas (prepare / execute)',
        'Marcadores de posición ? y :nombre',
        'fetch() y fetchAll(PDO::FETCH_ASSOC)',
        'lastInsertId()',
        'Inyección SQL y cómo prevenirla',
        'Credenciales fuera del repositorio',
      ],
      tools: ['mysql-pdo', 'sql', 'php'],
      estimatedTimeMinutes: 55,
      challenge: {
        title: 'CRUD de reseñas con PDO',
        brief:
          'Implementa en PHP el CRUD completo de reseñas de ReseñApp (crear, leer, actualizar y eliminar) usando PDO con sentencias preparadas, sobre el esquema creado en el reto anterior.',
        context:
          'Con el esquema listo, este reto conecta PHP a la base de datos y expone las cuatro operaciones fundamentales. El código resultante será la base de los modelos que se usarán al aplicar MVC en la fase siguiente.',
        objective:
          'Demostrar que sabes conectar PHP a MySQL con PDO, ejecutar las cuatro operaciones CRUD con sentencias preparadas y manejar errores de base de datos correctamente.',
        targetUser: 'Desarrollador que necesita persistir y recuperar reseñas de ReseñApp de forma segura.',
        restrictions: [
          'Toda consulta SQL que incluya datos externos debe usar sentencias preparadas.',
          'Está prohibido concatenar variables de usuario directamente en la cadena SQL.',
          'Las credenciales de la base de datos deben estar en un archivo de configuración separado, no en el script principal.',
          'Los errores de PDO deben capturarse con try/catch y mostrar un mensaje genérico al usuario (no el stack trace).',
          'No se permite usar ningún ORM ni framework.',
        ],
        deliverables: [
          'Archivo config.php con la conexión PDO (credenciales en variables, no hardcodeadas en el código fuente).',
          'Archivo reviews.php (o clase/funciones equivalentes) con las cuatro operaciones CRUD.',
          'Script de prueba o formulario HTML que demuestre que las cuatro operaciones funcionan.',
          'Capturas de pantalla: inserción de una reseña, listado, edición y eliminación.',
          'Enlace al repositorio o carpeta comprimida.',
        ],
        checklist: [
          'La conexión PDO usa ERRMODE_EXCEPTION.',
          'Todas las consultas con datos externos usan prepare() + execute().',
          'La operación CREATE inserta una reseña y devuelve el ID generado.',
          'La operación READ lista reseñas con JOIN (incluye nombre del ítem y del autor).',
          'La operación UPDATE modifica texto y nota de una reseña existente.',
          'La operación DELETE elimina una reseña por su ID.',
          'Los errores se capturan con try/catch y no exponen información del servidor.',
          'Las credenciales están en un archivo separado no incluido en el repositorio (.gitignore).',
        ],
        commonMistakes: [
          'Usar query() con concatenación de variables en vez de prepare() + execute().',
          'No capturar excepciones de PDO y dejar que PHP muestre el error con credenciales visibles.',
          'Olvidar el .gitignore para el archivo de credenciales y subirlo al repositorio.',
          'Usar fetch() en un bucle cuando fetchAll() + foreach es más claro y eficiente.',
        ],
        difficulty: 3,
        timeLimitMinutes: 120,
        skills: ['sql', 'mysql-pdo'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Las cuatro operaciones CRUD funcionan correctamente contra la base de datos real.',
            isCritical: true,
          },
          {
            name: 'Seguridad (prevención de inyección SQL)',
            description: 'Toda consulta con datos externos usa sentencias preparadas; no existe ningún punto de inyección SQL.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Código PHP limpio, funciones bien nombradas, sin duplicación de la lógica de conexión.',
          },
          {
            name: 'Buenas prácticas',
            description: 'Credenciales en archivo separado e ignorado por git, errores capturados y mensajes genéricos al usuario.',
          },
        ],
      },
    },
  ],
};
