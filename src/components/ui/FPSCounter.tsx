import { useState, useEffect, useRef } from 'react';

const FPSCounter: React.FC = () => {
  const [fps, setFps] = useState(0);
  const [visible, setVisible] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        // Don't toggle if user is typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        setVisible(v => !v);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
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

    animationFrameId = requestAnimationFrame(updateFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-4 z-[9999] px-3 py-1.5 bg-obsidian/90 backdrop-blur-sm rounded border border-zinc/30">
      <span className="font-mono text-xs text-cyan">{fps}</span>
      <span className="font-mono text-xs text-ash ml-1">FPS</span>
    </div>
  );
};

export default FPSCounter;
