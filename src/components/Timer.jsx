import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Sprout } from 'lucide-react';

const DEBUG_MODE = true; // Set to false for normal use

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

      <div className="bg-white/80 backdrop-blur rounded-lg shadow-lg p-4 mb-8 border-4 border-green-800">
        <div className="flex justify-around items-center text-center">
          <div>
            <div className="text-3xl font-bold text-amber-600">🪙 {coins}</div>
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

      <div className="bg-gradient-to-br from-amber-100 to-green-100 rounded-2xl shadow-2xl p-12 border-8 border-green-800 relative overflow-hidden">
        <div className="absolute top-4 left-4 text-4xl">🪴</div>
        <div className="absolute top-4 right-4 text-4xl">🌿</div>
        <div className="absolute bottom-4 left-8 text-4xl">🌱</div>
        <div className="absolute bottom-4 right-8 text-4xl">☕</div>

        <div className="text-center mb-6">
          <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${
            isBreak ? 'bg-blue-500 text-white' : 'bg-green-600 text-white'
          }`}>
            {isBreak ? '☕ Break Time' : '🌱 Focus Time'}
          </div>
        </div>

        <div className="text-center">
          <div className="text-9xl font-bold text-green-800 mb-8 font-mono tracking-wider drop-shadow-lg">
            {formatTime(minutes, seconds)}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-64 h-8 bg-green-200 rounded-full border-4 border-green-800 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                isBreak ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{
                width: `${((isBreak ? breakLength : focusLength) - minutes - (seconds > 0 ? 1 : 0)) / (isBreak ? breakLength : focusLength) * 100}%`
              }}
            ></div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
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
            className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
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
              className="flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Skip Break
            </button>
          )}
        </div>

        {!isBreak && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-amber-200 border-4 border-amber-600 rounded-lg px-6 py-3">
              <p className="text-green-800 font-bold">
                🪙 Complete this session to earn <span className="text-amber-700 text-xl">10 coins</span>!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}