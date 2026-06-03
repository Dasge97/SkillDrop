import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { SubmissionDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Avatar, Badge, Button, Card, EmptyState, PageLoader, SectionTitle, cx } from '@/components/ui';
import { PageHeader } from '@/components/Layout';

export function MentorQueue() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['mentor-queue'],
    queryFn: () => api.get<SubmissionDTO[]>('/mentor/queue'),
  });

  if (isLoading || !data) return <PageLoader />;

  return (
    <div>
      <PageHeader
        eyebrow="Mentor"
        title="Cola de revisión"
        subtitle="Entregas esperando tu evaluación. Da feedback claro y una nota por criterio."
      />

      {data.length === 0 ? (
        <Card className="p-4">
          <EmptyState
            mascot="success"
            title="¡Cola vacía! No hay nada por revisar."
          >
            Buen trabajo. Cuando lleguen nuevas entregas aparecerán aquí.
          </EmptyState>
        </Card>
      ) : (
        <div className="space-y-3">
          <SectionTitle
            icon="review"
            title={`${data.length} entrega${data.length !== 1 ? 's' : ''} pendiente${data.length !== 1 ? 's' : ''}`}
          />
          {data.map((s) => (
            <Card key={s.id} className="p-4 flex items-center gap-4">
              <img
                src="/mascot/submit.png"
                alt="Entrega"
                className="w-16 h-16 object-contain shrink-0 hidden sm:block select-none"
                draggable={false}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge tone="primary">Pendiente</Badge>
                  <Badge tone="outline">v{s.version}</Badge>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {s.challengeTitle ?? 'Reto sin título'}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <Avatar name={s.studentName ?? ''} size="xs" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {s.studentName ?? 'Alumno'}
                  </span>
                </div>
              </div>
              <Button
                icon="review"
                onClick={() => navigate(`/mentor/submission/${s.id}`)}
              >
                Evaluar
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
