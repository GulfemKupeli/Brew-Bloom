import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getAssetPath } from '../utils/assets';

// Grid configuration - optimized to fit screen without scrolling
const GRID_WIDTH = 11; // Odd number for center tree
const GRID_HEIGHT = 7; // Fewer rows to fit screen
const TILE_SIZE = 100; // Adjusted for perfect fit
const CHARACTER_SIZE = 130; // Bigger character
const TREE_SIZE = 300; // 3x3 tiles (3 * 100px)
const TREE_CENTER = { x: 5, y: 3 }; // Center position of tree

// Tile types
const TILE_TYPES = {
  GRASS: 'grass',
  PATH: 'path',
  TILLED_SOIL: 'tilled_soil',
  TILLED_SOIL_WATERED: 'tilled_soil_watered',
};

// Tools - simplified
const TOOLS = {
  NONE: 'none',
  HOE: 'hoe',
  SEEDBAG: 'seedbag',
  WATERING_CAN: 'watering_can',
  SCISSORS: 'scissors',
};

// Character directions
const DIRECTIONS = {
  DOWN: 'down',
  UP: 'up',
  LEFT: 'left',
  RIGHT: 'right',
};

// Plant growth stages
const PLANT_STAGES = {
  SEEDLING: 0,
  GROWTH1: 1,
  GROWTH2: 2,
  MATURE: 3,
};

// Initialize grid with beautiful garden layout
const createInitialGrid = () => {
  const grid = [];
  const centerX = Math.floor(GRID_WIDTH / 2); // 5
  const centerY = Math.floor(GRID_HEIGHT / 2); // 3

  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      let type = TILE_TYPES.GRASS;
      let hasFlowers = false;

      // Force all 9 tiles under the tree to be GRASS FIRST (3x3 area)
      const treeMinX = TREE_CENTER.x - 1; // 4
      const treeMaxX = TREE_CENTER.x + 1; // 6
      const treeMinY = TREE_CENTER.y - 1; // 2
      const treeMaxY = TREE_CENTER.y + 1; // 4

      if (x >= treeMinX && x <= treeMaxX && y >= treeMinY && y <= treeMaxY) {
        type = TILE_TYPES.GRASS;
      }

      // THEN add paths (will override grass where needed)
      // Horizontal path through middle (full width)
      if (y === centerY) {
        type = TILE_TYPES.PATH;
      }

      // Vertical paths branching upward and downward
      if (x === 2 || x === GRID_WIDTH - 3) {
        // Extend from top to bottom through the center path
        type = TILE_TYPES.PATH;
      }

      // Randomly add flowers to grass tiles (30% chance)
      if (type === TILE_TYPES.GRASS && Math.random() < 0.3) {
        hasFlowers = true;
      }

      row.push({
        type: type,
        hasFlowers: hasFlowers,
        plant: null,
        plantType: null,
        growthStage: 0,
        watered: false,
        harvestable: false,
        plantedTime: null,
      });
    }
    grid.push(row);
  }
  return grid;
};

