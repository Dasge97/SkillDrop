import { type PhaseSeed } from '../content-types.js';

export const dwesP02: PhaseSeed = {
  code: 'FASE 2',
  title: 'Vistas dinámicas (PHP en HTML)',
  objective: 'Generar páginas web dinámicas en el servidor combinando PHP embebido en HTML, procesando datos de formularios y escapando la salida correctamente.',
  unlockedSkills: ['php-marcas'],
  projects: [
    'Listado dinámico de reseñas con PHP embebido',
    'Formulario de filtrado por categoría y nota mínima',
  ],
  lessons: [
    {
      title: 'PHP embebido en HTML y datos de formulario',
      objective: 'Escribir PHP dentro de plantillas HTML para generar contenido dinámico y leer parámetros enviados por el usuario mediante $_GET y $_POST.',
      theory:
        'PHP se puede intercalar directamente en HTML usando las etiquetas <?php ... ?> y <?= ... ?>. Esto permite que el servidor procese la lógica y entregue al navegador un documento HTML completamente construido. Es el modelo más sencillo del ciclo petición-respuesta: el cliente solicita una URL, el servidor ejecuta el script y devuelve HTML puro.\n\nLos formularios HTML envían datos al servidor a través de dos métodos: GET (los parámetros van en la URL, ideales para filtros y búsquedas) y POST (los datos viajan en el cuerpo de la petición, adecuados para enviar información sensible o crear recursos). PHP expone esos valores a través de los superglobales $_GET y $_POST, ambos arrays asociativos indexados por el atributo name del input.\n\nCuando se genera HTML con datos provenientes del usuario (o de cualquier fuente externa) es imprescindible escapar la salida con htmlspecialchars(). Sin este paso, cualquier cadena que contenga < > " & puede romper el documento o permitir ataques XSS: el navegador interpretaría el contenido del usuario como código HTML o JavaScript. La función convierte esos caracteres en sus entidades HTML equivalentes (&lt;, &gt;, &amp;, etc.) y es la primera línea de defensa.\n\nLos bucles de PHP (foreach, for) son la herramienta clave para generar listas de elementos HTML. Iterando sobre un array de datos se produce tantas veces el fragmento HTML como elementos haya, manteniendo el código limpio y libre de repetición. Una separación inicial entre lógica (preparar los datos) y presentación (el HTML que los muestra) facilita el mantenimiento y sienta las bases del patrón MVC que se verá más adelante.',
      example:
        '<?php\n$resenyas = [\n  [\'titulo\' => \'Cafetería Sol\', \'nota\' => 4, \'categoria\' => \'restaurante\'],\n  [\'titulo\' => \'Cine Goya\',    \'nota\' => 3, \'categoria\' => \'ocio\'],\n];\n$filtro = $_GET[\'categoria\'] ?? \'\';\n$resultado = $filtro\n  ? array_filter($resenyas, fn($r) => $r[\'categoria\'] === $filtro)\n  : $resenyas;\n?>\n<ul>\n<?php foreach ($resultado as $r): ?>\n  <li><?= htmlspecialchars($r[\'titulo\']) ?> — <?= $r[\'nota\'] ?>/5</li>\n<?php endforeach; ?>\n</ul>',
      concepts: [
        'PHP embebido en HTML',
        'Etiquetas <?php ?> y <?= ?>',
        '$_GET y $_POST',
        'htmlspecialchars() y escape de salida',
        'foreach para generar HTML',
        'Separación lógica / presentación',
      ],
      tools: ['php', 'php-marcas', 'http'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'Listado y filtrado de reseñas en PHP',
        brief:
          'Crea un script PHP que muestre un listado de reseñas de ReseñApp generando el HTML dinámicamente desde un array de datos, con un formulario GET que filtre por categoría y nota mínima.',
        context:
          'Es la primera vista funcional de ReseñApp: el usuario puede explorar reseñas y acotar resultados sin recargar toda la página ni requerir base de datos todavía.',
        objective:
          'Demostrar que sabes generar HTML dinámico con PHP, leer parámetros de formulario de forma segura y escapar correctamente toda salida.',
        targetUser: 'Visitante de ReseñApp que busca reseñas por tipo de lugar o valoración.',
        restrictions: [
          'Los datos deben estar en un array PHP (sin base de datos en esta fase).',
          'El formulario de filtrado debe usar método GET.',
          'Toda salida de datos de usuario debe pasar por htmlspecialchars().',
          'La lógica de filtrado debe separarse del bloque HTML de presentación.',
          'No se permite usar frameworks ni librerías externas.',
        ],
        deliverables: [
          'Archivo index.php con el listado dinámico y el formulario de filtrado.',
          'El filtrado por categoría y por nota mínima debe funcionar de forma combinada.',
          'Capturas de pantalla: listado completo, filtrado por categoría y filtrado por nota.',
          'Enlace al repositorio o carpeta comprimida con el código.',
        ],
        checklist: [
          'El listado muestra todas las reseñas del array al cargar la página sin parámetros.',
          'El formulario GET filtra correctamente por categoría.',
          'El formulario GET filtra correctamente por nota mínima.',
          'Los filtros se pueden combinar.',
          'Toda salida de datos externos pasa por htmlspecialchars().',
          'La lógica de preparación de datos está separada del HTML.',
          'El código es legible y las capas bien diferenciadas.',
        ],
        commonMistakes: [
          'Volcar $_GET directamente en el HTML sin escapar (XSS).',
          'Mezclar la lógica de filtrado dentro del bucle foreach del HTML.',
          'Usar $_POST para un formulario de filtrado que debería ser GET (pierde la URL compartible).',
          'Olvidar manejar el caso en que el parámetro GET no existe (usar ?? o isset()).',
        ],
        difficulty: 2,
        timeLimitMinutes: 90,
        skills: ['php-marcas', 'php'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'El listado muestra las reseñas y el filtrado por categoría y nota funciona correctamente en todos los casos.',
            isCritical: true,
          },
          {
            name: 'Seguridad de salida',
            description: 'Toda variable mostrada en HTML pasa por htmlspecialchars(); no existe riesgo de XSS.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Código limpio, indentado correctamente y sin repetición innecesaria.',
          },
          {
            name: 'Buenas prácticas',
            description: 'Lógica separada de la presentación; uso semántico de GET para el filtrado.',
          },
        ],
      },
    },
    {
      title: 'Separación inicial: lógica vs. presentación',
      objective: 'Organizar el código PHP separando la preparación de datos en un archivo independiente de la plantilla HTML que los muestra.',
      theory:
        'A medida que los scripts PHP crecen, mezclar consultas, cálculos y HTML en el mismo archivo se vuelve difícil de leer y de mantener. La separación inicial más sencilla consiste en preparar todos los datos en un bloque PHP al principio del archivo (o en un archivo aparte incluido con require) y reservar el resto del documento para la presentación HTML, que solo debería contener <?= ?> y estructuras de control simples.\n\nEsta separación es el embrión del patrón MVC (Modelo-Vista-Controlador) que se usará en fases posteriores. En la vista solo debe haber lógica de presentación: recorrer arrays, formatear fechas, decidir qué clase CSS aplicar según un valor. La lógica de negocio (cálculos, filtros, validaciones) debe estar en la capa de lógica.\n\nPHP ofrece require y require_once para incluir archivos externos. Dividir el proyecto en archivos con responsabilidades claras (por ejemplo, data.php para los datos y listado.php para la vista) anticipa la estructura que tendrá el proyecto cuando se conecte a la base de datos. El objetivo es que la plantilla HTML sea tan simple que un diseñador web pueda modificarla sin romper la lógica.',
      concepts: [
        'Separación lógica / presentación',
        'require y require_once',
        'Plantilla PHP (template)',
        'Variables de vista',
        'Embrión del patrón MVC',
      ],
      tools: ['php', 'php-marcas'],
      estimatedTimeMinutes: 30,
    },
  ],
};
