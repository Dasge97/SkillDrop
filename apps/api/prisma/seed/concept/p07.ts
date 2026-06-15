import { type PhaseSeed } from '../content-types.js';

export const conceptP07: PhaseSeed = {
  code: 'FASE 7',
  title: 'Seguridad',
  objective: 'Nunca te fíes de la entrada del usuario y protege las contraseñas.',
  unlockedSkills: ['seguridad-web'],
  projects: [],
  lessons: [
    {
      title: 'Nunca te fíes de la entrada',
      objective: 'Entender qué es la inyección SQL y por qué concatenar la entrada del usuario es peligroso.',
      theory:
        `Una de las reglas de oro de la seguridad web es: nunca te fíes de la entrada del usuario. En un formulario, una URL o una cabecera puede llegar cualquier cosa, y si tu código la usa tal cual para construir una consulta, le estás dando el control de tu base de datos.\n\n` +
        `La inyección SQL ocurre cuando alguien introduce texto que se escapa de la cadena que tú esperabas y añade instrucciones SQL propias. Si construyes la consulta pegando el nombre directamente (algo como: buscar donde el nombre sea igual al texto que escribió el usuario), un atacante puede escribir un valor con comillas y un OR 1=1 para que la condición sea siempre verdadera y la consulta devuelva toda la tabla.\n\n` +
        `Con variantes más agresivas se pueden borrar tablas, extraer datos sensibles o saltarse el login. Es un ataque antiguo pero sigue en lo más alto de las vulnerabilidades según OWASP, justo por confiar en la entrada.\n\n` +
        `La defensa son las consultas parametrizadas (sentencias preparadas): en vez de pegar el valor en la cadena, pones un marcador de posición y pasas el valor aparte. El driver de la base de datos se encarga de tratarlo como dato, nunca como código, y la inyección deja de ser posible.`,
      concepts: ['Confiar en la entrada', 'Inyección SQL', 'Consultas parametrizadas'],
      tools: ['SQL', 'Validación'],
      estimatedTimeMinutes: 6,
      challenge: {
        title: 'Inyección SQL: el riesgo',
        brief: 'Identifica a qué tipo de ataque abre la puerta concatenar la entrada del usuario en una consulta.',
        difficulty: 1,
        timeLimitMinutes: 4,
        skills: ['seguridad-web'],
        rubric: [{ name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true }],
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: 'Concatenar directamente la entrada del usuario dentro de una consulta SQL abre la puerta a…',
          quiz: {
            options: [
              { id: 'a', text: 'Inyección SQL: el atacante puede inyectar sus propias instrucciones.' },
              { id: 'b', text: 'Que la consulta vaya más lenta, pero nada grave.' },
              { id: 'c', text: 'Un error de sintaxis siempre, así que se detecta en seguida.' },
              { id: 'd', text: 'Nada: la base de datos lo protege automáticamente.' },
            ],
            correctIds: ['a'],
            explanation:
              'Concatenar la entrada permite que el usuario escriba texto que se convierte en parte de la consulta (inyección SQL). No es solo lentitud, no falla siempre, y la base de datos no te protege sola: tienes que usar consultas parametrizadas.',
          },
        },
      },
    },
    {
      title: 'Arréglalo: consulta parametrizada',
      objective: 'Ver el ataque y reescribir la idea de forma segura con un marcador de posición.',
      theory:
        `La forma insegura construye la consulta pegando el valor: tomas el nombre que llega y lo metes entre comillas dentro del texto SQL. El problema es que el usuario controla ese texto y puede cerrar la comilla y añadir lo que quiera.\n\n` +
        `Por ejemplo, si alguien envía como nombre el valor: ' OR '1'='1 , la condición pasa a ser siempre verdadera y la consulta devuelve todos los usuarios. Ese es el corazón de la inyección.\n\n` +
        `La versión segura no pega el valor: usa un marcador de posición (un signo de interrogación) en la consulta y pasa el valor por separado al ejecutar. Así el valor viaja como dato, nunca como código, y aunque contenga comillas no rompe nada.`,
      concepts: ['Concatenación insegura', 'Payload de inyección', 'Placeholder ?'],
      tools: ['JavaScript', 'SQL'],
      estimatedTimeMinutes: 8,
      challenge: {
        title: 'De inseguro a parametrizado',
        brief: 'Demuestra el riesgo de la concatenación e indica la versión segura con placeholder.',
        difficulty: 2,
        timeLimitMinutes: 12,
        skills: ['seguridad-web'],
        rubric: [{ name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true }],
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Esta función concatena la entrada del usuario en una consulta SQL (inseguro). 1) Con console.log, muestra qué consulta sale si alguien envía un valor malicioso para provocar inyección. 2) En un string, muestra la versión SEGURA usando un marcador de posición (?) en vez de concatenar.',
          starterCode:
            `function buscar(nombre) {\n  const sql = "SELECT * FROM users WHERE name = '" + nombre + "'";\n  return sql;\n}\n\n// 1) Imprime la consulta con un valor malicioso (inyección)\n// 2) Muestra la versión segura con un placeholder ?\n`,
          solution:
            `function buscar(nombre) {\n  const sql = "SELECT * FROM users WHERE name = '" + nombre + "'";\n  return sql;\n}\n\n// 1) Entrada normal\nconsole.log(buscar("Ana"));\n// SELECT * FROM users WHERE name = 'Ana'\n\n// 1b) Entrada maliciosa: cierra la comilla y añade OR '1'='1\nconsole.log(buscar("' OR '1'='1"));\n// SELECT * FROM users WHERE name = '' OR '1'='1'  -> devuelve TODA la tabla\n\n// 2) Versión segura: placeholder ? y el valor aparte\nconst sqlSeguro = "SELECT * FROM users WHERE name = ?";\nconsole.log(sqlSeguro, "con valor:", "Ana");`,
        },
      },
    },
    {
      title: 'Contraseñas: nunca en texto plano',
      objective: 'Entender por qué las contraseñas se guardan con hash.',
      theory:
        `Las contraseñas no se guardan tal cual en la base de datos. Se guardan pasadas por una función de hash: una transformación de un solo sentido que convierte la contraseña en una cadena de la que no se puede volver atrás.\n\n` +
        `Cuando el usuario inicia sesión, se aplica el mismo hash a lo que escribe y se compara con el guardado. Si coinciden, la contraseña es correcta, sin que el servidor haya tenido que guardar la contraseña real.\n\n` +
        `La ventaja es clave: si alguien roba la base de datos, no obtiene las contraseñas, solo sus hashes. Por eso se usan funciones pensadas para esto (como bcrypt) con sal, y nunca se almacena la contraseña en claro.`,
      concepts: ['Hash de un solo sentido', 'Verificación', 'bcrypt y sal'],
      tools: ['Hashing'],
      estimatedTimeMinutes: 5,
      challenge: {
        title: '¿Por qué hashear?',
        brief: 'Razona por qué las contraseñas nunca se guardan en texto plano.',
        difficulty: 1,
        timeLimitMinutes: 4,
        skills: ['seguridad-web'],
        rubric: [{ name: 'Comprensión', description: 'Demuestra que entiende el concepto', isCritical: true }],
        concept: {
          kind: 'quiz',
          runner: 'none',
          prompt: '¿Por qué NUNCA se guardan las contraseñas en texto plano?',
          quiz: {
            options: [
              { id: 'a', text: 'Se guardan con hash para que, si roban la base de datos, no se vean las contraseñas reales.' },
              { id: 'b', text: 'Porque las bases de datos no admiten texto, solo números.' },
              { id: 'c', text: 'Para ahorrar espacio de almacenamiento.' },
              { id: 'd', text: 'Da igual cómo se guarden mientras la base de datos tenga contraseña.' },
            ],
            correctIds: ['a'],
            explanation:
              'El hash es de un solo sentido: el servidor compara hashes sin conocer la contraseña real. Así, si la base de datos se filtra, el atacante no obtiene las contraseñas. No es por espacio ni por tipos de datos.',
          },
        },
      },
    },
  ],
};
