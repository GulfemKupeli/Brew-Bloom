import React, { useState, useEffect } from 'react';
import { SEEDS } from '../data/seeds';
import { getAssetPath } from '../utils/assets';

export default function BrewingStation({ recipe, inventory, onComplete, onCancel }) {
  const [brewingStep, setBrewingStep] = useState(0);
  const [cupFillLevel, setCupFillLevel] = useState(0);
  const [addedIngredients, setAddedIngredients] = useState([]);
  const [isPouring, setIsPouring] = useState(false);
  const [showSteam, setShowSteam] = useState(false);

  const ingredients = Object.entries(recipe.ingredients);
  const totalSteps = ingredients.length + 2; // ingredients + heating + complete

  useEffect(() => {
    if (brewingStep === 0) {
      // Start brewing automatically
      setTimeout(() => {
        setBrewingStep(1);
      }, 500);
    } else if (brewingStep > 0 && brewingStep <= ingredients.length) {
      // Add ingredient animation
      setIsPouring(true);
      setTimeout(() => {
        const [herb, amount] = ingredients[brewingStep - 1];
        setAddedIngredients(prev => [...prev, herb]);
        setCupFillLevel(prev => Math.min(100, prev + (100 / ingredients.length)));
        setIsPouring(false);

        setTimeout(() => {
          setBrewingStep(prev => prev + 1);
        }, 800);
      }, 1500);
    } else if (brewingStep === ingredients.length + 1) {
      // Heating step
      setShowSteam(true);
      setTimeout(() => {
        setBrewingStep(prev => prev + 1);
      }, 2000);
    } else if (brewingStep === ingredients.length + 2) {
      // Complete
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [brewingStep, ingredients.length, onComplete]);

  const getCurrentStepText = () => {
    if (brewingStep === 0) return 'Preparing brewing station...';
    if (brewingStep <= ingredients.length) {
      const [herb, amount] = ingredients[brewingStep - 1];
      return `Adding ${SEEDS[herb].name} (${amount}x)...`;
    }
    if (brewingStep === ingredients.length + 1) return 'Heating and mixing...';
    return 'Brewing complete!';
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 p-8 bg-amber-100 border-8 border-green-800 border-4 border-green-800">
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-green-800 mb-2">
              Brewing {recipe.name}
            </h2>
            <div className="text-sm text-green-600">
              Step {brewingStep} of {totalSteps}
            </div>
          </div>

          {/* Brewing Area */}
          <div className="flex justify-center items-end mb-6 h-64 relative">
            {/* Ingredient being poured */}
            {isPouring && brewingStep <= ingredients.length && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce">
                <img
                  src={getAssetPath(`assets/${ingredients[brewingStep - 1][0]}-grown.png`)}
                  alt="Ingredient"
                  className="w-16 h-16"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="w-1 h-32 bg-green-400 mx-auto opacity-60 animate-pulse"></div>
              </div>
            )}

            {/* Cup/Pot */}
            <div className="relative">
              {/* Steam effect */}
              {showSteam && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <div className="text-4xl animate-pulse opacity-60">💨</div>
                  <div className="text-4xl animate-pulse opacity-40" style={{ animationDelay: '0.3s' }}>💨</div>
                  <div className="text-4xl animate-pulse opacity-50" style={{ animationDelay: '0.6s' }}>💨</div>
                </div>
              )}

              {/* The cup */}
              <div className="relative w-32 h-40 border-8 border-amber-900 bg-white rounded-b-3xl overflow-hidden">
                {/* Liquid fill */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-1000"
                  style={{ height: `${cupFillLevel}%` }}
                >
                  {/* Bubbles */}
                  {showSteam && (
                    <>
                      <div className="absolute top-2 left-4 w-2 h-2 bg-amber-200 border-4 border-green-800 animate-ping"></div>
                      <div className="absolute top-4 right-6 w-2 h-2 bg-amber-200 border-4 border-green-800 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute top-6 left-8 w-2 h-2 bg-amber-200 border-4 border-green-800 animate-ping" style={{ animationDelay: '1s' }}></div>
                    </>
                  )}
                </div>

                {/* Ingredients floating in cup */}
                <div className="absolute inset-0 flex flex-wrap gap-1 p-2 items-end justify-center">
                  {addedIngredients.map((herb, idx) => (
                    <img
                      key={idx}
                      src={getAssetPath(`assets/${herb}-grown.png`)}
                      alt={SEEDS[herb].name}
                      className="w-6 h-6 opacity-70"
                      style={{
                        imageRendering: 'pixelated',
                        animation: `float ${2 + idx * 0.5}s ease-in-out infinite`,
                        animationDelay: `${idx * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Cup handle */}
              <div className="absolute right-0 top-8 w-8 h-12 border-8 border-amber-900 border-l-0 rounded-r-full"></div>
            </div>
          </div>

          {/* Progress text */}
          <div className="text-center mb-6">
            <div className="text-lg font-bold text-green-800 mb-3">
              {getCurrentStepText()}
            </div>

            {/* Progress bar */}
            <div className="w-full h-6 bg-green-200 border-4 border-green-800 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(brewingStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Ingredient list */}
          <div className="bg-amber-100/80 border-4 border-green-800 p-4 mb-4">
            <div className="text-sm font-bold text-green-800 mb-2">Recipe:</div>
            <div className="grid grid-cols-2 gap-2">
              {ingredients.map(([herb, amount], idx) => (
                <div
                  key={herb}
                  className={`flex items-center gap-2 text-sm transition-all ${
                    idx < brewingStep ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <img
                    src={getAssetPath(`assets/${herb}-grown.png`)}
                    alt={SEEDS[herb].name}
                    className="w-6 h-6"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <span className={idx < brewingStep ? 'line-through text-green-600' : 'text-green-800'}>
                    {SEEDS[herb].name} x{amount}
                  </span>
                  {idx < brewingStep && <span className="text-green-600">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Cancel button */}
          <div className="text-center">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold border-4 border-red-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
