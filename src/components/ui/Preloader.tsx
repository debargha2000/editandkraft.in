import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; 
    const intervalTime = 16;
    const increment = (100 / (duration / intervalTime));

    const interval = setInterval(() => {
      start += increment;
      if (start >= 100) {
        setProgress(100);
        clearInterval(interval);
        
        // Wait a bit at 100% before completing
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500); 
      } else {
        setProgress(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      <div className="preloader-content">
        <motion.div 
          className="progress-text-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="progress-text font-display">
            {progress}%
          </span>
        </motion.div>
        
        <div className="progress-bar-container">
          <motion.div 
            className="progress-bar-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
        
        <motion.div 
          className="preloader-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-uppercase tracking-widest text-[10px]">Edit & Kraft — Digital Creative</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
