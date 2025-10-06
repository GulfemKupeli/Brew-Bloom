import React from 'react';
import { X } from 'lucide-react';
import { SEEDS } from '../data/seeds';

export default function SeedBag({ seedInventory, onClose }) {
  const handleDragStart = (e, seedId) => {
    e.dataTransfer.setData('seedId', seedId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const availableSeeds = Object.entries(seedInventory).filter(([_, count]) => count > 0);

  return (
    <div className="fixed top-24 right-8 bg-gradient-to-br from-amber-100 to-green-100 border-4 border-green-800 border-8 border-green-800 p-6 w-80 shadow-2xl z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-800">Seed Bag</h2>
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {availableSeeds.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-lg text-green-700 mb-2">Seed bag is empty!</p>
          <p className="text-sm text-green-600">Visit the shop to buy seeds</p>
        </div>
      ) : (
        <>
          <p className="text-center text-green-700 mb-4 text-sm font-bold">
            Drag seeds to plots
          </p>
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {availableSeeds.map(([seedId, count]) => {
              const seed = SEEDS[seedId];
              return (
                <div
                  key={seedId}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, seedId)}
                  className="bg-white border-4 border-green-800 border-4 border-green-600 p-3 text-center cursor-grab active:cursor-grabbing hover:scale-105 transition transform shadow-lg"
                >
                  <div className="text-4xl mb-1">{seed.emoji}</div>
                  <div className="font-bold text-green-800 text-xs">{seed.name}</div>
                  <div className="text-xl font-bold text-amber-600 mt-1">×{count}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}