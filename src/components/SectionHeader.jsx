import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { expoTransition } from '../utils/animations';
import './SectionHeader.css';

export default function SectionHeader({ title, subtitle, align = 'left', level = 'h2' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Use a dynamic motion component
  const MotionTag = motion[level] || motion.h2;

  return (
    <div ref={ref} className={`section-header section-header--${align}`}>
      <div style={{ overflow: 'hidden' }}>
        <MotionTag
          className="section-header__title"
          initial={{ y: '100%' }}
          animate={isInView ? { y: '0%' } : {}}
          transition={expoTransition(0.9)}
        >
          {title}
        </MotionTag>
      </div>
      {subtitle && (
        <motion.p
          className="section-header__subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={expoTransition(0.8, 0.2)}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
