import { useState, useEffect, useRef } from 'react';

/** Dev overlay: press "F" to toggle a live frame-rate readout. */
const FPSCounter: React.FC = () => {
  const [fps, setFps] = useState(0);
  const [visible, setVisible] = useState(false);
  const frameCount = useRef(0);
  // Seeded in the effect, not here — performance.now() during render is impure.
  const lastTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'f' && e.key !== 'F') return;
      // Ignore the shortcut while typing, or when it is part of a chord that
      // means something else to the browser (Ctrl/Cmd+F, etc.).
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }
      setVisible((v) => !v);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!visible) return;

    let animationFrameId: number;

    const updateFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / elapsed));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(updateFPS);
    };

    lastTime.current = performance.now();
    frameCount.current = 0;
    animationFrameId = requestAnimationFrame(updateFPS);

    return () => cancelAnimationFrame(animationFrameId);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-4 left-4 z-[9999] px-3 py-1.5 bg-obsidian/90 backdrop-blur-sm rounded border border-zinc/30"
    >
      <span className="font-mono text-xs text-cyan">{fps}</span>
      <span className="font-mono text-xs text-ash ml-1">FPS</span>
    </div>
  );
};

export default FPSCounter;
