import { useEffect, useRef } from 'react';

// ── CONFIG ──────────────────────────────────────────────────
const CONFIG = {
  blobCount: 6,
  blobRadiusMin: 0.35,
  blobRadiusMax: 0.60,
  speedMin: 50, // Slightly slower for more "premium" feel and less CPU jitter
  speedMax: 100,
  blurAmount: 80, // Reduced slightly to balance performance and aesthetics
  saturationBoost: true,
};

// ── COLOURS ─────────────────────────────────────────────────
const PALETTE = [
  { r: 255, g: 0, b: 128 },   // hot pink
  { r: 200, g: 50, b: 255 },   // magenta / purple
  { r: 80, g: 60, b: 255 },   // blue‑violet
  { r: 0, g: 180, b: 255 },   // cyan
];

// ── HELPERS ─────────────────────────────────────────────────
function rand(min, max) { return Math.random() * (max - min) + min; }

// ── BLOB CLASS ──────────────────────────────────────────────
class Blob {
  constructor(w, h, color) {
    this.x = rand(0, w);
    this.y = rand(0, h);
    this.vx = rand(-1, 1);
    this.vy = rand(-1, 1);
    const mag = Math.hypot(this.vx, this.vy) || 1;
    const speed = rand(CONFIG.speedMin, CONFIG.speedMax);
    this.vx = (this.vx / mag) * speed;
    this.vy = (this.vy / mag) * speed;
    this.r = rand(CONFIG.blobRadiusMin, CONFIG.blobRadiusMax) * Math.min(w, h);
    this.color = color;
    this.baseR = this.r;
    this.rPhase = rand(0, Math.PI * 2);
    this.rSpeed = rand(0.1, 0.3); // Slower pulsing
    this.rAmp = this.baseR * 0.12;
  }

  update(dt, w, h) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const pad = this.r * 0.4;
    if (this.x < -pad) { this.x = -pad; this.vx *= -1; }
    if (this.x > w + pad) { this.x = w + pad; this.vx *= -1; }
    if (this.y < -pad) { this.y = -pad; this.vy *= -1; }
    if (this.y > h + pad) { this.y = h + pad; this.vy *= -1; }

    this.rPhase += this.rSpeed * dt;
    this.r = this.baseR + Math.sin(this.rPhase) * this.rAmp;
  }

  draw(ctx) {
    const { r, g, b } = this.color;
    // Caching gradient can be tricky because it depends on x,y. 
    // But we can optimize the fillRect size.
    const grad = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.r
    );
    grad.addColorStop(0, `rgba(${r},${g},${b}, 0.8)`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b}, 0.3)`);
    grad.addColorStop(1, `rgba(${r},${g},${b}, 0)`);

    ctx.fillStyle = grad;
    ctx.fillRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
  }
}

export default function LiquidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // PERFORMANCE: Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      canvas.style.display = 'none'; // Or draw a static frame
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for non-transparent canvas
    let animationFrameId;
    let W, H;
    let blobs = [];
    let isVisible = true;

    const resize = () => {
      // PERFORMANCE: Cap DPR at 1.2 for blurred backgrounds (huge fill-rate win)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;

      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      canvas.style.filter = `blur(${CONFIG.blurAmount}px) saturate(1.4) contrast(1.1)`;
      canvas.style.transform = 'scale(1.1)';
      canvas.style.transformOrigin = 'center center';
      canvas.style.willChange = 'transform'; // Hardware acceleration hint

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (const b of blobs) {
        b.baseR = rand(CONFIG.blobRadiusMin, CONFIG.blobRadiusMax) * Math.min(W, H);
        b.rAmp = b.baseR * 0.12;
      }
    };

    const initBlobs = () => {
      blobs = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < CONFIG.blobCount; i++) {
        blobs.push(new Blob(w, h, PALETTE[i % PALETTE.length]));
      }
    };

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };

    initBlobs();
    resize();

    let last = performance.now();
    const frame = (ts) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(frame);
        return;
      }

      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'screen';
      for (const blob of blobs) {
        blob.update(dt, W, H);
        blob.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(frame);
    };

    animationFrameId = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
      }}
      aria-hidden="true"
    />
  );
}

