import { useMemo, useState, useEffect, useRef } from 'react';

interface WaveConfig {
  yPercent: number;
  opacity: number;
  angleOffset: number;
  amplitude: number;
  frequency: number;
  phase: number;
  // Additional harmonics for organic shape
  harmonic2Amp: number;
  harmonic2Freq: number;
  harmonic3Amp: number;
  harmonic3Freq: number;
  // Individual timing
  duration: number;
  delay: number;
}

// Generate organic wave path with multiple harmonics for bay-like curves
const generateWavePath = (
  width: number,
  config: WaveConfig
): string => {
  const { amplitude, frequency, phase, harmonic2Amp, harmonic2Freq, harmonic3Amp, harmonic3Freq } = config;
  const segments = Math.max(60, Math.ceil(frequency * 20)); // More segments for smoother curves
  const segmentWidth = width / segments;

  // Calculate max possible amplitude for proper centering
  const maxAmp = amplitude + harmonic2Amp + harmonic3Amp;

  let path = '';

  for (let i = 0; i <= segments; i++) {
    const x = i * segmentWidth;
    const progress = (i / segments) * Math.PI * 2;

    // Combine multiple sine waves for organic shape
    const y1 = Math.sin(progress * frequency + phase) * amplitude;
    const y2 = Math.sin(progress * harmonic2Freq + phase * 1.3) * harmonic2Amp;
    const y3 = Math.sin(progress * harmonic3Freq + phase * 0.7) * harmonic3Amp;

    const y = y1 + y2 + y3 + maxAmp;

    if (i === 0) {
      path = `M ${x} ${y}`;
    } else {
      // Use line segments (many small ones = smooth curve)
      path += ` L ${x} ${y}`;
    }
  }

  return path;
};

const WaveBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '100px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const waves = useMemo(() => {
    const generatedWaves: WaveConfig[] = [];
    const waveCount = 5;

    for (let i = 0; i < waveCount; i++) {
      // Spread waves across the height with more spacing
      const yPercent = 3 + (i / waveCount) * 45 + Math.random() * 5;

      // Base amplitude varies significantly for bay-like variety
      const baseAmplitude = 50 + Math.random() * 60; // 50-110px deep curves

      generatedWaves.push({
        yPercent,
        opacity: 0.15 + Math.random() * 0.2,
        angleOffset: (Math.random() - 0.5) * 16,
        // Primary wave - slow, deep curves
        amplitude: baseAmplitude,
        frequency: 0.4 + Math.random() * 0.4, // 0.4-0.8 cycles - very few, deep curves
        phase: Math.random() * Math.PI * 2,
        // Second harmonic - adds bay-like indentations
        harmonic2Amp: baseAmplitude * (0.2 + Math.random() * 0.3),
        harmonic2Freq: 1.5 + Math.random() * 1, // Higher frequency detail
        // Third harmonic - subtle organic variation
        harmonic3Amp: baseAmplitude * (0.05 + Math.random() * 0.1),
        harmonic3Freq: 3 + Math.random() * 2,
        // Individual timing for staggered spawning
        duration: 50 + Math.random() * 40, // 50-90 seconds per cycle
        delay: Math.random() * 60, // Random start delay 0-60 seconds
      });
    }

    return generatedWaves;
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  const baseAngle = -12;
  const svgWidth = 3000;

  // Generate unique keyframes for each wave
  const keyframesStyles = waves.map((_, i) => `
    @keyframes waveScroll${i} {
      from { transform: translateY(0) translateZ(0); }
      to { transform: translateY(-50%) translateZ(0); }
    }
  `).join('\n');

  const renderWave = (wave: WaveConfig, index: number, yOffset: number) => {
    const path = generateWavePath(svgWidth, wave);
    const maxAmp = wave.amplitude + wave.harmonic2Amp + wave.harmonic3Amp;
    const svgHeight = maxAmp * 2 + 60;

    // Trail offset - positioned behind (below) the wave in scroll direction
    const trailOffset = 6;

    return (
      <svg
        key={`wave-${index}-${yOffset}`}
        style={{
          position: 'absolute',
          top: `${(wave.yPercent + yOffset) / 2}%`,
          left: '50%',
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          transform: `translateX(-50%) rotate(${baseAngle + wave.angleOffset}deg) translateZ(0)`,
          transformOrigin: 'center center',
          backfaceVisibility: 'hidden',
          overflow: 'visible',
        }}
      >
        {/* Trail - offset behind the wave */}
        <g style={{ transform: `translateY(${trailOffset * 3}px)` }}>
          <path
            d={path}
            fill="none"
            stroke={`rgba(180, 200, 240, ${wave.opacity * 0.15})`}
            strokeWidth="6"
            strokeLinecap="round"
            style={{ filter: 'blur(5px)' }}
          />
        </g>
        <g style={{ transform: `translateY(${trailOffset * 2}px)` }}>
          <path
            d={path}
            fill="none"
            stroke={`rgba(160, 190, 230, ${wave.opacity * 0.25})`}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: 'blur(3px)' }}
          />
        </g>
        <g style={{ transform: `translateY(${trailOffset}px)` }}>
          <path
            d={path}
            fill="none"
            stroke={`rgba(140, 175, 220, ${wave.opacity * 0.4})`}
            strokeWidth="2"
            strokeLinecap="round"
            style={{ filter: 'blur(1px)' }}
          />
        </g>
        {/* Core wave line */}
        <path
          d={path}
          fill="none"
          stroke={`rgba(100, 150, 200, ${wave.opacity})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Bright leading edge */}
        <path
          d={path}
          fill="none"
          stroke={`rgba(220, 240, 255, ${wave.opacity * 0.5})`}
          strokeWidth="0.75"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
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
      <style>{keyframesStyles}</style>
      {isVisible && waves.map((wave, i) => (
        <div
          key={`wave-container-${i}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '200%',
            willChange: 'transform',
            animation: `waveScroll${i} ${wave.duration}s linear infinite`,
            animationDelay: `-${wave.delay}s`, // Negative delay = start partway through
            backfaceVisibility: 'hidden',
          }}
        >
          {renderWave(wave, i, 0)}
          {renderWave(wave, i, 50)}
          {renderWave(wave, i, 100)}
        </div>
      ))}
    </div>
  );
};

export default WaveBackground;
