import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Sparkles } from 'lucide-react';
import { getAssetPath } from '../utils/assets';
import { RECIPES } from '../data/recipes';

const DEBUG_MODE = false;

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
  setBrewedDrinks,
  isDaytime
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

      if (activeDrink) {
        const recipe = RECIPES[activeDrink];
        const match = recipe.effect.match(/\+(\d+)%/);
        if (match) {
          const bonusPercent = parseInt(match[1]);
          const bonus = Math.floor(coinsEarned * (bonusPercent / 100));
          coinsEarned += bonus;
          showToast(`${recipe.name} bonus: +${bonus} extra coins! Total: ${coinsEarned}`, '✨');
        }
        setActiveDrink(null);
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

  const progress = ((isBreak ? breakLength : focusLength) - minutes - (seconds > 0 ? 1 : 0)) / (isBreak ? breakLength : focusLength) * 100;

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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">

        {/* Minimal Stats - Top Corners */}
        <div className="fixed top-8 left-8 flex gap-6 z-40">
          <div className="flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
            <img
              src={getAssetPath('assets/coin.png')}
              alt="Coin"
              className="w-8 h-8"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{coins}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
            <img
              src={getAssetPath('assets/session.png')}
              alt="Session"
              className="w-8 h-8"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{sessionsCompleted}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
            <img
              src={getAssetPath('assets/clock.png')}
              alt="Clock"
              className="w-8 h-8"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalFocusTime}m</span>
          </div>
        </div>

        {/* Use Drink Button - Top Right */}
        {Object.keys(brewedDrinks).filter(id => brewedDrinks[id] > 0).length > 0 && (
          <button
            onClick={() => setShowDrinkModal(true)}
            className="fixed top-8 right-8 z-40 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-bold rounded-full transition-all transform hover:scale-110 flex items-center gap-2 shadow-xl"
          >
            <Coffee className="w-5 h-5" />
            Use Drink
          </button>
        )}

        {/* Main Content - Character with Timer Overlay */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          onDrop={handleDrinkDrop}
          onDragOver={handleDragOver}
        >
          {/* Large Studying Character */}
          <div className="relative" style={{ width: '900px', height: '900px' }}>
            {/* Drink effect notification */}
            {drinkEffect && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 animate-fade-up">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl px-6 py-3 rounded-2xl shadow-2xl">
                  ✨ {drinkEffect} ✨
                </div>
              </div>
            )}

            {/* Active drink on table */}
            {activeDrink && (
              <div
                className="absolute z-20"
                style={{ left: '58%', top: '68%', transform: 'translate(-50%, -50%)' }}
              >
                <img
                  src={getAssetPath(`assets/${RECIPES[activeDrink].image}`)}
                  alt={RECIPES[activeDrink].name}
                  className="w-40 h-40 drop-shadow-2xl animate-float"
                  style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Animated character */}
            <img
              src={getAssetPath('assets/girl-writing1.png')}
              alt="Girl Writing"
              className="w-full h-full absolute animate-writing-1 object-contain drop-shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
            <img
              src={getAssetPath('assets/girl-writing2.png')}
              alt="Girl Writing"
              className="w-full h-full absolute animate-writing-2 object-contain drop-shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
            <img
              src={getAssetPath('assets/girl-writing3.png')}
              alt="Girl Writing"
              className="w-full h-full absolute animate-writing-3 object-contain drop-shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Floating Timer Overlay - Top Left of Character */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-[-350px] mt-[-200px]">
            {/* Mode Badge */}
            <div className="mb-4 text-center">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg shadow-lg backdrop-blur-md ${
                isBreak
                  ? 'bg-blue-500/90 text-white'
                  : 'bg-green-500/90 text-white'
              }`}>
                {isBreak ? '☕ Break Time' : '🎯 Focus Time'}
              </div>
            </div>

            {/* Giant Timer */}
            <div className="text-center mb-6">
              <div className="text-[120px] font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-wider drop-shadow-2xl leading-none">
                {formatTime(minutes, seconds)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="h-3 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 shadow-lg ${
                    isBreak
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-3 px-8 py-4 font-bold text-lg rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md ${
                  isActive
                    ? 'bg-red-500/90 hover:bg-red-600/90 text-white'
                    : 'bg-green-500/90 hover:bg-green-600/90 text-white'
                }`}
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
                className="flex items-center gap-3 px-8 py-4 bg-amber-500/90 hover:bg-amber-600/90 text-white font-bold text-lg rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md"
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
                  className="flex items-center gap-3 px-8 py-4 bg-blue-500/90 hover:bg-blue-600/90 text-white font-bold text-lg rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md"
                >
                  Skip Break
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Drink Selection Modal */}
        {showDrinkModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-10 max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-white/50">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 text-center">
                Select a Drink
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-300 font-semibold mb-8 text-lg">
                Drag a drink to the girl's table to activate it!
              </p>

              {Object.keys(brewedDrinks).length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 font-semibold text-lg">
                  No drinks available! Brew some drinks in the Kitchen first.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {Object.entries(brewedDrinks)
                    .filter(([_, count]) => count > 0)
                    .map(([drinkId, count]) => {
                      const recipe = RECIPES[drinkId];
                      return (
                        <div
                          key={drinkId}
                          draggable="true"
                          onDragStart={(e) => handleDrinkDragStart(e, drinkId)}
                          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-300 shadow-xl border-2 border-gray-200 dark:border-gray-700 select-none"
                        >
                          <img
                            src={getAssetPath(`assets/${recipe.image}`)}
                            alt={recipe.name}
                            className="w-24 h-24 mx-auto mb-3 drop-shadow-lg pointer-events-none"
                            style={{ imageRendering: 'pixelated' }}
                            draggable="false"
                          />
                          <div className="font-bold text-gray-800 dark:text-gray-200 text-base mb-2 pointer-events-none">{recipe.name}</div>
                          <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2 pointer-events-none">{recipe.effect}</div>
                          <div className="text-amber-600 dark:text-amber-400 font-bold text-lg pointer-events-none">×{count}</div>
                        </div>
                      );
                    })}
                </div>
              )}

              <button
                onClick={() => setShowDrinkModal(false)}
                className="mt-8 w-full px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-lg rounded-2xl transition-all shadow-xl transform hover:scale-105"
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
