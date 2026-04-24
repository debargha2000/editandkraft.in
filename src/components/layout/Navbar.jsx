import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE, NAV_LINKS } from '../../data/content';
import { EASE_EXPO, EASE_IN_OUT } from '../../utils/animations';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(0);

  useEffect(() => {
    let rafId = null;
    let lastScrollTime = 0;
    const scrollThrottle = 16; // ~60fps

    const handleScroll = () => {
      const now = performance.now();
      
      if (now - lastScrollTime < scrollThrottle) {
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            const currentY = window.scrollY;
            setIsScrolled(currentY > 50);
            setIsHidden(currentY > lastScrollY.current && currentY > 200);
            lastScrollY.current = currentY;
            rafId = null;
          });
        }
      } else {
        const currentY = window.scrollY;
        setIsScrolled(currentY > 50);
        setIsHidden(currentY > lastScrollY.current && currentY > 200);
        lastScrollY.current = currentY;
        lastScrollTime = now;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => { document.body.classList.remove('menu-open'); };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'navbar--scrolled' : ''} ${isHidden ? 'navbar--hidden' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
      >
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo" aria-label="Edit & Kraft Home">
            <span className="navbar__logo-text" style={{ color: 'white' }}>{SITE.name}</span>
          </Link>

          <div className="navbar__links">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
              >
                <span className="navbar__link-text">{link.label}</span>
              </Link>
            ))}
          </div>

          <button
            className={`navbar__burger btn-magic ${menuOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="navbar__burger-line" />
            <span className="navbar__burger-line" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2rem) 2rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          >
            <nav className="mobile-menu__inner">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: EASE_EXPO }}
                >
                  <Link to={link.path} className="mobile-menu__link">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="mobile-menu__contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
