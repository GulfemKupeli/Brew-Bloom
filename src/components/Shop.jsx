import React from 'react';
import { SEEDS } from '../data/seeds';
import { getAssetPath } from '../utils/assets';
import { getTextClass, getBorderClass } from '../utils/theme';
import { ShoppingBag, Sparkles } from 'lucide-react';

export default function Shop({ coins, setCoins, setSelectedSeed, showToast, seedInventory, setSeedInventory, isDaytime }) {

  const buySeed = (seedId) => {
    const seed = SEEDS[seedId];
    if (coins >= seed.price) {
      setCoins(prev => prev - seed.price);
      setSeedInventory(prev => ({
        ...prev,
        [seedId]: (prev[seedId] || 0) + 1
      }));
      setSelectedSeed(seedId);
      showToast(`Bought ${seed.name} seed! You have ${(seedInventory[seedId] || 0) + 1} ${seed.name} seeds.`, '✅');
    } else {
      showToast('Not enough coins!', '❌');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
          <ShoppingBag className="w-12 h-12 text-green-500" />
          Seed Shop
          <Sparkles className="w-12 h-12 text-amber-500" />
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">Grow your garden with premium seeds</p>
      </div>

      {/* Coins display */}
      <div className="bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 backdrop-blur-lg rounded-3xl p-8 mb-10 text-center shadow-xl border-2 border-amber-300 dark:border-amber-700 max-w-md mx-auto transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-center gap-4">
          <img
            src={getAssetPath('assets/coin.png')}
            alt="Coin"
            className="w-20 h-20 drop-shadow-xl animate-bounce"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="text-6xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            {coins}
          </p>
        </div>
        <p className="text-amber-700 dark:text-amber-300 font-bold mt-2 text-lg">Available Coins</p>
      </div>

      {/* Seeds Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.values(SEEDS).map(seed => {
          const ownedCount = seedInventory[seed.id] || 0;
          const canAfford = coins >= seed.price;

          return (
            <div
              key={seed.id}
              className={`
                bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-3xl p-6 text-center
                shadow-xl border-2 transition-all duration-300 transform
                ${canAfford ? 'border-green-300 dark:border-green-700 hover:scale-105 hover:shadow-2xl' : 'border-gray-300 dark:border-gray-700 opacity-75'}
                relative overflow-hidden group
              `}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`}></div>

              {/* Owned badge */}
              {ownedCount > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                  Owned: {ownedCount}
                </div>
              )}

              {/* Seed Image */}
              <div className="relative z-10 mb-4">
                <img
                  src={getAssetPath(`assets/${seed.id}-grown.png`)}
                  alt={seed.name}
                  className="w-40 h-40 mx-auto drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Seed Info */}
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 relative z-10">
                {seed.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 relative z-10 h-10">
                {seed.description}
              </p>

              {/* Growth Time */}
              <div className="flex items-center justify-center gap-2 mb-4 relative z-10">
                <div className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-semibold">
                  Growth: {seed.growthTime} waters
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => buySeed(seed.id)}
                className={`
                  w-full px-6 py-4 rounded-2xl font-bold text-lg transition-all transform
                  relative z-10 flex items-center justify-center gap-2 shadow-lg
                  ${canAfford
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105 active:scale-95'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }
                `}
                disabled={!canAfford}
              >
                <span>Buy</span>
                <span className="flex items-center gap-1">
                  <img
                    src={getAssetPath('assets/coin.png')}
                    alt="Coin"
                    className="w-8 h-8"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  {seed.price}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
