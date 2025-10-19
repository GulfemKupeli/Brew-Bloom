import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Sprout, Sparkles } from 'lucide-react';
import { getAssetPath } from '../utils/assets';
import { RECIPES } from '../data/recipes';
import { getTextClass, getBorderClass } from '../utils/theme';

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

      // Apply drink bonus if active
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
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-4 drop-shadow-lg">
          <Sprout className="w-14 h-14 text-green-400 animate-pulse" />
          Brew & Bloom
          <Coffee className="w-14 h-14 text-amber-600 animate-pulse" />
        </h1>
        <p className="text-xl text-green-600 dark:text-green-300 font-semibold">Grow your focus, bloom your garden</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
        {/* Coins */}
        <div className="bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-amber-300 dark:border-amber-700 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src={getAssetPath('assets/coin.png')}
              alt="Coin"
              className="w-16 h-16 drop-shadow-lg animate-bounce"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              {coins}
            </div>
          </div>
          <div className="text-center text-amber-700 dark:text-amber-300 font-bold text-sm">Coins</div>
        </div>

        {/* Sessions */}
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-green-300 dark:border-green-700 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src={getAssetPath('assets/session.png')}
              alt="Session"
              className="w-16 h-16 drop-shadow-lg"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {sessionsCompleted}
            </div>
          </div>
          <div className="text-center text-green-700 dark:text-green-300 font-bold text-sm">Sessions Today</div>
        </div>

        {/* Focus Time */}
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-300 dark:border-blue-700 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src={getAssetPath('assets/clock.png')}
              alt="Clock"
              className="w-16 h-16 drop-shadow-lg"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {totalFocusTime}m
            </div>
          </div>
          <div className="text-center text-blue-700 dark:text-blue-300 font-bold text-sm">Total Focus Time</div>
        </div>
      </div>

      {/* Main Timer and Character Section */}
      <div className="flex gap-8 items-stretch max-w-7xl mx-auto">
        {/* Timer Card - 60% */}
        <div className="flex-1 bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/50 dark:border-white/20 p-12 relative overflow-hidden">
          {/* Decorative plant icons */}
          <div className="absolute top-6 left-6 opacity-20">
            <img src={getAssetPath('assets/basil-grown.png')} alt="" className="w-16 h-16" style={{ imageRendering: 'pixelated' }} />
          </div>
          <div className="absolute top-6 right-6 opacity-20">
            <img src={getAssetPath('assets/mint-grown.png')} alt="" className="w-16 h-16" style={{ imageRendering: 'pixelated' }} />
          </div>
          <div className="absolute bottom-6 left-10 opacity-20">
            <img src={getAssetPath('assets/lavender-grown.png')} alt="" className="w-16 h-16" style={{ imageRendering: 'pixelated' }} />
          </div>
          <div className="absolute bottom-6 right-10 opacity-20">
            <img src={getAssetPath('assets/chamomile-grown.png')} alt="" className="w-16 h-16" style={{ imageRendering: 'pixelated' }} />
          </div>

          <div className="text-center mb-8 relative z-10">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg shadow-lg ${
              isBreak
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
            }`}>
              {isBreak ? '☕ Break Time' : '🎯 Focus Time'}
            </div>
          </div>

          <div className="text-center mb-8 relative z-10">
            <div className="text-9xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 tracking-wider drop-shadow-2xl">
              {formatTime(minutes, seconds)}
            </div>

            {/* Modern Progress Bar */}
            <div className="max-w-xl mx-auto">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
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
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 mb-8 relative z-10">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-3 px-10 py-5 font-bold text-xl rounded-2xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl ${
                isActive
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-7 h-7" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-7 h-7" />
                  Start
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl"
            >
              <RotateCcw className="w-7 h-7" />
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
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl"
              >
                Skip Break
              </button>
            )}
          </div>

          {/* Earnings Display */}
          {!isBreak && (
            <div className="text-center relative z-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/70 dark:to-yellow-900/70 rounded-2xl px-8 py-4 shadow-lg border-2 border-amber-300 dark:border-amber-700">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <p className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  Complete this session to earn
                  <span className="flex items-center gap-2 text-2xl text-amber-600 dark:text-amber-400">
                    <img
                      src={getAssetPath('assets/coin.png')}
                      alt="Coin"
                      className="w-10 h-10"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    10
                  </span>!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Character Card - 40% */}
        <div
          className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/50 dark:border-white/20 relative"
          style={{ width: '40%', aspectRatio: '1/1' }}
          onDrop={handleDrinkDrop}
          onDragOver={handleDragOver}
        >
          {/* Use Drink Button */}
          <button
            onClick={() => setShowDrinkModal(true)}
            className="absolute top-6 right-6 z-20 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-bold rounded-2xl transition-all transform hover:scale-110 flex items-center gap-2 shadow-xl"
          >
            <img
              src={getAssetPath('assets/mint-tea.png')}
              alt="Drink"
              className="w-7 h-7"
              style={{ imageRendering: 'pixelated' }}
            />
            Use Drink
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-8">
            {/* Drink effect notification */}
            {drinkEffect && (
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 animate-fade-up">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl px-6 py-3 rounded-2xl shadow-2xl">
                  ✨ {drinkEffect} ✨
                </div>
              </div>
            )}

            {/* Active drink on table */}
            {activeDrink && (
              <div
                className="absolute z-20"
                style={{ left: '61%', top: '72%', transform: 'translate(-50%, -50%)' }}
              >
                <img
                  src={getAssetPath(`assets/${RECIPES[activeDrink].image}`)}
                  alt={RECIPES[activeDrink].name}
                  className="w-32 h-32 drop-shadow-2xl"
                  style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Animated character */}
            <img
              src={getAssetPath('assets/girl-writing1.png')}
              alt="Girl Writing"
              className="max-w-full max-h-full absolute animate-writing-1 object-contain drop-shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
            <img
              src={getAssetPath('assets/girl-writing2.png')}
              alt="Girl Writing"
              className="max-w-full max-h-full absolute animate-writing-2 object-contain drop-shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
            <img
              src={getAssetPath('assets/girl-writing3.png')}
              alt="Girl Writing"
              className="max-w-full max-h-full absolute animate-writing-3 object-contain drop-shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
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
