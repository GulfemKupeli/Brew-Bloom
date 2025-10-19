import React, { useState } from 'react';
import { SEEDS } from '../data/seeds';
import { RECIPES } from '../data/recipes';
import BrewingStation from './BrewingStation';
import { getAssetPath } from '../utils/assets';
import { getTextClass, getBorderClass } from '../utils/theme';
import { ChefHat, Sparkles, Leaf, Coffee } from 'lucide-react';

export default function Kitchen({ inventory, setInventory, brewedDrinks, setBrewedDrinks, showToast, isDaytime }) {
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
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
          <ChefHat className="w-12 h-12 text-amber-500" />
          Kitchen
          <Coffee className="w-12 h-12 text-orange-600" />
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">Brew magical tea blends from your harvest</p>
      </div>

      {brewingRecipe && (
        <BrewingStation
          recipe={brewingRecipe}
          inventory={inventory}
          onComplete={handleBrewingComplete}
          onCancel={handleBrewingCancel}
        />
      )}

      {/* Inventory and Collection Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Your Ingredients */}
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-3xl p-8 relative shadow-xl border-2 border-white/50 dark:border-white/20 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url(${getAssetPath('assets/marble.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Leaf className="w-6 h-6 text-green-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Your Ingredients
              </h3>
            </div>

            {Object.keys(inventory).length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 font-semibold py-8">
                No herbs yet! Harvest from your garden!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(inventory).map(([herb, count]) => (
                  <div key={herb} className="bg-white/50 dark:bg-black/50 rounded-2xl p-3 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
                    <img
                      src={getAssetPath(`assets/${herb}-grown.png`)}
                      alt={SEEDS[herb].name}
                      className="w-20 h-20 mx-auto mb-2 drop-shadow-lg"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{SEEDS[herb].name}</div>
                    <div className="text-green-600 dark:text-green-400 font-bold text-lg">×{count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Brewed Collection */}
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-3xl p-8 relative shadow-xl border-2 border-white/50 dark:border-white/20 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url(${getAssetPath('assets/marble.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Brewed Collection
              </h3>
            </div>

            {Object.keys(brewedDrinks).length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 font-semibold py-8">
                No drinks brewed yet!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(brewedDrinks).map(([drinkId, count]) => (
                  <div key={drinkId} className="bg-white/50 dark:bg-black/50 rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
                    {RECIPES[drinkId].image ? (
                      <img
                        src={getAssetPath(`assets/${RECIPES[drinkId].image}`)}
                        alt={RECIPES[drinkId].name}
                        className="w-20 h-20 mx-auto mb-2 drop-shadow-lg"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div className="text-4xl mb-2">{RECIPES[drinkId].emoji}</div>
                    )}
                    <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{RECIPES[drinkId].name}</div>
                    <div className="text-amber-600 dark:text-amber-400 font-bold text-lg">×{count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Book */}
      <div>
        <div className="flex items-center justify-center gap-3 mb-8">
          <Coffee className="w-8 h-8 text-amber-500" />
          <h3 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Recipe Book
          </h3>
          <Sparkles className="w-8 h-8 text-orange-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(RECIPES).map(recipe => {
            const canBrew = canBrewRecipe(recipe);
            const ingredientCount = Object.keys(recipe.ingredients).length;
            const isLargeRecipe = ingredientCount >= 4;

            return (
              <div
                key={recipe.id}
                className={`
                  bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-3xl p-8 relative
                  shadow-xl border-2 transition-all duration-300 transform
                  ${canBrew ? 'border-amber-300 dark:border-amber-700 hover:scale-105 hover:shadow-2xl' : 'border-gray-300 dark:border-gray-700 opacity-75'}
                  ${isLargeRecipe ? 'md:col-span-2' : ''}
                  overflow-hidden group
                `}
              >
                {/* Background texture */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `url(${getAssetPath('assets/marble.png')})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  imageRendering: 'pixelated'
                }}></div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    {recipe.image ? (
                      <img
                        src={getAssetPath(`assets/${recipe.image}`)}
                        alt={recipe.name}
                        className="w-24 h-24 flex-shrink-0 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div className="text-6xl flex-shrink-0">{recipe.emoji}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 leading-tight">
                        {recipe.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold leading-snug">
                        {recipe.description}
                      </p>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="mb-4">
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-base flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-500" />
                      Ingredients:
                    </p>
                    <div className="space-y-2">
                      {Object.entries(recipe.ingredients).map(([herb, amount]) => {
                        const hasEnough = (inventory[herb] || 0) >= amount;
                        return (
                          <div key={herb} className="flex justify-between items-center bg-white/50 dark:bg-black/50 rounded-xl px-4 py-2">
                            <span className="flex items-center gap-2">
                              <img
                                src={getAssetPath(`assets/${herb}-grown.png`)}
                                alt={SEEDS[herb].name}
                                className="w-6 h-6 flex-shrink-0"
                                style={{ imageRendering: 'pixelated' }}
                              />
                              <span className="text-gray-800 dark:text-gray-200 font-medium">{SEEDS[herb].name}</span>
                            </span>
                            <span className={`font-bold ${hasEnough ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {inventory[herb] || 0}/{amount}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Effect Badge */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 px-4 py-2 rounded-full">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-purple-700 dark:text-purple-300 font-bold text-sm">
                        {recipe.effect}
                      </span>
                    </div>
                  </div>

                  {/* Brew Button */}
                  <button
                    onClick={() => startBrewing(recipe.id)}
                    disabled={!canBrew || brewingRecipe !== null}
                    className={`
                      w-full px-6 py-4 rounded-2xl font-bold text-lg transition-all transform
                      shadow-lg flex items-center justify-center gap-2
                      ${canBrew && brewingRecipe === null
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:scale-105 active:scale-95'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <ChefHat className="w-5 h-5" />
                    {canBrew ? 'Brew Now' : 'Locked'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
