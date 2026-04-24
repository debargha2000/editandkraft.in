import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';
import { useSiteStore } from '../stores/siteStore';
import SectionHeader from '../components/ui/SectionHeader';
import PlanCard from "../components/ui/PlanCard.jsx";
import './Services.css';

export default function Services() {
  const showcaseRef = useRef(null);
  const plansRef = useRef(null);
  const isShowcaseInView = useInView(showcaseRef, { once: false, margin: '-50px' });
  const isPlansInView = useInView(plansRef, { once: false, margin: '-50px' });
  
  const { pageTransition, fadeUp } = useAnimations();
  const { services: SERVICES, plans: PLANS } = useSiteStore();

  return (
    <motion.main className="services-page" {...pageTransition}>
      <section className="services-hero section">
        <div className="container">
          <SectionHeader
            title="Our Services"
            subtitle="A full spectrum of premium creative services designed to make your brand unforgettable."
            level="h1"
          />
        </div>
      </section>

      {/* Services Showcase */}
      <section className="services-showcase section" ref={showcaseRef}>
        <div className="container">
          <div className="services-grid">
            {SERVICES.items.map((service, index) => {
              const serviceAnim = fadeUp(index * 0.1, 0.8, 30);
              return (
                <motion.div
                  key={service.id}
                  className="service-card"
                  initial={serviceAnim.initial}
                  animate={isShowcaseInView ? serviceAnim.animate : {}}
                  transition={serviceAnim.transition}
                >
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__description">{service.description}</p>
                  <a 
                    href="/contact" 
                    className="service-card__cta"
                  >
                    Get {service.title} Service
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="services-plans" ref={plansRef}>
        <div className="container">
          <SectionHeader
            title="Service Plans"
            subtitle="Transparent pricing for elite digital marketing services, crafted to scale your brand."
            level="h2"
          />
          <div className="plans-grid">
            {PLANS.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} isInView={isPlansInView} />
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
