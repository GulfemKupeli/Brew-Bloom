import React, { useState } from 'react';
import { SEEDS } from '../data/seeds';
import { RECIPES } from '../data/recipes';

export default function Kitchen({ inventory, setInventory, brewedDrinks, setBrewedDrinks, showToast }) {
  const [brewing, setBrewing] = useState(false);

  const canBrewRecipe = (recipe) => {
    return Object.entries(recipe.ingredients).every(
      ([herb, amount]) => (inventory[herb] || 0) >= amount
    );
  };

  const brewRecipe = (recipeId) => {
    const recipe = RECIPES[recipeId];
    
    if (!canBrewRecipe(recipe)) {
      showToast('Not enough ingredients!', '❌');
      return;
    }

    setBrewing(true);
    
    setTimeout(() => {
      const newInventory = { ...inventory };
      Object.entries(recipe.ingredients).forEach(([herb, amount]) => {
        newInventory[herb] -= amount;
        if (newInventory[herb] === 0) delete newInventory[herb];
      });
      setInventory(newInventory);

      setBrewedDrinks(prev => ({
        ...prev,
        [recipeId]: (prev[recipeId] || 0) + 1
      }));

      setBrewing(false);
      showToast(`Brewed ${recipe.name}! ${recipe.effect}`, '✨');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">Kitchen</h2>
      
      {brewing && (
        <div className="bg-amber-200 border-4 border-amber-600 rounded-lg p-6 mb-6 text-center animate-pulse">
          <p className="text-2xl font-bold text-green-800">Brewing...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div 
          className="rounded-lg p-6 relative min-h-64"
          style={{
            backgroundImage: 'url(/assets/square-sign.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
          }}
        >
          <h3 className="text-2xl font-bold text-green-800 mb-4 text-center relative z-10">Your Ingredients</h3>
          {Object.keys(inventory).length === 0 ? (
            <p className="text-center text-green-600 relative z-10">No herbs yet! Harvest from your garden!</p>
          ) : (
            <div className="grid grid-cols-3 gap-4 relative z-10">
              {Object.entries(inventory).map(([herb, count]) => (
                <div key={herb} className="text-center">
                  <img 
                    src={`/assets/${herb}-grown.png`}
                    alt={SEEDS[herb].name}
                    className="w-16 h-16 mx-auto mb-1"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="font-bold text-green-800 text-sm">{SEEDS[herb].name}</div>
                  <div className="text-green-600">×{count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div 
          className="rounded-lg p-6 relative min-h-64"
          style={{
            backgroundImage: 'url(/assets/square-sign.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
          }}
        >
          <h3 className="text-2xl font-bold text-green-800 mb-4 text-center relative z-10">Brewed Collection</h3>
          {Object.keys(brewedDrinks).length === 0 ? (
            <p className="text-center text-green-600 relative z-10">No drinks brewed yet!</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {Object.entries(brewedDrinks).map(([drinkId, count]) => (
                <div key={drinkId} className="text-center">
                  <div className="text-3xl mb-1">{RECIPES[drinkId].emoji}</div>
                  <div className="font-bold text-green-800 text-sm">{RECIPES[drinkId].name}</div>
                  <div className="text-amber-600">×{count}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-green-800 mb-6 text-center">Recipe Book</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(RECIPES).map(recipe => {
            const canBrew = canBrewRecipe(recipe);
            return (
              <div 
                key={recipe.id} 
                className="rounded-xl px-6 py-6 relative"
                style={{
                  backgroundImage: 'url(/assets/square-sign.png)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  imageRendering: 'pixelated'
                }}
              >
                <div className="flex items-start gap-3 mb-2 relative z-10">
                  <div className="text-4xl flex-shrink-0">{recipe.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-green-800 mb-0.5 leading-tight">{recipe.name}</h4>
                    <p className="text-xs text-green-600 leading-snug">{recipe.description}</p>
                  </div>
                </div>
                
                <div className="mb-2 relative z-10">
                  <p className="font-bold text-green-800 mb-1 text-sm">Ingredients:</p>
                  <div className="space-y-0.5">
                    {Object.entries(recipe.ingredients).map(([herb, amount]) => (
                      <div key={herb} className="flex justify-between text-sm items-center">
                        <span className="flex items-center gap-2">
                          <img 
                            src={`/assets/${herb}-grown.png`}
                            alt={SEEDS[herb].name}
                            className="w-4 h-4 flex-shrink-0"
                            style={{ imageRendering: 'pixelated' }}
                          />
                          <span>{SEEDS[herb].name}</span>
                        </span>
                        <span className={`font-bold ${(inventory[herb] || 0) >= amount ? 'text-green-600' : 'text-red-600'}`}>
                          {inventory[herb] || 0}/{amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center text-sm text-amber-700 font-bold mb-2 relative z-10 leading-snug">{recipe.effect}</div>
                
                <button
                  onClick={() => brewRecipe(recipe.id)}
                  disabled={!canBrew || brewing}
                  className={`w-full px-4 py-2.5 rounded-lg font-bold text-sm transition transform hover:scale-105 relative z-10 ${
                    canBrew && !brewing
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  {canBrew ? 'Brew' : 'Locked'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}