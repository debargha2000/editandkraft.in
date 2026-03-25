import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { pageTransition, fadeUp, scaleUp } from '../utils/animations';
import { PORTFOLIO } from '../data/content';
import SectionHeader from '../components/ui/SectionHeader';
import './Work.css';

export default function Work() {
  const [activeCategory, setActiveCategory] = useState('All');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const filteredProjects =
    activeCategory === 'All'
      ? PORTFOLIO.projects
      : PORTFOLIO.projects.filter((p) => p.category === activeCategory);

  const filterBarAnim = fadeUp(0, 0.6, 20);

  return (
    <motion.main className="work-page" {...pageTransition}>
      <section className="work-hero section">
        <div className="container">
          <SectionHeader
            title={PORTFOLIO.sectionTitle}
            subtitle={PORTFOLIO.sectionSubtitle}
            level="h1"
          />
        </div>
      </section>

      <section className="work-content" ref={ref}>
        <div className="container">
          {/* Filter Bar */}
          <motion.div
            className="work-filters"
            initial={filterBarAnim.initial}
            animate={isInView ? filterBarAnim.animate : {}}
            transition={filterBarAnim.transition}
          >
            {PORTFOLIO.categories.map((cat) => (
              <button
                key={cat}
                className={`work-filter ${activeCategory === cat ? 'work-filter--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div className="work-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const cardAnim = scaleUp();
                return (
                  <motion.div
                    key={project.id}
                    className="work-card"
                    layout
                    initial={cardAnim.initial}
                    animate={cardAnim.animate}
                    exit={cardAnim.exit}
                    transition={cardAnim.transition}
                    data-cursor="pointer"
                  >
                    <div
                      className="work-card__image"
                      style={{ backgroundColor: project.color }}
                    >
                      <div className="work-card__image-inner">
                        <span className="work-card__number">
                          {project.id.toString().padStart(2, '0')}
                        </span>
                      </div>
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
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
