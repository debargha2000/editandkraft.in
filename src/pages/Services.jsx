import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { pageTransition } from '../utils/animations';
import { PLANS } from '../data/content';
import SectionHeader from '../components/ui/SectionHeader';
import PlanCard from "../components/ui/PlanCard.jsx";
import './Services.css';

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.main className="services-page" {...pageTransition}>
      <section className="services-hero section">
        <div className="container">
          <SectionHeader
            title="Our Plans"
            subtitle="Transparent pricing for elite digital marketing services, crafted to scale your brand."
            level="h1"
          />
        </div>
      </section>

      <section className="services-plans" ref={ref}>
        <div className="container">
          <div className="plans-grid">
            {PLANS.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} isInView={isInView} />
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
