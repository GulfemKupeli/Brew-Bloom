import React from 'react';
import { getTextClass, getBorderClass } from '../utils/theme';

export default function Settings({
  focusLength,
  setFocusLength,
  breakLength,
  setBreakLength,
  soundEnabled,
  setSoundEnabled,
  autoStart,
  setAutoStart,
  isDaytime
}) {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className={`text-4xl font-bold ${getTextClass(isDaytime, 'primary')} mb-8 text-center`}>⚙️ Settings</h2>
      
      <div className="bg-white/80 border-4 border-green-800 border-4 border-green-800 p-8 space-y-6">
        <div>
          <label className={`block text-lg font-bold ${getTextClass(isDaytime, 'primary')} mb-2`}>
            Focus Duration (minutes)
          </label>
          <select
            value={focusLength}
            onChange={(e) => setFocusLength(parseInt(e.target.value))}
            className="w-full p-3 border-4 border-green-600 border-4 border-green-800 text-lg font-bold"
          >
            <option value={15}>15 minutes</option>
            <option value={25}>25 minutes (Default)</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>

        <div>
          <label className={`block text-lg font-bold ${getTextClass(isDaytime, 'primary')} mb-2`}>
            Break Duration (minutes)
          </label>
          <select
            value={breakLength}
            onChange={(e) => setBreakLength(parseInt(e.target.value))}
            className="w-full p-3 border-4 border-green-600 border-4 border-green-800 text-lg font-bold"
          >
            <option value={5}>5 minutes (Default)</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className={`text-lg font-bold ${getTextClass(isDaytime, 'primary')}`}>Sound Notifications</label>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-6 py-2 border-4 border-green-800 font-bold transition ${
              soundEnabled ? 'bg-green-600 text-white' : 'bg-gray-400 text-gray-700'
            }`}
          >
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className={`text-lg font-bold ${getTextClass(isDaytime, 'primary')}`}>Auto-start Next Session</label>
          <button
            onClick={() => setAutoStart(!autoStart)}
            className={`px-6 py-2 border-4 border-green-800 font-bold transition ${
              autoStart ? 'bg-green-600 text-white' : 'bg-gray-400 text-gray-700'
            }`}
          >
            {autoStart ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}