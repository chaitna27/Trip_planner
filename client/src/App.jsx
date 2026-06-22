import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// ── Pages ──────────────────────────────────────────────────────────────────────
import LandingPage  from './pages/LandingPage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// ── Phase 2 placeholder pages (stubs so routes don't 404) ─────────────────────
// These will be replaced in Phase 2 with full implementations.
const DashboardPage  = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-gray-400 text-lg font-medium">
      Dashboard — Coming in Phase 2
    </p>
  </div>
);
const MyTripsPage    = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-gray-400 text-lg font-medium">
      My Trips — Coming in Phase 2
    </p>
  </div>
);
const TripResultPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-gray-400 text-lg font-medium">
      Trip Result — Coming in Phase 2
    </p>
  </div>
);
const TripDetailPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-gray-400 text-lg font-medium">
      Trip Detail — Coming in Phase 2
    </p>
  </div>
);

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
        {/* ── Public routes wrapped in MainLayout (Navbar + Footer) ────────── */}
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
          <Route
            path="/trip/:id"
            element={
              <ProtectedRoute>
                <TripResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute>
                <TripDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ── Fallback ─────────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
