import { motion } from 'framer-motion';
import { pageTransition } from '../utils/animations';
import Hero from '../components/sections/Hero';
import ServicesShowcase from '../components/sections/ServicesShowcase';
import PortfolioPreview from '../components/sections/PortfolioPreview';
import StatsStrip from '../components/sections/StatsStrip';
import ProcessSection from '../components/sections/ProcessSection';
import TestimonialsMarquee from '../components/sections/TestimonialsMarquee';

export default function Home() {
  return (
    <motion.main {...pageTransition}>
      <Hero />
      <PortfolioPreview />
      <ServicesShowcase />
      <ProcessSection />
      <StatsStrip />
      <TestimonialsMarquee />
    </motion.main>
  );
}
