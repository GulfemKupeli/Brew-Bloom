import React, { useState } from 'react';
import { SEEDS } from '../data/seeds';
import { RECIPES } from '../data/recipes';
import BrewingStation from './BrewingStation';
import { getAssetPath } from '../utils/assets';

export default function Kitchen({ inventory, setInventory, brewedDrinks, setBrewedDrinks, showToast }) {
  const [brewingRecipe, setBrewingRecipe] = useState(null);

  const canBrewRecipe = (recipe) => {
    return Object.entries(recipe.ingredients).every(
      ([herb, amount]) => (inventory[herb] || 0) >= amount
    );
  };

  const startBrewing = (recipeId) => {
    const recipe = RECIPES[recipeId];

    if (!canBrewRecipe(recipe)) {
      showToast('Not enough ingredients!', '❌');
      return;
    }

    setBrewingRecipe(recipe);
  };

  const handleBrewingComplete = () => {
    const newInventory = { ...inventory };
    Object.entries(brewingRecipe.ingredients).forEach(([herb, amount]) => {
      newInventory[herb] -= amount;
      if (newInventory[herb] === 0) delete newInventory[herb];
    });
    setInventory(newInventory);

    setBrewedDrinks(prev => ({
      ...prev,
      [brewingRecipe.id]: (prev[brewingRecipe.id] || 0) + 1
    }));

    showToast(`Brewed ${brewingRecipe.name}! ${brewingRecipe.effect}`, '✨');
    setBrewingRecipe(null);
  };

  const handleBrewingCancel = () => {
    setBrewingRecipe(null);
    showToast('Brewing cancelled', '❌');
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">Kitchen</h2>

      {brewingRecipe && (
        <BrewingStation
          recipe={brewingRecipe}
          inventory={inventory}
          onComplete={handleBrewingComplete}
          onCancel={handleBrewingCancel}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div
          className="border-4 border-green-800 p-6 relative min-h-64 border-4 border-green-800 overflow-hidden"
          style={{
            backgroundImage: `url(${getAssetPath('assets/marble.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
          }}
        >
          <h3 className="text-2xl font-bold text-green-800 mb-4 text-center relative z-10">Your Ingredients</h3>
          {Object.keys(inventory).length === 0 ? (
            <p className="text-center text-green-700 font-semibold relative z-10">No herbs yet! Harvest from your garden!</p>
          ) : (
            <div className="grid grid-cols-3 gap-4 relative z-10">
              {Object.entries(inventory).map(([herb, count]) => (
                <div key={herb} className="text-center">
                  <img 
                    src={getAssetPath(`assets/${herb}-grown.png`)}
                    alt={SEEDS[herb].name}
                    className="w-16 h-16 mx-auto mb-1"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="font-bold text-green-800 text-sm">{SEEDS[herb].name}</div>
                  <div className="text-green-700 font-semibold">×{count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="border-4 border-green-800 p-6 relative min-h-64 border-4 border-green-800 overflow-hidden"
          style={{
            backgroundImage: `url(${getAssetPath('assets/marble.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
          }}
        >
          <h3 className="text-2xl font-bold text-green-800 mb-4 text-center relative z-10">Brewed Collection</h3>
          {Object.keys(brewedDrinks).length === 0 ? (
            <p className="text-center text-green-700 font-semibold relative z-10">No drinks brewed yet!</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {Object.entries(brewedDrinks).map(([drinkId, count]) => (
                <div key={drinkId} className="text-center">
                  {RECIPES[drinkId].image ? (
                    <img
                      src={getAssetPath(`assets/${RECIPES[drinkId].image}`)}
                      alt={RECIPES[drinkId].name}
                      className="w-16 h-16 mx-auto mb-1"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <div className="text-3xl mb-1">{RECIPES[drinkId].emoji}</div>
                  )}
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
            const ingredientCount = Object.keys(recipe.ingredients).length;
            const isLargeRecipe = ingredientCount >= 4;
            return (
              <div
                key={recipe.id}
                className={`border-4 border-green-800 px-16 py-8 relative border-4 border-green-800 overflow-hidden ${isLargeRecipe ? 'md:col-span-2' : ''}`}
                style={{
                  backgroundImage: `url(${getAssetPath('assets/marble.png')})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  imageRendering: 'pixelated'
                }}
              >
                <div className="flex items-start gap-3 mb-2 relative z-10">
                  {recipe.image ? (
                    <img
                      src={getAssetPath(`assets/${recipe.image}`)}
                      alt={recipe.name}
                      className="w-20 h-20 flex-shrink-0"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <div className="text-5xl flex-shrink-0">{recipe.emoji}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-2xl font-bold text-green-800 mb-1 leading-tight">{recipe.name}</h4>
                    <p className="text-sm text-green-700 font-semibold leading-snug">{recipe.description}</p>
                  </div>
                </div>
                
                <div className="mb-3 relative z-10">
                  <p className="font-bold text-green-800 mb-2 text-base">Ingredients:</p>
                  <div className="space-y-1">
                    {Object.entries(recipe.ingredients).map(([herb, amount]) => (
                      <div key={herb} className="flex justify-between text-base items-center">
                        <span className="flex items-center gap-2">
                          <img 
                            src={getAssetPath(`assets/${herb}-grown.png`)}
                            alt={SEEDS[herb].name}
                            className="w-4 h-4 flex-shrink-0"
                            style={{ imageRendering: 'pixelated' }}
                          />
                          <span>{SEEDS[herb].name}</span>
                        </span>
                        <span className={`font-bold ${(inventory[herb] || 0) >= amount ? 'text-green-700' : 'text-red-700'}`}>
                          {inventory[herb] || 0}/{amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center text-base text-amber-700 font-bold mb-3 relative z-10 leading-snug">{recipe.effect}</div>
                
                <button
                  onClick={() => startBrewing(recipe.id)}
                  disabled={!canBrew || brewingRecipe !== null}
                  className={`w-full px-4 py-3 border-4 border-green-800 font-bold text-base transition transform hover:scale-105 relative z-10 ${
                    canBrew && brewingRecipe === null
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