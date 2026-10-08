/**
 * Utility Functions for DSA Website
 * =================================
 * 
 * This file contains reusable helper functions used across multiple visualizers.
 * These functions handle common operations like:
 * - ⚡ Performance optimization (debounce, throttle)
 * - 🔀 Data manipulation (shuffling, cloning)
 * - 🧠 Memory address generation for linked list visualization
 * - ✅ Input validation and error handling
 * - 💾 Local storage management
 * - 📊 Performance monitoring
 * - ♿ Accessibility utilities
 * 
 * Import specific functions as needed:
 * import { debounce, shuffleArray, isValidInput } from '../../../utils/helpers';
 */

// Memory address generation for linked list visualization
export const generateMemoryAddresses = (size) => {
  return Array(size).fill().map((_, i) => 
    `0x${(i * 100).toString(16).toUpperCase().padStart(3, '0')}`
  );
};

// Singular version for backwards compatibility
export const generateMemoryAddress = (index = 0) => {
  return `0x${(index * 100).toString(16).toUpperCase().padStart(3, '0')}`;
};

/**
 * Performance optimization functions
 */

// Debounce function for performance optimization
// Prevents rapid successive calls by delaying execution
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events and rapid user interactions
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Deep clone utility
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(deepClone);
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Array shuffle utility for randomization
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate random array for sorting
export const generateRandomArray = (size = 50, min = 1, max = 100) => {
  return Array.from({ length: size }, (_, index) => ({
    id: index,
    value: Math.floor(Math.random() * (max - min + 1)) + min,
    style: ''
  }));
};

// Format complexity notation
export const formatComplexity = (complexity) => {
  const complexityMap = {
    '1': 'O(1)',
    'log n': 'O(log n)',
    'n': 'O(n)',
    'n log n': 'O(n log n)',
    'n²': 'O(n²)',
    'n^2': 'O(n²)',
    '2^n': 'O(2^n)',
    'n!': 'O(n!)'
  };
  return complexityMap[complexity] || complexity;
};

// Input validation helper
export const isValidInput = (input) => {
  return input && input.trim().length > 0;
};

// Error message display helper
export const showErrorMessage = (message, duration = 3000) => {
  return new Promise((resolve) => {
    // This function returns a promise that resolves after the duration
    // In a real app, this would show a toast or notification
    console.error(message);
    setTimeout(resolve, duration);
  });
};

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }
};

// Session storage utilities (for temporary data)
export const sessionStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from sessionStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to sessionStorage:`, error);
    }
  },
  
  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from sessionStorage:`, error);
    }
  }
};

// Validation utilities
export const validators = {
  isPositiveInteger: (value) => {
    const num = parseInt(value);
    return Number.isInteger(num) && num > 0;
  },
  
  isInRange: (value, min, max) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  },
  
  isValidNodeData: (data) => {
    return data !== null && data !== undefined && data.toString().trim() !== '';
  }
};

/**
 * Performance Monitoring Utilities
 * ================================
 */

/**
 * Creates a performance observer to monitor component render times
 * Useful for identifying performance bottlenecks in visualizations
 * 
 * @param {Function} callback - Called with performance entries
 * @returns {PerformanceObserver} The observer instance
 */
export const createPerformanceObserver = (callback) => {
  if (!window.PerformanceObserver) {
    console.warn('PerformanceObserver not supported in this browser');
    return null;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      callback(entries);
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    return observer;
  } catch (error) {
    console.error('Error creating performance observer:', error);
    return null;
  }
};

/**
 * Measures the time taken for a specific operation
 * 
 * @param {string} name - Unique name for the measurement
 * @param {Function} operation - Function to measure
 * @returns {Promise<any>} Result of the operation
 */
export const measureAsync = async (name, operation) => {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  
  performance.mark(startMark);
  try {
    const result = await operation();
    performance.mark(endMark);
    performance.measure(name, startMark, endMark);
    return result;
  } catch (error) {
    performance.mark(endMark);
    performance.measure(`${name}-error`, startMark, endMark);
    throw error;
  }
};

/**
 * Accessibility Utilities
 * =======================
 */

/**
 * Checks if user prefers reduced motion for animations
 * 
 * @returns {boolean} True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Announces text to screen readers
 * 
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  
  document.body.appendChild(announcer);
  announcer.textContent = message;
  
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
};

/**
 * Animation Utilities
 * ===================
 */

/**
 * Creates optimized animation frame loop
 * 
 * @param {Function} callback - Function to call each frame
 * @returns {Function} Cleanup function to stop the animation
 */
export const createAnimationLoop = (callback) => {
  let isRunning = true;
  let rafId;
  
  const loop = () => {
    if (isRunning) {
      callback();
      rafId = requestAnimationFrame(loop);
    }
  };
  
  rafId = requestAnimationFrame(loop);
  
  return () => {
    isRunning = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  };
};

/**
 * Throttles animation updates to prevent overwhelming the browser
 * 
 * @param {Function} callback - Function to throttle
 * @param {number} fps - Target frames per second (default: 60)
 * @returns {Function} Throttled function
 */
export const throttleAnimation = (callback, fps = 60) => {
  const interval = 1000 / fps;
  let lastTime = 0;
  
  return (...args) => {
    const now = performance.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      callback(...args);
    }
  };
};

/**
 * Storage helpers for direct import
 */
export const getStorageItem = (key, type = 'local') => {
  try {
    const storage = type === 'session' ? window.sessionStorage : window.localStorage;
    const value = storage.getItem(key);
    return value === null ? null : value;
  } catch (error) {
    console.error(`Error getting ${key} from ${type} storage:`, error);
    return null;
  }
};

export const setStorageItem = (key, value, type = 'local') => {
  try {
    const storage = type === 'session' ? window.sessionStorage : window.localStorage;
    storage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in ${type} storage:`, error);
    return false;
  }
};

export const removeStorageItem = (key, type = 'local') => {
  try {
    const storage = type === 'session' ? window.sessionStorage : window.localStorage;
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from ${type} storage:`, error);
    return false;
  }
};
