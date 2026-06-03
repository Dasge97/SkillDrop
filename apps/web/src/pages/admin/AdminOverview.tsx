import { useQuery } from '@tanstack/react-query';
import type { AdminOverviewDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, Spinner } from '@/components/ui';

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => api.get<AdminOverviewDTO>('/admin/overview'),
  });

  if (isLoading || !data) {
    return <div className="flex h-48 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">👥 Usuarios</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Metric label="Total" value={data.users.total} />
          <Metric label="Alumnos" value={data.users.students} />
          <Metric label="Mentores" value={data.users.mentors} />
          <Metric label="Admins" value={data.users.admins} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">📨 Entregas</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Metric label="Total" value={data.submissions.total} />
          <Metric label="Pendientes" value={data.submissions.pending} />
          <Metric label="Aprobadas" value={data.submissions.approved} />
          <Metric label="Requieren mejora" value={data.submissions.needsWork} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">🧩 Contenido</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Metric label="Cursos" value={data.content.courses} />
          <Metric label="Fases" value={data.content.phases} />
          <Metric label="Lecciones" value={data.content.lessons} />
          <Metric label="Retos" value={data.content.challenges} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">🧑‍🏫 Evaluaciones</CardTitle></CardHeader>
        <CardContent>
          <Metric label="Evaluaciones realizadas" value={data.evaluations} />
        </CardContent>
      </Card>
    </div>
  );
}
