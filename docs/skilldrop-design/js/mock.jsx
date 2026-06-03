// mock.jsx — datos de ejemplo en español
const GUIDING_PHRASE = 'No avances por completar lecciones. Avanza porque puedes demostrar dominio.';

const DEMO_ACCOUNTS = [
  { role: 'STUDENT', email: 'student@skilldrop.dev', name: 'Lucía Fernández', label: 'Alumna' },
  { role: 'MENTOR',  email: 'mentor@skilldrop.dev',  name: 'Diego Navarro',   label: 'Mentor' },
  { role: 'ADMIN',   email: 'admin@skilldrop.dev',   name: 'Marta Ríos',      label: 'Admin' },
];
const DEMO_PASSWORD = 'skilldrop';

const COURSE = { id: 'figma-bootcamp', title: 'Bootcamp de Figma · UI/UX', subtitle: 'De cero a portafolio profesional' };

// 13 fases (0–12). Estados ilustrativos para mostrar todos los badges.
const PHASES = [
  { n: 0,  status: 'completada', progress: 100, avg: 9.1, retos: 3, title: 'Fundamentos y mentalidad de producto', objetivo: 'Entender qué es diseñar para personas y cómo se evalúa el dominio.', skills: ['Mentalidad de producto', 'Crítica de diseño'] },
  { n: 1,  status: 'completada', progress: 100, avg: 8.7, retos: 4, title: 'Figma esencial: interfaz y formas', objetivo: 'Dominar el lienzo, las formas, capas y la navegación básica.', skills: ['Frames', 'Formas', 'Capas'] },
  { n: 2,  status: 'progreso',   progress: 45,  avg: 8.2, retos: 5, title: 'Auto Layout y composición', objetivo: 'Construir interfaces flexibles y mantenibles con Auto Layout.', skills: ['Auto Layout', 'Constraints', 'Composición fluida'] },
  { n: 3,  status: 'revision',   progress: 80,  avg: 7.4, retos: 4, title: 'Color, contraste y tipografía', objetivo: 'Crear paletas accesibles y escalas tipográficas con ritmo.', skills: ['Color accesible', 'Escala tipográfica'] },
  { n: 4,  status: 'disponible', progress: 0,   avg: null, retos: 5, title: 'Componentes y variantes', objetivo: 'Diseñar componentes reutilizables con propiedades y variantes.', skills: ['Componentes', 'Variantes', 'Props'] },
  { n: 5,  status: 'bloqueada',  progress: 0,   avg: null, retos: 4, title: 'Estilos, tokens y librerías', objetivo: 'Sistematizar estilos y tokens en una librería compartida.', skills: ['Tokens', 'Librerías'] },
  { n: 6,  status: 'bloqueada',  progress: 0,   avg: null, retos: 5, title: 'Prototipado e interacción', objetivo: 'Conectar pantallas y diseñar microinteracciones creíbles.', skills: ['Prototipado', 'Smart Animate'] },
  { n: 7,  status: 'bloqueada',  progress: 0,   avg: null, retos: 3, title: 'Investigación y flujos de usuario', objetivo: 'Mapear necesidades reales y traducirlas en flujos.', skills: ['User flows', 'Research'] },
  { n: 8,  status: 'bloqueada',  progress: 0,   avg: null, retos: 4, title: 'Wireframes y arquitectura', objetivo: 'Estructurar producto con wireframes de baja fidelidad.', skills: ['Wireframes', 'IA'] },
  { n: 9,  status: 'bloqueada',  progress: 0,   avg: null, retos: 5, title: 'UI visual y jerarquía', objetivo: 'Pulir la capa visual: jerarquía, espacio y detalle.', skills: ['Jerarquía', 'Pulido visual'] },
  { n: 10, status: 'bloqueada',  progress: 0,   avg: null, retos: 4, title: 'Diseño responsive', objetivo: 'Adaptar interfaces a móvil, tablet y escritorio.', skills: ['Responsive', 'Breakpoints'] },
  { n: 11, status: 'bloqueada',  progress: 0,   avg: null, retos: 3, title: 'Handoff y colaboración', objetivo: 'Preparar entregas claras para desarrollo.', skills: ['Handoff', 'Specs'] },
  { n: 12, status: 'bloqueada',  progress: 0,   avg: null, retos: 1, title: 'Proyecto final de portafolio', objetivo: 'Construir un caso de estudio completo y presentable.', skills: ['Caso de estudio', 'Presentación'] },
];

