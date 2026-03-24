// ============================================================
// REUSABLE ANIMATION PRESETS — Framer Motion
// ============================================================
// Centralized animation config. Every component should import
// from here instead of hardcoding easing / transition values.
// ============================================================

// ---- Shared easing curves (mirrors CSS vars) ----
export const EASE_EXPO = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

// ---- Transition helpers ----
export const expoTransition = (duration = 1, delay = 0) => ({
  duration,
  delay,
  ease: EASE_EXPO,
});

// ---- Common variants ----

// Fade up from below (most-used across the site)
export const fadeUp = (delay = 0, duration = 0.8, y = 60) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: expoTransition(duration, delay),
});

// Fade in (opacity only)
export const fadeIn = (delay = 0, duration = 0.8) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration, delay },
});

// Scale up reveal
export const scaleUp = (delay = 0, duration = 0.5) => ({
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: expoTransition(duration, delay),
});

// Slide from left
export const slideFromLeft = (delay = 0, duration = 0.7, x = -40) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  transition: expoTransition(duration, delay),
});

// Horizontal line grow (dividers)
export const lineGrow = (delay = 0, duration = 1.2) => ({
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: expoTransition(duration, delay),
});



// Page transition (used by every page wrapper)
export const pageTransition = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_EXPO },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.5, ease: EASE_IN_OUT },
  },
};
