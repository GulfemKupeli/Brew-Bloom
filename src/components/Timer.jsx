import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Sprout } from 'lucide-react';
import { getAssetPath } from '../utils/assets';
import { RECIPES } from '../data/recipes';

const DEBUG_MODE = false; // Set to true for testing (10s focus, 5s break)

export default function Timer({
  coins,
  sessionsCompleted,
  totalFocusTime,
  setCoins,
  setSessionsCompleted,
  setTotalFocusTime,
  focusLength,
  breakLength,
  soundEnabled,
  autoStart,
  showToast,
  brewedDrinks,
  setBrewedDrinks
}) {
  const [minutes, setMinutes] = useState(DEBUG_MODE ? 0 : focusLength);
  const [seconds, setSeconds] = useState(DEBUG_MODE ? 10 : 0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [activeDrink, setActiveDrink] = useState(null);
  const [drinkEffect, setDrinkEffect] = useState(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds]);

  const playSound = () => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj');
      audio.play().catch(() => {});
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    playSound();

    if (!isBreak) {
      let coinsEarned = 10;

      // Apply drink bonus if active
      if (activeDrink) {
        const recipe = RECIPES[activeDrink];
        // Extract percentage from effect string (e.g., "Energy +20%" -> 20)
        const match = recipe.effect.match(/\+(\d+)%/);
        if (match) {
          const bonusPercent = parseInt(match[1]);
          const bonus = Math.floor(coinsEarned * (bonusPercent / 100));
          coinsEarned += bonus;
          showToast(`${recipe.name} bonus: +${bonus} extra coins! Total: ${coinsEarned}`, '✨');
        }
        setActiveDrink(null); // Drink is consumed
      }

      setCoins(prev => prev + coinsEarned);
      setSessionsCompleted(prev => prev + 1);
      setTotalFocusTime(prev => prev + focusLength);
      showToast(`Focus session complete! You earned ${coinsEarned} coins!`, '🎉');
      setIsBreak(true);
      setMinutes(DEBUG_MODE ? 0 : breakLength);
      setSeconds(DEBUG_MODE ? 5 : 0);
      if (autoStart) {
        setTimeout(() => setIsActive(true), 1000);
      }
    } else {
      showToast('Break time over! Ready for another focus session?', '☕');
      setIsBreak(false);
      setMinutes(DEBUG_MODE ? 0 : focusLength);
      setSeconds(DEBUG_MODE ? 10 : 0);
      if (autoStart) {
        setTimeout(() => setIsActive(true), 1000);
      }
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isBreak ? (DEBUG_MODE ? 0 : breakLength) : (DEBUG_MODE ? 0 : focusLength));
    setSeconds(isBreak ? (DEBUG_MODE ? 5 : 0) : (DEBUG_MODE ? 10 : 0));
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDrinkDragStart = (e, drinkId) => {
    e.dataTransfer.setData('drinkId', drinkId);
  };

  const handleDrinkDrop = (e) => {
    e.preventDefault();
    const drinkId = e.dataTransfer.getData('drinkId');
    if (drinkId && brewedDrinks[drinkId] > 0) {
      setActiveDrink(drinkId);
      setBrewedDrinks(prev => ({
        ...prev,
        [drinkId]: prev[drinkId] - 1
      }));
      const recipe = RECIPES[drinkId];
      setDrinkEffect(recipe.effect);
      setTimeout(() => setDrinkEffect(null), 5000);
      showToast(`${recipe.name} active! ${recipe.effect}`, '☕');
      setShowDrinkModal(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
    <style>{`
      @keyframes writing-1 {
        0%, 32% { opacity: 1; }
        33%, 100% { opacity: 0; }
      }
      @keyframes writing-2 {
        0%, 32% { opacity: 0; }
        33%, 65% { opacity: 1; }
        66%, 100% { opacity: 0; }
      }
      @keyframes writing-3 {
        0%, 65% { opacity: 0; }
        66%, 100% { opacity: 1; }
      }
      @keyframes fade-up {
        0% {
          opacity: 0;
          transform: translateY(10px);
        }
        20% {
          opacity: 1;
          transform: translateY(0);
        }
        80% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(-10px);
        }
      }
      .animate-writing-1 {
        animation: writing-1 1.2s steps(1, end) infinite;
      }
      .animate-writing-2 {
        animation: writing-2 1.2s steps(1, end) infinite;
      }
      .animate-writing-3 {
        animation: writing-3 1.2s steps(1, end) infinite;
      }
      .animate-fade-up {
        animation: fade-up 5s ease-in-out forwards;
      }
    `}</style>
    <div className="w-full px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-orange-300 mb-2 flex items-center justify-center gap-3">
          <Sprout className="w-12 h-12" />
          Brew & Bloom
          <Coffee className="w-12 h-12" />
        </h1>
        <p className="text-orange-300 text-lg">Grow your focus, bloom your garden</p>
      </div>

      <div className="bg-white/80 backdrop-blur border-4 border-green-800 shadow-lg p-4 mb-8 border-4 border-green-800 max-w-3xl mx-auto">
        <div className="flex justify-around items-center text-center">
          <div>
            <div className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-2">
              <img
                src={getAssetPath('assets/coin.png')}
                alt="Coin"
                className="w-12 h-12"
                style={{ imageRendering: 'pixelated' }}
              />
              {coins}
            </div>
            <div className="text-sm text-green-700">Coins</div>
          </div>
          <div className="w-px h-12 bg-green-300"></div>
          <div>
            <div className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
              <img
                src={getAssetPath('assets/session.png')}
                alt="Session"
                className="w-12 h-12"
                style={{ imageRendering: 'pixelated' }}
              />
              {sessionsCompleted}
            </div>
            <div className="text-sm text-green-700">Sessions Today</div>
          </div>
          <div className="w-px h-12 bg-green-300"></div>
          <div>
            <div className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
              <img
                src={getAssetPath('assets/clock.png')}
                alt="Clock"
                className="w-12 h-12"
                style={{ imageRendering: 'pixelated' }}
              />
              {totalFocusTime}m
            </div>
            <div className="text-sm text-green-700">Total Focus Time</div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-stretch w-full">
        {/* Timer Box - 60% */}
        <div
          className="border-4 border-green-800 shadow-2xl p-12 border-8 border-green-800 relative overflow-hidden bg-amber-100"
          style={{ width: '60%' }}
        >
          <div className="absolute top-4 left-4">
            <img src={getAssetPath('assets/basil-grown.png')} alt="Plant" className="w-12 h-12" style={{ imageRendering: 'pixelated' }} />
          </div>
          <div className="absolute top-4 right-4">
            <img src={getAssetPath('assets/mint-grown.png')} alt="Herb" className="w-12 h-12" style={{ imageRendering: 'pixelated' }} />
          </div>
          <div className="absolute bottom-4 left-8">
            <img src={getAssetPath('assets/lavender-grown.png')} alt="Plant" className="w-12 h-12" style={{ imageRendering: 'pixelated' }} />
          </div>
          <div className="absolute bottom-4 right-8">
            <img src={getAssetPath('assets/chamomile-grown.png')} alt="Tea" className="w-12 h-12" style={{ imageRendering: 'pixelated' }} />
          </div>

        <div className="text-center mb-6 relative z-10">
          <div className={`inline-block px-6 py-2 text-lg font-bold border-4 ${
            isBreak ? 'bg-blue-500 text-white border-blue-700' : 'bg-green-600 text-white border-green-800'
          }`} style={{ imageRendering: 'pixelated' }}>
            {isBreak ? 'Break Time' : 'Focus Time'}
          </div>
        </div>

        <div className="text-center relative z-10">
          <div className="text-9xl font-bold text-green-800 mb-8 tracking-wider drop-shadow-lg bg-amber-100/80 inline-block px-8 py-4 border-8 border-green-800" style={{ imageRendering: 'pixelated' }}>
            {formatTime(minutes, seconds)}
          </div>
        </div>

        <div className="flex justify-center mb-8 relative z-10">
          <div className="relative w-64 h-8 bg-green-200 border-4 border-green-800 overflow-hidden" style={{ imageRendering: 'pixelated' }}>
            <div
              className={`h-full transition-all duration-1000 ${
                isBreak ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{
                width: `${((isBreak ? breakLength : focusLength) - minutes - (seconds > 0 ? 1 : 0)) / (isBreak ? breakLength : focusLength) * 100}%`,
                imageRendering: 'pixelated'
              }}
            ></div>
          </div>
        </div>

        <div className="flex justify-center gap-4 relative z-10">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-8 py-4 font-bold text-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg border-4 ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white border-red-700'
                : 'bg-green-600 hover:bg-green-700 text-white border-green-800'
            }`}
            style={{ imageRendering: 'pixelated' }}
          >
            {isActive ? (
              <>
                <Pause className="w-6 h-6" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                Start
              </>
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg border-4 border-amber-700"
            style={{ imageRendering: 'pixelated' }}
          >
            <RotateCcw className="w-6 h-6" />
            Reset
          </button>

          {isBreak && (
            <button
              onClick={() => {
                setIsActive(false);
                setIsBreak(false);
                setMinutes(DEBUG_MODE ? 0 : focusLength);
                setSeconds(DEBUG_MODE ? 10 : 0);
              }}
              className="flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg border-4 border-blue-700"
              style={{ imageRendering: 'pixelated' }}
            >
              Skip Break
            </button>
          )}
        </div>

          {!isBreak && (
            <div className="mt-8 text-center relative z-10">
              <div className="inline-block bg-amber-200 border-4 border-amber-600 px-6 py-3" style={{ imageRendering: 'pixelated' }}>
                <p className="text-green-800 font-bold flex items-center justify-center gap-2">
                  Complete this session to earn
                  <span className="text-amber-700 text-xl flex items-center gap-1">
                    <img
                      src={getAssetPath('assets/coin.png')}
                      alt="Coin"
                      className="w-8 h-8"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    10
                  </span>!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Character Box - 40% Square */}
        <div
          className="border-4 border-green-800 shadow-2xl border-8 border-green-800 bg-amber-100 relative"
          style={{ width: 'calc(40% - 24px)', aspectRatio: '1/1' }}
          onDrop={handleDrinkDrop}
          onDragOver={handleDragOver}
        >
          {/* Use Drink Button */}
          <button
            onClick={() => setShowDrinkModal(true)}
            className="absolute top-4 right-4 z-20 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold border-4 border-purple-700 transition-all transform hover:scale-105 flex items-center gap-2"
            style={{ imageRendering: 'pixelated' }}
          >
            <img
              src={getAssetPath('assets/mint-tea.png')}
              alt="Drink"
              className="w-6 h-6"
              style={{ imageRendering: 'pixelated' }}
            />
            Use Drink
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-8">
            {/* Drink effect notification */}
            {drinkEffect && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 animate-fade-up">
                <div className="text-white font-bold text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  ✨ {drinkEffect} ✨
                </div>
              </div>
            )}

            {/* Active drink on table coaster */}
            {activeDrink && (
              <div
                className="absolute z-20"
                style={{ left: '61%', top: '72%', transform: 'translate(-50%, -50%)' }}
              >
                {/* Drink only - no background circle */}
                <img
                  src={getAssetPath(`assets/${RECIPES[activeDrink].image}`)}
                  alt={RECIPES[activeDrink].name}
                  className="w-32 h-32"
                  style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
                />
              </div>
            )}

            <img
              src={getAssetPath('assets/girl-writing1.png')}
              alt="Girl Writing"
              className="max-w-full max-h-full absolute animate-writing-1 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            <img
              src={getAssetPath('assets/girl-writing2.png')}
              alt="Girl Writing"
              className="max-w-full max-h-full absolute animate-writing-2 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            <img
              src={getAssetPath('assets/girl-writing3.png')}
              alt="Girl Writing"
              className="max-w-full max-h-full absolute animate-writing-3 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      </div>

      {/* Drink Selection Modal */}
      {showDrinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-amber-100 border-8 border-green-800 p-8 max-w-2xl max-h-[80vh] overflow-y-auto pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-3xl font-bold text-green-800 mb-6 text-center">Select a Drink</h3>
            <p className="text-center text-green-700 font-semibold mb-6">Drag a drink to the girl's table to activate it!</p>

            {Object.keys(brewedDrinks).length === 0 ? (
              <p className="text-center text-green-700 font-semibold">No drinks available! Brew some drinks in the Kitchen first.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(brewedDrinks)
                  .filter(([_, count]) => count > 0)
                  .map(([drinkId, count]) => {
                    const recipe = RECIPES[drinkId];
                    return (
                      <div
                        key={drinkId}
                        draggable="true"
                        onDragStart={(e) => handleDrinkDragStart(e, drinkId)}
                        onDragEnd={() => {}}
                        className="border-4 border-green-800 p-4 text-center bg-white cursor-grab active:cursor-grabbing hover:scale-105 transition-transform select-none"
                        style={{ imageRendering: 'pixelated' }}
                      >
                        <img
                          src={getAssetPath(`assets/${recipe.image}`)}
                          alt={recipe.name}
                          className="w-20 h-20 mx-auto mb-2 pointer-events-none"
                          style={{ imageRendering: 'pixelated' }}
                          draggable="false"
                        />
                        <div className="font-bold text-green-800 text-sm mb-1 pointer-events-none">{recipe.name}</div>
                        <div className="text-xs text-purple-600 font-semibold mb-1 pointer-events-none">{recipe.effect}</div>
                        <div className="text-amber-600 font-bold pointer-events-none">×{count}</div>
                      </div>
                    );
                  })}
              </div>
            )}

            <button
              onClick={() => setShowDrinkModal(false)}
              className="mt-6 w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold border-4 border-red-700 transition-all"
              style={{ imageRendering: 'pixelated' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}