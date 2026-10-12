import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const PERIOD_W = 1800; // px — one full sine cycle; translateX animates exactly this far
const TILE_PERIODS = 8; // continuous periods per SVG tile — pushes tile boundary off-screen
const TILE_W = PERIOD_W * TILE_PERIODS; // background-size; tile boundary at 14400px is never visible
const BASE_TILT = -12; // deg — global wave tilt, applied per-wave (about each wave's own centre)

/**
 * Path samples per period. A sine of amplitude ~100px sampled 48x per 1800px
 * period deviates from the true curve by well under a third of a pixel, so the
 * old 80 samples were paying ~40% more string length and path data for nothing.
 */
const SAMPLES_PER_PERIOD = 48;

// Full site palette — split into warm-cyan and cool-steel tiers
const BRIGHT = ['0,212,255', '56,189,248', '125,211,252']; // cyan family
const COOL = ['37,99,235', '100,140,200', '140,170,215', '90,120,180']; // steel family

interface WaveConfig {
  id: number;
  centerY: string; // CSS for the wave's vertical centre — '40%' or 'calc(100% - 600px)'
  amplitude: number;
  phase: number;
  harmonic: number; // 0–0.4: mixes in a 2nd frequency so wave shapes vary
  duration: number; // drift cycle (s)
  delay: number; // drift pre-start (s) — full range so start positions are random
  opacity: number;
  colorDuration: number; // color crossfade cycle (s)
  colorDelay: number; // crossfade pre-start (s)
  color1: string; // r,g,b — bright
  color2: string; // r,g,b — cool
  angle: number; // per-wave rotation offset (degrees)
}

/**
 * Bakes a sine-wave SVG (optionally with a 2nd harmonic) as a CSS url() data-URI.
 * Four concentric strokes simulate a glow halo — zero filter:blur anywhere.
 *
 * The four strokes share one <path> via <use> rather than repeating the `d`
 * attribute four times. `d` dominates the string, so this cuts each data-URI
 * (and the parse work behind it) to roughly a quarter of its former size — and
 * there are two of them per wave.
 */
const buildWaveURI = (
  amplitude: number,
  phase: number,
  harmonic: number,
  color: string,
  opacity: number
): string => {
  const H = amplitude * 2 + 20;
  const cy = amplitude + 10;

  let d = '';
  const totalPts = SAMPLES_PER_PERIOD * TILE_PERIODS;
  for (let i = 0; i <= totalPts; i++) {
    const cycles = i / SAMPLES_PER_PERIOD;
    const t = cycles * Math.PI * 2;
    const x = (cycles * PERIOD_W).toFixed(1);
    const raw = Math.sin(t + phase) + harmonic * Math.sin(2 * t + phase * 1.3);
    const y = (cy + (raw / (1 + harmonic)) * amplitude).toFixed(1);
    d += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  }

  const stroke = (c: string, o: number, w: number) =>
    `<use href="#w" stroke="rgb(${c})" stroke-opacity="${o.toFixed(3)}" stroke-width="${w}"/>`;

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_W} ${H}">`,
    `<defs><path id="w" d="${d}"/></defs>`,
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round">`,
    stroke(color, opacity * 0.18, 12),
    stroke(color, opacity * 0.42, 4),
    stroke(color, opacity, 1.5),
    stroke('220,240,255', opacity * 0.45, 0.65),
    `</g></svg>`,
  ].join('');

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Builds the randomised wave set.
 *
 * Three waves are anchored to guarantee the short sections always get one; the
 * rest spread across the long Experience span with wide jitter so they cluster
 * and overlap freely. The anchors use fixed px (from the top / from the bottom)
 * rather than a percentage, because the page height varies a lot by device
 * (responsive reflow makes phones much taller than desktop) — but each section's
 * distance from its edge of the page stays roughly constant, so px anchors land
 * in the right section anywhere.
 */
