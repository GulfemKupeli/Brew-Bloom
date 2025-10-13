import React, { useEffect } from 'react';
import { getTextClass, getBorderClass } from '../utils/theme';

export default function Toast({ message, emoji, onClose, isDaytime }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-24 right-8 bg-white border-4 ${getBorderClass(isDaytime)} shadow-2xl p-6 animate-slide-in z-50 max-w-sm`}>
      <div className="flex items-center gap-4">
        <div className="text-5xl">{emoji}</div>
        <div className={`font-bold ${getTextClass(isDaytime, 'primary')}`}>{message}</div>
      </div>
    </div>
  );
}