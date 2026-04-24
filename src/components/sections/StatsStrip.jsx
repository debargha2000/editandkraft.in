import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { STATS } from '../../data/content';
import { fadeUp } from '../../utils/animations';
import './StatsStrip.css';

export default function StatsStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <section className="stats section" ref={ref}>
      <div className="container">
        <div className="stats__grid glass">
          {STATS.map((stat, i) => {
            const anim = fadeUp(0.2 + i * 0.1, 0.8, 40);
            return (
              <motion.div
                key={stat.label}
                className="stats__item"
                initial={anim.initial}
                animate={isInView ? anim.animate : {}}
                transition={anim.transition}
              >
                <div className="stats__value">
                  <AnimatedCounter
                    value={stat.value}
                    isInView={isInView}
                    duration={2000}
                  />
                  <span className="stats__suffix">{stat.suffix}</span>
                </div>
                <span className="stats__label">{stat.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({ value, isInView, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * value);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span className="stats__number">{count}</span>;
}
