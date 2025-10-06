import React, { useEffect } from 'react';

export default function Toast({ message, emoji, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-8 bg-white border-4 border-green-700 border-4 border-green-800 shadow-2xl p-6 animate-slide-in z-50 max-w-sm">
      <div className="flex items-center gap-4">
        <div className="text-5xl">{emoji}</div>
        <div className="font-bold text-green-800">{message}</div>
      </div>
    </div>
  );
}