import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SEEDS } from '../data/seeds';
import { getAssetPath } from '../utils/assets';

const STAGES = {
  SELECT_HERB: 'select_herb',
  GRINDING: 'grinding',
  POUR_TO_GLASS: 'pour_to_glass',
  ADD_WATER: 'add_water',
  READY: 'ready',
  CELEBRATION: 'celebration'
};

export default function BrewingStation({ recipe, inventory, onComplete, onCancel }) {
  const [brewingStage, setBrewingStage] = useState(STAGES.SELECT_HERB);

  // Herb selection
  const [herbsAdded, setHerbsAdded] = useState([]);
  const [sprinkleEffect, setSprinkleEffect] = useState(null);

  // Grinding
  const [grindProgress, setGrindProgress] = useState(0);
  const [pestlePosition, setPestlePosition] = useState({ x: 200, y: 100 });
  const [isDraggingPestle, setIsDraggingPestle] = useState(false);
  const [smashEffect, setSmashEffect] = useState(false);

  // Pouring to glass
  const [isDraggingMortar, setIsDraggingMortar] = useState(false);
  const [mortarPosition, setMortarPosition] = useState({ x: 0, y: 0 });
  const [pouringToGlass, setPouringToGlass] = useState(false);
  const [glassHasPowder, setGlassHasPowder] = useState(false);

  // Water pouring
  const [isDraggingKettle, setIsDraggingKettle] = useState(false);
  const [kettlePosition, setKettlePosition] = useState({ x: 50, y: 100 });
  const [isPouringWater, setIsPouringWater] = useState(false);
  const [waterLevel, setWaterLevel] = useState(0);

  // Celebration
  const [stars, setStars] = useState([]);

  const pestleRef = useRef(null);
  const mortarRef = useRef(null);
  const glassRef = useRef(null);
  const kettleRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const requiredHerbs = Object.entries(recipe.ingredients).flatMap(
    ([herb, amount]) => Array(amount).fill(herb)
  );

  // Drag herb from hanging position
  const handleHerbDragStart = (e, herbType) => {
    if (brewingStage !== STAGES.SELECT_HERB) return;
    e.dataTransfer.setData('herb', herbType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleMortarDragOver = (e) => {
    if (brewingStage !== STAGES.SELECT_HERB) return;
    e.preventDefault();
  };

  const handleHerbDrop = (e) => {
    if (brewingStage !== STAGES.SELECT_HERB) return;
    e.preventDefault();

    const herb = e.dataTransfer.getData('herb');
    if (!herb) return;

    const currentCount = herbsAdded.filter(h => h === herb).length;
    const requiredCount = recipe.ingredients[herb] || 0;

    if (currentCount < requiredCount) {
      setHerbsAdded(prev => [...prev, herb]);

      // Show sprinkle effect
      setSprinkleEffect({ x: e.clientX, y: e.clientY, herb });
      setTimeout(() => setSprinkleEffect(null), 800);

      // Check if all herbs added
      if (herbsAdded.length + 1 >= requiredHerbs.length) {
        setTimeout(() => setBrewingStage(STAGES.GRINDING), 1000);
      }
    }
  };

  // Pestle dragging for grinding
  const handlePestleMouseDown = (e) => {
    if (brewingStage !== STAGES.GRINDING) return;
    setIsDraggingPestle(true);
    dragOffsetRef.current = {
      x: 64, // Half of pestle width (128px / 2)
      y: 64  // Half of pestle height (128px / 2)
    };
    e.preventDefault();
  };

  const checkPestleMortarCollision = useCallback(() => {
    if (!pestleRef.current || !mortarRef.current) return false;

    const pestleRect = pestleRef.current.getBoundingClientRect();
    const mortarRect = mortarRef.current.getBoundingClientRect();

    const pestleCenterX = pestleRect.left + pestleRect.width / 2;
    const pestleCenterY = pestleRect.top + pestleRect.height / 2;

    return (
      pestleCenterX > mortarRect.left &&
      pestleCenterX < mortarRect.right &&
      pestleCenterY > mortarRect.top &&
      pestleCenterY < mortarRect.bottom
    );
  }, []);

  const handleMouseMove = useCallback((e) => {
    // Pestle grinding
    if (isDraggingPestle && brewingStage === STAGES.GRINDING) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      // Center item under cursor
      const newX = e.clientX - containerRect.left - 64; // 64 = half of 128px pestle width
      const newY = e.clientY - containerRect.top - 64;  // 64 = half of 128px pestle height

      setPestlePosition({
        x: Math.max(0, Math.min(containerRect.width - 128, newX)),
        y: Math.max(0, Math.min(containerRect.height - 128, newY))
      });

      // Check collision
      if (checkPestleMortarCollision()) {
        setSmashEffect(true);
        setTimeout(() => setSmashEffect(false), 100);

        setGrindProgress(prev => {
          const newProgress = Math.min(100, prev + 3);
          if (newProgress >= 100) {
            setTimeout(() => setBrewingStage(STAGES.POUR_TO_GLASS), 500);
          }
          return newProgress;
        });
      }
    }

    // Mortar dragging to pour
    else if (isDraggingMortar && brewingStage === STAGES.POUR_TO_GLASS) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      // Center item under cursor
      const newX = e.clientX - containerRect.left - 96; // 96 = half of 192px mortar width
      const newY = e.clientY - containerRect.top - 96;  // 96 = half of 192px mortar height

      setMortarPosition({
        x: Math.max(-300, Math.min(300, newX)),
        y: Math.max(-200, Math.min(200, newY))
      });

      // Check if over glass
      if (glassRef.current && mortarRef.current) {
        const mortarRect = mortarRef.current.getBoundingClientRect();
        const glassRect = glassRef.current.getBoundingClientRect();

        const isOverGlass =
          mortarRect.left < glassRect.right &&
          mortarRect.right > glassRect.left &&
          mortarRect.top < glassRect.top;

        setPouringToGlass(isOverGlass);

        if (isOverGlass && !glassHasPowder) {
          setTimeout(() => {
            setGlassHasPowder(true);
            setBrewingStage(STAGES.ADD_WATER);
            setIsDraggingMortar(false);
            setMortarPosition({ x: 0, y: 0 });
          }, 1000);
        }
      }
    }

    // Kettle dragging
    else if (isDraggingKettle && brewingStage === STAGES.ADD_WATER) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      // Center item under cursor
      const newX = e.clientX - containerRect.left - 80; // 80 = half of 160px kettle width
      const newY = e.clientY - containerRect.top - 80;  // 80 = half of 160px kettle height

      setKettlePosition({
        x: Math.max(0, Math.min(containerRect.width - 160, newX)),
        y: Math.max(0, Math.min(containerRect.height - 160, newY))
      });

      // Check if over glass
      if (glassRef.current && kettleRef.current) {
        const kettleRect = kettleRef.current.getBoundingClientRect();
        const glassRect = glassRef.current.getBoundingClientRect();

        const isOverGlass =
          kettleRect.left < glassRect.right &&
          kettleRect.right > glassRect.left &&
          kettleRect.bottom > glassRect.top &&
          kettleRect.top < glassRect.bottom;

        setIsPouringWater(isOverGlass);
      }
    }
  }, [isDraggingPestle, isDraggingMortar, isDraggingKettle, brewingStage, checkPestleMortarCollision, glassHasPowder]);

  const handleMouseUp = () => {
    setIsDraggingPestle(false);
    setIsDraggingMortar(false);
    if (isDraggingKettle) {
      setIsDraggingKettle(false);
      setIsPouringWater(false);
    }
  };

  // Mortar pickup
  const handleMortarMouseDown = (e) => {
    if (brewingStage !== STAGES.POUR_TO_GLASS) return;
    setIsDraggingMortar(true);
    dragOffsetRef.current = {
      x: 96, // Half of mortar width (192px / 2)
      y: 96  // Half of mortar height (192px / 2)
    };
    e.preventDefault();
  };

  // Kettle pickup
  const handleKettleMouseDown = (e) => {
    if (brewingStage !== STAGES.ADD_WATER) return;
    setIsDraggingKettle(true);
    dragOffsetRef.current = {
      x: 80, // Half of kettle width (160px / 2)
      y: 80  // Half of kettle height (160px / 2)
    };
    e.preventDefault();
  };

  // Water filling effect
  useEffect(() => {
    if (isPouringWater && waterLevel < 100) {
      const interval = setInterval(() => {
        setWaterLevel(prev => {
          const newLevel = Math.min(100, prev + 2);
          if (newLevel >= 100) {
            setTimeout(() => setBrewingStage(STAGES.READY), 500);
          }
          return newLevel;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPouringWater, waterLevel]);

  // Ready button
  const handleReady = () => {
    setBrewingStage(STAGES.CELEBRATION);

    // Create star explosion
    const newStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 0.5
    }));
    setStars(newStars);

    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const getLiquidColor = () => {
    const mainHerb = Object.keys(recipe.ingredients)[0];
    const colors = {
      mint: 'from-green-400 to-green-600',
      lavender: 'from-purple-400 to-purple-600',
      basil: 'from-lime-400 to-lime-600',
      chamomile: 'from-yellow-300 to-yellow-500',
      rosemary: 'from-green-500 to-green-700',
      thyme: 'from-teal-400 to-teal-600',
      sage: 'from-gray-400 to-gray-600',
      lemonBalm: 'from-yellow-400 to-lime-500'
    };
    return colors[mainHerb] || 'from-amber-400 to-amber-600';
  };

  const getInstructionText = () => {
    switch (brewingStage) {
      case STAGES.SELECT_HERB:
        return 'Drag herbs from the right into the mortar';
      case STAGES.GRINDING:
        return 'Drag the pestle over the mortar to grind the herbs';
      case STAGES.POUR_TO_GLASS:
        return 'Pick up the mortar and pour into the glass';
      case STAGES.ADD_WATER:
        return 'Pick up the kettle and pour water into the glass';
      case STAGES.READY:
        return 'Your brew is ready!';
      case STAGES.CELEBRATION:
        return '✨ Masterpiece Created! ✨';
      default:
        return '';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-b from-amber-900/95 via-orange-900/95 to-amber-950/95 flex items-center justify-center z-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDraggingPestle || isDraggingMortar || isDraggingKettle ? 'grabbing' : 'default' }}
    >
      {/* Kitchen Counter Scene */}
      <div className="relative w-full max-w-7xl h-[90vh] mx-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-amber-100 mb-3 drop-shadow-lg">
            Brewing {recipe.name}
          </h2>
          <p className="text-2xl text-amber-200 font-semibold">{getInstructionText()}</p>
        </div>

        {/* Main Brewing Area - Kitchen Counter */}
        <div className="relative h-full flex items-center justify-center">

          {/* Counter Surface */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[500px] border-t-8 border-slate-400 shadow-2xl"
            style={{
              backgroundImage: `url(${getAssetPath('assets/marble.png')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              imageRendering: 'pixelated'
            }}
          >
          </div>

          {/* Hanging Herbs - Right Side */}
          <div className="absolute right-10 top-20 flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-amber-100 text-center mb-2">Herbs</h3>
            {Object.entries(inventory).map(([herb, count]) => {
              const needed = recipe.ingredients[herb] || 0;
              const used = herbsAdded.filter(h => h === herb).length;
              const canUse = brewingStage === STAGES.SELECT_HERB && used < needed;

              return (
                <div
                  key={herb}
                  draggable={canUse}
                  onDragStart={(e) => handleHerbDragStart(e, herb)}
                  className={`relative ${canUse ? 'cursor-grab active:cursor-grabbing' : 'opacity-40'}`}
                >
                  {/* Rope */}
                  <div className="absolute -top-6 left-1/2 w-1 h-6 bg-amber-800"></div>

                  {/* Herb bunch */}
                  <div className="bg-gradient-to-br from-green-700 to-green-900 border-4 border-green-800 rounded-lg p-3 transform hover:scale-110 transition shadow-xl">
                    <img
                      src={getAssetPath(`assets/${herb}-grown.png`)}
                      alt={SEEDS[herb].name}
                      className="w-16 h-16"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="text-center text-xs text-green-200 font-bold mt-1">
                      {used}/{needed}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Counter Items */}
          <div className="relative z-10 flex items-center justify-center gap-20 mb-20">

            {/* Mortar (always visible, center-left) */}
            <div
              ref={mortarRef}
              onDragOver={handleMortarDragOver}
              onDrop={handleHerbDrop}
              onMouseDown={handleMortarMouseDown}
              className={`relative ${
                brewingStage === STAGES.POUR_TO_GLASS
                  ? 'cursor-grab active:cursor-grabbing'
                  : ''
              }`}
              style={
                isDraggingMortar
                  ? {
                      transform: `translate(${mortarPosition.x}px, ${mortarPosition.y}px) ${pouringToGlass ? 'rotate(45deg)' : 'rotate(0deg)'}`,
                      transition: 'transform 0.2s ease'
                    }
                  : {}
              }
            >
              {/* Background plate/circle */}
              <div className="absolute inset-0 -m-8 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full opacity-40 blur-sm"></div>

              <img
                src={getAssetPath('assets/mortar.png')}
                alt="Mortar"
                className={`w-48 h-48 ${smashEffect ? 'scale-105' : 'scale-100'} transition-transform relative z-10`}
                style={{ imageRendering: 'pixelated' }}
              />

              {/* Progress ring during grinding */}
              {brewingStage === STAGES.GRINDING && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-48">
                  <div className="bg-amber-300 h-4 border-4 border-amber-900 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full transition-all duration-200"
                      style={{ width: `${grindProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-amber-100 font-bold mt-1">{Math.round(grindProgress)}%</p>
                </div>
              )}

              {/* Powder in mortar */}
              {grindProgress > 20 && brewingStage !== STAGES.POUR_TO_GLASS && (
                <div
                  className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-6 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, #6b5744 0%, #4a3f2f 100%)',
                    opacity: Math.min(1, grindProgress / 100)
                  }}
                ></div>
              )}

              {/* Falling powder effect */}
              {pouringToGlass && (
                <div className="absolute bottom-0 left-1/2 w-4 h-32 bg-gradient-to-b from-amber-800 to-transparent animate-pulse"></div>
              )}
            </div>

            {/* Empty Glass (center-right) */}
            {(brewingStage === STAGES.POUR_TO_GLASS ||
              brewingStage === STAGES.ADD_WATER ||
              brewingStage === STAGES.READY ||
              brewingStage === STAGES.CELEBRATION) && (
              <div ref={glassRef} className="relative">
                {/* Background plate/circle */}
                <div className="absolute inset-0 -m-6 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full opacity-40 blur-sm"></div>

                <img
                  src={getAssetPath('assets/glass-empty.png')}
                  alt="Glass"
                  className="w-40 h-40 relative z-20"
                  style={{ imageRendering: 'pixelated' }}
                />

                {/* Powder at bottom */}
                {glassHasPowder && (
                  <div className="absolute bottom-4 left-6 right-6 h-8 rounded-b-lg bg-gradient-to-t from-amber-900 to-amber-800 z-10"></div>
                )}

                {/* Water/liquid */}
                {waterLevel > 0 && (
                  <div className="absolute bottom-4 left-6 right-6 z-10" style={{ height: '70%' }}>
                    <div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getLiquidColor()} transition-all duration-300 rounded-b-lg`}
                      style={{ height: `${waterLevel}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Pestle (draggable during grinding) */}
          {brewingStage === STAGES.GRINDING && (
            <div
              ref={pestleRef}
              className="absolute z-50"
              style={{
                left: `${pestlePosition.x}px`,
                top: `${pestlePosition.y}px`,
                cursor: isDraggingPestle ? 'grabbing' : 'grab'
              }}
              onMouseDown={handlePestleMouseDown}
            >
              <img
                src={getAssetPath('assets/pestle.png')}
                alt="Pestle"
                className={`w-32 h-32 ${smashEffect ? 'scale-110' : 'scale-100'} transition-transform drop-shadow-lg`}
                style={{ imageRendering: 'pixelated', transform: 'rotate(-45deg)' }}
              />
            </div>
          )}

          {/* Kettle (back on counter during water stage) */}
          {(brewingStage === STAGES.ADD_WATER || brewingStage === STAGES.READY) && (
            <div
              ref={kettleRef}
              className={`absolute z-40 ${
                brewingStage === STAGES.ADD_WATER ? '' : 'opacity-50'
              }`}
              style={{
                left: `${kettlePosition.x}px`,
                top: `${kettlePosition.y}px`,
                cursor: brewingStage === STAGES.ADD_WATER ? (isDraggingKettle ? 'grabbing' : 'grab') : 'default'
              }}
              onMouseDown={handleKettleMouseDown}
            >
              <img
                src={getAssetPath(isPouringWater ? 'assets/kettle-pouring.png' : 'assets/kettle.png')}
                alt="Kettle"
                className="w-40 h-40 drop-shadow-lg transition-all"
                style={{
                  imageRendering: 'pixelated',
                  transform: isPouringWater ? 'rotate(-25deg)' : 'rotate(0deg)'
                }}
              />

              {/* Water stream */}
              {isPouringWater && (
                <div className="absolute bottom-8 left-20 w-3 h-40 bg-gradient-to-b from-blue-300 to-transparent opacity-70 animate-pulse"></div>
              )}
            </div>
          )}

          {/* Sprinkle effect when herb is dropped */}
          {sprinkleEffect && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: sprinkleEffect.x,
                top: sprinkleEffect.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-green-500 rounded-full animate-sprinkle"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    transform: `rotate(${i * 45}deg) translateY(-20px)`
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Final Drink Celebration - Separate from counter */}
        {brewingStage === STAGES.CELEBRATION && (
          <div className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none">
            <div className="relative bg-gradient-to-br from-amber-800/90 via-orange-800/90 to-yellow-700/90 border-8 border-yellow-500 rounded-3xl p-16 shadow-2xl">
              {/* Decorative corner stars */}
              <div className="absolute top-4 left-4 text-4xl animate-pulse">⭐</div>
              <div className="absolute top-4 right-4 text-4xl animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</div>
              <div className="absolute bottom-4 left-4 text-4xl animate-pulse" style={{ animationDelay: '0.4s' }}>⭐</div>
              <div className="absolute bottom-4 right-4 text-4xl animate-pulse" style={{ animationDelay: '0.6s' }}>⭐</div>

              <div className="relative animate-bounce-slow">
                <img
                  src={getAssetPath(`assets/${recipe.image}`)}
                  alt={recipe.name}
                  className="w-96 h-96 drop-shadow-2xl"
                  style={{ imageRendering: 'pixelated' }}
                />

                {/* Stars explosion */}
                {stars.map(star => (
                  <div
                    key={star.id}
                    className="absolute text-6xl pointer-events-none animate-star-burst"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(${star.x}px, ${star.y}px)`,
                      animationDelay: `${star.delay}s`,
                      animationDuration: `${star.duration}s`
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <h3 className="text-6xl font-bold text-yellow-100 mb-4 drop-shadow-lg animate-pulse">
                  {recipe.name}
                </h3>
                <p className="text-3xl text-yellow-200 font-semibold drop-shadow-md">{recipe.effect}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ready Button */}
        {brewingStage === STAGES.READY && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={handleReady}
              className="px-16 py-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-white font-bold text-3xl border-8 border-amber-700 shadow-2xl transform hover:scale-110 transition-all animate-pulse"
            >
              ✨ READY! ✨
            </button>
          </div>
        )}

        {/* Cancel Button */}
        {brewingStage !== STAGES.CELEBRATION && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 px-6 py-3 bg-red-600/80 hover:bg-red-500 text-white font-bold border-4 border-red-800 transition text-lg"
          >
            ✕ Cancel
          </button>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes sprinkle {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.3) translateY(40px);
          }
        }

        @keyframes star-burst {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(2) rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        .animate-sprinkle {
          animation: sprinkle 0.8s ease-out forwards;
        }

        .animate-star-burst {
          animation: star-burst 1.5s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
