// Catálogo de habilidades desbloqueables (sección 6.6 del spec).

export interface SkillSeed {
  slug: string;
  name: string;
  category: string;
  description: string;
}

export const skills: SkillSeed[] = [
  // Fundamentos visuales
  { slug: 'frames', name: 'Frames', category: 'Fundamentos visuales', description: 'Crear y usar frames como base del diseño.' },
  { slug: 'layers', name: 'Layers', category: 'Fundamentos visuales', description: 'Organización y orden de capas.' },
  { slug: 'grids', name: 'Grids', category: 'Fundamentos visuales', description: 'Layout grids y columnas.' },
  { slug: 'spacing', name: 'Spacing', category: 'Fundamentos visuales', description: 'Sistema de espaciado consistente.' },
  { slug: 'alignment', name: 'Alineación', category: 'Fundamentos visuales', description: 'Alinear y distribuir con precisión.' },
  { slug: 'hierarchy', name: 'Jerarquía', category: 'Fundamentos visuales', description: 'Guiar la atención con jerarquía visual.' },
  { slug: 'typography', name: 'Tipografía', category: 'Fundamentos visuales', description: 'Escalas tipográficas y legibilidad.' },
  { slug: 'color', name: 'Color', category: 'Fundamentos visuales', description: 'Paletas, contraste y uso del color.' },

  // Figma técnico
  { slug: 'auto-layout', name: 'Auto Layout', category: 'Figma técnico', description: 'Padding, gap, hug y fill con Auto Layout.' },
  { slug: 'constraints', name: 'Constraints', category: 'Figma técnico', description: 'Anclajes y comportamiento al redimensionar.' },

  // Componentes y sistemas
  { slug: 'components', name: 'Components', category: 'Componentes y sistemas', description: 'Componentes reutilizables.' },
  { slug: 'variants', name: 'Variants', category: 'Componentes y sistemas', description: 'Variantes y propiedades de componente.' },
  { slug: 'variables', name: 'Variables', category: 'Componentes y sistemas', description: 'Variables de Figma.' },
  { slug: 'tokens', name: 'Tokens', category: 'Componentes y sistemas', description: 'Design tokens y escalabilidad.' },
  { slug: 'design-systems', name: 'Design Systems', category: 'Componentes y sistemas', description: 'Construir y documentar sistemas de diseño.' },

  // Responsive
  { slug: 'responsive', name: 'Responsive', category: 'Responsive', description: 'Diseño adaptable multiplataforma.' },

  // Prototipado
  { slug: 'prototyping', name: 'Prototyping', category: 'Prototipado', description: 'Prototipos navegables e interacciones.' },

  // UX
  { slug: 'ux-flows', name: 'UX Flows', category: 'UX', description: 'Flujos de usuario y arquitectura de información.' },
  { slug: 'forms', name: 'Forms', category: 'UX', description: 'Formularios usables y validaciones.' },

  // Producto digital
  { slug: 'dashboards', name: 'Dashboards', category: 'Producto digital', description: 'Paneles de datos y tablas.' },
  { slug: 'mobile-ui', name: 'Mobile UI', category: 'Producto digital', description: 'Patrones de interfaz móvil.' },
  { slug: 'web-ui', name: 'Web UI', category: 'Producto digital', description: 'Patrones de interfaz web.' },
  { slug: 'saas-ui', name: 'SaaS UI', category: 'Producto digital', description: 'Interfaces de producto SaaS complejas.' },

  // Handoff
  { slug: 'dev-mode', name: 'Dev Mode', category: 'Handoff', description: 'Dev Mode y specs para desarrollo.' },
  { slug: 'handoff', name: 'Handoff', category: 'Handoff', description: 'Entrega de diseño lista para frontend.' },

  // Carrera
  { slug: 'portfolio', name: 'Portfolio', category: 'Carrera', description: 'Case studies y portfolio profesional.' },
  { slug: 'freelancing', name: 'Freelancing', category: 'Carrera', description: 'Propuestas, briefs y clientes.' },

  // ---- Desarrollo Web: Cliente (DWEC) ----
  { slug: 'js-fundamentos', name: 'Fundamentos JS', category: 'JavaScript', description: 'Sintaxis, tipos, operadores y control de flujo.' },
  { slug: 'js-datos', name: 'Datos en JS', category: 'JavaScript', description: 'Arrays, objetos y transformación de colecciones.' },
  { slug: 'js-poo', name: 'POO en JS', category: 'JavaScript', description: 'Objetos, clases y módulos.' },
  { slug: 'dom', name: 'DOM', category: 'JavaScript', description: 'Manipular el árbol del documento.' },
  { slug: 'eventos', name: 'Eventos', category: 'JavaScript', description: 'Manejo de eventos e interacción.' },
  { slug: 'async', name: 'Asíncrono', category: 'JavaScript', description: 'Promesas, async/await y fetch.' },
  { slug: 'fetch-api', name: 'Consumo de APIs', category: 'JavaScript', description: 'Fetch, JSON y comunicación con el servidor.' },
  { slug: 'vue', name: 'Vue', category: 'Frontend', description: 'Componentes, reactividad y router en Vue.' },
  { slug: 'spa', name: 'SPA', category: 'Frontend', description: 'Aplicaciones de una sola página.' },
  { slug: 'accesibilidad-web', name: 'Accesibilidad web', category: 'Frontend', description: 'Accesibilidad y buenas prácticas de UI web.' },
  { slug: 'testing-front', name: 'Testing front', category: 'Frontend', description: 'Pruebas en el cliente.' },

  // ---- Desarrollo Web: Servidor (DWES) ----
  { slug: 'http', name: 'HTTP', category: 'Servidor', description: 'Protocolo, request/response, cliente vs servidor.' },
  { slug: 'php', name: 'PHP', category: 'Servidor', description: 'Sintaxis y lógica del lado servidor en PHP.' },
  { slug: 'php-marcas', name: 'PHP en HTML', category: 'Servidor', description: 'Código embebido en lenguajes de marcas (vistas dinámicas).' },
  { slug: 'mvc', name: 'MVC', category: 'Servidor', description: 'Separar presentación de lógica de negocio.' },
  { slug: 'sql', name: 'SQL', category: 'Datos', description: 'Consultas y modelado relacional.' },
  { slug: 'mysql-pdo', name: 'MySQL + PDO', category: 'Datos', description: 'Acceso a datos con PDO y seguridad.' },
  { slug: 'auth-sesiones', name: 'Auth y sesiones', category: 'Servidor', description: 'Login, sesiones, roles y hashing.' },
  { slug: 'api-rest', name: 'API REST', category: 'Servidor', description: 'Diseñar servicios web REST.' },
  { slug: 'seguridad-web', name: 'Seguridad web', category: 'Servidor', description: 'Inyección, XSS, CORS y validación.' },
  { slug: 'despliegue', name: 'Despliegue', category: 'Servidor', description: 'Puesta en producción y variables de entorno.' },
];
