import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PROCESS } from '../../data/content';
import { slideFromLeft } from '../../utils/animations';
import SectionHeader from '../ui/SectionHeader';
import './ProcessSection.css';

export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="process section" ref={ref}>
      <div className="container">
        <SectionHeader
          title={PROCESS.sectionTitle}
          subtitle={PROCESS.sectionSubtitle}
        />

        <div className="process__timeline">
          {PROCESS.steps.map((step, i) => {
            const anim = slideFromLeft(i * 0.15);
            return (
              <motion.div
                key={step.number}
                className="process__step glass"
                initial={anim.initial}
                animate={isInView ? anim.animate : {}}
                transition={anim.transition}
              >
                <div className="process__step-indicator">
                  <span className="process__step-number">{step.number}</span>
                  <div className="process__step-line" />
                </div>
                <div className="process__step-content">
                  <h3 className="process__step-title">{step.title}</h3>
                  <p className="process__step-description">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
