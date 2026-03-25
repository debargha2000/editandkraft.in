import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { pageTransition, fadeUp, fadeIn, lineGrow, slideFromLeft, EASE_EXPO } from '../utils/animations';
import { ABOUT } from '../data/content';
import { RevealLines } from '../components/ui/RevealText';
import './About.css';

export default function About() {
  const storyRef = useRef(null);
  const philosRef = useRef(null);
  const timelineRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: '-100px' });
  const philosInView = useInView(philosRef, { once: true, margin: '-100px' });
  const timelineInView = useInView(timelineRef, { once: true, margin: '-100px' });

  const introAnim = fadeUp(0.5, 1, 40);
  const dividerAnim = lineGrow();
  const storyLabelAnim = fadeIn(0, 0.8);
  const timelineLabelAnim = fadeIn(0, 0.8);

  return (
    <motion.main className="about-page" {...pageTransition}>
      {/* Headline */}
      <section className="about-hero section">
        <div className="container">
          <h1 className="about-hero__headline">
            <RevealLines
              text={[ABOUT.headline]}
              className="about-hero__title"
              delay={0.2}
            />
          </h1>
          <motion.p
            className="about-hero__intro"
            initial={introAnim.initial}
            animate={introAnim.animate}
            transition={introAnim.transition}
          >
            {ABOUT.intro}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="about-story section" ref={storyRef}>
        <div className="container">
          <motion.span
            className="about-story__label"
            initial={storyLabelAnim.initial}
            animate={storyInView ? storyLabelAnim.animate : {}}
            transition={storyLabelAnim.transition}
          >
            Our Story
          </motion.span>
          <div className="about-story__content">
            {ABOUT.story.map((paragraph, i) => {
              const anim = fadeUp(0.2 + i * 0.15);
              return (
                <motion.p
                  key={i}
                  className="about-story__paragraph"
                  initial={anim.initial}
                  animate={storyInView ? anim.animate : {}}
                  transition={anim.transition}
                >
                  {paragraph}
                </motion.p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="about-philosophy section" ref={philosRef}>
        <div className="container">
          <motion.div
            className="about-philosophy__divider"
            initial={dividerAnim.initial}
            animate={philosInView ? dividerAnim.animate : {}}
            transition={dividerAnim.transition}
            style={{ transformOrigin: 'left' }}
          />
          <div className="about-philosophy__inner">
            {(() => {
              const titleAnim = fadeUp(0.2, 0.8, 30);
              const textAnim = fadeUp(0.35, 0.8, 30);
              return (
                <>
                  <motion.h3
                    className="about-philosophy__title"
                    initial={titleAnim.initial}
                    animate={philosInView ? titleAnim.animate : {}}
                    transition={titleAnim.transition}
                  >
                    {ABOUT.philosophy.title}
                  </motion.h3>
                  <motion.p
                    className="about-philosophy__text"
                    initial={textAnim.initial}
                    animate={philosInView ? textAnim.animate : {}}
                    transition={textAnim.transition}
                  >
                    {ABOUT.philosophy.text}
                  </motion.p>
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about-timeline section" ref={timelineRef}>
        <div className="container">
          <motion.span
            className="about-timeline__label"
            initial={timelineLabelAnim.initial}
            animate={timelineInView ? timelineLabelAnim.animate : {}}
            transition={timelineLabelAnim.transition}
          >
            Milestones
          </motion.span>
          <div className="about-timeline__list">
            {ABOUT.milestones.map((milestone, i) => {
              const anim = slideFromLeft(0.2 + i * 0.12);
              return (
                <motion.div
                  key={milestone.year}
                  className="about-timeline__item"
                  initial={anim.initial}
                  animate={timelineInView ? anim.animate : {}}
                  transition={anim.transition}
                >
                  <span className="about-timeline__year">{milestone.year}</span>
                  <div className="about-timeline__dot" />
                  <p className="about-timeline__event">{milestone.event}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
