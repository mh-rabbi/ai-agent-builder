import { useState, useEffect, useRef } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const lastCall = useRef(0);

  useEffect(() => {
    function handleResize() {
      const now = Date.now();
      // Throttle to ~60fps (16ms) to keep it smooth but reduce React noise
      if (now - lastCall.current < 16) return;
      lastCall.current = now;

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
