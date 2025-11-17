import { useEffect } from 'react';

/**
 * Custom hook to scroll to top of the page
 * @param dependencies - Array of dependencies that trigger scroll when changed
 */
export const useScrollToTop = (dependencies: any[] = []) => {
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, dependencies);
};

/**
 * Utility function to scroll to top immediately
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

