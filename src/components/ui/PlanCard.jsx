import { useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton.jsx';
import { scaleUp } from '../../utils/animations';

/**
 * @param {{ plan: any, index: number, isInView: boolean, [key: string]: any }} props
 */
export default function PlanCard({ plan, index, isInView }) {
  const [selectedOption, setSelectedOption] = useState(plan.purchaseOptions ? plan.purchaseOptions[0] : null);
  const cardAnim = scaleUp(index * 0.15, 0.7);

  return (
    <motion.div
      key={plan.id}
      className={`plan-card glass ${plan.popular ? 'plan-card--popular' : ''}`}
      initial={cardAnim.initial}
      animate={isInView ? cardAnim.animate : {}}
      transition={cardAnim.transition}
    >
      {plan.popular && (
        <div className="plan-badge">Most Popular</div>
      )}
      <div className="plan-header">
        <h2 className="plan-name">{plan.name}</h2>
        <p className="plan-description">{plan.description}</p>

        {plan.purchaseOptions ? (
          <div className="plan-options">
            <div className="option-buttons">
              {plan.purchaseOptions.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-button ${selectedOption.type === option.type ? 'option-button--active' : ''}`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option.type === 'one-time' ? 'One-Time' : 'Subscription'}
                </button>
              ))}
            </div>
            <div className="plan-pricing">
              <span className="plan-price">{selectedOption.price}</span>
              <span className="plan-period">{selectedOption.period}</span>
            </div>
          </div>
        ) : (
          <div className="plan-pricing">
            <span className="plan-price">{plan.price}</span>
            <span className="plan-period">{plan.period}</span>
          </div>
        )}
      </div>

      <div className="plan-body">
        <ul className="plan-features">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="plan-feature-item">
              <svg className="plan-check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="plan-footer">
        <MagneticButton>
          <a
            href={selectedOption ? selectedOption.ctaLink : plan.ctaLink}
            target={selectedOption ? (selectedOption.isExternal ? "_blank" : "_self") : (plan.isExternal ? "_blank" : "_self")}
            rel={selectedOption ? (selectedOption.isExternal ? "noopener noreferrer" : "") : (plan.isExternal ? "noopener noreferrer" : "")}
            className={`plan-cta ${plan.popular ? 'plan-cta--primary' : 'plan-cta--secondary'}`}
          >
            {selectedOption ? selectedOption.ctaText : plan.ctaText}
          </a>
        </MagneticButton>
      </div>
    </motion.div>
  );
}
