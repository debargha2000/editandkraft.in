import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HERO } from '../../data/content';
import { fadeUp, fadeIn } from '../../utils/animations';
import { RevealLines } from '../ui/RevealText';
import MagneticButton from '../ui/MagneticButton';
import './Hero.css';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero__content container" style={{ opacity, y }}>
        <motion.div
          className="hero__label"
          {...fadeUp(0.2, 0.8, 20)}
        >
          <span className="hero__label-text">Digital Creative Agency</span>
        </motion.div>

        <h1 className="hero__headline">
          <RevealLines
            text={HERO.headline}
            className="hero__headline-lines"
            delay={0.4}
            stagger={0.12}
          />
        </h1>

        <motion.p
          className="hero__subtext"
          {...fadeUp(0.9, 1, 40)}
        >
          {HERO.subtext}
        </motion.p>

        <motion.div
          className="hero__cta"
          {...fadeUp(1.2, 0.8, 30)}
        >
          <MagneticButton>
            <Link to={HERO.cta.path} className="hero__cta-btn button button--primary" aria-label={`View our work - ${HERO.cta.label}`}>
              <span>{HERO.cta.label}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="hero__scroll"
        {...fadeIn(1.8, 1)}
        style={{ opacity }}
      >
        <span className="hero__scroll-text">{HERO.scrollIndicator}</span>
        <motion.div
          className="hero__scroll-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </section>
  );
}
