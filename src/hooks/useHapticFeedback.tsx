
import { useCallback } from 'react';

export const useHapticFeedback = () => {
  const triggerLight = useCallback(() => {
    // Web vibration API fallback
    if ('vibrator' in navigator || 'vibrate' in navigator) {
      navigator.vibrate?.(50);
    }
  }, []);

  const triggerMedium = useCallback(() => {
    if ('vibrator' in navigator || 'vibrate' in navigator) {
      navigator.vibrate?.([50, 50, 50]);
    }
  }, []);

  const triggerHeavy = useCallback(() => {
    if ('vibrator' in navigator || 'vibrate' in navigator) {
      navigator.vibrate?.([100, 50, 100]);
    }
  }, []);

  return {
    light: triggerLight,
    medium: triggerMedium,
    heavy: triggerHeavy,
  };
};
