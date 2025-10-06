import React from 'react';
import { SEEDS } from '../data/seeds';
import { getAssetPath } from '../utils/assets';

export default function Shop({ coins, setCoins, setSelectedSeed, showToast, seedInventory, setSeedInventory }) {
  
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
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">Seed Shop</h2>
      
      {/* Coins display */}
      <div className="border-4 border-green-800 p-6 mb-6 text-center relative min-h-24 bg-amber-100 border-4 border-green-800">
        <div className="flex items-center justify-center gap-2 relative z-10">
          <img
            src={getAssetPath('assets/coin.png')}
            alt="Coin"
            className="w-8 h-8"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="text-2xl font-bold text-amber-600">{coins}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.values(SEEDS).map(seed => {
          const ownedCount = seedInventory[seed.id] || 0;
          return (
            <div
              key={seed.id}
              className="border-4 border-green-800 p-6 text-center relative overflow-hidden min-h-80 bg-amber-100 border-4 border-green-800"
            >
              <img
                src={getAssetPath(`assets/${seed.id}-grown.png`)}
                alt={seed.name}
                className="w-32 h-32 mx-auto mb-3 relative z-10"
                style={{ imageRendering: 'pixelated' }}
              />
              <h3 className="text-xl font-bold text-green-800 mb-2 relative z-10">{seed.name}</h3>
              <p className="text-green-600 text-sm mb-2 relative z-10">{seed.description}</p>
              {ownedCount > 0 && (
                <p className="text-amber-600 font-bold mb-2 relative z-10">Owned: {ownedCount}</p>
              )}
              <p className="text-gray-600 text-sm mb-4 relative z-10">
                Growth: {seed.growthTime} waters
              </p>
              <button
                onClick={() => buySeed(seed.id)}
                className={`w-full px-6 py-3 border-4 border-green-800 font-bold text-lg transition transform hover:scale-105 relative z-10 flex items-center justify-center gap-2 ${
                  coins >= seed.price
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
                disabled={coins < seed.price}
              >
                <span>Buy -</span>
                <img
                  src={getAssetPath('assets/coin.png')}
                  alt="Coin"
                  className="w-6 h-6"
                  style={{ imageRendering: 'pixelated' }}
                />
                <span>{seed.price}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}