// Lecciones de la fase 2 (la actual)
const LESSONS = [
  { id: 'l-2-1', phase: 2, number: 1, title: 'Anatomía de Auto Layout', objetivo: 'Comprender dirección, espaciado y relleno.', dif: 2, time: '25 min', status: 'completada' },
  { id: 'l-2-2', phase: 2, number: 2, title: 'Filas, columnas y espaciado', objetivo: 'Distribuir elementos con gap y padding consistentes.', dif: 2, time: '30 min', status: 'completada' },
  { id: 'l-2-3', phase: 2, number: 3, title: 'Auto Layout anidado', objetivo: 'Componer estructuras complejas anidando contenedores.', dif: 3, time: '35 min', status: 'progreso' },
  { id: 'l-2-4', phase: 2, number: 4, title: 'Resizing y restricciones', objetivo: 'Controlar el comportamiento al redimensionar.', dif: 3, time: '30 min', status: 'disponible' },
  { id: 'l-2-5', phase: 2, number: 5, title: 'Patrones reales con Auto Layout', objetivo: 'Aplicar Auto Layout a componentes del mundo real.', dif: 4, time: '40 min', status: 'disponible' },
];

const LESSON_DETAIL = {
  id: 'l-2-3',
  phase: 2,
  number: 3,
  title: 'Auto Layout anidado',
  objetivo: 'Componer estructuras complejas anidando contenedores de Auto Layout.',
  dif: 3,
  time: '35 min',
  teoria: [
    'El Auto Layout anidado consiste en colocar un contenedor con Auto Layout dentro de otro. Es la base para construir tarjetas, listas y barras de navegación que se adaptan solos cuando cambia el contenido.',
    'La clave está en decidir, para cada nivel, la dirección (horizontal o vertical), el espaciado entre elementos y el relleno interno. Cuando los niveles están bien definidos, mover o duplicar un elemento no rompe nunca la composición.',
    'Una buena práctica es nombrar cada frame por su rol —"tarjeta", "cabecera", "acciones"— en lugar de "Frame 42". Tu yo del futuro (y tu equipo) lo agradecerá.',
  ],
  ejemplo: 'Una tarjeta de producto: el contenedor exterior es vertical (imagen arriba, contenido abajo). Dentro, el bloque de contenido es vertical (título, precio, descripción) y la fila de acciones es horizontal (botón + icono de favorito). Tres niveles, cero posiciones fijas.',
  conceptos: ['Dirección de flujo', 'Espaciado (gap)', 'Relleno (padding)', 'Hug vs Fill', 'Jerarquía de frames'],
  herramientas: ['Auto Layout (Shift+A)', 'Panel de propiedades', 'Resizing', 'Constraints'],
  challengeId: 'c-2-3',
};

