import { Link } from 'react-router-dom';
import { Mascot } from '@/components/Mascot';
import { Button } from '@/components/ui';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <Mascot variant="idea" className="h-28 w-28" />
      <h1 className="text-3xl font-extrabold">404</h1>
      <p className="text-muted-foreground">Esta página no existe (todavía).</p>
      <Link to="/"><Button>Volver al inicio</Button></Link>
    </div>
  );
}
