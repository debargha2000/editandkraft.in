import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { pageTransition, fadeUp } from '../utils/animations';
import { SITE, CONTACT } from '../data/content';
import { RevealLines } from '../components/ui/RevealText';
import MagneticButton from '../components/ui/MagneticButton';
import './Contact.css';

export default function Contact() {
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const formInView = useInView(formRef, { once: false, margin: '-50px' });
  const infoInView = useInView(infoRef, { once: false, margin: '-50px' });
  
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Honeypot check
    const honeypot = e.target.website_url.value;
    if (honeypot) {
      console.warn('Bot detected via honeypot.');
      return;
    }

    // In production, connect to a form backend
    setSubmitted(true);
  };

  const subtextAnim = fadeUp(0.5, 0.8, 30);
  const formAnim = fadeUp(0, 0.8, 40);
  const infoAnim = fadeUp(0.2, 0.8, 40);

  return (
    <motion.main className="contact-page" {...pageTransition}>
      <section className="contact-hero section">
        <div className="container">
          <h1 className="contact-hero__title-wrapper">
            <RevealLines
              text={[CONTACT.headline]}
              className="contact-hero__title"
              delay={0.2}
            />
          </h1>
          <motion.p
            className="contact-hero__subtext"
            initial={subtextAnim.initial}
            animate={subtextAnim.animate}
            transition={subtextAnim.transition}
          >
            {CONTACT.subtext}
          </motion.p>
        </div>
      </section>

      <section className="contact-content section">
        <div className="container">
          <div className="contact-grid">
            {/* Form */}
            <motion.div
              ref={formRef}
              className="contact-form-wrapper glass"
              initial={formAnim.initial}
              animate={formInView ? formAnim.animate : {}}
              transition={formAnim.transition}
            >
              {submitted ? (
                <div className="contact-success">
                  <h3 className="contact-success__title">Thank You</h3>
                  <p className="contact-success__text">
                    We've received your message. Our team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  {/* Honeypot field to prevent bot spam */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
                  </div>

                  {CONTACT.formFields.map((field, i) => {
                    const fieldAnim = fadeUp(0.1 + i * 0.08, 0.5, 20);
                    return (
                      <motion.div
                        key={field.name}
                        className="contact-field"
                        initial={fieldAnim.initial}
                        animate={formInView ? fieldAnim.animate : {}}
                        transition={fieldAnim.transition}
                      >
                        <label className="contact-field__label" htmlFor={field.name}>
                          {field.label}
                          {field.required && <span className="contact-field__required">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            className="contact-field__input contact-field__textarea"
                            required={field.required}
                            onChange={handleChange}
                            rows="5"
                          />
                        ) : field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            className="contact-field__input contact-field__select"
                            required={field.required}
                            onChange={handleChange}
                            defaultValue=""
                          >
                            <option value="" disabled>Select an option</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            className="contact-field__input"
                            required={field.required}
                            onChange={handleChange}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                  <MagneticButton>
                    <button type="submit" className="contact-submit" aria-label="Send your message">
                      Send Message
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </button>
                  </MagneticButton>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              ref={infoRef}
              className="contact-info"
              initial={infoAnim.initial}
              animate={infoInView ? infoAnim.animate : {}}
              transition={infoAnim.transition}
            >
              <div className="contact-info__block glass">
                <span className="contact-info__label">Email</span>
                <a href={`mailto:${SITE.email}`} className="contact-info__value">
                  {SITE.email}
                </a>
              </div>
              <div className="contact-info__block glass">
                <span className="contact-info__label">Phone</span>
                <a href={`tel:${SITE.phone}`} className="contact-info__value">
                  {SITE.phone}
                </a>
              </div>
              <div className="contact-info__block glass">
                <span className="contact-info__label">Location</span>
                <span className="contact-info__value">{SITE.location}</span>
              </div>
              <div className="contact-info__block glass">
                <span className="contact-info__label">Website</span>
                <a
                  href={SITE.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info__value"
                >
                  {SITE.website.replace('https://', '')}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
