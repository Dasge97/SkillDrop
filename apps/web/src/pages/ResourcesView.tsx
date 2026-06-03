import { useQuery } from '@tanstack/react-query';
import type { ResourceDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Mascot } from '@/components/Mascot';
import { Badge, Card, CardContent, CardHeader, CardTitle, Spinner } from '@/components/ui';

const TYPE_ICON: Record<string, string> = {
  link: '🔗', video: '🎬', template: '🧩', library: '📚', article: '📄',
};

export function ResourcesView() {
  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => api.get<ResourceDTO[]>('/resources'),
  });

  if (isLoading || !resources) {
    return <div className="flex h-64 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  const categories = [...new Set(resources.map((r) => r.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot variant="idea" className="h-16 w-16" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Biblioteca de recursos</h1>
          <p className="text-sm text-muted-foreground">Material curado para acompañar tu aprendizaje.</p>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {resources.filter((r) => r.category === cat).map((r) => (
              <a key={r.id} href={r.url} target="_blank" rel="noreferrer">
                <Card className="h-full cursor-pointer transition-all hover:border-primary hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span>{TYPE_ICON[r.type] ?? '🔗'}</span>
                      {r.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                    {r.phaseCode && <Badge tone="muted" className="mt-2">{r.phaseCode}</Badge>}
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
