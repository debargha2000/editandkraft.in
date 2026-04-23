import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

export default function Preloader({ onComplete = () => {} }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    let start = 0;
    const duration = 2000; // 2 seconds to reach 100%
    const intervalTime = 20;
    const increment = (100 / (duration / intervalTime));

    const interval = setInterval(() => {
      start += increment;
      if (start >= 100) {
        setProgress(100);
        clearInterval(interval);
        
        // Wait a short moment at 100% before triggering exit
        setTimeout(() => {
          setIsFinished(true);
          // And notify parent components shortly after exit animation starts
          setTimeout(onComplete, 800);
        }, 400); 
      } else {
        setProgress(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div 
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-10vh' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader-content">
            <motion.div 
              className="progress-text font-display"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {progress}%
            </motion.div>
            <div className="progress-bar-container">
              <motion.div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
