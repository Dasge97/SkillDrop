import { type PhaseSeed } from '../content-types.js';

export const dwecP04: PhaseSeed = {
  code: 'FASE 4',
  title: 'El DOM',
  objective:
    'Manipular el Document Object Model para pintar la interfaz de ReseñApp directamente desde JavaScript, sin depender de librerías.',
  unlockedSkills: ['dom'],
  projects: ['Listado de reseñas renderizado dinámicamente en ReseñApp'],
  lessons: [
    {
      title: 'Seleccionar y leer nodos',
      objective:
        'Usar querySelector y querySelectorAll para localizar elementos del HTML y leer sus propiedades.',
      theory:
        'El DOM (Document Object Model) es la representación en memoria del HTML que el navegador ha parseado. JavaScript puede leer y modificar esa estructura en tiempo real. Los métodos querySelector y querySelectorAll aceptan cualquier selector CSS y devuelven el primer elemento o una NodeList con todos los que coincidan.\n\nCada nodo expone propiedades para acceder a su contenido (textContent, innerHTML), sus atributos (getAttribute, setAttribute, dataset) y sus clases (classList). Modificar estas propiedades actualiza la pantalla de inmediato, sin recargar la página.\n\nEs importante distinguir entre innerHTML y textContent. innerHTML parsea el string como HTML —útil para insertar marcado, pero peligroso si el contenido viene del usuario (XSS). textContent inserta el texto tal cual, sin interpretar etiquetas, y es la opción segura por defecto. Usa innerHTML solo cuando controles completamente el origen del contenido.',
      example:
        'const titulo = document.querySelector("#app h1");\ntitulo.textContent = "Mis reseñas";\n\nconst tarjetas = document.querySelectorAll(".card");\ntarjetas.forEach(card => {\n  console.log(card.dataset.id, card.getAttribute("aria-label"));\n});',
      concepts: [
        'querySelector / querySelectorAll',
        'textContent vs innerHTML',
        'getAttribute / setAttribute',
        'dataset',
        'classList (add, remove, toggle, contains)',
        'NodeList',
      ],
      tools: ['DevTools Elements', 'DevTools Console'],
      estimatedTimeMinutes: 35,
    },
    {
      title: 'Crear, insertar y eliminar nodos',
      objective:
        'Generar elementos HTML desde JavaScript y añadirlos o quitarlos del DOM para pintar contenido dinámico.',
      theory:
        'Cuando los datos llegan de una fuente dinámica (un array, una API) necesitamos crear nodos en JS y añadirlos al documento. El método document.createElement crea un elemento vacío; luego le asignamos propiedades y lo insertamos con appendChild, append o insertAdjacentElement. Para vaciar un contenedor antes de re-renderizar, la forma más sencilla es asignar innerHTML = "" o usar replaceChildren().\n\nEl patrón clásico de render dinámico es: (1) leer el array de datos, (2) vaciar el contenedor, (3) iterar el array creando un nodo por elemento, (4) añadir cada nodo al contenedor. Este ciclo es la base de cualquier framework moderno: Vue, React y Angular no hacen nada esencialmente distinto por debajo.\n\nPara mantener el código limpio conviene extraer la creación de cada tarjeta a una función pura (createCard(resena)) que recibe los datos y devuelve el elemento. Así el bucle de render queda legible y la función es fácil de testear de forma aislada.',
      example:
        'function createCard(resena) {\n  const article = document.createElement("article");\n  article.className = "card";\n  article.dataset.id = resena.id;\n\n  const h2 = document.createElement("h2");\n  h2.textContent = resena.titulo;\n\n  const nota = document.createElement("span");\n  nota.className = "badge";\n  nota.textContent = `${resena.nota}/10`;\n\n  article.append(h2, nota);\n  return article;\n}\n\nfunction renderCatalogo(lista) {\n  const contenedor = document.querySelector("#catalogo");\n  contenedor.replaceChildren();\n  lista.forEach(r => contenedor.appendChild(createCard(r)));\n}',
      concepts: [
        'createElement',
        'appendChild / append',
        'insertAdjacentElement',
        'replaceChildren / innerHTML = ""',
        'Función pura de render',
        'Separación datos / vista',
      ],
      tools: ['DevTools Elements', 'VS Code'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'Catálogo de reseñas en el DOM',
        brief:
          'A partir de un array de objetos de reseñas definido en JS, renderiza en el DOM la lista de tarjetas de ReseñApp, mostrando título, categoría y nota de cada reseña.',
        context:
          'ReseñApp necesita pintar su catálogo en pantalla. Por ahora los datos viven en un array local; en fases posteriores vendrán de la API. El reto es implementar el motor de render puro en DOM antes de que entre ningún framework.',
        objective:
          'Que la página muestre dinámicamente todas las tarjetas del array sin escribir HTML estático para cada una.',
        targetUser: 'Usuario que navega el catálogo de ReseñApp buscando algo interesante.',
        restrictions: [
          'Los datos deben estar en un array de objetos JS (mínimo 5 reseñas con id, titulo, categoria y nota).',
          'Prohibido escribir las tarjetas a mano en el HTML; todo el marcado de las tarjetas se genera en JS.',
          'No usar innerHTML para insertar datos que vengan del array (usar textContent o createElement para los textos).',
          'El código debe estar organizado en módulos ES (type="module").',
        ],
        deliverables: [
          'Repositorio en GitHub con el código de esta fase.',
          'Captura del navegador mostrando las tarjetas renderizadas.',
          'Captura de DevTools Elements con la estructura de nodos generada.',
        ],
        checklist: [
          'El array tiene al menos 5 reseñas con id, titulo, categoria y nota.',
          'Cada tarjeta muestra título, categoría y nota con la nota visible como badge o texto destacado.',
          'La función createCard es pura: recibe una reseña y devuelve un elemento, sin efectos secundarios.',
          'La función renderCatalogo limpia el contenedor antes de insertar las tarjetas.',
          'No hay errores en la consola de DevTools.',
          'Los textos se insertan con textContent (no innerHTML con datos del array).',
        ],
        commonMistakes: [
          'Usar innerHTML para construir las tarjetas con template string y no escapar el texto (vulnerabilidad XSS potencial).',
          'No limpiar el contenedor antes de re-renderizar, causando tarjetas duplicadas.',
          'Mezclar la lógica de datos y la lógica de render en la misma función.',
          'Olvidar dataset o id en las tarjetas, dificultando operaciones posteriores (eliminar, editar).',
        ],
        difficulty: 3,
        timeLimitMinutes: 90,
        skills: ['dom'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description:
              'Todas las reseñas del array aparecen como tarjetas en pantalla con título, categoría y nota correctos. No hay errores en consola.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description:
              'Funciones pequeñas y con responsabilidad única (createCard separada de renderCatalogo). Nombres descriptivos. Código legible e indentado.',
          },
          {
            name: 'Buenas prácticas',
            description:
              'Textos del array insertados con textContent. Módulos ES correctamente importados. Sin variables globales innecesarias.',
          },
          {
            name: 'Accesibilidad / UX',
            description:
              'Las tarjetas usan elementos semánticos (article, h2…). La nota es legible y tiene contraste suficiente. El catálogo es navegable con teclado.',
          },
        ],
      },
    },
  ],
};
