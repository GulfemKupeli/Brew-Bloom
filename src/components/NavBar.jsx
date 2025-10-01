import React from 'react';
import { Home, Sprout, ShoppingCart, ChefHat, Settings, Trophy, Database } from 'lucide-react';

export default function NavBar({ currentPage, setCurrentPage }) {
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
    <div className="bg-green-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-around p-3">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentPage(id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
              currentPage === id ? 'bg-green-600' : 'hover:bg-green-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-bold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}