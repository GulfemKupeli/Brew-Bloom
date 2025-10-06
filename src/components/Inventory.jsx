import React from 'react';
import { SEEDS } from '../data/seeds';

export default function Inventory({ inventory }) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">📦 Inventory</h2>
      
      {Object.keys(inventory).length === 0 ? (
        <div className="bg-white/80 border-4 border-green-800 p-12 text-center border-4 border-green-700">
          <p className="text-2xl text-green-700">Your inventory is empty!</p>
          <p className="text-green-600 mt-2">Harvest herbs from your garden to fill it up! 🌿</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(inventory).map(([seedId, count]) => {
            const seed = SEEDS[seedId];
            return (
              <div
                key={seedId}
                className="bg-gradient-to-br from-white to-green-50 border-4 border-green-800 border-4 border-green-700 p-6 text-center"
              >
                <div className="text-5xl mb-2">{seed.emoji}</div>
                <h3 className="text-xl font-bold text-green-800">{seed.name}</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">×{count}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 bg-amber-100 border-4 border-amber-500 border-4 border-green-800 p-6 text-center">
        <p className="text-lg text-green-800">
          ☕ <strong>Tip:</strong> Use your herbs in the Kitchen to brew delicious drinks!
        </p>
      </div>
    </div>
  );
}