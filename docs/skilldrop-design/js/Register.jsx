// Register.jsx
function Register() {
  const nav = useNav();
  const { login } = useAuth();
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { login(form.email || 'student@skilldrop.dev', form.name || 'Lucía Fernández'); setLoading(false); nav.go('dashboard'); }, 600);
  };

  return (
    <AuthScaffold mascot="idea" mascotLabel="idea (bombilla)" title="Crea tu cuenta" subtitle="Empieza el bootcamp y gana tu primera habilidad hoy.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nombre">
          <Input type="text" placeholder="Tu nombre" value={form.name} onChange={set('name')} autoComplete="name" />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="tucorreo@ejemplo.com" value={form.email} onChange={set('email')} autoComplete="email" />
        </Field>
        <Field label="Contraseña" hint="Mínimo 8 caracteres.">
          <Input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} autoComplete="new-password" />
        </Field>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Spinner className="w-5 h-5 !text-white" /> : 'Crear cuenta'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        ¿Ya tienes cuenta?{' '}
        <button onClick={() => nav.go('login')} className="font-medium text-brand-600 dark:text-brand-400 hover:underline">Entrar</button>
      </p>
    </AuthScaffold>
  );
}

window.Register = Register;