const createWaves = (surfaceCount: number, swellCount: number): WaveConfig[] => {
  const configs: WaveConfig[] = [];
  const lastSurface = surfaceCount - 1;

  for (let i = 0; i < surfaceCount; i++) {
    let centerY: string;
    if (i === 0) {
      centerY = `${(450 + Math.random() * 250).toFixed(0)}px`; // About — from top
    } else if (i === lastSurface - 1) {
      centerY = `calc(100% - ${(1500 + Math.random() * 350).toFixed(0)}px)`; // Testimonials
    } else if (i === lastSurface) {
      centerY = `calc(100% - ${(500 + Math.random() * 250).toFixed(0)}px)`; // Contact
    } else {
      // Free waves are indices 1..lastSurface-2, so the last of them should land
      // at the top of the range: divide by one less than that count.
      const spread = Math.max(1, lastSurface - 3);
      const y = Math.max(
        6,
        Math.min(92, 12 + ((i - 1) / spread) * 66 + (Math.random() - 0.5) * 16)
      );
      centerY = `${y.toFixed(1)}%`;
    }
    const amplitude = 45 + Math.random() * 55; // 45–100 px
    const duration = 55 + Math.random() * 55; // 55–110 s
    configs.push({
      id: i,
      centerY,
      amplitude,
      phase: Math.random() * Math.PI * 2,
      harmonic: Math.random() * 0.4,
      duration,
      delay: Math.random() * duration, // random start position
      opacity: 0.16 + Math.random() * 0.16,
      colorDuration: 60 + Math.random() * 70,
      colorDelay: Math.random() * 130,
      color1: pick(BRIGHT),
      color2: pick(COOL),
      angle: (Math.random() - 0.5) * 5, // ±2.5° variance
    });
  }

  // Deep swells — slower, wider, fainter
  for (let i = 0; i < swellCount; i++) {
    const centerY = `${(15 + i * 55 + (Math.random() - 0.5) * 15).toFixed(1)}%`;
    const amplitude = 95 + Math.random() * 50; // 95–145 px
    const duration = 120 + Math.random() * 70; // 120–190 s
    configs.push({
      id: surfaceCount + i,
      centerY,
      amplitude,
      phase: Math.random() * Math.PI * 2,
      harmonic: Math.random() * 0.25, // swells smoother
      duration,
      delay: Math.random() * duration,
      opacity: 0.04 + Math.random() * 0.06,
      colorDuration: 100 + Math.random() * 80,
      colorDelay: Math.random() * 150,
      color1: pick(BRIGHT),
      color2: pick(COOL),
      angle: (Math.random() - 0.5) * 3, // ±1.5° variance (subtler for swells)
    });
  }

  return configs;
};

// Mobile gets a thinner field: every wave is two more compositor layers holding a
// very wide background tile, and phones have the least headroom for that.
const PRESETS = {
  desktop: { surface: 12, swells: 2 },
  mobile: { surface: 8, swells: 1 },
} as const;

/**
 * Lazily built once per page load and cached, so the layout is randomised on
 * every visit but stable across re-renders (and across a breakpoint flip and
 * back). Reading from the cache keeps the component's render itself pure.
 */
const waveCache = new Map<keyof typeof PRESETS, WaveConfig[]>();
const getWaves = (preset: keyof typeof PRESETS): WaveConfig[] => {
  let cached = waveCache.get(preset);
  if (!cached) {
    const { surface, swells } = PRESETS[preset];
    cached = createWaves(surface, swells);
    waveCache.set(preset, cached);
  }
  return cached;
};

const WaveBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  const waves = getWaves(isMobile ? 'mobile' : 'desktop');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0,
      rootMargin: '100px',
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Two data-URIs per wave, one per colour, built once per wave set.
  const uris1 = useMemo(
    () => waves.map((w) => buildWaveURI(w.amplitude, w.phase, w.harmonic, w.color1, w.opacity)),
    [waves]
  );
  const uris2 = useMemo(
    () => waves.map((w) => buildWaveURI(w.amplitude, w.phase, w.harmonic, w.color2, w.opacity)),
    [waves]
  );

  const keyframes = useMemo(
    () =>
      [
        // Shared crossfade — works for all waves regardless of which colors they picked
        `@keyframes showColor1 { 0%,100%{opacity:1} 50%{opacity:0} }`,
        `@keyframes showColor2 { 0%,100%{opacity:0} 50%{opacity:1} }`,
        // Per-wave drift — all translate the same distance, just at different speeds
        ...waves.map(
          (w) => `
    @keyframes waveDrift${w.id} {
      from { transform: translateX(0) translateZ(0); }
      to   { transform: translateX(-${PERIOD_W}px) translateZ(0); }
    }`
        ),
      ].join('\n'),
    [waves]
  );

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '100vh',
        left: 0,
        right: 0,
        bottom: 0,
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
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: '-50%',
          bottom: 0,
          left: '-50%',
        }}
      >
        {isVisible &&
          waves.map((w, idx) => {
            const H = w.amplitude * 2 + 20;
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
            // No will-change here on purpose: a running CSS transform animation is
            // already composited, and hinting it on every strip only pins a very
            // wide background tile into its own layer ahead of time.
            const strip: React.CSSProperties = {
              position: 'absolute',
              top: 0,
              left: 0,
              width: `calc(100% + ${PERIOD_W}px)`,
              height: '100%',
              backgroundSize: `${TILE_W}px 100%`,
              backgroundRepeat: 'repeat-x',
            };

            const drift = `waveDrift${w.id} ${w.duration}s linear -${w.delay}s infinite`;
            const f1 = `showColor1 ${w.colorDuration}s ease-in-out -${w.colorDelay}s infinite`;
            const f2 = `showColor2 ${w.colorDuration}s ease-in-out -${w.colorDelay}s infinite`;

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
