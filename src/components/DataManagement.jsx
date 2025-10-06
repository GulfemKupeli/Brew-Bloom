import React from 'react';

export default function DataManagement() {
  
  const exportData = () => {
    const data = {
      coins: localStorage.getItem('brewBloomCoins'),
      focusTime: localStorage.getItem('brewBloomFocusTime'),
      garden: localStorage.getItem('brewBloomGarden'),
      inventory: localStorage.getItem('brewBloomInventory'),
      brewedDrinks: localStorage.getItem('brewBloomBrewedDrinks'),
      stats: localStorage.getItem('brewBloomStats'),
      achievements: localStorage.getItem('brewBloomAchievements'),
      settings: {
        focusLength: localStorage.getItem('brewBloomFocusLength'),
        breakLength: localStorage.getItem('brewBloomBreakLength'),
        soundEnabled: localStorage.getItem('brewBloomSoundEnabled'),
        autoStart: localStorage.getItem('brewBloomAutoStart')
      }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brew-bloom-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Data exported successfully!');
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          Object.entries(data).forEach(([key, value]) => {
            if (key === 'settings') {
              Object.entries(value).forEach(([settingKey, settingValue]) => {
                localStorage.setItem(`brewBloom${settingKey.charAt(0).toUpperCase() + settingKey.slice(1)}`, settingValue);
              });
            } else {
              localStorage.setItem(`brewBloom${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
            }
          });
          alert('Data imported! Please refresh the page.');
          window.location.reload();
        } catch (error) {
          alert('Error importing data. Make sure the file is valid.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure? This will delete ALL your progress!')) {
      if (window.confirm('Really sure? This cannot be undone!')) {
        localStorage.clear();
        alert('Progress reset! Refreshing page...');
        window.location.reload();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-4xl font-bold text-green-800 mb-8 text-center">Data Management</h2>
      
      <div className="bg-white/80 border-4 border-green-800 border-4 border-green-800 p-8 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-green-800 mb-4">Backup & Restore</h3>
          <div className="space-y-4">
            <button
              onClick={exportData}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white border-4 border-green-800 font-bold text-lg transition transform hover:scale-105"
            >
              Export Data (Download Backup)
            </button>
            <button
              onClick={importData}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white border-4 border-green-800 font-bold text-lg transition transform hover:scale-105"
            >
              Import Data (Restore Backup)
            </button>
          </div>
        </div>

        <div className="border-t-4 border-red-300 pt-6">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Danger Zone</h3>
          <button
            onClick={resetProgress}
            className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white border-4 border-green-800 font-bold text-lg transition transform hover:scale-105"
          >
            Reset All Progress
          </button>
          <p className="text-sm text-gray-600 mt-2 text-center">
            This will delete all your data permanently!
          </p>
        </div>
      </div>
    </div>
  );
}