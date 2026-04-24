import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TESTIMONIALS } from '../../data/content';
import { fadeUp, fadeIn } from '../../utils/animations';
import './TestimonialsMarquee.css';

export default function TestimonialsMarquee() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  // Duplicate testimonials for seamless loop
  const duplicated = [...TESTIMONIALS, ...TESTIMONIALS];
  const labelAnim = fadeUp(0, 0.8, 30);
  const marqueeAnim = fadeIn(0.3, 1);

  return (
    <section className="testimonials section" ref={ref}>
      <motion.div
        className="container"
        style={{ marginBottom: 'var(--space-lg)' }}
        initial={labelAnim.initial}
        animate={isInView ? labelAnim.animate : {}}
        transition={labelAnim.transition}
      >
        <span className="testimonials__label">What Clients Say</span>
      </motion.div>

      <div className="testimonials__marquee-wrapper">
        <motion.div
          className="testimonials__marquee"
          initial={marqueeAnim.initial}
          animate={isInView ? marqueeAnim.animate : {}}
          transition={marqueeAnim.transition}
        >
          <div className="testimonials__track">
            {duplicated.map((testimonial, i) => (
              <div key={i} className="testimonials__card glass">
                <blockquote className="testimonials__quote">
                  "{testimonial.quote}"
                </blockquote>
                <div className="testimonials__author">
                  <span className="testimonials__author-name">
                    {testimonial.author}
                  </span>
                  <span className="testimonials__author-role">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
