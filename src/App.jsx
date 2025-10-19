import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Timer from './components/Timer';
import Garden from './components/Garden';
import GardenGame from './components/GardenGame';
import Shop from './components/Shop';
import Kitchen from './components/Kitchen';
import Inventory from './components/Inventory';
import Settings from './components/Settings';
import Stats from './components/Stats';
import DataManagement from './components/DataManagement';
import { useDayNight, DayNightIndicator } from './components/DayNightCycle';
import { ACHIEVEMENTS } from './data/achievements';
import Toast from './components/Toast';
import { getAssetPath } from './utils/assets';

export default function App() {
  const [currentPage, setCurrentPage] = useState('timer');
  const [toast, setToast] = useState(null);

  const showToast = (message, emoji = '✅') => {
  setToast({ message, emoji });
  };
  const { isDaytime, toggleDayNight } = useDayNight();
  
  // Timer & Game States
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('brewBloomCoins');
    return saved ? parseInt(saved) : 250;
  });
  
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const [totalFocusTime, setTotalFocusTime] = useState(() => {
    const saved = localStorage.getItem('brewBloomFocusTime');
    return saved ? parseInt(saved) : 0;
  });

  // Settings States
  const [focusLength, setFocusLength] = useState(() => {
    const saved = localStorage.getItem('brewBloomFocusLength');
    return saved ? parseInt(saved) : 25;
  });
  
  const [breakLength, setBreakLength] = useState(() => {
    const saved = localStorage.getItem('brewBloomBreakLength');
    return saved ? parseInt(saved) : 5;
  });
  
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('brewBloomSoundEnabled');
    return saved ? saved === 'true' : true;
  });
  
  const [autoStart, setAutoStart] = useState(() => {
    const saved = localStorage.getItem('brewBloomAutoStart');
    return saved ? saved === 'true' : false;
  });

  // Garden States
  const [garden, setGarden] = useState(() => {
    const saved = localStorage.getItem('brewBloomGarden');
    return saved ? JSON.parse(saved) : Array(9).fill(null).map((_, i) => ({
      id: i,
      seedType: null,
      stage: 0,
      wateredCount: 0
    }));
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('brewBloomInventory');
    return saved ? JSON.parse(saved) : {};
  });

  const [brewedDrinks, setBrewedDrinks] = useState(() => {
    const saved = localStorage.getItem('brewBloomBrewedDrinks');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedSeed, setSelectedSeed] = useState(null);

  // Stats & Achievements
  const [seedInventory, setSeedInventory] = useState(() => {
  const saved = localStorage.getItem('brewBloomSeedInventory');
  return saved ? JSON.parse(saved) : {};
});
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('brewBloomStats');
    return saved ? JSON.parse(saved) : {
      totalSessions: 0,
      totalPlanted: 0,
      totalHarvested: 0,
      totalBrewed: 0,
      maxCoins: 50,
      uniqueRecipes: 0,
      uniqueHerbsHarvested: 0,
      fullGardenAchieved: false
    };
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const saved = localStorage.getItem('brewBloomAchievements');
    return saved ? JSON.parse(saved) : [];
  });

  // Update stats when actions happen
  useEffect(() => {
    const newStats = {
      totalSessions: totalFocusTime / focusLength,
      totalPlanted: stats.totalPlanted,
      totalHarvested: Object.values(inventory).reduce((sum, count) => sum + count, 0) + stats.totalHarvested,
      totalBrewed: Object.values(brewedDrinks).reduce((sum, count) => sum + count, 0),
      maxCoins: Math.max(stats.maxCoins, coins),
      uniqueRecipes: Object.keys(brewedDrinks).length,
      uniqueHerbsHarvested: Object.keys(inventory).length,
      fullGardenAchieved: garden.every(plot => plot.seedType !== null) || stats.fullGardenAchieved
    };
    setStats(newStats);
  }, [totalFocusTime, inventory, brewedDrinks, coins, garden]);

  // Check achievements
  useEffect(() => {
    const newUnlocked = [];
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (achievement.check(stats) && !unlockedAchievements.includes(achievement.id)) {
        newUnlocked.push(achievement.id);
      }
    });
    
    if (newUnlocked.length > 0) {
  setUnlockedAchievements(prev => [...prev, ...newUnlocked]);
  newUnlocked.forEach(id => {
    const achievement = ACHIEVEMENTS[id];
    setTimeout(() => {
      showToast(`Achievement Unlocked: ${achievement.name}!`, achievement.emoji);
    }, 500);
  });
}
  }, [stats]);

  // Track planting
  useEffect(() => {
    const planted = garden.filter(plot => plot.seedType !== null).length;
    if (planted > 0 && stats.totalPlanted === 0) {
      setStats(prev => ({ ...prev, totalPlanted: 1 }));
    }
  }, [garden]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('brewBloomCoins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('brewBloomFocusTime', totalFocusTime.toString());
  }, [totalFocusTime]);

  useEffect(() => {
    localStorage.setItem('brewBloomGarden', JSON.stringify(garden));
  }, [garden]);

  useEffect(() => {
    localStorage.setItem('brewBloomInventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('brewBloomBrewedDrinks', JSON.stringify(brewedDrinks));
  }, [brewedDrinks]);

  useEffect(() => {
    localStorage.setItem('brewBloomFocusLength', focusLength.toString());
  }, [focusLength]);

  useEffect(() => {
    localStorage.setItem('brewBloomBreakLength', breakLength.toString());
  }, [breakLength]);

  useEffect(() => {
    localStorage.setItem('brewBloomSoundEnabled', soundEnabled.toString());
  }, [soundEnabled]);
  
  useEffect(() => {
  localStorage.setItem('brewBloomSeedInventory', JSON.stringify(seedInventory));
}, [seedInventory]);

  useEffect(() => {
    localStorage.setItem('brewBloomAutoStart', autoStart.toString());
  }, [autoStart]);

  useEffect(() => {
    localStorage.setItem('brewBloomStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('brewBloomAchievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  return (
    <div
      className="min-h-screen transition-colors duration-1000"
      style={{
        backgroundImage: `url(${getAssetPath(isDaytime ? 'assets/background.png' : 'assets/dark-background.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <DayNightIndicator isDaytime={isDaytime} onToggle={toggleDayNight} />
      <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'timer' && (
        <Timer
          coins={coins}
          sessionsCompleted={sessionsCompleted}
          totalFocusTime={totalFocusTime}
          setCoins={setCoins}
          setSessionsCompleted={setSessionsCompleted}
          setTotalFocusTime={setTotalFocusTime}
          focusLength={focusLength}
          breakLength={breakLength}
          soundEnabled={soundEnabled}
          autoStart={autoStart}
          brewedDrinks={brewedDrinks}
          setBrewedDrinks={setBrewedDrinks}
          showToast={showToast}
          isDaytime={isDaytime}
        />
      )}

      {currentPage === 'shop' && (
  <Shop
    coins={coins}
    setCoins={setCoins}
    setSelectedSeed={setSelectedSeed}
    showToast={showToast}
    seedInventory={seedInventory}
    setSeedInventory={setSeedInventory}
    isDaytime={isDaytime}
  />
)}

{currentPage === 'garden' && (
  <GardenGame
    showToast={showToast}
    setInventory={setInventory}
    seedInventory={seedInventory}
    setSeedInventory={setSeedInventory}
    isDaytime={isDaytime}
  />
)}

{currentPage === 'garden-old' && (
  <Garden
    garden={garden}
    setGarden={setGarden}
    selectedSeed={selectedSeed}
    setSelectedSeed={setSelectedSeed}
    setInventory={setInventory}
    showToast={showToast}
    seedInventory={seedInventory}
    setSeedInventory={setSeedInventory}
    isDaytime={isDaytime}
  />
)}

      {currentPage === 'kitchen' && (
        <Kitchen
          inventory={inventory}
          setInventory={setInventory}
          brewedDrinks={brewedDrinks}
          setBrewedDrinks={setBrewedDrinks}
          showToast={showToast}
          isDaytime={isDaytime}
        />
      )}

      {currentPage === 'inventory' && (
        <Inventory inventory={inventory} isDaytime={isDaytime} />
      )}

      {currentPage === 'settings' && (
        <Settings
          focusLength={focusLength}
          setFocusLength={setFocusLength}
          breakLength={breakLength}
          setBreakLength={setBreakLength}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          autoStart={autoStart}
          setAutoStart={setAutoStart}
          isDaytime={isDaytime}
        />
      )}

      {currentPage === 'stats' && (
        <Stats stats={stats} unlockedAchievements={unlockedAchievements} isDaytime={isDaytime} />
      )}

      {currentPage === 'data' && (
        <DataManagement isDaytime={isDaytime} />
      )}
      {toast && (
      <Toast
        message={toast.message}
        emoji={toast.emoji}
        onClose={() => setToast(null)}
        isDaytime={isDaytime}
      />
    )}
    </div>
  );
}
