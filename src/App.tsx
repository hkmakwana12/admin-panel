// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { useAuthStore } from './stores/auth-store';
import { authService } from './services/auth-service';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('admin_token');
    if (token && !isAuthenticated) {
      authService.getCurrentUser()
        .then(user => setUser(user))
        .catch(() => {
          localStorage.removeItem('admin_token');
        });
    }
  }, [setUser, isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<div>Users Page</div>} />
            <Route path="products" element={<div>Products Page</div>} />
            <Route path="orders" element={<div>Orders Page</div>} />
            <Route path="analytics" element={<div>Analytics Page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;