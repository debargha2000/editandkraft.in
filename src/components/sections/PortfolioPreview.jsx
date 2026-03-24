import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PORTFOLIO } from '../../data/content';
import { fadeUp } from '../../utils/animations';
import SectionHeader from '../SectionHeader';
import MagneticButton from '../MagneticButton';
import './PortfolioPreview.css';

export default function PortfolioPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const ctaAnim = fadeUp(0.6, 0.8, 30);

  return (
    <section className="portfolio-preview section" ref={ref}>
      <div className="container">
        <SectionHeader
          title={PORTFOLIO.sectionTitle}
          subtitle={PORTFOLIO.sectionSubtitle}
        />

        <div className="portfolio-preview__grid">
          {PORTFOLIO.projects.slice(0, 6).map((project, i) => (
            <PortfolioCard
              key={project.id}
              project={project}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.div
          className="portfolio-preview__cta"
          initial={ctaAnim.initial}
          animate={isInView ? ctaAnim.animate : {}}
          transition={ctaAnim.transition}
        >
          <MagneticButton>
            <Link to="/work" className="portfolio-preview__cta-btn" aria-label="View all portfolio projects">
              View All Work
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

function PortfolioCard({ project, index, isInView }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const isLarge = index % 3 === 0;
  const anim = fadeUp(index * 0.12);

  return (
    <motion.div
      ref={cardRef}
      className={`portfolio-card glass ${isLarge ? 'portfolio-card--large' : ''}`}
      initial={anim.initial}
      animate={isInView ? anim.animate : {}}
      transition={anim.transition}
      data-cursor="pointer"
    >
      <div className="portfolio-card__image-wrapper">
        <motion.div
          className="portfolio-card__image"
          style={{
            y: imageY,
            backgroundColor: project.color,
          }}
        >
          <div className="portfolio-card__image-placeholder">
            <span className="portfolio-card__image-number">{project.id.toString().padStart(2, '0')}</span>
          </div>
        </motion.div>
        <div className="portfolio-card__overlay">
          <span className="portfolio-card__overlay-text">View Project</span>
        </div>
      </div>
      <div className="portfolio-card__info">
        <div className="portfolio-card__meta">
          <span className="portfolio-card__category">{project.category}</span>
          <span className="portfolio-card__year">{project.year}</span>
        </div>
        <h3 className="portfolio-card__title">{project.title}</h3>
      </div>
    </motion.div>
  );
}
