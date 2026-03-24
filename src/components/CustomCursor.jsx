import { useEffect, useRef, useCallback } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

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
    // Hide on touch devices
    if (isTouch) return;

    const handleMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
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

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // Ring follows with lag
    let raf;
    const animateRing = () => {
      const dx = pos.current.x - ringPos.current.x;
      const dy = pos.current.y - ringPos.current.y;
      ringPos.current.x += dx * 0.12;
      ringPos.current.y += dy * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf = requestAnimationFrame(animateRing);
    };
    raf = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(raf);
    };
  }, [isTouch, updateHoverClass, updateVisibility]);

  // Don't render on touch devices at all
  if (isTouch) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
