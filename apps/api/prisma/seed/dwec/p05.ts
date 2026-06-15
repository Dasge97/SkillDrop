import { type PhaseSeed } from '../content-types.js';

export const dwecP05: PhaseSeed = {
  code: 'FASE 5',
  title: 'Eventos y formularios',
  objective:
    'Construir aplicaciones interactivas manejando eventos del navegador y validando formularios en el cliente antes de procesar los datos.',
  unlockedSkills: ['eventos'],
  projects: ['Formulario "añadir reseña" con validación y render inmediato en ReseñApp'],
  lessons: [
    {
      title: 'addEventListener y el objeto event',
      objective:
        'Registrar manejadores de eventos, entender la propagación y usar el objeto event para responder con precisión a la interacción del usuario.',
      theory:
        'Los eventos son el mecanismo principal por el que JavaScript reacciona a lo que hace el usuario. Con addEventListener(tipo, handler) registramos una función que se ejecuta cada vez que ocurre el evento indicado en el elemento objetivo. El navegador construye un objeto Event y lo pasa al handler: ese objeto contiene información como el elemento que originó el evento (event.target), la posición del ratón, la tecla pulsada, etc.\n\nLos eventos se propagan por el árbol del DOM en dos fases: captura (de padre a hijo) y burbuja (de hijo a padre). La fase de burbuja es la que usamos por defecto y la que permite la delegación de eventos: en vez de poner un listener en cada tarjeta, ponemos uno solo en el contenedor padre y comprobamos event.target para saber en qué elemento exacto se hizo clic. Esto mejora el rendimiento y funciona automáticamente con elementos añadidos después del registro del listener.\n\nAlgunos eventos tienen un comportamiento predeterminado del navegador: un formulario hace POST y recarga la página, un enlace navega a su href, una casilla cambia de estado. Con event.preventDefault() cancelamos ese comportamiento y tomamos el control desde JS, que es lo que necesitamos para manejar formularios con validación en cliente.',
      example:
        '// Delegación: un solo listener para todas las tarjetas\ndocument.querySelector("#catalogo").addEventListener("click", (e) => {\n  const card = e.target.closest(".card");\n  if (!card) return;\n  console.log("tarjeta seleccionada:", card.dataset.id);\n});\n\n// Cancelar el comportamiento por defecto de un formulario\ndocument.querySelector("form").addEventListener("submit", (e) => {\n  e.preventDefault();\n  // aquí procesamos los datos\n});',
      concepts: [
        'addEventListener / removeEventListener',
        'Tipos de eventos (click, submit, input, keydown, change)',
        'Objeto Event (target, currentTarget, key, type)',
        'Propagación: captura y burbuja',
        'Delegación de eventos',
        'preventDefault',
        'stopPropagation',
      ],
      tools: ['DevTools Console', 'DevTools Elements'],
      estimatedTimeMinutes: 35,
    },
    {
      title: 'Formularios y validación en cliente',
      objective:
        'Acceder a los valores de un formulario, validar los datos en el cliente y mostrar mensajes de error claros sin recargar la página.',
      theory:
        'Acceder a los campos de un formulario es sencillo: FormData convierte todos los campos en un objeto iterable, o podemos leer input.value directamente. Lo importante es validar antes de usar esos datos: comprobar que los campos requeridos no están vacíos, que los números están en rango y que los textos tienen la longitud mínima.\n\nLa validación en cliente no sustituye a la del servidor —un usuario puede saltársela con DevTools—, pero mejora la experiencia: el usuario recibe retroalimentación inmediata sin esperar una respuesta de red. El patrón recomendado es: (1) capturar el evento submit con preventDefault, (2) leer y validar los valores, (3) si hay errores mostrar mensajes junto al campo afectado, (4) si todo es correcto procesar los datos (añadir al array, pintar en el DOM, limpiar el formulario).\n\nPara mostrar errores de validación accesibles hay que conectar el mensaje con el campo mediante aria-describedby y aria-live, de forma que los lectores de pantalla anuncien el error cuando aparece. El atributo novalidate en el formulario desactiva la validación nativa del navegador, dándonos control total desde JS. Limpiar el formulario con form.reset() después de un envío exitoso es un detalle pequeño que mejora mucho la experiencia.',
      example:
        'const form = document.querySelector("#form-resena");\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const data = Object.fromEntries(new FormData(form));\n  const errores = validar(data);\n\n  if (errores.length > 0) {\n    mostrarErrores(errores);\n    return;\n  }\n\n  // Añadir al array y renderizar\n  resenas.push({ id: Date.now(), ...data });\n  renderCatalogo(resenas);\n  form.reset();\n});\n\nfunction validar({ titulo, nota }) {\n  const errores = [];\n  if (!titulo.trim()) errores.push({ campo: "titulo", msg: "El título es obligatorio." });\n  if (nota < 1 || nota > 10) errores.push({ campo: "nota", msg: "La nota debe estar entre 1 y 10." });\n  return errores;\n}',
      concepts: [
        'FormData',
        'input.value / select.value',
        'Validación manual vs. nativa',
        'novalidate',
        'form.reset()',
        'Mensajes de error accesibles (aria-describedby, aria-live)',
        'Patrón: valida → muestra errores → procesa',
      ],
      tools: ['VS Code', 'DevTools Console', 'Lighthouse (accesibilidad)'],
      estimatedTimeMinutes: 45,
      challenge: {
        title: 'Formulario "añadir reseña" con validación',
        brief:
          'Implementa un formulario en ReseñApp que permita añadir una nueva reseña (título, categoría, nota y comentario). Al enviar, valida los datos en cliente, y si son correctos crea la tarjeta en el DOM y la añade al array de reseñas.',
        context:
          'ReseñApp necesita que sus usuarios puedan publicar nuevas reseñas. Por ahora el envío es local (sin API), pero el flujo completo —validar, actualizar el array, renderizar— es exactamente el mismo que usaremos cuando conectemos con el backend.',
        objective:
          'Formulario que valida en cliente, muestra errores claros junto al campo, y al envío válido añade la tarjeta al catálogo sin recargar la página.',
        targetUser: 'Usuario que quiere publicar una nueva reseña en ReseñApp.',
        restrictions: [
          'Capturar el evento submit con preventDefault; prohibido que el formulario recargue la página.',
          'Validar en JS al menos: título no vacío, nota entre 1 y 10, categoría seleccionada.',
          'Los mensajes de error deben mostrarse junto al campo afectado (no solo un alert).',
          'Después de un envío válido, limpiar el formulario con form.reset().',
          'La nueva tarjeta debe aparecer en el catálogo existente sin borrar las demás.',
          'No usar librerías externas de validación ni frameworks.',
        ],
        deliverables: [
          'Repositorio en GitHub con el código actualizado de esta fase.',
          'Captura mostrando mensajes de error de validación.',
          'Captura del catálogo con la nueva tarjeta añadida tras un envío válido.',
        ],
        checklist: [
          'El formulario tiene campos para título, categoría (select), nota (number 1-10) y comentario.',
          'El evento submit se cancela con preventDefault.',
          'Los errores de validación aparecen junto al campo correspondiente (no solo en consola).',
          'Un envío válido añade el objeto al array de reseñas y llama a renderCatalogo.',
          'El formulario se limpia con form.reset() tras un envío exitoso.',
          'Las tarjetas anteriores no desaparecen al añadir una nueva.',
          'No hay errores en la consola de DevTools.',
        ],
        commonMistakes: [
          'Olvidar preventDefault y que el formulario recargue la página borrando el catálogo.',
          'Mostrar errores solo con alert en vez de mensajes junto al campo.',
          'No limpiar los mensajes de error anteriores antes de volver a validar.',
          'Añadir la tarjeta al DOM sin añadirla primero al array, perdiendo coherencia entre datos y vista.',
          'Usar innerHTML con el valor del input para construir la tarjeta (riesgo XSS).',
        ],
        difficulty: 3,
        timeLimitMinutes: 100,
        skills: ['eventos', 'dom'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description:
              'El formulario no recarga la página, la validación detecta todos los errores requeridos y el envío válido añade la tarjeta al catálogo. No hay errores en consola.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description:
              'La función de validación está separada del handler de submit. Nombres descriptivos. Código legible sin duplicaciones.',
          },
          {
            name: 'Buenas prácticas',
            description:
              'Los mensajes de error se limpian antes de cada nueva validación. El array es la fuente de verdad y el DOM refleja su estado. form.reset() tras envío exitoso.',
          },
          {
            name: 'Accesibilidad / UX',
            description:
              'Los mensajes de error están asociados al campo con aria-describedby o equivalente. La región de errores usa aria-live para anunciarse a lectores de pantalla. Los campos tienen label visible.',
          },
        ],
      },
    },
  ],
};
