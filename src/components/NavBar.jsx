import React from 'react';
import { Home, Sprout, ShoppingCart, ChefHat, Settings, Trophy, Database } from 'lucide-react';
import { getAssetPath } from '../utils/assets';
import { useDayNight } from './DayNightCycle';

export default function NavBar({ currentPage, setCurrentPage }) {
  const { isDaytime } = useDayNight();
  const navItems = [
    { id: 'timer', icon: Home, label: 'Timer' },
    { id: 'garden', icon: Sprout, label: 'Garden' },
    { id: 'shop', icon: ShoppingCart, label: 'Shop' },
    { id: 'kitchen', icon: ChefHat, label: 'Kitchen' },
    { id: 'stats', icon: Trophy, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'data', icon: Database, label: 'Data' }
  ];

  return (
    <div className="relative -mt-4">
      <div className="max-w-6xl mx-auto flex justify-center gap-6 pt-0 pb-4 relative z-10">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`
                relative transition-all duration-200 transform
                ${isActive
                  ? 'scale-105 -translate-y-1'
                  : 'hover:scale-102 hover:-translate-y-0.5'
                }
              `}
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Wooden sign background with chain */}
              <div className="relative -mt-4">
                {/* Chain touching top of screen */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-amber-950" style={{ height: '16px', top: '-16px' }}></div>

                <img
                  src={getAssetPath('assets/wooden-sign.png')}
                  alt=""
                  className="w-40 h-40"
                  style={{ imageRendering: 'pixelated' }}
                />

                {/* Content on sign */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-2">
                  <Icon className={`${isActive ? 'w-7 h-7' : 'w-6 h-6'} text-amber-100 transition-all drop-shadow-lg flex-shrink-0`} />
                  <span className={`${isActive ? 'text-sm' : 'text-xs'} font-bold text-amber-100 transition-all drop-shadow-lg text-center leading-tight`}>
                    {label}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}