import { type PhaseSeed } from '../content-types.js';

export const dwesP01: PhaseSeed = {
  code: 'FASE 1',
  title: 'PHP: el lenguaje',
  objective: 'Escribir lógica de servidor sólida con PHP: tipos, arrays, control de flujo, funciones y organización de archivos.',
  unlockedSkills: ['php'],
  projects: ['Librería de utilidades ReseñApp', 'Validador de reseñas', 'Calculadora de media de valoraciones'],
  lessons: [
    {
      title: 'Variables, tipos y operadores',
      objective: 'Manejar con soltura los tipos de PHP y evitar los errores más comunes de tipado dinámico.',
      theory:
        'PHP es de tipado dinámico: una variable puede cambiar de tipo durante la ejecución. Aun así conviene declarar tipos explícitos en funciones (declare(strict_types=1)) para evitar conversiones silenciosas que generan bugs difíciles de rastrear. Los tipos básicos son int, float, string, bool y null; los compuestos son array y object.\n\nLos operadores de comparación son la fuente de confusión más habitual: == compara valor con conversión de tipo (0 == "a" es true en PHP), mientras que === compara valor Y tipo (0 === "a" es false). En código de producción casi siempre quieres ===. El operador de fusión de null ?? devuelve el operando izquierdo si no es null, lo que simplifica mucho la lectura de valores opcionales.\n\nPara trabajar con cadenas PHP ofrece funciones como strlen(), strtolower(), trim(), str_contains() (PHP 8+) y sprintf() para formatear. El interpolado dentro de comillas dobles ("Hola $nombre") es cómodo para mensajes simples, pero para lógica compleja es mejor concatenar o usar sprintf().',
      concepts: ['Tipos escalares', 'Tipado dinámico', 'strict_types', '== vs ===', 'Operador ??', 'Funciones de cadena'],
      tools: ['PHP CLI (php -r)', 'VS Code + PHP Intelephense'],
      estimatedTimeMinutes: 35,
    },
    {
      title: 'Arrays, control de flujo y funciones',
      objective: 'Recorrer y transformar arrays con funciones nativas de PHP y organizar el código con include/require.',
      theory:
        'Los arrays de PHP son los más versátiles del mundo: pueden ser indexados (lista) o asociativos (mapa clave→valor) y se pueden anidar libremente. Las funciones nativas más útiles son array_map() para transformar, array_filter() para filtrar, array_reduce() para acumular, usort() para ordenar con criterio propio y array_column() para extraer una columna de un array bidimensional.\n\nEl control de flujo es el de siempre (if/elseif/else, switch, match en PHP 8, for, foreach, while), pero foreach es el que más usarás en backend porque casi todo llega como array o colección. El operador match es más estricto que switch (usa ===, sin fallthrough) y devuelve un valor, lo que permite escribir lógica compacta.\n\nPara organizar el código en varios archivos usa require_once en lugar de include: lanza un error fatal si el archivo no existe y no lo carga dos veces. Una convención habitual es agrupar funciones relacionadas en archivos dentro de src/ e incluirlos desde el punto de entrada. En fases posteriores esto evolucionará a clases y namespaces, pero por ahora la modularidad por funciones es suficiente.',
      concepts: ['Arrays indexados y asociativos', 'array_map / filter / reduce', 'foreach', 'match', 'require_once', 'Funciones con tipos'],
      tools: ['PHP CLI', 'PHP built-in server (php -S localhost:8000)'],
      estimatedTimeMinutes: 40,
      challenge: {
        title: 'Utilidades PHP para ReseñApp',
        brief:
          'Crea una librería de funciones PHP puras que validen los datos de una reseña, calculen la media de valoraciones de un ítem y formateen el resultado para mostrarlo; pruébalas desde el navegador o la CLI.',
        context:
          'En ReseñApp cada reseña tiene un título (string, 3-200 chars), una valoración (int, 1-10) y un texto opcional (string, max 1000 chars). El backend necesitará validar estos campos antes de guardarlos y calcular la media de las valoraciones de cada película, serie o juego. Estas funciones serán reutilizadas más adelante cuando conectemos la BD.',
        objective:
          'Implementar funciones PHP reutilizables que validen, calculen y formateen datos de reseñas sin depender de ningún framework ni base de datos.',
        targetUser: 'El desarrollador backend que integrará estas utilidades en el router y en la capa de datos.',
        restrictions: [
          'Solo PHP puro; sin frameworks ni librerías externas.',
          'declare(strict_types=1) obligatorio en todos los archivos.',
          'Las funciones deben estar en src/utils/resenas.php y ser incluidas desde el script de prueba.',
          'No se puede usar eval() ni ninguna función de ejecución de código dinámico.',
        ],
        deliverables: [
          'Enlace al repositorio GitHub con el código (src/utils/resenas.php + script de prueba).',
          'Captura del resultado en el navegador o de la salida en la terminal mostrando casos válidos e inválidos.',
        ],
        checklist: [
          'validarResena(array $datos): array devuelve un array de errores vacío si los datos son correctos.',
          'validarResena() devuelve mensajes de error descriptivos para cada campo inválido.',
          'mediaValoraciones(array $valoraciones): float devuelve la media correcta o 0.0 si el array está vacío.',
          'formatearResena(array $resena): string devuelve una representación legible con título, nota y texto.',
          'Hay al menos 3 llamadas de prueba que cubren casos válidos e inválidos.',
          'declare(strict_types=1) presente en todos los .php del entregable.',
        ],
        commonMistakes: [
          'Usar == en lugar de === para comparar tipos o rangos numéricos.',
          'No contemplar el array vacío en mediaValoraciones(), provocando división por cero.',
          'Mezclar la lógica de validación con la de presentación dentro de la misma función.',
          'Olvidar trim() en los strings antes de validar la longitud, dejando pasar espacios como contenido.',
        ],
        difficulty: 2,
        timeLimitMinutes: 75,
        skills: ['php'],
        rubric: [
          {
            name: 'Funcionamiento / correctitud',
            description: 'Las tres funciones producen el resultado correcto en los casos válidos e inválidos probados, incluido el edge case del array vacío.',
            isCritical: true,
          },
          {
            name: 'Calidad del código',
            description: 'Funciones cortas y con un único propósito, nombres descriptivos, sin lógica duplicada.',
          },
          {
            name: 'Buenas prácticas PHP',
            description: 'strict_types habilitado, tipos declarados en todas las firmas de función, sin warnings ni notices.',
          },
          {
            name: 'Claridad / organización',
            description: 'Separación correcta en archivos, require_once bien usado y script de prueba fácil de ejecutar.',
          },
        ],
      },
    },
  ],
};
