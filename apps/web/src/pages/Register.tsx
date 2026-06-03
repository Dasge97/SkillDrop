import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '@skilldrop/shared';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import { Button, Card, Field, Input, Spinner } from '@/components/ui';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Datos no válidos');
      return;
    }
    setLoading(true);
    try {
      await register(parsed.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
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
            <img src="/mascot/hero.png" alt="Mascota registro" className="w-24 h-24 object-contain" />
          </div>

          <Card className="p-8 shadow-lg">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Crea tu cuenta</h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Empieza el bootcamp y gana tu primera habilidad hoy.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <Field label="Nombre">
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  autoFocus
                  required
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="Contraseña" hint="Mínimo 8 caracteres.">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </Field>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                {loading ? <Spinner className="w-5 h-5 !text-white" /> : 'Crear cuenta'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-brand-600 dark:text-brand-400 hover:underline">
                Entrar
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
