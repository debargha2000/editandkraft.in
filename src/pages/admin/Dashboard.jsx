import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { pageTransition, fadeUp } from '../../utils/animations';
import MagneticButton from '../../components/ui/MagneticButton';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const headerAnim = fadeUp(0.1, 0.8, 30);
  const contentAnim = fadeUp(0.2, 0.8, 30);

  return (
    <motion.main className="admin-dashboard-page" {...pageTransition} style={{ padding: '120px 20px', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <motion.div 
          className="dashboard-header"
          initial={headerAnim.initial}
          animate={headerAnim.animate}
          transition={headerAnim.transition}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}
        >
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Welcome back. Manage your portfolio and site settings here.</p>
          </div>
          
          <MagneticButton>
            <button 
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = 'black';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Sign Out
            </button>
          </MagneticButton>
        </motion.div>

        <motion.div 
          className="dashboard-content"
          initial={contentAnim.initial}
          animate={contentAnim.animate}
          transition={contentAnim.transition}
          style={{ 
            padding: '3rem', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '16px', 
            border: '1px dashed rgba(255,255,255,0.1)',
            textAlign: 'center',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" style={{ marginBottom: '1.5rem' }}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.6)' }}>Placeholder: CMS Editor Coming Soon</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>
            This is where you will add, edit, and delete your portfolio projects. The database connection is active.
          </p>
        </motion.div>

      </div>
    </motion.main>
  );
}
