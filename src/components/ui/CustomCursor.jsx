import { useEffect, useRef, useCallback } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  const rafId = useRef(null);
  const isMoving = useRef(false);

  // Use refs for hover/hidden state to avoid re-renders on every mouseover
  const isHoveringRef = useRef(false);
  const isHiddenRef = useRef(isTouch);

  const updateHoverClass = useCallback((hovering) => {
    isHoveringRef.current = hovering;
    if (dotRef.current) {
      dotRef.current.classList.toggle('cursor-dot--hover', hovering);
    }
    if (ringRef.current) {
      ringRef.current.classList.toggle('cursor-ring--hover', hovering);
    }
  }, []);

  const updateVisibility = useCallback((hidden) => {
    isHiddenRef.current = hidden;
    const display = hidden ? 'none' : '';
    if (dotRef.current) dotRef.current.style.display = display;
    if (ringRef.current) ringRef.current.style.display = display;
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const animateRing = () => {
      const dx = pos.current.x - ringPos.current.x;
      const dy = pos.current.y - ringPos.current.y;

      // PERFORMANCE: If distance is tiny, stop animating to save CPU
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        ringPos.current.x = pos.current.x;
        ringPos.current.y = pos.current.y;
        isMoving.current = false;
        return;
      }

      ringPos.current.x += dx * 0.15;
      ringPos.current.y += dy * 0.15;

      if (ringRef.current) {
        // PERFORMANCE: translate3d triggers hardware acceleration
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animateRing);
    };

    const handleMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Start animation if not already running
      if (!isMoving.current) {
        isMoving.current = true;
        rafId.current = requestAnimationFrame(animateRing);
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset.cursor === 'pointer'
      ) {
        updateHoverClass(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset.cursor === 'pointer'
      ) {
        updateHoverClass(false);
      }
    };

    const handleMouseLeave = () => updateVisibility(true);
    const handleMouseEnter = () => updateVisibility(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTouch, updateHoverClass, updateVisibility]);

  if (isTouch) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className="cursor-dot" 
        style={{ willChange: 'transform' }}
      />
      <div 
        ref={ringRef} 
        className="cursor-ring" 
        style={{ willChange: 'transform' }}
      />
    </>
  );
}

