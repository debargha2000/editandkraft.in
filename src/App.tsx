import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ui/ErrorBoundary';
import RootLayout from './components/layout/RootLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Pages — eagerly loaded (public-facing, SEO-critical)
import Home from './pages/Home';
import Work from './pages/Work';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages — lazy-loaded (not SEO-indexed, rarely accessed)
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));

// Global Styles
import './styles/index.css';

// Minimal fallback for lazy-loaded admin routes
function AdminFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      color: 'rgba(255,255,255,0.5)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.9rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }}>
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <RootLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Admin Routes — code-split */}
              <Route path="/admin/login" element={
                <Suspense fallback={<AdminFallback />}>
                  <Login />
                </Suspense>
              } />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<AdminFallback />}>
                      <Dashboard />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </RootLayout>
        </Router>
      </HelmetProvider>
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  );
}
