import React, { useState, useEffect } from 'react';

export function useDayNight() {
  const [isDaytime, setIsDaytime] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20; // Day is 6am-8pm
  });

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsDaytime(hour >= 6 && hour < 20);
    };

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return isDaytime;
}

export function DayNightIndicator({ isDaytime }) {
  return (
    <div className="fixed top-20 right-8 text-6xl animate-pulse">
      {isDaytime ? '☀️' : '🌙'}
    </div>
  );
}