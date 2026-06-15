import { type PhaseSeed } from '../content-types.js';

export const conceptP04: PhaseSeed = {
  code: 'FASE 4',
  title: 'Autenticación y seguridad básica',
  objective:
    'Entender cómo sabe el servidor quién eres y por qué nunca hay que fiarse de los datos que llegan.',
  unlockedSkills: ['auth-sesiones'],
  projects: [],
  lessons: [
    {
      title: '¿Quién eres? Autenticación básica',
      objective:
        'Comprender cómo el servidor identifica al cliente en cada petición tras el inicio de sesión.',
      theory:
        'Cuando inicias sesión, el servidor verifica tu contraseña y, si es correcta, te entrega una credencial: puede ser un token (como un JWT) o el identificador de una sesión guardada en el servidor. A partir de ese momento, no necesitas volver a escribir tu contraseña.\n\nEn cada petición siguiente, el cliente adjunta esa credencial, normalmente en la cabecera HTTP llamada Authorization (por ejemplo: Authorization: Bearer <token>). El servidor la lee, la valida y sabe quién eres sin repetir el proceso de login.\n\nEste mecanismo separa el acto de autenticarse (demostrar quién eres una vez) del acto de estar autorizado (adjuntar la prueba en cada llamada). La credencial tiene una duración limitada para reducir el riesgo si alguien la intercepta.',
      concepts: ['autenticación', 'token', 'sesión', 'cabecera Authorization', 'login'],
      tools: [],
      estimatedTimeMinutes: 15,
      challenge: {
        title: 'Identificación tras el login',
        brief: 'Quiz sobre cómo demuestra el cliente su identidad después de iniciar sesión.',
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
            'Tras iniciar sesión, ¿cómo demuestra el cliente quién es en las siguientes peticiones?',
          quiz: {
            options: [
              { id: 'a', text: 'Vuelve a enviar usuario y contraseña en cada petición' },
              { id: 'b', text: 'Envía un token o credencial en la cabecera de cada petición' },
              { id: 'c', text: 'El servidor lo recuerda para siempre sin necesitar nada del cliente' },
              { id: 'd', text: 'No hace falta nada; el servidor confía en cualquier petición' },
            ],
            correctIds: ['b'],
            multiple: false,
            explanation:
              'Tras el login el servidor emite una credencial (token o sesión). El cliente la adjunta en cada petición, normalmente en la cabecera Authorization. Así el servidor puede verificar la identidad sin volver a pedir la contraseña, y la credencial expira con el tiempo para limitar el daño si se filtra.',
          },
        },
      },
    },
    {
      title: 'Nunca te fíes de la entrada',
      objective:
        'Entender por qué toda entrada del cliente debe validarse y qué ocurre si no se hace.',
      theory:
        'El servidor no puede saber de antemano qué envía el cliente: cualquier dato que llegue —un nombre de usuario, un parámetro de búsqueda, un campo de formulario— podría haber sido manipulado. Por eso la regla fundamental es: nunca te fíes de la entrada del cliente; valídala y saneala siempre en el servidor.\n\nSi concatenas directamente la entrada del usuario en una consulta SQL, un atacante puede escribir fragmentos de SQL que alteren la consulta original. Esto se llama inyección SQL y puede exponer o borrar toda la base de datos. La solución es usar consultas parametrizadas o prepared statements, donde los datos van separados del código SQL.\n\nAlgo similar ocurre en HTML: si muestras en la página el texto que el usuario envió sin escaparlo, puede inyectar etiquetas <script> que se ejecutan en el navegador de otras personas. Esto se llama XSS (Cross-Site Scripting). Escapar la salida y usar cabeceras de seguridad adecuadas son las defensas básicas.',
      concepts: ['validación', 'saneado', 'inyección SQL', 'XSS', 'consulta parametrizada'],
      tools: [],
      estimatedTimeMinutes: 20,
      challenge: {
        title: 'Detectar y corregir una inyección SQL',
        brief:
          'Analiza una función que construye SQL concatenando entrada del usuario, explica el riesgo y reescríbela de forma segura.',
        difficulty: 2,
        timeLimitMinutes: 10,
        skills: ['seguridad-web'],
        rubric: [
          {
            name: 'Comprensión',
            description: 'Demuestra que entiende el concepto',
            isCritical: true,
          },
        ],
        concept: {
          kind: 'code',
          runner: 'js',
          prompt:
            'Esta función construye una consulta SQL concatenando la entrada del usuario (inseguro). Explica el riesgo con un console.log y reescribe la idea usando un parámetro/placeholder (pseudocódigo o con un comentario claro).',
          starterCode: `function buscar(nombre) {
  const sql = "SELECT * FROM users WHERE name = '" + nombre + "'";
  return sql;
}

console.log(buscar("Ana"));

// TODO: ¿qué pasa si nombre es  Ana' OR '1'='1  ?
// Escribe un console.log que muestre el SQL resultante con esa entrada
// y luego reescribe buscar() usando un placeholder (?) en lugar de concatenar.`,
          solution: `// RIESGO: inyección SQL
// Si nombre = "Ana' OR '1'='1", la consulta se convierte en:
// SELECT * FROM users WHERE name = 'Ana' OR '1'='1'
// ...que devuelve TODOS los usuarios porque '1'='1' siempre es verdadero.

console.log(buscar("Ana' OR '1'='1"));
// → SELECT * FROM users WHERE name = 'Ana' OR '1'='1'

// VERSIÓN SEGURA: consulta parametrizada (placeholder ?)
// El valor viaja separado del SQL; el motor de BD lo trata como dato, nunca como código.
function buscarSeguro(nombre) {
  const sql = "SELECT * FROM users WHERE name = ?";
  // En un ORM real: db.query(sql, [nombre])
  return { sql, params: [nombre] };
}

console.log(buscarSeguro("Ana' OR '1'='1"));
// → { sql: "SELECT * FROM users WHERE name = ?", params: ["Ana' OR '1'='1"] }`,
        },
      },
    },
  ],
};
