import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';
import { pageTransition, fadeUp } from '../../utils/animations';
import MagneticButton from '../../components/ui/MagneticButton';
import './Login.css';

const ALLOWED_EMAILS = ["debarghapakhira@gmail.com", "deys87714@gmail.com"];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkAndRedirect = async (user) => {
    if (!ALLOWED_EMAILS.includes(user.email)) {
      await auth.signOut();
      navigate('/'); // Redirect to home page
      return false;
    }
    return true;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (await checkAndRedirect(userCredential.user)) {
        navigate('/admin/dashboard');
      }
    } catch {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const userCredential = await signInWithPopup(auth, provider);
      if (await checkAndRedirect(userCredential.user)) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const formAnim = fadeUp(0.1, 0.8, 30);

  return (
    <motion.div className="admin-login-page" {...pageTransition}>
      <div className="login-container glass">
        <motion.div
          initial={formAnim.initial}
          animate={formAnim.animate}
          transition={formAnim.transition}
          className="login-content"
        >
          <div className="login-header">
            <h2>Admin Portal</h2>
            <p>Welcome back. Please sign in to manage your portfolio.</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button 
            type="button" 
            className="google-btn" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Sign in with Google
          </button>

          <div className="login-divider">
            <span>or sign in with email</span>
          </div>

          <form onSubmit={handleEmailLogin} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="hello@editandkraft.in"
              />
            </div>
            
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            <MagneticButton>
              <button 
                type="submit" 
                className="login-submit"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </MagneticButton>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
