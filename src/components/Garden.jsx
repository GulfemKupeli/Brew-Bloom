import React, { useState } from 'react';
import { SEEDS } from '../data/seeds';
import SeedBag from './SeedBag';
import ToolBar from './ToolBar';

export default function Garden({ 
  garden, 
  setGarden, 
  selectedSeed, 
  setSelectedSeed,
  setInventory,
  showToast,
  seedInventory,
  setSeedInventory
}) {
  const [showSeedBag, setShowSeedBag] = useState(false);
  
  const plantSeed = (plotId, seedId) => {
    if ((seedInventory[seedId] || 0) <= 0) {
      showToast('You don\'t have any of these seeds! Buy more from the shop.', '⚠️');
      return;
    }
    
    const plot = garden[plotId];
    if (plot.seedType) {
      showToast('This plot already has a plant!', '⚠️');
      return;
    }

    setGarden(prev => prev.map(p => 
      p.id === plotId 
        ? { ...p, seedType: seedId, stage: 1, wateredCount: 0 }
        : p
    ));
    
    setSeedInventory(prev => ({
      ...prev,
      [seedId]: prev[seedId] - 1
    }));
    
    if (seedInventory[seedId] - 1 > 0) {
      showToast(`${SEEDS[seedId].name} planted! You have ${seedInventory[seedId] - 1} seeds left.`, '🌱');
    } else {
      showToast('Seed planted! That was your last one.', '🌱');
    }
  };

  const waterPlant = (plotId) => {
    const plot = garden[plotId];
    if (!plot.seedType) {
      showToast('No plant here to water!', '⚠️');
      return;
    }
    if (plot.wateredCount >= SEEDS[plot.seedType].growthTime) {
      showToast('This plant is fully grown! Harvest it first!', '⚠️');
      return;
    }

    setGarden(prev => prev.map(p => 
      p.id === plotId 
        ? { ...p, wateredCount: p.wateredCount + 1, stage: p.stage + 1 }
        : p
    ));
    showToast('Watered!', '💧');
  };

  const harvestPlant = (plotId) => {
    const plot = garden[plotId];
    if (!plot.seedType) {
      showToast('No plant here!', '⚠️');
      return;
    }
    
    const seed = SEEDS[plot.seedType];
    if (plot.wateredCount < seed.growthTime) {
      showToast('Plant is not ready to harvest yet! Keep watering!', '⚠️');
      return;
    }

    setInventory(prev => ({
      ...prev,
      [plot.seedType]: (prev[plot.seedType] || 0) + 1
    }));

    setGarden(prev => prev.map(p => 
      p.id === plotId 
        ? { ...p, seedType: null, stage: 0, wateredCount: 0 }
        : p
    ));

    showToast(`Harvested ${seed.name}!`, '✂️');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, plotId) => {
    e.preventDefault();
    const tool = e.dataTransfer.getData('tool');
    const seedId = e.dataTransfer.getData('seedId');
    
    if (tool === 'wateringCan') {
      waterPlant(plotId);
    } else if (tool === 'scissors') {
      harvestPlant(plotId);
    } else if (seedId) {
      plantSeed(plotId, seedId);
    }
  };

  const getPlotSprite = (plot) => {
    if (!plot.seedType) {
      return { src: '/assets/seed.png', label: 'Empty' };
    }
    
    const seed = SEEDS[plot.seedType];
    const progress = plot.wateredCount / seed.growthTime;
    
    if (progress === 0) {
      return { src: '/assets/planted-seed.png', label: 'Planted' };
    } else if (progress < 1) {
      return { src: `/assets/${plot.seedType}.png`, label: 'Growing' };
    } else {
      return { src: `/assets/${plot.seedType}-grown.png`, label: 'Ready!' };
    }
  };

  const totalSeeds = Object.values(seedInventory).reduce((sum, count) => sum + count, 0);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <ToolBar onOpenSeedBag={() => setShowSeedBag(true)} totalSeeds={totalSeeds} />
      
      <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">Your Garden</h2>

      <div className="grid grid-cols-3 gap-6">
        {garden.map(plot => {
          const sprite = getPlotSprite(plot);
          
          return (
            <div
              key={plot.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, plot.id)}
              className="bg-gradient-to-br from-amber-100 to-green-100 rounded-xl border-4 border-green-700 p-6 text-center hover:shadow-xl transition"
            >
              <img 
                src={sprite.src} 
                alt={sprite.label}
                className="w-16 h-16 mx-auto mb-3"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="font-bold text-green-800 mb-2">{sprite.label}</div>
              
              {plot.seedType && (
                <div className="text-sm text-green-600 mb-3">
                  {plot.wateredCount}/{SEEDS[plot.seedType].growthTime} 💧
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showSeedBag && (
        <SeedBag 
          seedInventory={seedInventory} 
          onClose={() => setShowSeedBag(false)} 
        />
      )}
    </div>
  );
}