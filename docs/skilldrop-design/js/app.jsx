// app.jsx — contexts (Theme, Auth, Nav), router and bootstrap
const { useState, useEffect, useCallback, createContext, useContext } = React;

/* --------------------------------- Theme ---------------------------------- */
const ThemeContext = createContext(null);
const useTheme = () => useContext(ThemeContext);
function applyTheme(theme) {
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = theme === 'dark' || (theme === 'system' && sysDark);
  document.documentElement.classList.toggle('dark', dark);
}
function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('skilldrop-theme') || 'system');
  useEffect(() => { applyTheme(theme); localStorage.setItem('skilldrop-theme', theme); }, [theme]);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const h = () => { if ((localStorage.getItem('skilldrop-theme') || 'system') === 'system') applyTheme('system'); };
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>{children}</ThemeContext.Provider>;
}

/* ---------------------------------- Auth ----------------------------------- */
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skilldrop-auth')) || null; } catch (e) { return null; }
  });
  const persist = (a) => { setAuth(a); if (a) localStorage.setItem('skilldrop-auth', JSON.stringify(a)); else localStorage.removeItem('skilldrop-auth'); };
  const login = useCallback((email, name) => {
    const acc = DEMO_ACCOUNTS.find((a) => a.email === email);
    persist({ user: { name: name || (acc ? acc.name : 'Lucía Fernández'), email: email || 'student@skilldrop.dev' }, role: acc ? acc.role : 'STUDENT' });
  }, []);
  const logout = useCallback(() => persist(null), []);
  const setRole = useCallback((role) => setAuth((a) => { const n = { ...(a || { user: DEMO_ACCOUNTS[0] }), role }; localStorage.setItem('skilldrop-auth', JSON.stringify(n)); return n; }), []);
  const value = {
    isAuthed: !!auth,
    user: auth ? auth.user : { name: 'Invitado', email: '' },
    role: auth ? auth.role : 'STUDENT',
    login, logout, setRole,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ---------------------------------- Nav ------------------------------------ */
const NavContext = createContext(null);
const useNav = () => useContext(NavContext);
const PUBLIC_ROUTES = ['landing', 'login', 'register'];
const SCREENS = {
  landing: 'Landing', login: 'Login', register: 'Register',
  dashboard: 'Dashboard', roadmap: 'Roadmap', phase: 'PhaseView', lesson: 'LessonView',
  challenge: 'ChallengeView', submit: 'SubmitView', submission: 'SubmissionView',
  progress: 'ProgressView', resources: 'ResourcesView',
  'mentor-queue': 'MentorQueue', 'mentor-review': 'MentorReview', admin: 'Admin',
};

function App() {
  const { isAuthed } = useAuth();
  const [route, setRoute] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skilldrop-route')) || { name: 'landing', params: {} }; }
    catch (e) { return { name: 'landing', params: {} }; }
  });
  const go = useCallback((name, params = {}) => {
    const r = { name, params };
    setRoute(r);
    localStorage.setItem('skilldrop-route', JSON.stringify(r));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // guard: app routes require auth
  let name = route.name;
  if (!isAuthed && !PUBLIC_ROUTES.includes(name)) name = 'login';
  if (isAuthed && name === 'landing') { /* allow viewing landing while authed */ }

  const compName = SCREENS[name] || 'Landing';
  const Screen = window[compName] || window.Landing;
  const nav = { route: { name, params: route.params || {} }, go };
  const isPublic = PUBLIC_ROUTES.includes(name);

  return (
    <NavContext.Provider value={nav}>
      {isPublic ? <Screen /> : <AppLayout><Screen /></AppLayout>}
    </NavContext.Provider>
  );
}

Object.assign(window, { useTheme, useAuth, useNav, ThemeContext, AuthContext, NavContext });

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
