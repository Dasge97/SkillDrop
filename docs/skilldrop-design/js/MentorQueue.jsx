// MentorQueue.jsx
function MentorQueue() {
  const nav = useNav();
  const [queue, setQueue] = React.useState(MENTOR_QUEUE);

  return (
    <div>
      <PageHeader eyebrow="Mentor" title="Cola de revisión"
        subtitle="Entregas esperando tu evaluación. Da feedback claro y una nota por criterio."
        actions={queue.length > 0
          ? <Button variant="outline" size="sm" onClick={() => setQueue([])}>Simular cola vacía</Button>
          : <Button variant="outline" size="sm" onClick={() => setQueue(MENTOR_QUEUE)}>Restaurar cola</Button>} />

      {queue.length === 0 ? (
        <Card className="p-4">
          <EmptyState mascot="celebración" title="¡Cola vacía! No hay nada por revisar."
            action={<Button variant="outline" onClick={() => setQueue(MENTOR_QUEUE)}>Restaurar cola (demo)</Button>}>
            Buen trabajo. Cuando lleguen nuevas entregas aparecerán aquí.
          </EmptyState>
        </Card>
      ) : (
        <div className="space-y-3">
          {queue.map((q) => (
            <Card key={q.id} className="p-4 flex items-center gap-4">
              <Mascot variant="entrega" label="entrega" className="w-16 h-16 shrink-0 hidden sm:flex" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge tone="primary">{q.fase}</Badge>
                  <Badge tone="outline">v{q.version}</Badge>
                  <span className="text-xs text-slate-400">{q.fecha}</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{q.reto}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <Avatar name={q.alumno} size="xs" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">{q.alumno}</span>
                </div>
              </div>
              <Button icon="review" onClick={() => nav.go('mentor-review', { id: q.id })}>Evaluar</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

window.MentorQueue = MentorQueue;
