import { motion } from 'framer-motion';
import './PortfolioSkeleton.css';

export default function PortfolioSkeleton() {
  return (
    <div className="portfolio-preview__grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={`skeleton-card ${i % 3 === 0 ? 'skeleton-card--large' : ''}`}>
          <div className="skeleton-card__image" />
          <div className="skeleton-card__info">
            <div className="skeleton-card__meta" />
            <div className="skeleton-card__title" />
          </div>
        </div>
      ))}
    </div>
  );
}
