import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

/**
 * Throttles frame execution to a target FPS, useful for mobile optimization.
 * 
 * @param callback The function to execute on each allowed frame
 * @param targetFps Target frames per second (e.g., 30 for mobile)
 */
export function useOptimizedFrame(callback: (state: any, delta: number) => void, targetFps: number = 30) {
  const lastTime = useRef(0);
  const interval = 1 / targetFps;

  useFrame((state, delta) => {
    const currentTime = state.clock.getElapsedTime();
    
    // Throttle to target FPS
    if (currentTime - lastTime.current >= interval) {
      callback(state, delta);
      lastTime.current = currentTime;
    }
  });
}
