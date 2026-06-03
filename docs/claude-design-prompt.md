# Prompt para Claude Design — SkillDrop

> Copia el bloque de abajo en Claude Design. Genera un prototipo visual (no Vite); luego adaptamos el diseño a nuestra app real (Vite + React + Tailwind + React Router).

---

Diseña el sistema visual y las pantallas de **SkillDrop**, una plataforma web de cursos basada en la **maestría**: el alumno no avanza por completar lecciones, sino cuando demuestra dominio. Cada lección sigue el ciclo **mini‑teoría → reto realista → entrega → evaluación tipo mentor (rúbrica 1–10) → reintento**. El primer curso es un bootcamp completo de Figma/UI/UX, pero la plataforma es multi‑curso.

## Formato del entregable
- Crea un **prototipo React autocontenido en un solo archivo** (artifact), con **Tailwind** para todo el estilo.
- **Navegación interna** entre todas las pantallas con estado (useState o un mini‑router propio), para poder recorrer el flujo completo. No uses librerías externas de routing ni dependencias de Vite.
- Usa **datos mock realistas en español**.
- Incluye **modo claro y oscuro** con un toggle.
- Organiza el código en **un componente por pantalla** (p. ej. `Dashboard`, `Roadmap`, `LessonView`…), de forma que luego podamos portar cada uno a nuestra app real. Mantén el estilo en clases Tailwind.

## Assets / mascota (IMPORTANTE)
- Tenemos una **mascota propia**: una simpática **máquina expendedora con gorra y bombilla** que "dispensa habilidades". Queremos usarla en varias pantallas, PERO **no te paso las imágenes**.
- Por cada lugar donde iría la mascota o cualquier imagen nuestra, **deja un hueco/placeholder claramente marcado** (p. ej. un recuadro con borde discontinuo, color neutro, centrado, con una etiqueta como `🤖 [mascota: celebración]`). Respeta el tamaño/proporción que tendría la imagen final. Yo sustituiré esos huecos por los PNG reales después.
- Variantes de mascota a referenciar en los placeholders: `bienvenida/hero`, `login (guiño)`, `celebración (aprobado)`, `trabajando (lápiz)`, `entrega (portátil)`, `idea (bombilla)`, `guía (señalando)`, `medalla (logros)`.

## Identidad visual deseada
- Estética **producto digital premium**, limpia y moderna. Inspiración: **Linear, Notion, Stripe, Figma, Framer**. Nada escolar ni infantil.
- Color **primario teal/verde azulado** (aprox. `hsl(174 72% 34%)`), acentos suaves del mismo tono. Estados: éxito (verde), aviso (ámbar), peligro (rojo).
- Tipografía **Inter**. Mucho aire/whitespace, tarjetas con esquinas redondeadas (radius ~12px), sombras sutiles, texto secundario atenuado.
- Tono de copy: profesional, directo y motivador. Frase guía: *"No avances por completar lecciones. Avanza porque puedes demostrar dominio."*

## Pantallas a diseñar (con su contenido)

**Públicas**
1. **Landing**: hero (titular, subtítulo, 2 CTAs "Crear cuenta"/"Entrar", placeholder mascota hero), grid de 4 features (retos realistas, evaluación tipo mentor, avance por dominio, progreso visible), preview del roadmap (13 "chips" de fase numeradas 0–12), bloque CTA final con mascota, footer.
2. **Login / Registro**: tarjeta centrada, placeholder mascota (guiño), formulario (email/contraseña; registro añade nombre), nota de "cuentas demo".

