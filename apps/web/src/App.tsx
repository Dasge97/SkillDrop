import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { AppLayout } from './components/Layout';
import { Spinner } from './components/ui';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Roadmap } from './pages/Roadmap';
import { PhaseView } from './pages/PhaseView';
import { LessonView } from './pages/LessonView';
import { ChallengeView } from './pages/ChallengeView';
import { SubmitView } from './pages/SubmitView';
import { SubmissionView } from './pages/SubmissionView';
import { ProgressView } from './pages/ProgressView';
import { ResourcesView } from './pages/ResourcesView';
import { MentorQueue } from './pages/MentorQueue';
import { MentorReview } from './pages/MentorReview';
import { Admin } from './pages/admin/Admin';
import { NotFound } from './pages/NotFound';

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );
}

function Protected({
  children,
  mentor,
  admin,
}: {
  children: React.ReactNode;
  mentor?: boolean;
  admin?: boolean;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (mentor && user.role !== 'MENTOR' && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  if (admin && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return <AppLayout>{children}</AppLayout>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/roadmap" element={<Protected><Roadmap /></Protected>} />
      <Route path="/phase/:id" element={<Protected><PhaseView /></Protected>} />
      <Route path="/lesson/:id" element={<Protected><LessonView /></Protected>} />
      <Route path="/challenge/:id" element={<Protected><ChallengeView /></Protected>} />
      <Route path="/challenge/:id/submit" element={<Protected><SubmitView /></Protected>} />
      <Route path="/submission/:id" element={<Protected><SubmissionView /></Protected>} />
      <Route path="/progress" element={<Protected><ProgressView /></Protected>} />
      <Route path="/resources" element={<Protected><ResourcesView /></Protected>} />

      <Route path="/mentor" element={<Protected mentor><MentorQueue /></Protected>} />
      <Route path="/mentor/submission/:id" element={<Protected mentor><MentorReview /></Protected>} />

      <Route path="/admin" element={<Protected admin><Admin /></Protected>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
