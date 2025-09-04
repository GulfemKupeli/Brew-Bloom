import { AppState } from '../context/AppState';

const KEYS = {
  settings: 'brewBloom.settings',
  wallet: 'brewBloom.wallet',
  garden: 'brewBloom.garden',
  inventory: 'brewBloom.inventory',
  timer: 'brewBloom.timer',
};

export function loadState(): AppState | null {
  try {
    const settings = localStorage.getItem(KEYS.settings);
    const wallet = localStorage.getItem(KEYS.wallet);
    const garden = localStorage.getItem(KEYS.garden);
    const inventory = localStorage.getItem(KEYS.inventory);
    const timer = localStorage.getItem(KEYS.timer);
    if (!settings || !wallet || !garden || !inventory || !timer) return null;
    return {
      settings: JSON.parse(settings),
      coins: JSON.parse(wallet).coins,
      plots: JSON.parse(garden),
      inventory: JSON.parse(inventory),
      timer: JSON.parse(timer),
    } as AppState;
  } catch {
    return null;
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEYS.settings, JSON.stringify(state.settings));
  localStorage.setItem(KEYS.wallet, JSON.stringify({ coins: state.coins }));
  localStorage.setItem(KEYS.garden, JSON.stringify(state.plots));
  localStorage.setItem(KEYS.inventory, JSON.stringify(state.inventory));
  localStorage.setItem(KEYS.timer, JSON.stringify(state.timer));
}
