import React from 'react';
import { ACHIEVEMENTS } from '../data/achievements';

export default function Stats({ stats, unlockedAchievements }) {
  const achievementsList = Object.values(ACHIEVEMENTS);
  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievementsList.length;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-4xl font-bold text-green-800 mb-8 text-center">Stats & Achievements</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/80 border-4 border-green-800 border-4 border-green-700 p-6 text-center">
          <div className="text-4xl mb-2">⏱️</div>
          <div className="text-3xl font-bold text-green-800">{stats.totalSessions}</div>
          <div className="text-sm text-green-600">Total Sessions</div>
        </div>
        <div className="bg-white/80 border-4 border-green-800 border-4 border-green-700 p-6 text-center">
          <div className="text-4xl mb-2">🌱</div>
          <div className="text-3xl font-bold text-green-800">{stats.totalPlanted}</div>
          <div className="text-sm text-green-600">Seeds Planted</div>
        </div>
        <div className="bg-white/80 border-4 border-green-800 border-4 border-green-700 p-6 text-center">
          <div className="text-4xl mb-2">✂️</div>
          <div className="text-3xl font-bold text-green-800">{stats.totalHarvested}</div>
          <div className="text-sm text-green-600">Herbs Harvested</div>
        </div>
        <div className="bg-white/80 border-4 border-green-800 border-4 border-green-700 p-6 text-center">
          <div className="text-4xl mb-2">☕</div>
          <div className="text-3xl font-bold text-green-800">{stats.totalBrewed}</div>
          <div className="text-sm text-green-600">Drinks Brewed</div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-3xl font-bold text-green-800 mb-4 text-center">
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
                <div className="font-bold text-green-800 text-sm mb-1">{achievement.name}</div>
                <div className="text-xs text-green-600">{achievement.description}</div>
                {isUnlocked && <div className="mt-2 text-amber-600 font-bold text-xs">UNLOCKED!</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}