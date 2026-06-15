import { type PhaseSeed } from '../content-types.js';

export const dwecP06: PhaseSeed = {
  code: 'FASE 6',
  title: 'POO en JavaScript',
  objective:
    'Modelar el dominio de ReseñApp con objetos y clases, aplicando los pilares de la programación orientada a objetos: encapsulación, herencia y composición.',
  unlockedSkills: ['js-poo'],
  projects: ['Módulo de dominio de ReseñApp (clases + store en memoria)'],
  lessons: [
    {
      title: 'Objetos, this y clases en JS',
      objective:
        'Entender cómo funciona this en JavaScript, crear objetos literales y transformarlos en clases reutilizables con constructor y métodos.',
      theory:
        'En JavaScript los objetos son colecciones de pares clave-valor donde los valores pueden ser datos o funciones. Cuando una función se usa como método de un objeto, la palabra clave this hace referencia al objeto que la invoca. Este comportamiento dinámico es la base de la orientación a objetos en el lenguaje, pero también es la fuente de muchos errores si se pierde el contexto (por ejemplo, al pasar un método como callback).\n\nLas clases, introducidas en ES6, son azúcar sintáctico sobre el sistema de prototipos de JavaScript. El constructor se ejecuta una sola vez al crear la instancia con new, y en él se inicializan las propiedades del objeto. Los métodos definidos fuera del constructor se añaden al prototipo compartido, lo que significa que no se duplican en memoria por cada instancia.\n\nLa encapsulación permite ocultar el estado interno usando campos privados (prefijo #). Así el exterior solo puede interactuar con el objeto a través de los métodos que expongamos explícitamente, lo que reduce el acoplamiento y hace el código más mantenible. En ReseñApp, por ejemplo, la lista interna de reseñas del store debe ser privada: nadie debe modificarla directamente.\n\nLos módulos ES permiten organizar las clases en archivos separados y exportarlas con export / import. Tener cada clase en su propio fichero facilita el testing, la legibilidad y el trabajo en equipo, que son hábitos profesionales desde el primer proyecto.',
      example:
        '// resena.js\nexport class Resena {\n  #puntuacion;\n\n  constructor(id, texto, puntuacion, itemId, autorId) {\n    this.id = id;\n    this.texto = texto;\n    this.#puntuacion = Math.min(5, Math.max(1, puntuacion));\n    this.itemId = itemId;\n    this.autorId = autorId;\n    this.fecha = new Date();\n  }\n\n  get puntuacion() { return this.#puntuacion; }\n\n  toJSON() {\n    return { id: this.id, texto: this.texto, puntuacion: this.#puntuacion,\n             itemId: this.itemId, autorId: this.autorId };\n  }\n}',
      concepts: [
        'Objetos literales',
        'this',
        'Clases y constructor',
        'Métodos de instancia',
        'Campos privados (#)',
        'Getters',
        'Módulos ES (export / import)',
        'Prototipo',
      ],
      tools: ['VS Code', 'DevTools Console', 'Node.js (opcional para ejecutar sin navegador)'],
      estimatedTimeMinutes: 45,
    },
    {
      title: 'Herencia, composición y store en memoria',
      objective:
        'Aplicar herencia con extends, entender cuándo preferir composición, y construir un store que gestione la colección de ReseñApp en memoria.',
      theory:
        'La herencia permite que una clase hija reutilice el comportamiento de una clase padre usando extends y super(). En ReseñApp podría existir una clase base EntidadBase con id y fecha de creación, de la que hereden Resena e Item, evitando duplicar esa lógica. Sin embargo, la herencia profunda crea jerarquías frágiles: cuando el parecido entre clases es superficial, la composición (incluir instancias de otras clases como propiedades) es preferible.\n\nUn store es un objeto centralizado que mantiene y gestiona una colección de entidades en memoria. Encapsula la lista (campo privado) y expone únicamente los métodos necesarios: añadir, buscar por id, filtrar por criterio y calcular estadísticas como la media de puntuaciones. Este patrón es el núcleo de cualquier aplicación de gestión y es la base sobre la que luego se construirán integraciones con APIs reales.\n\nLos métodos de array como map, filter y reduce son las herramientas naturales para trabajar con colecciones dentro del store. Conocerlos bien reduce la cantidad de código y lo hace más expresivo. Por ejemplo, calcular la media de puntuaciones de un item es un reduce de una línea.\n\nAntes de pasar a frameworks, dominar este patrón manualmente es clave: Vue, React y similares gestionan el estado de forma similar por dentro, y entender el mecanismo subyacente permite depurar problemas que de otra forma resultarían mágicos.',
      example:
        '// store.js\nimport { Resena } from \'./resena.js\';\n\nexport class ResenaStore {\n  #resenas = [];\n\n  agregar(resena) {\n    if (!(resena instanceof Resena)) throw new Error(\'Solo se admiten instancias de Resena\');\n    this.#resenas.push(resena);\n    return this;\n  }\n\n  porItem(itemId) {\n    return this.#resenas.filter(r => r.itemId === itemId);\n  }\n\n  mediaItem(itemId) {\n    const lista = this.porItem(itemId);\n    if (!lista.length) return null;\n    return lista.reduce((acc, r) => acc + r.puntuacion, 0) / lista.length;\n  }\n}',
      concepts: [
        'Herencia (extends / super)',
        'Composición vs herencia',
        'Store en memoria',
        'Campos privados en el store',
        'map / filter / reduce sobre colecciones',
        'instanceof',
      ],
      tools: ['VS Code', 'DevTools Console'],
      estimatedTimeMinutes: 50,
      challenge: {
        title: 'Dominio de ReseñApp: clases y store',
        brief:
          'Implementa en módulos ES las clases Resena, Item y Usuario, y un ResenaStore que gestione la colección: añadir reseñas, buscar por item y calcular la media de puntuaciones.',
        context:
          'Hasta ahora los datos de ReseñApp vivían en objetos literales dispersos. En esta fase los organizamos como entidades de dominio con comportamiento propio. El resultado será el núcleo del frontend: todas las fases siguientes construirán sobre este store.',
        objective:
          'Modelar el dominio de ReseñApp con clases bien encapsuladas y un store que garantice la integridad de los datos.',
        targetUser: 'El propio alumno como desarrollador del módulo de dominio.',
        restrictions: [
          'Cada clase en su propio archivo (resena.js, item.js, usuario.js, store.js).',
          'La lista interna del store debe ser un campo privado (#).',
          'La puntuación de Resena debe estar acotada entre 1 y 5 (validación en el constructor).',
          'Prohibido usar arrays globales sueltos; toda la colección se gestiona a través del store.',
          'Sin frameworks ni librerías externas.',
        ],
        deliverables: [
          'Enlace al repositorio de GitHub con los módulos de dominio.',
          'Archivo demo.js (o sección en main.js) que crea instancias, las añade al store e imprime la media de puntuaciones en consola.',
          'Captura de la consola de DevTools mostrando los resultados.',
        ],
        checklist: [
          'Las clases Resena, Item y Usuario tienen constructor con validación básica.',
          'ResenaStore.agregar() rechaza objetos que no sean instancias de Resena.',
          'ResenaStore.porItem(itemId) devuelve el subconjunto correcto.',
          'ResenaStore.mediaItem(itemId) devuelve null si no hay reseñas y la media correcta si las hay.',
          'Los módulos se importan/exportan correctamente sin errores en consola.',
          'El código usa campos privados (#) para el estado interno del store.',
        ],
        commonMistakes: [
          'Acceder directamente al array interno del store desde fuera en lugar de usar los métodos.',
          'Olvidar llamar a super() en una subclase y recibir un ReferenceError críptico.',
          'Calcular la media dividiendo por la longitud total en vez de por la longitud del subconjunto filtrado.',
          'Exportar la instancia del store en lugar de la clase, lo que impide tener múltiples stores en tests.',
          'Mezclar lógica de presentación (DOM) dentro de las clases de dominio.',
        ],
        difficulty: 3,
        timeLimitMinutes: 90,
        skills: ['js-poo'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description:
              'Las clases se instancian sin errores, el store gestiona la colección correctamente y la media se calcula bien.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description:
              'Código legible, bien indentado, nombres de variables y métodos descriptivos, sin lógica duplicada entre clases.',
          },
          {
            name: 'Encapsulación y diseño',
            description:
              'El estado interno del store es privado, la validación ocurre en el lugar correcto y las responsabilidades están bien repartidas entre clases.',
          },
          {
            name: 'Buenas prácticas',
            description:
              'Módulos ES bien organizados, commits atómicos y sin código muerto (console.log de debug, variables sin usar).',
          },
        ],
      },
    },
  ],
};
