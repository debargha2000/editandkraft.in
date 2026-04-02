import { lazy, Suspense, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import RootLayout from './components/layout/RootLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Preloader from './components/ui/Preloader';

const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

import './styles/index.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  const [isSiteLoaded, setIsSiteLoaded] = useState(false);

  // Lock scroll while loading
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isSiteLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isSiteLoaded]);

  return (
    <>
      <Preloader onComplete={() => setIsSiteLoaded(true)} />
      
      {/* We keep the router mounted, but we can delay pointer events or just let the preloader overlap it */}
      <Router>
        <RootLayout>
          <AnimatedRoutes />
        </RootLayout>
      </Router>
    </>
  );
}
