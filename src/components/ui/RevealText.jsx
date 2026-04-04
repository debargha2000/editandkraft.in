import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASE_EXPO } from '../../utils/animations';

// Split text into lines and reveal each
export function RevealLines({ text, className = '', delay = 0, stagger = 0.08 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-80px' });
  const lines = Array.isArray(text) ? text : [text];

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: 'hidden' }}>
          <motion.div
            initial={{ y: '110%' }}
            animate={isInView ? { y: '0%' } : {}}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: EASE_EXPO,
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
