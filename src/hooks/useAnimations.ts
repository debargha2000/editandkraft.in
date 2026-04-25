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

export function useAnimations() {
  return useMemo(() => ({
    fadeUp,
    fadeIn,
    scaleUp,
    slideFromLeft,
    lineGrow,
    pageTransition,
    EASE_EXPO,
    EASE_IN_OUT,
    expoTransition,
  }), []);
}
