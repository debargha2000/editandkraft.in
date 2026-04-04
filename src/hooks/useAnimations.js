import { useMemo } from 'react';
import { 
  fadeUp, 
  fadeIn, 
  scaleUp, 
  slideFromLeft, 
  lineGrow, 
  pageTransition,
  EASE_EXPO,
  EASE_IN_OUT,
  expoTransition
} from '../utils/animations';

/**
 * useAnimations - Centralized animation hook for consistent animations across the site
 * 
 * @returns {object} Object containing all animation functions
 */
export function useAnimations() {
  return useMemo(() => ({
    // Animation presets
    fadeUp,
    fadeIn,
    scaleUp,
    slideFromLeft,
    lineGrow,
    pageTransition,
    
    // Easing functions
    EASE_EXPO,
    EASE_IN_OUT,
    
    // Transition helpers
    expoTransition,
  }), []);
}
