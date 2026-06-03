// Login.jsx
function Login() {
  const nav = useNav();
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { login(email || 'student@skilldrop.dev'); setLoading(false); nav.go('dashboard'); }, 500);
  };
  const useDemo = (acc) => { setEmail(acc.email); setPassword(DEMO_PASSWORD); };

  return (
    <AuthScaffold mascot="login" mascotLabel="login (guiño)" title="Bienvenido de vuelta" subtitle="Entra para seguir demostrando tu dominio.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <Input type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </Field>
        <Field label="Contraseña">
          <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </Field>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Spinner className="w-5 h-5 !text-white" /> : 'Entrar'}
        </Button>
      </form>

      <DemoAccounts onPick={useDemo} />

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        ¿No tienes cuenta?{' '}
        <button onClick={() => nav.go('register')} className="font-medium text-brand-600 dark:text-brand-400 hover:underline">Crear cuenta</button>
      </p>
    </AuthScaffold>
  );
}

/* ---------- shared auth pieces (used by Login + Register) ---------- */
function AuthScaffold({ mascot, mascotLabel, title, subtitle, children }) {
  const nav = useNav();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-16 flex items-center justify-between max-w-6xl mx-auto w-full">
        <button onClick={() => nav.go('landing')}><Logo /></button>
        <ThemeToggle />
      </header>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Mascot variant={mascot} label={mascotLabel} className="w-28 h-28" />
          </div>
          <Card className="p-8 shadow-soft-lg">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}

function DemoAccounts({ onPick }) {
  return (
    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
        <Icon name="info" className="w-3.5 h-3.5" /> Cuentas demo · contraseña <code className="font-mono text-brand-600 dark:text-brand-400">{DEMO_PASSWORD}</code>
      </p>
      <div className="grid gap-2">
        {DEMO_ACCOUNTS.map((a) => (
          <button key={a.email} type="button" onClick={() => onPick(a)}
            className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-left hover:border-brand-300 hover:bg-brand-50/50 dark:hover:bg-brand-500/10 transition-colors">
            <Avatar name={a.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{a.name}</p>
              <p className="text-xs text-slate-400 truncate">{a.email}</p>
            </div>
            <Badge tone="outline">{a.label}</Badge>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Login, AuthScaffold, DemoAccounts });