export default function GardenGame({
  showToast,
  setInventory,
  seedInventory,
  setSeedInventory,
  isDaytime
}) {
  const [grid, setGrid] = useState(createInitialGrid());
  const [characterPos, setCharacterPos] = useState({ x: 2, y: 3 }); // Start on path
  const [characterDirection, setCharacterDirection] = useState(DIRECTIONS.RIGHT);
  const [isWalking, setIsWalking] = useState(false);
  const [selectedTool, setSelectedTool] = useState(TOOLS.NONE);
  const [walkFrame, setWalkFrame] = useState(0);
  const [isWatering, setIsWatering] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState(null);

  const keysPressed = useRef({});
  const gameLoopRef = useRef(null);
  const walkAnimationRef = useRef(null);

  // Check if tile is walkable
  const isWalkable = useCallback((x, y) => {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;

    const tile = grid[y][x];

    // Can't walk on tiles with plants
    if (tile.plant) return false;

    // Can't walk under the tree EXCEPT on path tiles
    const treeMinX = TREE_CENTER.x - 1;
    const treeMaxX = TREE_CENTER.x + 1;
    const treeMinY = TREE_CENTER.y - 1;
    const treeMaxY = TREE_CENTER.y + 1;

    if (x >= treeMinX && x <= treeMaxX && y >= treeMinY && y <= treeMaxY) {
      // Allow walking on path tiles behind the tree
      if (tile.type === TILE_TYPES.PATH) {
        return true;
      }
      return false;
    }

    // Can walk on paths, tilled soil, and grass
    return true;
  }, [grid]);

  // Get the tile in front of the character based on facing direction
  const getFacingTile = useCallback(() => {
    let targetX = characterPos.x;
    let targetY = characterPos.y;

    switch (characterDirection) {
      case DIRECTIONS.UP:
        targetY -= 1;
        break;
      case DIRECTIONS.DOWN:
        targetY += 1;
        break;
      case DIRECTIONS.LEFT:
        targetX -= 1;
        break;
      case DIRECTIONS.RIGHT:
        targetX += 1;
        break;
    }

    if (targetX < 0 || targetX >= GRID_WIDTH || targetY < 0 || targetY >= GRID_HEIGHT) {
      return null;
    }

    return { x: targetX, y: targetY };
  }, [characterPos, characterDirection]);

  // Handle character movement with WASD and tool use with E
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'e'].includes(key)) {
        e.preventDefault();
        keysPressed.current[key] = true;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'e'].includes(key)) {
        keysPressed.current[key] = false;

        // Handle E key for tool use
        if (key === 'e') {
          useTool();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [characterPos, selectedTool, selectedSeed, characterDirection, grid]);

  // Movement loop
  useEffect(() => {
    const moveInterval = setInterval(() => {
      let newX = characterPos.x;
      let newY = characterPos.y;
      let moved = false;
      let newDirection = characterDirection;

      if (keysPressed.current['w']) {
        newY -= 1;
        newDirection = DIRECTIONS.UP;
        moved = true;
      } else if (keysPressed.current['s']) {
        newY += 1;
        newDirection = DIRECTIONS.DOWN;
        moved = true;
      }

      if (keysPressed.current['a']) {
        newX -= 1;
        newDirection = DIRECTIONS.LEFT;
        moved = true;
      } else if (keysPressed.current['d']) {
        newX += 1;
        newDirection = DIRECTIONS.RIGHT;
        moved = true;
      }

      if (moved) {
        if (isWalkable(newX, newY)) {
          setCharacterPos({ x: newX, y: newY });
        }
        setCharacterDirection(newDirection);
        setIsWalking(true);
      } else {
        setIsWalking(false);
      }
    }, 300); // Slower movement speed (300ms instead of 200ms)

    return () => clearInterval(moveInterval);
  }, [characterPos, characterDirection, isWalkable]);

  // Walking animation - alternate between frame 0 and 1
  useEffect(() => {
    if (isWalking) {
      walkAnimationRef.current = setInterval(() => {
        setWalkFrame(prev => prev === 0 ? 1 : 0); // Toggle between 0 and 1
      }, 200); // Animation speed
    } else {
      if (walkAnimationRef.current) {
        clearInterval(walkAnimationRef.current);
      }
      setWalkFrame(0);
    }

    return () => {
      if (walkAnimationRef.current) {
        clearInterval(walkAnimationRef.current);
      }
    };
  }, [isWalking]);

  // Tool usage - works on the tile the character is FACING
  const useTool = useCallback(() => {
    const facingTile = getFacingTile();
    if (!facingTile) {
      showToast('Nothing there!', '⚠️');
      return;
    }

    // Can't interact with tiles under the tree (3x3 area)
    const treeMinX = TREE_CENTER.x - 1;
    const treeMaxX = TREE_CENTER.x + 1;
    const treeMinY = TREE_CENTER.y - 1;
    const treeMaxY = TREE_CENTER.y + 1;

    if (facingTile.x >= treeMinX && facingTile.x <= treeMaxX &&
        facingTile.y >= treeMinY && facingTile.y <= treeMaxY) {
      showToast("Can't interact with the tree!", '🌳');
      return;
    }

    const tile = grid[facingTile.y][facingTile.x];

    switch (selectedTool) {
      case TOOLS.HOE:
        tillSoil(facingTile.x, facingTile.y);
        break;

      case TOOLS.SEEDBAG:
        if (selectedSeed) {
          plantSeed(facingTile.x, facingTile.y, selectedSeed);
        } else {
          showToast('Select a seed first!', '⚠️');
        }
        break;

      case TOOLS.WATERING_CAN:
        waterPlant(facingTile.x, facingTile.y);
        break;

      case TOOLS.SCISSORS:
        harvestPlant(facingTile.x, facingTile.y);
        break;

      default:
        showToast('Select a tool first!', '⚠️');
        break;
    }
  }, [selectedTool, selectedSeed, characterDirection, characterPos, grid, getFacingTile]);

  // Till soil
  const tillSoil = (x, y) => {
    const tile = grid[y][x];

    if (tile.type === TILE_TYPES.GRASS && !tile.plant) {
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[y] = [...newGrid[y]];
        newGrid[y][x] = { ...newGrid[y][x], type: TILE_TYPES.TILLED_SOIL };
        return newGrid;
      });
      showToast('Soil tilled!', '🌾');
    } else if (tile.plant) {
      showToast("There's already a plant here!", '⚠️');
    } else {
      showToast('Can only till grass!', '⚠️');
    }
  };

  // Plant seed
  const plantSeed = (x, y, plantType) => {
    const tile = grid[y][x];
    const seedKey = plantType;

    if ((seedInventory[seedKey] || 0) <= 0) {
      showToast("You don't have any of these seeds!", '⚠️');
      return;
    }

    if (tile.type !== TILE_TYPES.TILLED_SOIL && tile.type !== TILE_TYPES.TILLED_SOIL_WATERED) {
      showToast('You need to till the soil first!', '⚠️');
      return;
    }

    if (tile.plant) {
      showToast("There's already a plant here!", '⚠️');
      return;
    }

    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[y] = [...newGrid[y]];
      newGrid[y][x] = {
        ...newGrid[y][x],
        plant: true,
        plantType: plantType,
        growthStage: PLANT_STAGES.SEEDLING,
        watered: false,
        harvestable: false,
        plantedTime: Date.now(),
      };
      return newGrid;
    });

    setSeedInventory(prev => ({
      ...prev,
      [seedKey]: prev[seedKey] - 1
    }));

    showToast(`${plantType} planted!`, '🌱');
  };

  // Water plant
  const waterPlant = (x, y) => {
    const tile = grid[y][x];

    if (!tile.plant) {
      showToast('No plant here to water!', '⚠️');
      return;
    }

    if (tile.watered) {
      showToast('This plant is already watered!', '💧');
      return;
    }

    if (tile.harvestable) {
      showToast('This plant is ready to harvest!', '✨');
      return;
    }

    // Show watering animation
    setIsWatering(true);
    setTimeout(() => setIsWatering(false), 500);

    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[y] = [...newGrid[y]];
      newGrid[y][x] = {
        ...newGrid[y][x],
        watered: true,
        type: TILE_TYPES.TILLED_SOIL_WATERED,
      };
      return newGrid;
    });

    showToast('Watered!', '💧');
  };

  // Harvest plant
  const harvestPlant = (x, y) => {
    const tile = grid[y][x];

    if (!tile.plant) {
      showToast('No plant here!', '⚠️');
      return;
    }

    if (!tile.harvestable) {
      showToast('Plant is not ready to harvest yet!', '⚠️');
      return;
    }

    setInventory(prev => ({
      ...prev,
      [tile.plantType]: (prev[tile.plantType] || 0) + 1
    }));

    // Keep the tilled soil, just remove the plant
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[y] = [...newGrid[y]];
      newGrid[y][x] = {
        ...newGrid[y][x],
        plant: null,
        plantType: null,
        growthStage: 0,
        watered: false,
        harvestable: false,
        plantedTime: null,
        // Keep the soil type as is (TILLED_SOIL or TILLED_SOIL_WATERED stays)
      };
      return newGrid;
    });

    showToast(`Harvested ${tile.plantType}!`, '✂️');
  };

  // Game loop for plant growth
  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      setGrid(prev => {
        const newGrid = [...prev];
        let hasChanges = false;

        for (let y = 0; y < GRID_HEIGHT; y++) {
          for (let x = 0; x < GRID_WIDTH; x++) {
            const tile = newGrid[y][x];

            if (tile.plant && tile.watered && !tile.harvestable) {
              const timeSincePlanted = Date.now() - tile.plantedTime;
              const secondsSincePlanted = timeSincePlanted / 1000;

              // Growth stages every 10 seconds
              const newGrowthStage = Math.min(PLANT_STAGES.MATURE, Math.floor(secondsSincePlanted / 10));

              if (newGrowthStage !== tile.growthStage) {
                hasChanges = true;
                newGrid[y] = [...newGrid[y]];

                newGrid[y][x] = {
                  ...tile,
                  growthStage: newGrowthStage,
                  harvestable: newGrowthStage === PLANT_STAGES.MATURE,
                  watered: newGrowthStage < PLANT_STAGES.MATURE,
                };
              }
            }
          }
        }

        return hasChanges ? newGrid : prev;
      });
    }, 1000);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  // Get character sprite
  const getCharacterSprite = () => {
    // Show watering animation if watering
    if (isWatering && (characterDirection === DIRECTIONS.LEFT || characterDirection === DIRECTIONS.RIGHT)) {
      return getAssetPath(`assets/girl-watering-${characterDirection}.png`);
    }

    const walkSuffix = isWalking ? `-${walkFrame + 1}` : '';
    const action = isWalking ? 'walk' : 'idle';

    // Use "walking" for left/right, "walk" for up/down
    let spriteName;
    if (isWalking && (characterDirection === DIRECTIONS.LEFT || characterDirection === DIRECTIONS.RIGHT)) {
      spriteName = `girl-walking-${characterDirection}${walkSuffix}.png`;
    } else {
      spriteName = `girl-${action}-${characterDirection}${walkSuffix}.png`;
    }

    return getAssetPath(`assets/${spriteName}`);
  };

  // Get tile sprite - with proper growth stages
  const getTileSprite = (tile) => {
    if (tile.plant) {
      // Show different sprites based on growth stage
      if (tile.growthStage >= PLANT_STAGES.GROWTH2) {
        // Stage 2 and 3 (mature) show grown plant
        return getAssetPath(`assets/${tile.plantType}-grown.png`);
      } else {
        // Stage 0 and 1 show base plant (seedling)
        return getAssetPath(`assets/${tile.plantType}.png`);
      }
    }

    if (tile.type === TILE_TYPES.TILLED_SOIL) {
      return getAssetPath('assets/tilled-soil.png');
    }

    if (tile.type === TILE_TYPES.TILLED_SOIL_WATERED) {
      return getAssetPath('assets/tilled-soil-watered.png');
    }

    if (tile.type === TILE_TYPES.PATH) {
      return getAssetPath('assets/path-tile.png');
    }

    // Grass with flowers or regular grass
    if (tile.hasFlowers) {
      return getAssetPath('assets/flower-grass-tile.png');
    }

    return getAssetPath('assets/grass-tile.png');
  };

  // Handle seedbag click
  const handleSeedbagClick = () => {
    setSelectedTool(TOOLS.SEEDBAG);
    setShowSeedModal(true);
  };

  // Handle seed selection from modal
  const handleSeedSelect = (seedType) => {
    setSelectedSeed(seedType);
    setShowSeedModal(false);
    showToast(`${seedType} seeds selected!`, '🌱');
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Toolbar - bottom right corner */}
      <div className="fixed bottom-8 right-8 bg-amber-900/95 p-4 rounded-2xl border-4 border-amber-950 z-50">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSelectedTool(TOOLS.HOE)}
            className={`w-20 h-20 rounded-xl border-4 transition-all transform hover:scale-110 ${
              selectedTool === TOOLS.HOE
                ? 'bg-green-400 border-green-600 scale-110'
                : 'bg-amber-200 border-amber-600 hover:bg-amber-300'
            }`}
            title="Hoe"
          >
            <img
              src={getAssetPath('assets/hoe.png')}
              alt="Hoe"
              className="w-full h-full object-contain p-2"
            />
          </button>

          <button
            onClick={handleSeedbagClick}
            className={`w-20 h-20 rounded-xl border-4 transition-all transform hover:scale-110 ${
              selectedTool === TOOLS.SEEDBAG
                ? 'bg-green-400 border-green-600 scale-110'
                : 'bg-amber-200 border-amber-600 hover:bg-amber-300'
            }`}
            title="Seed Bag"
          >
            <img
              src={getAssetPath('assets/seedbag.png')}
              alt="Seed Bag"
              className="w-full h-full object-contain p-2"
            />
          </button>

          <button
            onClick={() => setSelectedTool(TOOLS.WATERING_CAN)}
            className={`w-20 h-20 rounded-xl border-4 transition-all transform hover:scale-110 ${
              selectedTool === TOOLS.WATERING_CAN
                ? 'bg-green-400 border-green-600 scale-110'
                : 'bg-amber-200 border-amber-600 hover:bg-amber-300'
            }`}
            title="Watering Can"
          >
            <img
              src={getAssetPath('assets/watering-can.png')}
              alt="Watering Can"
              className="w-full h-full object-contain p-2"
            />
          </button>

          <button
            onClick={() => setSelectedTool(TOOLS.SCISSORS)}
            className={`w-20 h-20 rounded-xl border-4 transition-all transform hover:scale-110 ${
              selectedTool === TOOLS.SCISSORS
                ? 'bg-green-400 border-green-600 scale-110'
                : 'bg-amber-200 border-amber-600 hover:bg-amber-300'
            }`}
            title="Scissors"
          >
            <img
              src={getAssetPath('assets/scissors.png')}
              alt="Scissors"
              className="w-full h-full object-contain p-2"
            />
          </button>
        </div>
      </div>

      {/* Controls hint */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-8 py-3 rounded-full text-base font-bold z-40">
        WASD - Move | E - Use Tool
      </div>

      {/* Game grid - NO shadows, clean display */}
      <div
        className="relative"
        style={{
          width: GRID_WIDTH * TILE_SIZE,
          height: GRID_HEIGHT * TILE_SIZE,
          imageRendering: 'pixelated',
        }}
      >
        {/* Render grid tiles */}
        {grid.map((row, y) => (
          row.map((tile, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                position: 'absolute',
                left: x * TILE_SIZE,
                top: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
            >
              <img
                src={getTileSprite(tile)}
                alt="tile"
                style={{
                  width: '100%',
                  height: '100%',
                  imageRendering: 'pixelated',
                }}
              />
              {tile.harvestable && (
                <div className="absolute inset-0 flex items-center justify-center text-6xl animate-pulse">
                  ✨
                </div>
              )}
            </div>
          ))
        ))}

        {/* Character - z-index based on Y position so she can walk behind tree */}
        <img
          src={getCharacterSprite()}
          alt="character"
          style={{
            position: 'absolute',
            left: characterPos.x * TILE_SIZE - (CHARACTER_SIZE - TILE_SIZE) / 2,
            top: characterPos.y * TILE_SIZE - (CHARACTER_SIZE - TILE_SIZE),
            width: CHARACTER_SIZE,
            height: CHARACTER_SIZE,
            imageRendering: 'pixelated',
            zIndex: characterPos.y * 10, // Y-based layering
            transition: 'left 0.2s, top 0.2s',
          }}
        />

        {/* Tree - 3x3 sprite on top of grass tiles, positioned at center Y */}
        <img
          src={getAssetPath('assets/tree.png')}
          alt="tree"
          style={{
            position: 'absolute',
            left: (TREE_CENTER.x - 1) * TILE_SIZE,
            top: (TREE_CENTER.y - 1) * TILE_SIZE,
            width: TREE_SIZE,
            height: TREE_SIZE,
            imageRendering: 'pixelated',
            zIndex: TREE_CENTER.y * 10 + 5, // Tree at center Y level + 5
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Seed inventory at bottom left */}
      <div className="fixed bottom-8 left-8 bg-amber-900/95 p-4 rounded-2xl border-4 border-amber-950 z-50">
        <h3 className="text-lg font-bold text-amber-100 mb-3 text-center">Seeds</h3>
        <div className="flex flex-col gap-2">
          {Object.entries(seedInventory).map(([seedType, count]) => (
            <div key={seedType} className="flex items-center gap-3 bg-amber-200 px-4 py-2 rounded-lg border-2 border-amber-950">
              <div className="text-sm font-bold text-amber-950 capitalize w-24">{seedType}</div>
              <div className="text-xl font-bold text-green-700">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seed Selection Modal */}
      {showSeedModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-amber-100 p-8 rounded-3xl border-8 border-amber-950 max-w-md">
            <h2 className="text-3xl font-bold text-amber-950 mb-6 text-center">Select Seeds</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.entries(seedInventory).map(([seedType, count]) => (
                <button
                  key={seedType}
                  onClick={() => handleSeedSelect(seedType)}
                  disabled={count <= 0}
                  className={`p-4 rounded-xl border-4 font-bold text-lg transition-all ${
                    count > 0
                      ? 'bg-green-200 border-green-600 hover:bg-green-300 hover:scale-105'
                      : 'bg-gray-300 border-gray-500 opacity-50 cursor-not-allowed'
                  } ${selectedSeed === seedType ? 'ring-4 ring-yellow-400' : ''}`}
                >
                  <div className="capitalize text-amber-950">{seedType}</div>
                  <div className="text-2xl text-green-700">{count}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSeedModal(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl border-4 border-red-700 transition-all hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
