import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { fadeUp } from '../../utils/animations';
import SectionHeader from '../ui/SectionHeader';
import MagneticButton from '../ui/MagneticButton';
import './PortfolioPreview.css';

export default function PortfolioPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const allProjects = await projectService.getProjects();
        // Filter those marked as favorite and sort them by their assigned slot (1 to 6)
        const favorites = allProjects
          .filter(p => p.isFavorite)
          .sort((a, b) => (Number(a.showcaseSlot) || 0) - (Number(b.showcaseSlot) || 0))
          .slice(0, 6); // Max 6 showcase slots
        
        setFavoriteProjects(favorites);
      } catch (error) {
        console.error("Failed to fetch favorite projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const ctaAnim = fadeUp(0.6, 0.8, 30);

  return (
    <section className="portfolio-preview section" ref={ref}>
      <div className="container">
        <SectionHeader
          title="Selected Work"
          subtitle="Featured Showcases"
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            Loading selected work...
          </div>
        ) : favoriteProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            No showcase items added yet. Mark projects as "Favorite" in the CMS.
          </div>
        ) : (
          <div className="portfolio-preview__grid">
            {favoriteProjects.map((project, i) => (
              <PortfolioCard
                key={project.id}
                project={project}
                index={i}
                isInView={isInView}
              />
            ))}
          </div>
        )}

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

  // Make every 3rd card large, just like the original design
  const isLarge = index % 3 === 0;
  const anim = fadeUp(index * 0.12);

  const handleClick = () => {
    if (project.projectUrl) {
      window.open(project.projectUrl, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`portfolio-card glass ${isLarge ? 'portfolio-card--large' : ''}`}
      initial={anim.initial}
      animate={isInView ? anim.animate : {}}
      transition={anim.transition}
      onClick={handleClick}
      data-cursor={project.projectUrl ? "pointer" : "default"}
    >
      <div className="portfolio-card__image-wrapper">
        <motion.div
          className="portfolio-card__image"
          style={{
            y: imageY,
            backgroundColor: project.color || '#1a1a1a',
          }}
        >
          {project.imageUrl && (
            <img 
              src={project.imageUrl} 
              alt={project.showcaseLabel || project.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          {!project.imageUrl && (
            <div className="portfolio-card__image-placeholder">
              <span className="portfolio-card__image-number">0{index + 1}</span>
            </div>
          )}
        </motion.div>
        <div className="portfolio-card__overlay">
          <span className="portfolio-card__overlay-text">
            {/* Display the custom showcase label, falling back to main description or "View Project" */}
            {project.showcaseLabel || project.description || "View Project"}
          </span>
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
