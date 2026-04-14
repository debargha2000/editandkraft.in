import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MagneticButton from './MagneticButton.jsx';

describe('MagneticButton', () => {
  it('should render children correctly', () => {
    render(<MagneticButton>Click me</MagneticButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply magnetic effect on mouse move', () => {
    const { container } = render(<MagneticButton strength={0.5}>Test</MagneticButton>);
    const button = container.querySelector('.magnetic-button');

    // Simulate mouse move event
    fireEvent.mouseMove(button, {
      clientX: 100,
      clientY: 100
    });

    // Check if transform style is applied
    expect(button.style.transform).toMatch(/translate\(-?\d+\.?\d*px, -?\d+\.?\d*px\)/);
  });

  it('should reset position on mouse leave', () => {
    const { container } = render(<MagneticButton>Test</MagneticButton>);
    const button = container.querySelector('.magnetic-button');

    // First move mouse
    fireEvent.mouseMove(button, {
      clientX: 100,
      clientY: 100
    });

    // Then leave
    fireEvent.mouseLeave(button);

    // Should reset to translate(0px, 0px)
    expect(button.style.transform).toBe('translate(0px, 0px)');
  });

  it('should accept custom strength prop', () => {
    const { container } = render(<MagneticButton strength={1.0}>Test</MagneticButton>);
    const button = container.querySelector('.magnetic-button');

    // Mock getBoundingClientRect
    button.getBoundingClientRect = () => ({
      left: 50,
      top: 50,
      width: 100,
      height: 50
    });

    fireEvent.mouseMove(button, {
      clientX: 100, // centerX = 50 + 100/2 = 100, so deltaX = (100 - 100) * 1.0 = 0
      clientY: 75   // centerY = 50 + 50/2 = 75, so deltaY = (75 - 75) * 1.0 = 0
    });

    expect(button.style.transform).toBe('translate(0px, 0px)');
  });
});