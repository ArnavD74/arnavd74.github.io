import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  xvel: number;
  yvel: number;
  t: number;
  colorIndex: number;
  fadeInDelay: number;
  currentFade: number;
}

// Blue spectrum colors (weighted toward darker shades)
const PARTICLE_COLORS = [
  { r: 10, g: 22, b: 40 }, // navy
  { r: 15, g: 40, b: 71 }, // marine
  { r: 30, g: 73, b: 118 }, // azure
  { r: 37, g: 99, b: 235 }, // cobalt
  { r: 56, g: 189, b: 248 }, // sky
  { r: 0, g: 212, b: 255 }, // cyan
  { r: 125, g: 211, b: 252 }, // ice-blue
  { r: 186, g: 230, b: 253 }, // pale blue
  { r: 255, g: 255, b: 255 }, // white (accent)
];

// Draw weights, darkest-first, so the field stays recessive. Index into
// PARTICLE_COLORS; the repeats are what bias the random pick.
const COLOR_WEIGHTS = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6, 7, 8];

const CONFIG = {
  connectionDistance: 120,
  maxSize: 5,
  minSize: 1.5,
  minTransparency: 0.2,
  maxTransparency: 0.6,
  fadeOut: 50,
  maxSpeed: 1.8,
  repelFactor: 8000000,
  maxAccel: 4,
  pullFactor: 15000,
  pullLength: 12,
  /** Reference viewport the density below was tuned against. */
  referenceArea: 1903 * 969,
  referenceDots: 110,
  /**
   * Hard cap on particle count. Both the collision pass and the link pass are
   * O(n²), so on a 4K display the uncapped density (~500 dots) cost roughly 20x
   * the pair work of a 1080p one and dropped frames badly.
   */
  maxDots: 190,
  /** Retina sharpness is worth 4x the fill cost; 3x (phones) is not. */
  maxPixelRatio: 2,
  fps: 30,
} as const;

/** Rendered size of a glow sprite, in px, before it is scaled down per particle. */
const SPRITE_SIZE = 96;
/** Sprite geometry: the glow spans 3r, so the solid core occupies a sixth of it. */
const SPRITE_CORE_RATIO = 1 / 6;

// Module scope: the dots should fade in once per page load, not again every time
// the hero scrolls back into view and remounts the canvas.
let initialFadeComplete = false;

/**
 * Pre-renders one glow+core sprite per colour.
 *
 * Replaces a per-particle, per-frame `createRadialGradient` + two `arc` fills —
 * with ~190 particles at 30fps that was ~5,700 gradient objects a second. The
 * sprite bakes the 0.3 glow alpha in, so multiplying by `globalAlpha` at draw
 * time reproduces the original output exactly.
 */
const buildSprites = (): HTMLCanvasElement[] =>
  PARTICLE_COLORS.map(({ r, g, b }) => {
    const sprite = document.createElement('canvas');
    sprite.width = SPRITE_SIZE;
    sprite.height = SPRITE_SIZE;
    const sctx = sprite.getContext('2d')!;
    const mid = SPRITE_SIZE / 2;
    const glowRadius = mid;
    const coreRadius = SPRITE_SIZE * SPRITE_CORE_RATIO;

    const gradient = sctx.createRadialGradient(mid, mid, 0, mid, mid, glowRadius);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    sctx.fillStyle = gradient;
    sctx.beginPath();
    sctx.arc(mid, mid, glowRadius, 0, Math.PI * 2);
    sctx.fill();

    sctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    sctx.beginPath();
    sctx.arc(mid, mid, coreRadius, 0, Math.PI * 2);
    sctx.fill();

    return sprite;
  });

