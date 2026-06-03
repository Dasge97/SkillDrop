import { Link } from 'react-router-dom';
import { Mascot } from '@/components/Mascot';
import { Button, Card, CardContent } from '@/components/ui';
import { useTheme } from '@/lib/theme';

const PHASES = [
  'Mentalidad', 'Control visual', 'Figma esencial', 'UI real', 'UX práctico',
  'Responsive', 'Componentes', 'Design systems', 'Prototipado', 'Producto avanzado',
  'Handoff', 'IA & workflows', 'Portfolio',
];

const FEATURES = [
  { icon: '🎯', title: 'Retos realistas', text: 'Briefs como encargos profesionales, con restricciones y entregables claros.' },
  { icon: '🧑‍🏫', title: 'Evaluación tipo mentor', text: 'Rúbrica 1–10 por criterio, feedback exigente y mejoras concretas.' },
  { icon: '🔒', title: 'Avance por dominio', text: 'No avanzas hasta demostrar que dominas la fase. Sin atajos.' },
  { icon: '📈', title: 'Progreso visible', text: 'Habilidades, XP, rachas y comparación de versiones de tus entregas.' },
];

export function Landing() {
  const { resolved, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-5">
        <div className="flex items-center gap-2">
          <Mascot variant="login" className="h-9 w-9" />
          <span className="text-xl font-extrabold tracking-tight">SkillDrop</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggle} aria-label="Cambiar tema">
            {resolved === 'dark' ? '🌙' : '☀️'}
          </Button>
          <Link to="/login"><Button variant="ghost" size="sm">Entrar</Button></Link>
          <Link to="/register"><Button size="sm">Empezar gratis</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-2 md:py-20">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            🚀 Plataforma de cursos basados en la maestría
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Aprende diseño de producto como en un{' '}
            <span className="text-primary">entorno profesional real</span>.
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            No estás aprendiendo a decorar pantallas. Estás aprendiendo a construir productos
            digitales claros, usables y escalables. Empieza por el bootcamp completo de Figma.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/register"><Button size="lg">Crear mi cuenta</Button></Link>
            <Link to="/login"><Button size="lg" variant="outline">Ya tengo cuenta</Button></Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            "No avances por completar lecciones. Avanza porque puedes demostrar dominio."
          </p>
        </div>
        <div className="flex justify-center">
          <Mascot variant="hero" className="w-72 animate-fade-in md:w-96" />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardContent className="pt-5">
                <div className="text-2xl">{f.icon}</div>
                <h3 className="mt-2 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Roadmap preview */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex items-center gap-3">
          <Mascot variant="guide" className="h-14 w-14" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">13 fases, de cero a profesional</h2>
            <p className="text-sm text-muted-foreground">El primer curso del catálogo: Figma Product Design Bootcamp.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {PHASES.map((p, i) => (
            <span
              key={p}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm"
            >
              <span className="mr-1.5 font-semibold text-primary">{i}</span>
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Mascot variant="success" className="h-24 w-24" />
            <h2 className="text-2xl font-bold">¿Listo para demostrar tu dominio?</h2>
            <p className="max-w-md text-muted-foreground">
              Crea tu cuenta, monta tu primer archivo profesional en Figma y empieza a entrenar.
            </p>
            <Link to="/register"><Button size="lg">Empezar ahora</Button></Link>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        SkillDrop · Aprende haciendo · Demuestra tu dominio
      </footer>
    </div>
  );
}