const CHALLENGE = {
  id: 'c-2-3',
  lessonId: 'l-2-3',
  phase: 2,
  title: 'Rediseña una tarjeta de perfil con Auto Layout anidado',
  dif: 3,
  time: '45–60 min',
  brief: 'Vas a reconstruir una tarjeta de perfil de usuario usando exclusivamente Auto Layout anidado, de forma que se adapte a nombres largos, descripciones de distinta longitud y a la presencia o ausencia de la insignia de verificación.',
  contexto: 'Una red profesional quiere unificar cómo se muestran las tarjetas de perfil en buscador, sugerencias y mensajes. Hoy cada equipo las maqueta a mano y nada encaja.',
  objetivo: 'Entregar una tarjeta que un desarrollador pueda traducir a componente sin adivinar espaciados ni alineaciones.',
  usuario: 'Personas que ojean decenas de perfiles al día y necesitan escanear nombre, rol y acción principal en menos de un segundo.',
  restricciones: [
    'Solo Auto Layout: cero posiciones absolutas.',
    'Espaciado en múltiplos de 8.',
    'Debe funcionar con un nombre de 1 línea y de 2 líneas sin romperse.',
    'Máximo 3 niveles de anidación.',
  ],
  entregables: [
    'Frame de la tarjeta a 360 px de ancho.',
    'Una variante con insignia de verificación y otra sin ella.',
    'Captura del árbol de capas con nombres significativos.',
  ],
  checklist: [
    '¿Todos los frames usan Auto Layout?',
    '¿El espaciado son múltiplos de 8?',
    '¿La tarjeta aguanta un nombre de 2 líneas?',
    '¿Las capas están nombradas por su rol?',
  ],
  errores: [
    'Dejar textos con ancho fijo en vez de "Fill".',
    'Mezclar 4, 5 y 8 px de espaciado sin criterio.',
    'Anidar 5 niveles cuando bastan 2.',
    'Nombrar las capas "Frame 12", "Group 3".',
  ],
  criterios: [
    { name: 'Uso correcto de Auto Layout', desc: 'Estructura, dirección y resizing aplicados con intención.', critico: true },
    { name: 'Espaciado y alineación', desc: 'Ritmo consistente en múltiplos de 8 y bordes alineados.', critico: false },
    { name: 'Jerarquía visual', desc: 'El ojo encuentra nombre → rol → acción sin esfuerzo.', critico: false },
    { name: 'Reutilización', desc: 'La tarjeta es fácil de convertir en componente con variantes.', critico: true },
    { name: 'Pulido visual', desc: 'Detalle final: radios, contraste, equilibrio.', critico: false },
  ],
  skills: ['Auto Layout', 'Espaciado', 'Jerarquía', 'Componentización'],
  umbral: 'Para aprobar: media ≥ 8 y ningún criterio crítico por debajo de 7.',
};

// Historial de entregas del reto actual
const SUBMISSIONS = [
  {
    id: 's-v1', challengeId: 'c-2-3', version: 1, fecha: '28 may 2026', estado: 'rehacer',
    figma: 'https://figma.com/file/abc/tarjeta-perfil-v1', notas: 'Primer intento, todavía con algunas posiciones fijas.',
    capturas: ['Tarjeta v1 — vista general', 'Árbol de capas'],
    eval: {
      notaTotal: 5.5, estado: 'rehacer',
      feedback: 'Se nota el esfuerzo, pero todavía hay posiciones absolutas y el espaciado es irregular. Rehazlo apoyándote 100% en Auto Layout antes de pulir lo visual.',
      criterios: [
        { name: 'Uso correcto de Auto Layout', nota: 5, critico: true, comentario: 'Aún quedan elementos colocados a mano.' },
        { name: 'Espaciado y alineación', nota: 5, critico: false, comentario: 'Mezcla de valores sin sistema.' },
        { name: 'Jerarquía visual', nota: 6, critico: false, comentario: 'El nombre y el rol compiten.' },
        { name: 'Reutilización', nota: 5, critico: true, comentario: 'Difícil de convertir en componente tal cual.' },
        { name: 'Pulido visual', nota: 7, critico: false, comentario: 'Buen gusto con el color.' },
      ],
      obligatorias: ['Eliminar todas las posiciones absolutas.', 'Definir un único sistema de espaciado.'],
      opcionales: ['Explorar una versión compacta.'],
      nivel: 1,
    },
  },
  {
    id: 's-v2', challengeId: 'c-2-3', version: 2, fecha: '01 jun 2026', estado: 'mejoras',
    figma: 'https://figma.com/file/abc/tarjeta-perfil-v2', notas: 'Reconstruida con Auto Layout en 3 niveles. Sigo dudando del espaciado interior.',
    capturas: ['Tarjeta v2 — con insignia', 'Tarjeta v2 — sin insignia', 'Árbol de capas nombrado'],
    eval: {
      notaTotal: 7.4, estado: 'mejoras',
      feedback: 'Gran salto respecto a la v1. La estructura con Auto Layout anidado es correcta y las capas están bien nombradas. Para aprobar necesito ver un espaciado totalmente consistente y la tarjeta convertida en componente con sus variantes.',
      criterios: [
        { name: 'Uso correcto de Auto Layout', nota: 8, critico: true, comentario: 'Estructura sólida y bien anidada. ¡Muy bien!' },
        { name: 'Espaciado y alineación', nota: 6, critico: false, comentario: 'Aún mezclas 8 y 12 px dentro del mismo bloque. Unifícalo.' },
        { name: 'Jerarquía visual', nota: 7, critico: false, comentario: 'Clara, aunque el rol podría atenuarse un punto más.' },
        { name: 'Reutilización', nota: 7, critico: true, comentario: 'Falta convertirla en componente con variante de insignia.' },
        { name: 'Pulido visual', nota: 8, critico: false, comentario: 'Bonito equilibrio de radios y contraste.' },
      ],
      obligatorias: ['Unifica todo el espaciado a múltiplos de 8.', 'Convierte la tarjeta en componente con variante de insignia.', 'Añade el estado hover del botón de acción.'],
      opcionales: ['Prueba una versión con el avatar a la izquierda.', 'Documenta los tokens de espaciado usados.'],
      nivel: 2,
    },
  },
];

