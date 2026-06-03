// SubmitView.jsx
function SubmitView() {
  const nav = useNav();
  const c = CHALLENGE;
  const [figma, setFigma] = React.useState('');
  const [shots, setShots] = React.useState(['']);
  const [notas, setNotas] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const setShot = (i, v) => setShots((s) => s.map((x, idx) => (idx === i ? v : x)));
  const addShot = () => setShots((s) => [...s, '']);
  const removeShot = (i) => setShots((s) => s.filter((_, idx) => idx !== i));
  const submit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); nav.go('submission', { id: 's-v3', pending: true }); }, 800);
  };

  return (
    <div>
      <PageHeader back={{ to: 'challenge', label: 'Volver al reto', params: { id: c.id } }}
        eyebrow={`Entrega · FASE ${c.phase}`} title="Entrega tu trabajo" subtitle={c.title} />

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <Card className="p-6">
          {/* alerta motivacional */}
          <div className="rounded-lg border-l-4 border-brand-400 bg-brand-50/60 dark:bg-brand-500/10 p-4 mb-6 flex gap-3">
            <Icon name="sparkles" className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">Primero termina, luego perfecciona.</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Entrega aunque no esté perfecto. El mentor te dirá exactamente qué pulir para llegar al dominio.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <Field label="Enlace de Figma" hint="Asegúrate de que el archivo tenga permiso de visualización.">
              <div className="relative">
                <Icon name="link" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input type="url" className="pl-9" placeholder="https://figma.com/file/…" value={figma} onChange={(e) => setFigma(e.target.value)} />
              </div>
            </Field>

            <div>
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Capturas (URLs)</span>
              <div className="space-y-2">
                {shots.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="relative flex-1">
                      <Icon name="image" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input type="url" className="pl-9" placeholder={`Captura ${i + 1} — https://…`} value={s} onChange={(e) => setShot(i, e.target.value)} />
                    </div>
                    <Button type="button" variant="ghost" size="md" className="!px-3" onClick={() => removeShot(i)} disabled={shots.length === 1}><Icon name="x" className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addShot} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"><Icon name="plus" className="w-4 h-4" />Añadir captura</button>
            </div>

            <Field label="Notas para el mentor" hint="Opcional: cuenta tus decisiones o dónde tienes dudas.">
              <Textarea rows={4} placeholder="Ej: dudé entre dos espaciados internos…" value={notas} onChange={(e) => setNotas(e.target.value)} />
            </Field>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => nav.go('challenge', { id: c.id })}>Cancelar</Button>
              <Button type="submit" icon="upload" disabled={sending}>{sending ? <Spinner className="w-5 h-5 !text-white" /> : 'Enviar a revisión'}</Button>
            </div>
          </form>
        </Card>

        {/* aside */}
        <div className="space-y-5 lg:sticky lg:top-8">
          <Card className="p-5 flex flex-col items-center text-center">
            <Mascot variant="entrega" label="entrega (portátil)" className="w-full aspect-[4/3] mb-4" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Tu entrega entra en la cola del mentor. Recibirás una rúbrica del 1 al 10 por criterio.</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Recuerda el umbral</p>
            <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><Icon name="info" className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" /><p className="leading-relaxed">{c.umbral}</p></div>
          </Card>
        </div>
      </div>
    </div>
  );
}

window.SubmitView = SubmitView;