const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sprites = buildSprites();
    const particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };
    let attractionTimer = 0;
    let visible = true;
    /** Canvas size in CSS px (device pixels are handled by the ctx transform). */
    let width = 0;
    let height = 0;

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: CONFIG.minSize + Math.random() * CONFIG.maxSize,
      xvel: CONFIG.maxSpeed * (Math.random() * 2 - 1),
      yvel: CONFIG.maxSpeed * (Math.random() * 2 - 1),
      t:
        CONFIG.minTransparency +
        Math.random() * (CONFIG.maxTransparency - CONFIG.minTransparency),
      colorIndex: COLOR_WEIGHTS[Math.floor(Math.random() * COLOR_WEIGHTS.length)],
      fadeInDelay: initialFadeComplete ? 0 : Math.random() * 1500,
      currentFade: initialFadeComplete ? 1 : 0,
    });

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;

      // Back the canvas with device pixels so the dots and links are not soft on
      // a HiDPI screen, then work in CSS px for the rest of the simulation.
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = CONFIG.referenceDots / CONFIG.referenceArea;
      const target = Math.min(Math.floor(width * height * density), CONFIG.maxDots);

      if (particles.length < target) {
        while (particles.length < target) particles.push(createParticle());
      } else if (particles.length > target) {
        particles.length = target;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      // Park the cursor far away so the repel term decays to nothing instead of
      // leaving a permanent dent wherever the pointer last was.
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = () => {
      attractionTimer = CONFIG.pullLength;
    };

    resize();
    // ResizeObserver catches container size changes that window 'resize' misses,
    // notably mobile dvh stabilization on first load.
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    container.addEventListener('click', handleClick);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(container);

    const step = (pullFactor: number) => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.xvel;
        p.y += p.yvel;

        // Pointer interaction: repel by default, attract briefly after a click.
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mouseDistSq = mdx * mdx + mdy * mdy;
        if (mouseDistSq > 0) {
          const mouseDist = Math.sqrt(mouseDistSq);
          if (attractionTimer <= 0) {
            const force = Math.min(
              CONFIG.repelFactor / (mouseDist * mouseDistSq),
              CONFIG.maxAccel
            );
            p.x -= (mdx / mouseDist) * force;
            p.y -= (mdy / mouseDist) * force;
          } else {
            let force = (pullFactor / mouseDistSq) * (attractionTimer + CONFIG.pullLength);
            if (force > 10 * CONFIG.maxAccel) force = CONFIG.maxAccel;
            p.x += (mdx / mouseDist) * force;
            p.y += (mdy / mouseDist) * force;
          }
        }

        // Separation. Only j > i, so each pair is resolved once instead of twice,
        // and the squared-distance test rejects far pairs before any sqrt.
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const minDist = p.r + other.r;
          const d2 = dx * dx + dy * dy;
          if (d2 >= minDist * minDist || d2 === 0) continue;

          const distance = Math.sqrt(d2);
          // Normalised push, replacing the old atan2 + cos + sin per pair.
          const push = (minDist - distance) / 2 / distance;
          p.x -= dx * push;
          p.y -= dy * push;
          other.x += dx * push;
          other.y += dy * push;
        }

        const slack = CONFIG.maxSize * 2;
        if (p.x < -slack || p.x > width + slack) p.xvel *= -1;
        if (p.y < -slack || p.y > height + slack) p.yvel *= -1;
      }
    };

    const maxLinkDist = CONFIG.connectionDistance + CONFIG.fadeOut;
    const maxLinkDistSq = maxLinkDist * maxLinkDist;
    const sigmoidScale = -6 / (2 * CONFIG.fadeOut);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Links first, so the dots sit on top of them.
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const alpha = p.t * p.currentFade;
        if (alpha <= 0) continue;
        const pc = PARTICLE_COLORS[p.colorIndex];

        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > maxLinkDistSq) continue;

          const otherAlpha = other.t * other.currentFade;
          if (otherAlpha <= 0) continue;

          const distance = Math.sqrt(d2);
          const transparency = 1 / (1 + Math.exp(-sigmoidScale * (distance - maxLinkDist)));
          const lineAlpha = transparency * 0.15 * Math.min(alpha, otherAlpha);
          if (lineAlpha <= 0.002) continue;

          const oc = PARTICLE_COLORS[other.colorIndex];
          ctx.strokeStyle = `rgba(${(pc.r + oc.r) >> 1}, ${(pc.g + oc.g) >> 1}, ${
            (pc.b + oc.b) >> 1
          }, ${lineAlpha})`;
          ctx.lineWidth = Math.min(p.r, other.r) / 3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      // Dots: one scaled sprite blit each.
      for (const p of particles) {
        const alpha = p.t * p.currentFade;
        if (alpha <= 0) continue;
        const size = p.r * 6;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[p.colorIndex], p.x - p.r * 3, p.y - p.r * 3, size, size);
      }
      ctx.globalAlpha = 1;
    };

    let lastTime = 0;
    let startTime = 0;
    let frameId = 0;
    const fpsInterval = 1000 / CONFIG.fps;

    const animate = (currentTime: number) => {
      frameId = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      if (!visible || width === 0 || height === 0) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      const pullFactor = (width * height * CONFIG.pullFactor) / CONFIG.referenceArea;

      // Staggered fade-in, after a 1s hold so the hero text lands first.
      if (!initialFadeComplete) {
        if (startTime === 0) startTime = currentTime;
        const fadeElapsed = currentTime - startTime - 1000;
        let allDone = true;
        for (const p of particles) {
          if (p.currentFade >= 1) continue;
          p.currentFade =
            fadeElapsed > 0 ? Math.min(1, Math.max(0, (fadeElapsed - p.fadeInDelay) / 500)) : 0;
          if (p.currentFade < 1) allDone = false;
        }
        if (allDone) initialFadeComplete = true;
      }

      step(pullFactor);
      if (attractionTimer > 0) attractionTimer--;
      draw();
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      ro.disconnect();
      io.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
    </div>
  );
};

export default ParticleNetwork;
