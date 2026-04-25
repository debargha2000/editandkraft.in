import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';
import { projectService } from '../services/projectService';
import SectionHeader from '../components/ui/SectionHeader';
import { Project } from '../data/content';
import './Work.css';

const CATEGORIES = ['All', 'Social Media', 'Motion Graphics', 'YouTube', 'Short-Form'];

export default function Work() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-50px' });
  
  const { pageTransition, fadeUp, scaleUp } = useAnimations();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data as Project[]);
      } catch (error) {
        console.error("Failed to load projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const filterBarAnim = fadeUp(0, 0.6, 20);

  return (
    <motion.main className="work-page" {...pageTransition}>
      <section className="work-hero section">
        <div className="container">
          <SectionHeader
            title="Our Work"
            subtitle="Selected Case Studies"
            level="h1"
          />
        </div>
      </section>

      <section className="work-content" ref={ref}>
        <div className="container">
          {error && (
            <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '2rem' }}>
              {error}
            </div>
          )}
          {/* Filter Bar */}
          <motion.div
            className="work-filters"
            initial={filterBarAnim.initial}
            animate={isInView ? filterBarAnim.animate : {}}
            transition={filterBarAnim.transition}
          >
            {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`work-filter button ${activeCategory === cat ? 'work-filter--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div className="work-grid" layout>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>
                Loading portfolio projects...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>
                No projects found for this category.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => {
                  const cardAnim = scaleUp();
                  return (
                    <motion.div
                      key={project.id || index}
                      className="work-card glass glass-shine"
                      layout
                      initial={cardAnim.initial}
                      animate={cardAnim.animate}
                      exit={cardAnim.exit}
                      transition={cardAnim.transition}
                      onClick={() => {
                        if (project.projectUrl) {
                          window.open(project.projectUrl, '_blank', 'noopener noreferrer');
                        }
                      }}
                      data-cursor={project.projectUrl ? "pointer" : "default"}
                    >
                      <div
                        className="work-card__image"
                        style={{ backgroundColor: project.color || '#1a1a1a' }}
                      >
                        {project.imageUrl ? (
                          <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            width="600"
                            height="400"
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '3/2' }} 
                          />
                        ) : (
                          <div className="work-card__image-inner">
                            <span className="work-card__number">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                          </div>
                        )}
                        <div className="work-card__overlay">
                          <p className="work-card__description">{project.description}</p>
                        </div>
                      </div>
                      <div className="work-card__info">
                        <div className="work-card__meta">
                          <span className="work-card__category">{project.category}</span>
                          <span className="work-card__dot">·</span>
                          <span className="work-card__year">{project.year}</span>
                        </div>
                        <h3 className="work-card__title">{project.title}</h3>
                        <p className="work-card__client">{project.client}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
