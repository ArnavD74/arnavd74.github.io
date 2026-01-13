import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  xvel: number;
  yvel: number;
  t: number;
  color: { r: number; g: number; b: number };
}

// Blue spectrum colors (weighted toward darker shades)
const particleColors = [
  { r: 10, g: 22, b: 40 },     // navy (x4)
  { r: 10, g: 22, b: 40 },
  { r: 10, g: 22, b: 40 },
  { r: 10, g: 22, b: 40 },
  { r: 15, g: 40, b: 71 },     // marine (x4)
  { r: 15, g: 40, b: 71 },
  { r: 15, g: 40, b: 71 },
  { r: 15, g: 40, b: 71 },
  { r: 30, g: 73, b: 118 },    // azure (x3)
  { r: 30, g: 73, b: 118 },
  { r: 30, g: 73, b: 118 },
  { r: 37, g: 99, b: 235 },    // cobalt (x2)
  { r: 37, g: 99, b: 235 },
  { r: 56, g: 189, b: 248 },   // sky
  { r: 0, g: 212, b: 255 },    // cyan
  { r: 125, g: 211, b: 252 },  // ice-blue
  { r: 186, g: 230, b: 253 },  // pale blue
  { r: 255, g: 255, b: 255 },  // white (accent)
];

const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const attractionTimerRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  const config = {
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
  };

  const dist = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const getAngle = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.atan2(y2 - y1, x2 - x1);
  };

  const sigmoid = (x: number) => {
    return 1 / (1 + Math.pow(Math.E, -1 * x));
  };

  const getRandomColor = () => {
    return particleColors[Math.floor(Math.random() * particleColors.length)];
  };

  const createParticle = useCallback((cw: number, ch: number): Particle => {
    return {
      x: Math.round(Math.random() * cw),
      y: Math.round(Math.random() * ch),
      r: config.minSize + Math.random() * config.maxSize,
      xvel: config.maxSpeed * (Math.random() * 2 - 1),
      yvel: config.maxSpeed * (Math.random() * 2 - 1),
      t: config.minTransparency + Math.random() * (config.maxTransparency - config.minTransparency),
      color: getRandomColor(),
    };
  }, []);

  const updateParticle = useCallback((particle: Particle, cw: number, ch: number, pullFactor: number) => {
    particle.x += particle.xvel;
    particle.y += particle.yvel;

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    if (attractionTimerRef.current <= 0) {
      const angle = getAngle(particle.x, particle.y, mx, my);
      let force = config.repelFactor / Math.pow(dist(particle.x, particle.y, mx, my), 3);
      if (force > config.maxAccel) force = config.maxAccel;
      particle.x += Math.cos(angle) * -force;
      particle.y += Math.sin(angle) * -force;
    } else {
      const angle = getAngle(particle.x, particle.y, mx, my);
      let force = (pullFactor / Math.pow(dist(particle.x, particle.y, mx, my), 2)) *
                  (attractionTimerRef.current + config.pullLength);
      if (force > 10 * config.maxAccel) force = config.maxAccel;
      particle.x += Math.cos(angle) * force;
      particle.y += Math.sin(angle) * force;
    }

    particlesRef.current.forEach(other => {
      if (other === particle) return;
      const distance = dist(particle.x, particle.y, other.x, other.y);
      const minDist = particle.r + other.r;
      if (distance < minDist) {
        const angle = getAngle(particle.x, particle.y, other.x, other.y);
        const moveDistance = (minDist - distance) / 2;
        particle.x += Math.cos(angle) * -moveDistance;
        particle.y += Math.sin(angle) * -moveDistance;
        other.x += Math.cos(angle) * moveDistance;
        other.y += Math.sin(angle) * moveDistance;
      }
    });

    if (particle.x < -config.maxSize * 2 || particle.x > cw + config.maxSize * 2) {
      particle.xvel *= -1;
    }
    if (particle.y < -config.maxSize * 2 || particle.y > ch + config.maxSize * 2) {
      particle.yvel *= -1;
    }
  }, []);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    // Draw lines to nearby particles - closer = more opaque
    particlesRef.current.forEach(other => {
      if (other === particle) return;
      const distance = dist(particle.x, particle.y, other.x, other.y);
      if (distance <= config.connectionDistance + config.fadeOut) {
        // Calculate line transparency based on distance (darker lines)
        const transparency = sigmoid(
          (-6 / (2 * config.fadeOut)) * (distance - (config.connectionDistance + config.fadeOut))
        );
        const lineAlpha = Math.max(0, transparency * 0.15 * Math.min(particle.t, other.t));

        // Blend the two particle colors for the line
        const avgR = Math.round((particle.color.r + other.color.r) / 2);
        const avgG = Math.round((particle.color.g + other.color.g) / 2);
        const avgB = Math.round((particle.color.b + other.color.b) / 2);

        ctx.strokeStyle = `rgba(${avgR}, ${avgG}, ${avgB}, ${lineAlpha})`;
        ctx.lineWidth = Math.min(particle.r, other.r) / 3;

        const angle = getAngle(particle.x, particle.y, other.x, other.y);
        const x1 = particle.x + particle.r * Math.cos(angle);
        const y1 = particle.y + particle.r * Math.sin(angle);
        const x2 = other.x + -other.r * Math.cos(angle);
        const y2 = other.y + -other.r * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    });

    const { r, g, b } = particle.color;

    // Outer glow
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.r * 3
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.t * 0.3})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r * 3, 0, Math.PI * 2);
    ctx.fill();

    // Core particle
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.t})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      canvas.width = cw;
      canvas.height = ch;

      const dotsPerPixel = 110 / (1903 * 969);
      const dotCount = Math.floor(cw * ch * dotsPerPixel);

      if (particlesRef.current.length === 0) {
        for (let i = 0; i < dotCount; i++) {
          particlesRef.current.push(createParticle(cw, ch));
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleClick = () => {
      attractionTimerRef.current = config.pullLength;
    };

    resize();
    window.addEventListener('resize', resize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    let lastTime = 0;
    const fps = 30;
    const fpsInterval = 1000 / fps;

    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      const cw = canvas.width;
      const ch = canvas.height;
      const sizePerPixel = config.pullFactor / (1903 * 969);
      const pullFactor = ch * cw * sizePerPixel;

      ctx.clearRect(0, 0, cw, ch);

      particlesRef.current.forEach(p => updateParticle(p, cw, ch, pullFactor));

      if (attractionTimerRef.current > 0) {
        attractionTimerRef.current--;
      }

      particlesRef.current.forEach(p => drawParticle(ctx, p));

      // Draw ripple effect on click
      if (attractionTimerRef.current > 0) {
        const rippleAlpha = (3 / config.pullLength) / attractionTimerRef.current;
        ctx.strokeStyle = `rgba(0, 212, 255, ${Math.min(rippleAlpha, 0.5)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          mouseRef.current.x,
          mouseRef.current.y,
          3 * Math.pow(attractionTimerRef.current + 1, 2),
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [createParticle, updateParticle, drawParticle]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default ParticleNetwork;
