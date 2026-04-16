import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import UploadCenter from './pages/UploadCenter';
import ExpertDirectory from './pages/ExpertDirectory';
import ExpertProfile from './pages/ExpertProfile';
import DocumentDetail from './pages/DocumentDetail';
import Profile from './pages/Profile';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
//   const { setAuth } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
  const unsub = useAuthStore.persist.onFinishHydration(() => {
    setHydrated(true);
  });

  // if already hydrated
  if (useAuthStore.persist.hasHydrated()) {
    setHydrated(true);
  }

  return () => unsub();
}, []);

  if (!hydrated) return null; // or show a loader

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="library/:id" element={<DocumentDetail />} />
            <Route path="upload" element={<UploadCenter />} />
            <Route path="experts" element={<ExpertDirectory />} />
            <Route path="experts/:id" element={<ExpertProfile />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;