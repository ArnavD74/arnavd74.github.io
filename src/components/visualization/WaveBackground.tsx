import React, { useMemo, useState, useEffect, useRef } from 'react';

const PERIOD_W = 1800; // px — one full sine cycle; translateX animates exactly this far
const TILE_PERIODS = 8; // continuous periods per SVG tile — pushes tile boundary off-screen
const TILE_W = PERIOD_W * TILE_PERIODS; // background-size; tile boundary at 14400px is never visible
const BASE_TILT = -12; // deg — global wave tilt, applied per-wave (about each wave's own centre)

// Full site palette — split into warm-cyan and cool-steel tiers
const BRIGHT = ['0,212,255', '56,189,248', '125,211,252'];          // cyan family
const COOL   = ['37,99,235', '100,140,200', '140,170,215', '90,120,180']; // steel family

interface WaveConfig {
  id: number;
  centerY: string;       // CSS for the wave's vertical centre — '40%' or 'calc(100% - 600px)'
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
  const totalPts = 80 * TILE_PERIODS;
  for (let i = 0; i <= totalPts; i++) {
    const t   = (i / 80) * Math.PI * 2;
    const x   = ((i / 80) * PERIOD_W).toFixed(1);
    const raw = Math.sin(t + phase) + harmonic * Math.sin(2 * t + phase * 1.3);
    const y   = (cy + (raw / (1 + harmonic)) * amplitude).toFixed(1);
    d += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  }

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_W} ${H}">`,
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round">`,
    `<path d="${d}" stroke="rgb(${color})" stroke-opacity="${(opacity * 0.18).toFixed(3)}" stroke-width="12"/>`,
    `<path d="${d}" stroke="rgb(${color})" stroke-opacity="${(opacity * 0.42).toFixed(3)}" stroke-width="4"/>`,
    `<path d="${d}" stroke="rgb(${color})" stroke-opacity="${opacity.toFixed(3)}"           stroke-width="1.5"/>`,
    `<path d="${d}" stroke="rgb(220,240,255)" stroke-opacity="${(opacity * 0.45).toFixed(3)}" stroke-width="0.65"/>`,
    `</g></svg>`,
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

    // 12 surface waves — reduced from 20 for lighter compositor load.
    // Three are anchored to guarantee the short sections always get a wave; the other nine
    // spread across the long Experience span with wide ±8% jitter so they cluster and
    // overlap freely. The anchors use fixed px (from the top / from the bottom) rather than
    // a percentage, because the page height varies a lot by device (responsive reflow makes
    // phones ~13000px tall vs ~11000px on desktop) — but each section's distance from its
    // edge of the page stays roughly constant, so px anchors land in the right section anywhere.
    for (let i = 0; i < 12; i++) {
      let centerY: string;
      if (i === 0)       centerY = `${(450 + Math.random() * 250).toFixed(0)}px`;                // About — from top
      else if (i === 10) centerY = `calc(100% - ${(1500 + Math.random() * 350).toFixed(0)}px)`;  // Testimonials — from bottom
      else if (i === 11) centerY = `calc(100% - ${(500 + Math.random() * 250).toFixed(0)}px)`;    // Contact — from bottom
      else {                                                                                      // 9 free across Experience
        const y = Math.max(6, Math.min(92, 12 + ((i - 1) / 8) * 66 + (Math.random() - 0.5) * 16));
        centerY = `${y.toFixed(1)}%`;
      }
      const amplitude = 45 + Math.random() * 55;                   // 45–100 px
      const duration  = 55  + Math.random() * 55;                  // 55–110 s (faster)
      configs.push({
        id: i,
        centerY,
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
      const centerY   = `${(15 + i * 55 + (Math.random() - 0.5) * 15).toFixed(1)}%`; // ~15%, ~70%
      const amplitude = 95 + Math.random() * 50;                   // 95–145 px (wider)
      const duration  = 120 + Math.random() * 70;                  // 120–190 s (faster)
      configs.push({
        id: 12 + i,
        centerY,
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

      {/* Positioning stage — NOT rotated. Full container height (top/bottom: 0) so every
          wave renders within view — no off-page waste — which is what keeps each page
          section populated. Overhangs 2× the container width (left/right: -50%) purely to
          give the strips room: the −12° tilt is applied per-wave below, about each wave's
          own centre, so a wave's reach to the screen edges depends only on its own height —
          never on the (very tall) page height — keeping waves edge-to-edge at any ratio. */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '-50%',
        bottom: 0,
        left: '-50%',
      }}>
        {isVisible && waves.map((w, idx) => {
          const H    = w.amplitude * 2 + 20;
          const wrapStyle: React.CSSProperties = {
            position: 'absolute',
            // Position by the wave's CENTRE (the strip draws the curve down its middle),
            // so centerY is the wave's centre — independent of the strip's height. centerY
            // is a % for free waves, or a px offset from top/bottom for the section anchors.
            top: `calc(${w.centerY} - ${(H / 2).toFixed(1)}px)`,
            left: 0,
            right: 0,
            height: `${H}px`,
            overflow: 'hidden',
            // The wave's full tilt = global −12° + its own small variance, applied here
            // about the wave's own centre (a 2W-wide strip rotated in place), so it always
            // overshoots both screen edges regardless of viewport size or page height.
            transform: `rotate(${(BASE_TILT + w.angle).toFixed(2)}deg)`,
            transformOrigin: 'center center',
          };
          const strip: React.CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: `calc(100% + ${PERIOD_W}px)`,
            height: '100%',
            backgroundSize:   `${TILE_W}px 100%`,
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
