import { SERVICES } from '../../data/content';
import SectionHeader from '../ui/SectionHeader';
import ServicesMarquee from './ServicesMarquee';
import './ServicesShowcase.css';

export default function ServicesShowcase() {
  return (
    <section className="services section">
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