const NIVELES = ['Principiante', 'Principiante avanzado', 'Intermedio', 'Intermedio avanzado', 'Profesional inicial'];

// Cola del mentor
const MENTOR_QUEUE = [
  { id: 'q1', reto: 'Rediseña una tarjeta de perfil con Auto Layout anidado', alumno: 'Lucía Fernández', version: 3, fecha: 'hace 2 h', fase: 'FASE 2' },
  { id: 'q2', reto: 'Escala tipográfica para una app de noticias', alumno: 'Mateo Gil', version: 1, fecha: 'hace 5 h', fase: 'FASE 3' },
  { id: 'q3', reto: 'Paleta accesible para un panel financiero', alumno: 'Ana Torres', version: 2, fecha: 'ayer', fase: 'FASE 3' },
];

// Progreso: medallas y árbol de habilidades
const MEDALS = [
  { id: 'm1', label: 'Primer reto superado', icon: 'flag', earned: true },
  { id: 'm2', label: 'Racha de 7 días', icon: 'flame', earned: true },
  { id: 'm3', label: 'Fase 1 dominada', icon: 'trophy', earned: true },
  { id: 'm4', label: 'Sin críticos < 7', icon: 'target', earned: true },
  { id: 'm5', label: 'Mentor por un día', icon: 'users', earned: false },
  { id: 'm6', label: 'Portafolio publicado', icon: 'award', earned: false },
];

const SKILL_TREE = [
  { cat: 'Figma esencial', skills: [
    { name: 'Frames y formas', nivel: 5, avg: 9.0, retos: 3 },
    { name: 'Capas y orden', nivel: 4, avg: 8.5, retos: 2 },
    { name: 'Auto Layout', nivel: 3, avg: 7.8, retos: 4 },
  ] },
  { cat: 'Diseño visual', skills: [
    { name: 'Jerarquía', nivel: 3, avg: 8.0, retos: 3 },
    { name: 'Espaciado', nivel: 2, avg: 7.2, retos: 2 },
    { name: 'Color', nivel: 2, avg: 7.4, retos: 1 },
  ] },
  { cat: 'Proceso', skills: [
    { name: 'Crítica de diseño', nivel: 4, avg: 8.6, retos: 2 },
    { name: 'Componentización', nivel: 1, avg: null, retos: 0 },
  ] },
];