**App (layout con sidebar)**
3. **Sidebar**: logo + mascota mini + "SkillDrop"; navegación (Dashboard, Roadmap, Progreso, Recursos, Revisión [solo mentor], Admin [solo admin]); abajo bloque de usuario (avatar con iniciales, nombre, email), toggle de tema y "Salir". Debe colapsar en móvil.
4. **Dashboard**: banner de bienvenida (placeholder mascota guía, saludo con nombre, curso activo, botón "Continuar →"); 4 tarjetas de stat (progreso %, nota media, XP total, racha de días); tarjeta "Tu posición actual" (fase y lección actuales, barra de progreso, "próximo reto" con CTA); tarjeta "Última evaluación" (nota grande con color según valor, badge de estado, feedback resumido, placeholder mascota según resultado); tarjetas de puntos fuertes / a mejorar (badges).
5. **Roadmap**: lista de 13 tarjetas de fase. Cada una: número o ✓, código (FASE N), badge de estado (**Bloqueada / Disponible / En progreso / En revisión / Completada** con icono y color), título, objetivo, barra de progreso, nota media y nº de retos. Las bloqueadas se ven atenuadas con candado.
6. **Vista de fase**: cabecera (código, badge estado, objetivo, % progreso con barra, placeholder mascota guía); chips de "habilidades que desbloquea"; lista de lecciones (número, título, objetivo, dificultad en estrellas, tiempo, flecha).
7. **Vista de lección**: bloque "Mini teoría" (placeholder mascota idea + varios párrafos) con un callout de "Ejemplo"; barra lateral con "Conceptos clave" (badges), "Herramientas de Figma" (badges) y una tarjeta destacada del "Reto práctico" (placeholder mascota trabajando + botón "Ver el reto →"); zona de "Tus notas" (textarea + guardar).
8. **Vista de reto**: cabecera (placeholder mascota trabajando, etiqueta "Reto práctico", título, badges de dificultad y tiempo recomendado, botón "Entregar trabajo"); Brief + Contexto + Objetivo + Usuario objetivo; 4 tarjetas en grid: Restricciones, Entregables, Checklist antes de entregar, Errores comunes (listas con viñetas); barra lateral con "Criterios de evaluación" (cada criterio con nombre, descripción y badge "crítico" cuando aplique) + nota sobre el umbral (media ≥ 8, ningún crítico < 7) + "Habilidades evaluadas" (badges) + historial "Tus entregas" (v1, v2… con su nota y estado).
9. **Vista de entrega (formulario)**: placeholder mascota entrega; alerta motivacional ("Primero termina, luego perfecciona"); campos: enlace de Figma, lista dinámica de URLs de capturas (añadir/quitar), notas; botones Cancelar / Enviar a revisión.
10. **Vista de evaluación (recibida)**: detalle de la entrega (enlace Figma, miniaturas de capturas, notas); tarjeta de evaluación del mentor: placeholder mascota según resultado, nota total grande + badge de estado (Aprobado / Requiere mejoras / Rehacer), feedback general, lista de criterios cada uno con barra 0–10 y comentario (badge "crítico" si aplica), "Mejoras obligatorias" y "Mejoras opcionales", "Nivel estimado" (Principiante → Profesional inicial), y si no está aprobado un CTA "Reintentar". Incluye también el estado alternativo "En revisión" (placeholder mascota idea, mensaje de espera).
11. **Progreso**: stats (XP, habilidades activas X/Y, racha); sección de medallas (badges 🏅); árbol de habilidades agrupado por categoría, cada skill con nombre, nivel en 5 puntos rellenables, nota media y nº de retos.
12. **Recursos**: tarjetas de recursos agrupadas por categoría (icono por tipo, título, descripción, badge de fase).
13. **Cola del mentor**: lista de entregas pendientes (placeholder mascota entrega, título del reto, alumno, versión, botón "Evaluar"); estado vacío con placeholder mascota celebración cuando no hay nada.
14. **Revisión del mentor**: preview de la entrega del alumno + formulario de rúbrica: por cada criterio una fila de botones 1–10, comentario opcional y badge "crítico"; media en vivo; feedback general; mejoras obligatorias/opcionales; selector de nivel estimado; nota explicando cómo se asigna el estado por la media; botón "Guardar evaluación".
15. **Panel admin** (con pestañas): **Resumen** (tarjetas de métricas: usuarios por rol, entregas por estado, contenido —cursos/fases/lecciones/retos—, evaluaciones); **Usuarios** (tabla con usuario, rol —badge—, XP, nº entregas, selector para cambiar rol); **Cursos** (editor en árbol: lista de cursos → fases → lecciones, con formularios para editar curso/fase/lección y un editor de reto + rúbrica).

## Componentes transversales a definir
Botones (primario/secundario/outline/ghost/danger en 3 tamaños), tarjetas, badges con tonos (default/primario/éxito/aviso/peligro), barra de progreso, inputs/textarea/select con label, badges de estado, avatar con iniciales, tabla simple, estado vacío (con placeholder mascota), spinner.

Entrega el prototipo navegable con todas estas pantallas y placeholders de mascota bien marcados. Cuida especialmente la jerarquía visual, el espaciado consistente y que el modo oscuro se vea igual de cuidado que el claro.
