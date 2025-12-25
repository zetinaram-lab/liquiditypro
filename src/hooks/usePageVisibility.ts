// ============================================
// Page Visibility Hook - Thermal Optimization
// Pauses all intervals when tab is not visible
// ============================================

import { useState, useEffect } from 'react';

export const usePageVisibility = (): boolean => {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      
      // Log para debugging
      if (document.hidden) {
        console.log('🌙 Tab hidden - Pausing all intervals (Battery Saver Mode)');
      } else {
        console.log('☀️ Tab visible - Resuming intervals');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
};
