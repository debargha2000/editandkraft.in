import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SITE, FOOTER } from '../../data/content';
import { fadeUp, lineGrow } from '../../utils/animations';
import MagneticButton from '../ui/MagneticButton';
import './Footer.css';

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const headingAnim = fadeUp(0, 1, 60);
  const btnAnim = fadeUp(0.2, 0.8, 30);
  const dividerAnim = lineGrow(0.3);

  return (
    <footer className="footer" ref={ref}>
      <div className="container">
        {/* CTA Section */}
        <div className="footer__cta">
          <motion.h2
            className="footer__cta-text"
            initial={headingAnim.initial}
            animate={isInView ? headingAnim.animate : {}}
            transition={headingAnim.transition}
          >
            {FOOTER.cta}
          </motion.h2>
          <motion.div
            initial={btnAnim.initial}
            animate={isInView ? btnAnim.animate : {}}
            transition={btnAnim.transition}
          >
            <MagneticButton>
              <Link to={FOOTER.ctaButton.path} className="footer__cta-btn">
                {FOOTER.ctaButton.label}
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="footer__divider"
          initial={dividerAnim.initial}
          animate={isInView ? dividerAnim.animate : {}}
          transition={dividerAnim.transition}
          style={{ transformOrigin: 'left' }}
        />

        {/* Bottom */}
        <div className="footer__bottom">
          <div className="footer__info">
            <Link to="/" className="footer__logo">{SITE.name}</Link>
            <p className="footer__tagline">{SITE.tagline}</p>
          </div>
          <div className="footer__email">
            <span className="footer__email-label">Get in touch</span>
            <a href={`mailto:${SITE.email}`} className="footer__email-link">
              {SITE.email}
            </a>
          </div>
          <div className="footer__socials">
            {FOOTER.socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__copyright">
          <p>{SITE.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
