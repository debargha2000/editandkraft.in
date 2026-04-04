import { motion } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';
import Hero from '../components/sections/Hero';
import ServicesShowcase from '../components/sections/ServicesShowcase';
import PortfolioPreview from '../components/sections/PortfolioPreview';
import StatsStrip from '../components/sections/StatsStrip';
import ProcessSection from '../components/sections/ProcessSection';
import TestimonialsMarquee from '../components/sections/TestimonialsMarquee';

export default function Home() {
  const { pageTransition } = useAnimations();
  
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
