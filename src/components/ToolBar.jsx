import React, { useState } from 'react';

export default function ToolBar({ onOpenSeedBag, totalSeeds }) {
  const [hoveredTool, setHoveredTool] = useState(null);

  const tools = [
    { id: 'wateringCan', name: 'Watering Can', icon: '/assets/watering-can.png' },
    { id: 'scissors', name: 'Scissors', icon: '/assets/scissors.png' }
  ];

  const handleDragStart = (e, toolId) => {
    e.dataTransfer.setData('tool', toolId);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="fixed top-24 left-8 bg-gradient-to-br from-amber-100 to-green-100 border-4 border-green-800 border-4 border-green-700 p-4 shadow-xl z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Seed Bag Button */}
        <div
          className="relative flex justify-center"
          onMouseEnter={() => setHoveredTool('seedBag')}
          onMouseLeave={() => setHoveredTool(null)}
        >
          <button
            onClick={onOpenSeedBag}
            className="relative w-20 h-20 hover:scale-110 transition-transform"
          >
            <img
              src="/assets/seedbag.png"
              alt="Seed Bag"
              className="w-full h-full"
              style={{ imageRendering: 'pixelated' }}
            />
            {totalSeeds > 0 && (
              <div className="absolute -top-2 -right-2 bg-amber-600 text-white border-4 border-green-800 w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-amber-800">
                {totalSeeds}
              </div>
            )}
          </button>
          {hoveredTool === 'seedBag' && (
            <div className="absolute left-24 top-1/2 -translate-y-1/2 bg-green-800 text-white px-3 py-1 rounded text-sm font-bold whitespace-nowrap">
              Seed Bag
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-full border-t-2 border-green-600"></div>

        {/* Tools */}
        {tools.map(tool => (
          <div
            key={tool.id}
            className="relative flex justify-center"
            onMouseEnter={() => setHoveredTool(tool.id)}
            onMouseLeave={() => setHoveredTool(null)}
          >
            <img
              src={tool.icon}
              alt={tool.name}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, tool.id)}
              className="w-20 h-20 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
              style={{ imageRendering: 'pixelated' }}
            />
            {hoveredTool === tool.id && (
              <div className="absolute left-24 top-1/2 -translate-y-1/2 bg-green-800 text-white px-3 py-1 rounded text-sm font-bold whitespace-nowrap">
                {tool.name}
              </div>
            )}
          </div>
        ))}

        {/* Divider */}
        <div className="w-full border-t-2 border-green-600"></div>
      </div>
    </div>
  );
}