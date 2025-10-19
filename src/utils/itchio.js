// Itch.io API integration for better compatibility

// Check if running in itch.io iframe
export const isItchIO = () => {
  return window.self !== window.top &&
         (window.location !== window.parent.location ||
          document.referrer.includes('itch.io') ||
          document.referrer.includes('hwcdn.net'));
};

// Initialize itch.io API if available
export const initItchIO = () => {
  if (typeof window.Itch !== 'undefined') {
    console.log('Itch.io API detected');
    return window.Itch;
  }
  return null;
};

// Wrapper for localStorage that falls back to itch.io storage if needed
export const storage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage not available, using memory storage');
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage not available');
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage not available');
    }
  }
};

// Request fullscreen using itch.io API if available
export const requestFullscreen = () => {
  const itch = initItchIO();
  if (itch && itch.requestFullscreen) {
    itch.requestFullscreen();
    return true;
  }

  // Fallback to standard fullscreen API
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    return true;
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
    return true;
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
    return true;
  }
  return false;
};
