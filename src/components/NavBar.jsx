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
    <div className="relative pt-4 pb-8">
      {/* Modern glassmorphism navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/30 dark:bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-white/10">
          <div className="flex justify-center gap-1 p-2">
            {navItems.map(({ id, icon: Icon, label }) => {
              const isActive = currentPage === id;
              return (
                <button
                  key={id}
                  onClick={() => setCurrentPage(id)}
                  className={`
                    flex flex-col items-center gap-2 px-6 py-4 rounded-2xl
                    transition-all duration-300 transform relative group
                    ${isActive
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-105 shadow-lg'
                      : 'hover:bg-white/40 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 hover:scale-105'
                    }
                  `}
                >
                  {/* Icon with glow effect */}
                  <Icon className={`
                    w-6 h-6 transition-all duration-300
                    ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'group-hover:scale-110'}
                  `} />

                  {/* Label */}
                  <span className={`
                    text-xs font-bold transition-all duration-300
                    ${isActive ? 'text-white' : ''}
                  `}>
                    {label}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}