import React from 'react';
import { ACHIEVEMENTS } from '../data/achievements';
import { getTextClass, getBorderClass } from '../utils/theme';

export default function Stats({ stats, unlockedAchievements, isDaytime }) {
  const achievementsList = Object.values(ACHIEVEMENTS);
  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievementsList.length;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className={`text-4xl font-bold ${getTextClass(isDaytime, 'primary')} mb-8 text-center`}>Stats & Achievements</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/80 border-4 border-green-800 border-4 border-green-700 p-6 text-center">
          <div className="text-4xl mb-2">⏱️</div>
          <div className={`text-3xl font-bold ${getTextClass(isDaytime, 'primary')}`}>{stats.totalSessions}</div>
          <div className={`text-sm ${getTextClass(isDaytime, 'tertiary')}`}>Total Sessions</div>
        </div>
        <div className="bg-white/80 border-4 border-green-800 border-4 border-green-700 p-6 text-center">
          <div className="text-4xl mb-2">🌱</div>
          <div className={`text-3xl font-bold ${getTextClass(isDaytime, 'primary')}`}>{stats.totalPlanted}</div>
          <div className={`text-sm ${getTextClass(isDaytime, 'tertiary')}`}>Seeds Planted</div>
        </div>
        <div className="bg-white/80 border-4 border-green-800 border-4 border-green-700 p-6 text-center">
          <div className="text-4xl mb-2">✂️</div>
          <div className={`text-3xl font-bold ${getTextClass(isDaytime, 'primary')}`}>{stats.totalHarvested}</div>
          <div className={`text-sm ${getTextClass(isDaytime, 'tertiary')}`}>Herbs Harvested</div>
        </div>
        <div className="bg-white/80 border-4 border-green-800 border-4 border-green-700 p-6 text-center">
          <div className="text-4xl mb-2">☕</div>
          <div className={`text-3xl font-bold ${getTextClass(isDaytime, 'primary')}`}>{stats.totalBrewed}</div>
          <div className={`text-sm ${getTextClass(isDaytime, 'tertiary')}`}>Drinks Brewed</div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className={`text-3xl font-bold ${getTextClass(isDaytime, 'primary')} mb-4 text-center`}>
          Achievements ({unlockedCount}/{totalCount})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievementsList.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`border-4 border-green-800 border-4 p-6 text-center transition ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-amber-500'
                    : 'bg-gray-200 border-gray-400 opacity-50'
                }`}
              >
                <div className="text-5xl mb-2">{achievement.emoji}</div>
                <div className={`font-bold ${getTextClass(isDaytime, 'primary')} text-sm mb-1`}>{achievement.name}</div>
                <div className={`text-xs ${getTextClass(isDaytime, 'tertiary')}`}>{achievement.description}</div>
                {isUnlocked && <div className="mt-2 text-amber-600 font-bold text-xs">UNLOCKED!</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}