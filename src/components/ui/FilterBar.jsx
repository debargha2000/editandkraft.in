import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';
import './FilterBar.css';

export default function FilterBar({ categories, activeCategory, onSelectCategory }) {
  const filterBarAnim = fadeIn(0, 0.6);
  
  return (
    <motion.div 
      className="filter-bar"
      initial={filterBarAnim.initial}
      animate={filterBarAnim.animate}
      transition={filterBarAnim.transition}
    >
      <ul className="filter-bar__list">
        {categories.map((category) => (
          <li key={category} className="filter-bar__item">
            <button
              className={`filter-bar__button ${
                activeCategory === category ? 'filter-bar__button--active' : ''
              }`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
