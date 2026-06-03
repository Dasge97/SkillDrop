import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { SubmissionDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Mascot } from '@/components/Mascot';
import { Badge, Button, Card, CardContent, EmptyState, Spinner } from '@/components/ui';

export function MentorQueue() {
  const { data, isLoading } = useQuery({
    queryKey: ['mentor-queue'],
    queryFn: () => api.get<SubmissionDTO[]>('/mentor/queue'),
  });

  if (isLoading || !data) {
    return <div className="flex h-64 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot variant="guide" className="h-16 w-16" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Cola de revisión</h1>
          <p className="text-sm text-muted-foreground">Entregas pendientes de evaluar.</p>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          mascot="success"
          title="¡Cola vacía!"
          description="No hay entregas pendientes de revisión. Buen trabajo, mentor."
        />
      ) : (
        <div className="grid gap-3">
          {data.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center gap-4 pt-5">
                <Mascot variant="submit" className="h-12 w-12" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{s.challengeTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {s.studentName} · versión {s.version}
                  </p>
                </div>
                <Badge tone="warning">Pendiente</Badge>
                <Link to={`/mentor/submission/${s.id}`}>
                  <Button size="sm">Evaluar</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
