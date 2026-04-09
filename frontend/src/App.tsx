import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
// Using placeholders for pages before creating them
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import UploadCenter from './pages/UploadCenter';
import ExpertDirectory from './pages/ExpertDirectory';
import DocumentDetail from './pages/DocumentDetail';
import Profile from './pages/Profile';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // Quick token re-hydration on reload (not full verification for simplicity)
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // if we stored user json
    if (storedToken && storedUser) {
      setAuth(JSON.parse(storedUser), storedToken);
    }
  }, [setAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="library/:id" element={<DocumentDetail />} />
            <Route path="upload" element={<UploadCenter />} />
            <Route path="experts" element={<ExpertDirectory />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
