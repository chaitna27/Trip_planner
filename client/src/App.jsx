import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// ── Pages ──────────────────────────────────────────────────────────────────────
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import DashboardPage  from './pages/DashboardPage';
import MyTripsPage    from './pages/MyTripsPage';
import TripDetailPage from './pages/TripDetailPage';

// Redirect /trip/:id → /trips/:id preserving the dynamic segment
const TripRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/trips/${id}`} replace />;
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f8fafc',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 10px 40px -4px rgba(0,0,0,0.25)',
          },
          success: {
            iconTheme: { primary: '#06B6D4', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* ── All routes wrapped in MainLayout (Navbar + Footer) ────────── */}
        <Route element={<MainLayout />}>
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected routes ─────────────────────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-trips"
            element={
              <ProtectedRoute>
                <MyTripsPage />
              </ProtectedRoute>
            }
          />
          {/* Primary trip detail route */}
          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute>
                <TripDetailPage />
              </ProtectedRoute>
            }
          />
          {/* Legacy /trip/:id alias → redirect to canonical /trips/:id */}
          <Route
            path="/trip/:id"
            element={<TripRedirect />}
          />
        </Route>

        {/* ── Fallback ─────────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
