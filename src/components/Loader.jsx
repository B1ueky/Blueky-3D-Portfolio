import { useState, useEffect } from 'react';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step + Math.random() * 0.5;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => setFadeOut(true), 400);
        setTimeout(() => onComplete(), 1200);
      }
      setProgress(Math.floor(current));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="glow-text text-4xl md:text-5xl font-light tracking-[0.3em]">
        LOADING
      </div>
      <div style={{ height: '20px' }} />
      <div className="w-48 h-[3px] bg-white/10 relative overflow-hidden rounded-full">
        <div
          className="absolute top-0 left-0 h-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="glow-text text-sm font-light tracking-[0.2em] mt-4">
        {progress}%
      </div>
    </div>
  );
};

export default Loader;
