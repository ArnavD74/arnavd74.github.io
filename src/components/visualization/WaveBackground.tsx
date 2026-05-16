import React, { useMemo, useState, useEffect, useRef } from 'react';

const PERIOD_W = 1800; // px — one full wave cycle; translateX animates exactly this far

// Full site palette — split into warm-cyan and cool-steel tiers
const BRIGHT = ['0,212,255', '56,189,248', '125,211,252'];          // cyan family
const COOL   = ['37,99,235', '100,140,200', '140,170,215', '90,120,180']; // steel family

interface WaveConfig {
  id: number;
  yPercent: number;
  amplitude: number;
  phase: number;
  harmonic: number;      // 0–0.4: mixes in a 2nd frequency so wave shapes vary
  duration: number;      // drift cycle (s)
  delay: number;         // drift pre-start (s) — full range so start positions are random
  opacity: number;
  colorDuration: number; // color crossfade cycle (s)
  colorDelay: number;    // crossfade pre-start (s)
  color1: string;        // r,g,b — bright
  color2: string;        // r,g,b — cool
  angle: number;         // per-wave rotation offset (degrees)
}

// Bakes a sine-wave SVG (optionally with a 2nd harmonic) as a CSS url() data-URI.
// 4 concentric strokes simulate a glow halo — zero filter:blur anywhere.
const buildWaveURI = (
  amplitude: number,
  phase: number,
  harmonic: number,
  color: string,
  opacity: number,
): string => {
  const H  = amplitude * 2 + 20;
  const cy = amplitude + 10;

  let d = '';
  // Draw one extra point past the period boundary so the stroke bridges the
  // tile seam when background-repeat tiles the SVG.  Without it the thick
  // glow strokes (up to 12 px) get clipped at the viewBox edge, leaving a
  // visible break between adjacent tiles.
  for (let i = 0; i <= 84; i++) {
    const t   = (i / 80) * Math.PI * 2;
    const x   = ((i / 80) * PERIOD_W).toFixed(1);
    const raw = Math.sin(t + phase) + harmonic * Math.sin(2 * t + phase * 1.3);
    const y   = (cy + (raw / (1 + harmonic)) * amplitude).toFixed(1);
    d += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  }

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PERIOD_W} ${H}" overflow="visible">`,
    `<path d="${d}" fill="none" stroke="rgb(${color})" stroke-opacity="${(opacity * 0.18).toFixed(3)}" stroke-width="12"/>`,
    `<path d="${d}" fill="none" stroke="rgb(${color})" stroke-opacity="${(opacity * 0.42).toFixed(3)}" stroke-width="4"/>`,
    `<path d="${d}" fill="none" stroke="rgb(${color})" stroke-opacity="${opacity.toFixed(3)}"           stroke-width="1.5"/>`,
    `<path d="${d}" fill="none" stroke="rgb(220,240,255)" stroke-opacity="${(opacity * 0.45).toFixed(3)}" stroke-width="0.65"/>`,
    `</svg>`,
  ].join('');

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const WaveBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '100px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Fully randomised on every page load — useMemo with [] runs once per mount
  const waves = useMemo<WaveConfig[]>(() => {
    const configs: WaveConfig[] = [];

    // 12 surface waves — reduced from 20 for lighter compositor load
    for (let i = 0; i < 12; i++) {
      const baseY    = 3 + (i / 11) * 87;                          // 3 → 90%
      const yPercent = Math.max(2, Math.min(93, baseY + (Math.random() - 0.5) * 10));
      const amplitude = 45 + Math.random() * 55;                   // 45–100 px
      const duration  = 55  + Math.random() * 55;                  // 55–110 s (faster)
      configs.push({
        id: i,
        yPercent,
        amplitude,
        phase:         Math.random() * Math.PI * 2,
        harmonic:      Math.random() * 0.4,                         // more varied shapes
        duration,
        delay:         Math.random() * duration,                    // random start position
        opacity:       0.16 + Math.random() * 0.16,
        colorDuration: 60  + Math.random() * 70,
        colorDelay:    Math.random() * 130,
        color1: pick(BRIGHT),
        color2: pick(COOL),
        angle:         (Math.random() - 0.5) * 5,                  // ±2.5° variance
      });
    }

    // 2 deep swells — reduced from 3 for lighter compositor load
    for (let i = 0; i < 2; i++) {
      const yPercent  = 15 + i * 55 + (Math.random() - 0.5) * 15; // ~15, 70%
      const amplitude = 95 + Math.random() * 50;                   // 95–145 px (wider)
      const duration  = 120 + Math.random() * 70;                  // 120–190 s (faster)
      configs.push({
        id: 12 + i,
        yPercent,
        amplitude,
        phase:         Math.random() * Math.PI * 2,
        harmonic:      Math.random() * 0.25,                        // swells smoother
        duration,
        delay:         Math.random() * duration,
        opacity:       0.04 + Math.random() * 0.06,
        colorDuration: 100 + Math.random() * 80,
        colorDelay:    Math.random() * 150,
        color1: pick(BRIGHT),
        color2: pick(COOL),
        angle:         (Math.random() - 0.5) * 3,                  // ±1.5° variance (subtler for swells)
      });
    }

    return configs;
  }, []);

  // Build two data-URIs per wave: one for each color — computed once
  const uris1 = useMemo(
    () => waves.map(w => buildWaveURI(w.amplitude, w.phase, w.harmonic, w.color1, w.opacity)),
    [waves]
  );
  const uris2 = useMemo(
    () => waves.map(w => buildWaveURI(w.amplitude, w.phase, w.harmonic, w.color2, w.opacity)),
    [waves]
  );

  const keyframes = useMemo(() => [
    // Shared crossfade — works for all waves regardless of which colors they picked
    `@keyframes showColor1 { 0%,100%{opacity:1} 50%{opacity:0} }`,
    `@keyframes showColor2 { 0%,100%{opacity:0} 50%{opacity:1} }`,
    // Per-wave drift — all translate the same distance, just at different speeds
    ...waves.map(w => `
    @keyframes waveDrift${w.id} {
      from { transform: translateX(0) translateZ(0); }
      to   { transform: translateX(-${PERIOD_W}px) translateZ(0); }
    }`),
  ].join('\n'), [waves]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '100vh',
        left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        contain: 'strict',
      }}
    >
      <style>{keyframes}</style>

      {/* Rotated stage — all strips at −12°; generous overshoot on all sides
          ensures the rotated rectangle fully covers the viewport at any aspect ratio */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        bottom: '-50%',
        left: '-50%',
        transform: 'rotate(-12deg)',
        transformOrigin: 'center center',
      }}>
        {isVisible && waves.map((w, idx) => {
          const H    = w.amplitude * 2 + 20;
          const wrapStyle: React.CSSProperties = {
            position: 'absolute',
            top: `${w.yPercent}%`,
            left: 0,
            right: 0,
            height: `${H}px`,
            overflow: 'hidden',
            transform: w.angle ? `rotate(${w.angle.toFixed(2)}deg)` : undefined,
            transformOrigin: 'center center',
          };
          // Strip is wider than wrapper to allow seamless looping:
          // needs at least wrapper-width + PERIOD_W so the translateX(-PERIOD_W)
          // animation doesn't reveal a gap on the right edge.
          const strip: React.CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: `calc(100% + ${PERIOD_W}px)`,
            height: '100%',
            backgroundSize:   `${PERIOD_W}px 100%`,
            backgroundRepeat: 'repeat-x',
            willChange: 'transform',
          };

          const drift = `waveDrift${w.id} ${w.duration}s linear -${w.delay}s infinite`;
          const f1    = `showColor1 ${w.colorDuration}s ease-in-out -${w.colorDelay}s infinite`;
          const f2    = `showColor2 ${w.colorDuration}s ease-in-out -${w.colorDelay}s infinite`;

          return (
            <div key={w.id} style={wrapStyle}>
              <div style={{ ...strip, backgroundImage: uris1[idx], animation: `${drift}, ${f1}` }} />
              <div style={{ ...strip, backgroundImage: uris2[idx], animation: `${drift}, ${f2}` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WaveBackground;
