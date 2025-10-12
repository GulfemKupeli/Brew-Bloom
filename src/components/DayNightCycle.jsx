import React, { useState, useEffect } from 'react';
import { getAssetPath } from '../utils/assets';

export function useDayNight() {
  const [isDaytime, setIsDaytime] = useState(() => {
    const saved = localStorage.getItem('isDaytime');
    if (saved !== null) {
      return saved === 'true';
    }
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20; // Day is 6am-8pm
  });

  const toggleDayNight = () => {
    setIsDaytime(prev => {
      const newValue = !prev;
      localStorage.setItem('isDaytime', newValue.toString());
      return newValue;
    });
  };

  return { isDaytime, toggleDayNight };
}

export function DayNightIndicator({ isDaytime, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-20 right-8 transition-transform hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-none p-0"
      aria-label="Toggle dark/light mode"
    >
      <img
        src={getAssetPath(isDaytime ? 'assets/sun.png' : 'assets/moon.png')}
        alt={isDaytime ? 'Light Mode' : 'Dark Mode'}
        className="w-16 h-16"
        style={{ imageRendering: 'pixelated' }}
      />
    </button>
  );
}