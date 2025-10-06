import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Sprout } from 'lucide-react';
import { getAssetPath } from '../utils/assets';

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
  showToast
}) {
  const [minutes, setMinutes] = useState(DEBUG_MODE ? 0 : focusLength);
  const [seconds, setSeconds] = useState(DEBUG_MODE ? 10 : 0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

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
      const coinsEarned = 10;
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

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2 flex items-center justify-center gap-3">
          <Sprout className="w-12 h-12" />
          Brew & Bloom
          <Coffee className="w-12 h-12" />
        </h1>
        <p className="text-green-700 text-lg">Grow your focus, bloom your garden</p>
      </div>

      <div className="bg-white/80 backdrop-blur border-4 border-green-800 shadow-lg p-4 mb-8 border-4 border-green-800">
        <div className="flex justify-around items-center text-center">
          <div>
            <div className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-2">
              <img
                src={getAssetPath('assets/coin.png')}
                alt="Coin"
                className="w-8 h-8"
                style={{ imageRendering: 'pixelated' }}
              />
              {coins}
            </div>
            <div className="text-sm text-green-700">Coins</div>
          </div>
          <div className="w-px h-12 bg-green-300"></div>
          <div>
            <div className="text-3xl font-bold text-green-600">🍃 {sessionsCompleted}</div>
            <div className="text-sm text-green-700">Sessions Today</div>
          </div>
          <div className="w-px h-12 bg-green-300"></div>
          <div>
            <div className="text-3xl font-bold text-blue-600">⏱️ {totalFocusTime}m</div>
            <div className="text-sm text-green-700">Total Focus Time</div>
          </div>
        </div>
      </div>

      <div
        className="border-4 border-green-800 shadow-2xl p-12 border-8 border-green-800 relative overflow-hidden bg-amber-100"
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
                    className="w-6 h-6"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  10
                </span>!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}