/* -------------------------------------------------------------------------- */
/*  Formato mínimo de textos del curso: bloques ```, `código` y **negrita**    */
/* -------------------------------------------------------------------------- */

export function InlineCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="font-mono text-[0.9em] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-slate-800 dark:text-slate-100">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

export function TheoryBlock({ text }: { text: string }) {
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    const code = trimmed.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
    return (
      <pre className="text-[13px] font-mono leading-relaxed whitespace-pre overflow-x-auto rounded-lg bg-slate-900 text-slate-100 p-4">
        {code}
      </pre>
    );
  }
  return (
    <p className="whitespace-pre-line">
      <InlineCode text={text} />
    </p>
  );
}

// Un párrafo sin ``` cuya mayoría de líneas acaban en ; { } o son comentarios
// se considera código (los enunciados de los retos lo escriben así).
function looksLikeCode(para: string): boolean {
  const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0 || para.trim().startsWith('```')) return false;
  const codeLines = lines.filter((l) => /[;{}]$/.test(l) || l.startsWith('//') || /^<\/?[a-z]/i.test(l) || /;\s*\/\/.*$/.test(l));
  return codeLines.length / lines.length >= 0.5;
}

// Texto con párrafos separados por línea en blanco. Con `detectCode`, los
// párrafos que parecen código se muestran como bloque de código.
export function RichText({
  text,
  className,
  detectCode = false,
}: {
  text: string;
  className?: string;
  detectCode?: boolean;
}) {
  return (
    <div className={className ?? 'space-y-3'}>
      {text.split('\n\n').map((para, i) => (
        <TheoryBlock key={i} text={detectCode && looksLikeCode(para) ? '```\n' + para + '\n```' : para} />
      ))}
    </div>
  );
}
