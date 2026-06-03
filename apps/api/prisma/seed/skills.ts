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
];
