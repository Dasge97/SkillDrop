import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import { Icon } from '@/components/icons';
import { Button, Card, Field, Input, Spinner, Badge, cx } from '@/components/ui';

const DEMO_PASSWORD = 'skilldrop';
const DEMO_ACCOUNTS = [
  { name: 'Alumno Demo', email: 'student@skilldrop.dev', label: 'Alumno' },
  { name: 'Mentor Demo', email: 'mentor@skilldrop.dev', label: 'Mentor' },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  function useDemo(acc: { email: string }) {
    setEmail(acc.email);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-16 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">SkillDrop</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src="/mascot/login.png" alt="Mascota login" className="w-24 h-24 object-contain" />
          </div>

          <Card className="p-8 shadow-lg">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Bienvenido de vuelta</h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Entra para seguir demostrando tu dominio.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <Field label="Email">
                <Input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                />
              </Field>
              <Field label="Contraseña">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Field>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                {loading ? <Spinner className="w-5 h-5 !text-white" /> : 'Entrar'}
              </Button>
            </form>

            {/* Cuentas demo */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Icon name="info" className="w-3.5 h-3.5" />
                Cuentas demo · contraseña{' '}
                <code className="font-mono text-brand-600 dark:text-brand-400">{DEMO_PASSWORD}</code>
              </p>
              <div className="grid gap-2">
                {DEMO_ACCOUNTS.map((a) => (
                  <button
                    key={a.email}
                    type="button"
                    onClick={() => useDemo(a)}
                    className={cx(
                      'flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800',
                      'px-3 py-2 text-left hover:border-brand-300 hover:bg-brand-50/50',
                      'dark:hover:bg-brand-500/10 transition-colors',
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-sm font-semibold text-brand-700 dark:text-brand-300 shrink-0">
                      {a.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{a.name}</p>
                      <p className="text-xs text-slate-400 truncate">{a.email}</p>
                    </div>
                    <Badge tone="outline">{a.label}</Badge>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-brand-600 dark:text-brand-400 hover:underline">
                Crear cuenta
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
