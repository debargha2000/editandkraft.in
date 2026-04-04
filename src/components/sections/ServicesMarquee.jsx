import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SERVICES } from '../../data/content';
import { fadeIn } from '../../utils/animations';
import './ServicesMarquee.css';

const ServiceCard = ({ service }) => {
  return (
    <div className="services-marquee__card">
      <div className="services-marquee__content">
        <h3 className="services-marquee__card-title">{service.title}</h3>
        <p className="services-marquee__card-desc">{service.description}</p>
      </div>
    </div>
  );
};

export default function ServicesMarquee() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  // Duplicate for seamless loop
  const duplicated = [...SERVICES.items, ...SERVICES.items];

  const marqueeAnim = fadeIn(0.3, 1);

  return (
    <div className="services-marquee__wrapper" ref={ref}>
      <motion.div
        className="services-marquee__container"
        initial={marqueeAnim.initial}
        animate={isInView ? marqueeAnim.animate : {}}
        transition={marqueeAnim.transition}
      >
        <div className="services-marquee__track">
          {duplicated.map((service, i) => (
            <ServiceCard key={`${service.id}-${i}`} service={service} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
