import { useRef } from 'react';
import { SERVICES } from '../../data/content';
import SectionHeader from '../ui/SectionHeader';
import ServicesMarquee from './ServicesMarquee';
import './ServicesShowcase.css';

export default function ServicesShowcase() {
  const ref = useRef(null);

  return (
    <section className="services section" ref={ref}>
      <div className="container">
        <SectionHeader
          title={SERVICES.sectionTitle}
          subtitle={SERVICES.sectionSubtitle}
        />
      </div>
      <ServicesMarquee />
    </section>
  );
}
