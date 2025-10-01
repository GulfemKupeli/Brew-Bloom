export const ACHIEVEMENTS = {
  firstPlant: {
    id: 'firstPlant',
    name: 'Green Thumb',
    description: 'Plant your first seed',
    emoji: '🌱',
    check: (stats) => stats.totalPlanted >= 1
  },
  firstHarvest: {
    id: 'firstHarvest',
    name: 'First Harvest',
    description: 'Harvest your first herb',
    emoji: '✂️',
    check: (stats) => stats.totalHarvested >= 1
  },
  tenSessions: {
    id: 'tenSessions',
    name: 'Dedicated Worker',
    description: 'Complete 10 focus sessions',
    emoji: '💪',
    check: (stats) => stats.totalSessions >= 10
  },
  firstBrew: {
    id: 'firstBrew',
    name: 'Master Brewer',
    description: 'Brew your first drink',
    emoji: '☕',
    check: (stats) => stats.totalBrewed >= 1
  },
  richGardener: {
    id: 'richGardener',
    name: 'Rich Gardener',
    description: 'Accumulate 100 coins',
    emoji: '💰',
    check: (stats) => stats.maxCoins >= 100
  },
  marathonWorker: {
    id: 'marathonWorker',
    name: 'Marathon Worker',
    description: 'Complete 50 focus sessions',
    emoji: '🏃',
    check: (stats) => stats.totalSessions >= 50
  },
  herbCollector: {
    id: 'herbCollector',
    name: 'Herb Collector',
    description: 'Harvest 50 herbs total',
    emoji: '🌿',
    check: (stats) => stats.totalHarvested >= 50
  },
  recipeExplorer: {
    id: 'recipeExplorer',
    name: 'Recipe Explorer',
    description: 'Brew 5 different recipes',
    emoji: '📖',
    check: (stats) => stats.uniqueRecipes >= 5
  },
  fullGarden: {
    id: 'fullGarden',
    name: 'Full Garden',
    description: 'Have all 9 plots growing',
    emoji: '🌸',
    check: (stats) => stats.fullGardenAchieved
  },
  masterGardener: {
    id: 'masterGardener',
    name: 'Master Gardener',
    description: 'Harvest all herb types',
    emoji: '👨‍🌾',
    check: (stats) => stats.uniqueHerbsHarvested >= 8
  }
};