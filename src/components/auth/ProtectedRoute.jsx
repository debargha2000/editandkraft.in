import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { ALLOWED_EMAILS } from '../../utils/authConfig';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--color-bg)',
        color: 'var(--color-text)'
      }}>
        <div style={{ opacity: 0.7, fontSize: '1.2rem', letterSpacing: '0.1em' }}>
          VERIFYING IDENTITY...
        </div>
      </div>
    );
  }

  if (!user || !ALLOWED_EMAILS.includes(user.email)) {
    // Redirect them to the /admin/login page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
