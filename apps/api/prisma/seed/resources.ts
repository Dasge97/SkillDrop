// Biblioteca de recursos inicial (sección 11 del spec).

export interface ResourceSeed {
  title: string;
  description: string;
  url: string;
  type: string; // link|video|template|library|article
  category: string;
  phaseCode?: string;
  order: number;
}

export const resources: ResourceSeed[] = [
  {
    title: 'Figma — Centro de ayuda oficial',
    description: 'Documentación oficial de todas las funciones de Figma.',
    url: 'https://help.figma.com/',
    type: 'link',
    category: 'Figma',
    order: 1,
  },
  {
    title: 'Auto Layout — Guía oficial',
    description: 'Cómo funcionan padding, gap, hug y fill en Auto Layout.',
    url: 'https://help.figma.com/hc/en-us/articles/360040451373',
    type: 'article',
    category: 'Figma',
    phaseCode: 'FASE 2',
    order: 2,
  },
  {
    title: 'Refactoring UI',
    description: 'Principios prácticos de UI: espaciado, jerarquía, color y tipografía.',
    url: 'https://www.refactoringui.com/',
    type: 'link',
    category: 'UI Design',
    phaseCode: 'FASE 1',
    order: 3,
  },
  {
    title: 'Laws of UX',
    description: 'Principios de usabilidad y psicología aplicados al diseño.',
    url: 'https://lawsofux.com/',
    type: 'link',
    category: 'UX',
    phaseCode: 'FASE 4',
    order: 4,
  },
  {
    title: 'Variables de Figma',
    description: 'Guía oficial de variables, modos y temas (light/dark).',
    url: 'https://help.figma.com/hc/en-us/articles/15339657135383',
    type: 'article',
    category: 'Design Systems',
    phaseCode: 'FASE 7',
    order: 5,
  },
  {
    title: 'Dev Mode',
    description: 'Inspección, specs y handoff con Dev Mode.',
    url: 'https://help.figma.com/hc/en-us/articles/15023124644247',
    type: 'article',
    category: 'Handoff',
    phaseCode: 'FASE 10',
    order: 6,
  },
  {
    title: 'WebAIM Contrast Checker',
    description: 'Comprueba el contraste de color para accesibilidad (WCAG).',
    url: 'https://webaim.org/resources/contrastchecker/',
    type: 'link',
    category: 'Accesibilidad',
    order: 7,
  },
  {
    title: 'Material Design — Guidelines',
    description: 'Referencia de patrones de interfaz y componentes.',
    url: 'https://m3.material.io/',
    type: 'link',
    category: 'UI Design',
    phaseCode: 'FASE 3',
    order: 8,
  },
];