// Recursos
const RESOURCES = [
  { cat: 'Fundamentos', items: [
    { type: 'articulo', title: 'Qué es diseñar por dominio', desc: 'La filosofía detrás de SkillDrop en 6 minutos.', fase: 'FASE 0' },
    { type: 'video', title: 'Crítica de diseño sin ego', desc: 'Cómo recibir y dar feedback útil.', fase: 'FASE 0' },
  ] },
  { cat: 'Figma', items: [
    { type: 'video', title: 'Auto Layout de 0 a 100', desc: 'Masterclass de 40 min con ejemplos reales.', fase: 'FASE 2' },
    { type: 'plantilla', title: 'Starter de Auto Layout', desc: 'Archivo base con frames listos para practicar.', fase: 'FASE 2' },
    { type: 'herramienta', title: 'Plugin: Tidy', desc: 'Ordena y distribuye capas en un clic.', fase: 'FASE 2' },
  ] },
  { cat: 'Inspiración', items: [
    { type: 'articulo', title: 'Anatomía de buenas tarjetas', desc: 'Patrones de tarjetas que envejecen bien.', fase: 'FASE 2' },
    { type: 'plantilla', title: 'Escalas tipográficas', desc: 'Colección de escalas listas para usar.', fase: 'FASE 3' },
  ] },
];

// Admin
const ADMIN = {
  metricas: {
    usuarios: [{ rol: 'STUDENT', n: 248 }, { rol: 'MENTOR', n: 12 }, { rol: 'ADMIN', n: 3 }],
    entregas: [{ estado: 'revision', label: 'En revisión', n: 18, tone: 'primary' }, { estado: 'aprobado', label: 'Aprobadas', n: 132, tone: 'success' }, { estado: 'mejoras', label: 'Requieren mejoras', n: 27, tone: 'warning' }, { estado: 'rehacer', label: 'Rehacer', n: 9, tone: 'danger' }],
    contenido: [{ label: 'Cursos', n: 1 }, { label: 'Fases', n: 13 }, { label: 'Lecciones', n: 64 }, { label: 'Retos', n: 41 }],
    evaluaciones: { total: 168, media: 8.1 },
  },
  usuarios: [
    { name: 'Lucía Fernández', email: 'student@skilldrop.dev', rol: 'STUDENT', xp: 2840, entregas: 11 },
    { name: 'Mateo Gil', email: 'mateo@skilldrop.dev', rol: 'STUDENT', xp: 1990, entregas: 8 },
    { name: 'Ana Torres', email: 'ana@skilldrop.dev', rol: 'STUDENT', xp: 3120, entregas: 14 },
    { name: 'Diego Navarro', email: 'mentor@skilldrop.dev', rol: 'MENTOR', xp: 0, entregas: 0 },
    { name: 'Sara Pérez', email: 'sara@skilldrop.dev', rol: 'MENTOR', xp: 0, entregas: 0 },
    { name: 'Marta Ríos', email: 'admin@skilldrop.dev', rol: 'ADMIN', xp: 0, entregas: 0 },
  ],
};

// Datos del alumno actual (dashboard / progreso)
const STUDENT_STATS = {
  progress: 38, // % del curso
  avg: 8.2,
  xp: 2840,
  streak: 7,
  skillsActivas: 8, skillsTotales: 24,
  fuertes: ['Auto Layout', 'Crítica de diseño', 'Frames'],
  mejorar: ['Espaciado consistente', 'Componentización'],
  posicion: { fase: 2, faseTitle: 'Auto Layout y composición', leccion: 'Auto Layout anidado', proximoReto: 'Rediseña una tarjeta de perfil con Auto Layout anidado' },
};

Object.assign(window, {
  GUIDING_PHRASE, DEMO_ACCOUNTS, DEMO_PASSWORD, COURSE, PHASES, LESSONS, LESSON_DETAIL,
  CHALLENGE, SUBMISSIONS, NIVELES, MENTOR_QUEUE, MEDALS, SKILL_TREE, RESOURCES, ADMIN, STUDENT_STATS,
});
