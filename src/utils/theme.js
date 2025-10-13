// Utility functions for theme-aware styling

export const getTextClass = (isDaytime, level = 'primary') => {
  if (isDaytime) {
    switch (level) {
      case 'primary':
        return 'text-green-800';
      case 'secondary':
        return 'text-green-700';
      case 'tertiary':
        return 'text-green-600';
      default:
        return 'text-green-800';
    }
  } else {
    switch (level) {
      case 'primary':
        return 'text-amber-200';
      case 'secondary':
        return 'text-amber-300';
      case 'tertiary':
        return 'text-amber-400';
      default:
        return 'text-amber-200';
    }
  }
};

export const getBorderClass = (isDaytime) => {
  return isDaytime ? 'border-green-800' : 'border-amber-400';
};
