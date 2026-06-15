import { type PhaseSeed } from '../content-types.js';

export const dwecP09: PhaseSeed = {
  code: 'FASE 9',
  title: 'Introducción a Vue',
  objective:
    'Construir interfaces reactivas con Vue 3 usando componentes, templates, ref/reactive, directivas y comunicación entre componentes con props y emits.',
  unlockedSkills: ['vue'],
  projects: [
    'App Vue mínima con Vite',
    'Contador reactivo con ref',
    'Lista filtrable con v-for y v-if',
    'Formulario con v-model',
    'Lista de reseñas y formulario de ReseñApp como componentes Vue',
  ],
  lessons: [
    {
      title: 'La app Vue y la reactividad',
      objective:
        'Crear una aplicación Vue 3 con Vite, entender la instancia de app, los templates y la reactividad básica con ref y reactive.',
      theory:
        'Vue 3 es un framework progresivo para construir interfaces de usuario. Su característica principal es la reactividad: cuando los datos cambian, el DOM se actualiza automáticamente sin que tengas que tocar el HTML manualmente. Esto elimina la mayor parte del código de manipulación del DOM que escribías con JavaScript puro.\n\nUna aplicación Vue se crea con createApp() y se monta en un elemento del HTML. Con la Composition API (la forma moderna de Vue 3), toda la lógica vive dentro de <script setup>: las variables reactivas se declaran con ref() para valores primitivos o reactive() para objetos, y están disponibles directamente en el template sin necesidad de this. Los templates usan llaves dobles {{ }} para interpolación y directivas (atributos especiales con prefijo v-) para comportamiento dinámico.\n\nLas directivas esenciales son v-bind para enlazar atributos HTML a datos (:class, :href, :disabled…), v-on para escuchar eventos (@click, @submit…) y v-model para crear un enlace bidireccional entre un input y una variable reactiva. Este último es especialmente útil en formularios: el valor del input y la variable se mantienen siempre sincronizados, lo que hace que gestionar un formulario sea mucho más sencillo que con addEventListener + value.',
      example:
        '<script setup>\nimport { ref } from \'vue\';\nconst count = ref(0);\nconst nombre = ref(\'\');\n</script>\n\n<template>\n  <p>Hola, {{ nombre || \'visitante\' }}</p>\n  <input v-model="nombre" placeholder="Tu nombre" />\n  <button @click="count++">Clics: {{ count }}</button>\n</template>',
      concepts: [
        'createApp()',
        'Single File Component (SFC)',
        '<script setup>',
        'ref()',
        'reactive()',
        'Interpolación {{ }}',
        'v-bind (:)',
        'v-on (@)',
        'v-model',
      ],
      tools: ['Vue 3', 'Vite', 'DevTools → Vue'],
      estimatedTimeMinutes: 45,
    },
    {
      title: 'Componentes, v-for/v-if, props y emits',
      objective:
        'Dividir la interfaz en componentes reutilizables, renderizar listas y condiciones, y comunicar datos entre componentes padre e hijo.',
      theory:
        'Los componentes son la unidad de construcción de Vue: cada uno es un archivo .vue con su propio template, lógica y estilos. Dividir la interfaz en componentes hace el código más fácil de entender, reutilizar y mantener. Un componente hijo recibe datos del padre a través de props (defineProps) y puede enviar eventos al padre con emits (defineEmits + emit()). La regla de oro es que los datos fluyen hacia abajo (props) y los eventos hacia arriba (emits).\n\nPara renderizar listas se usa v-for="item in items" :key="item.id". El atributo :key es obligatorio y debe ser único: le dice a Vue qué elemento del DOM corresponde a qué dato, lo que hace las actualizaciones eficientes. Para mostrar u ocultar elementos condicionalmente se usa v-if (desmonta el elemento) o v-show (lo oculta con CSS). Usa v-if cuando la condición cambia poco; v-show cuando alterna frecuentemente.\n\nEn una aplicación real, el componente padre suele ser el responsable de obtener los datos de la API y pasarlos como props a los hijos. Los hijos se encargan solo de mostrar y de emitir eventos cuando el usuario interactúa (borrar, editar, enviar). Esta separación de responsabilidades —"smart parent, dumb children"— mantiene los componentes simples y fáciles de testear.',
      concepts: [
        'Single File Component',
        'defineProps()',
        'defineEmits()',
        'emit()',
        'v-for y :key',
        'v-if / v-else / v-show',
        'Comunicación padre-hijo',
        'Props unidireccionales',
      ],
      tools: ['Vue 3', 'Vite', 'Vue DevTools'],
      estimatedTimeMinutes: 50,
      challenge: {
        title: 'Lista y formulario de ReseñApp en Vue',
        brief:
          'Reescribe la lista de reseñas y el formulario de nueva reseña de ReseñApp como componentes Vue reactivos, usando props, emits y v-model.',
        context:
          'ReseñApp funciona con datos reales gracias a la Fase 8. Ahora refactorizamos la capa de UI para aprovechar la reactividad de Vue: en lugar de manipular el DOM a mano, los datos guían la interfaz automáticamente. El objetivo es tener al menos dos componentes: uno que muestra la lista (ReviewList.vue) y otro con el formulario (ReviewForm.vue).',
        objective:
          'Que el alumno construya una interfaz Vue funcional con componentes separados, directivas y comunicación bidireccional, conectada a los mismos datos reales de la API.',
        targetUser: 'Usuario autenticado de ReseñApp que consulta y añade reseñas.',
        restrictions: [
          'Usar Vue 3 con Composition API (<script setup>).',
          'La lista de reseñas debe estar en un componente ReviewList.vue separado.',
          'El formulario debe estar en un componente ReviewForm.vue separado.',
          'Usar v-for con :key para renderizar las reseñas.',
          'Usar v-model en los campos del formulario.',
          'El componente padre (App.vue o la vista) gestiona el estado y las llamadas a la API; los hijos solo muestran datos y emiten eventos.',
          'No usar Options API (data(), methods…); solo Composition API.',
        ],
        deliverables: [
          'Repositorio con los archivos .vue de los componentes.',
          'ReviewList.vue que recibe las reseñas por props y las renderiza con v-for.',
          'ReviewForm.vue con v-model en cada campo y que emite un evento al enviar.',
          'El componente padre llama a la API y actualiza la lista tras crear una reseña.',
          'Capturas de pantalla de la lista con reseñas reales y del formulario en acción.',
        ],
        checklist: [
          'ReviewList.vue usa v-for con :key único.',
          'ReviewForm.vue usa v-model en todos los campos del formulario.',
          'ReviewForm.vue emite un evento con los datos al hacer submit.',
          'El padre escucha el evento y llama a la API para crear la reseña.',
          'Tras crear la reseña, la lista se actualiza sin recargar la página.',
          'Se usa v-if o v-show para mostrar mensajes de error o de éxito.',
          'Los componentes no mezclan lógica de API con presentación.',
        ],
        commonMistakes: [
          'Mutar directamente una prop en el hijo en lugar de emitir un evento al padre.',
          'Olvidar el :key en v-for y obtener advertencias de Vue en consola.',
          'Usar v-if y v-for en el mismo elemento (Vue no lo recomienda; usar un <template> intermedio).',
          'No declarar defineProps o defineEmits y que la comunicación no funcione.',
          'Recargar la página para ver los cambios en lugar de actualizar el array reactivo.',
        ],
        difficulty: 4,
        timeLimitMinutes: 120,
        skills: ['vue'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description:
              'La lista renderiza reseñas reales y el formulario crea una nueva sin errores en consola.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description:
              'Código legible, sin duplicación, nombres de variables y componentes descriptivos.',
          },
          {
            name: 'Componentización y estructura',
            description:
              'Lista y formulario en componentes separados; el padre gestiona el estado; los hijos solo muestran y emiten.',
          },
          {
            name: 'Manejo de errores',
            description:
              'Los errores de la API y de validación del formulario se comunican al usuario dentro de la UI Vue.',
          },
        ],
      },
    },
  ],
};
