import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { DEFAULTS } from '../lib/constants';
import { loadState, saveState } from '../lib/storage';

export type HerbType = 'mint' | 'basil' | 'lavender';
export type PlotStage = 0 | 1 | 2 | 3;

export interface Plot { id: string; herbType: HerbType | null; stage: PlotStage; }
export interface Inventory { mint: number; basil: number; lavender: number; }
export interface Settings { focusMinutes: number; breakMinutes: number; rewardCoins: number; }
export interface TimerState { mode: 'focus' | 'break'; isRunning: boolean; remainingSec: number; lastTick: number | null; }

export interface AppState {
  coins: number;
  plots: Plot[];
  inventory: Inventory;
  settings: Settings;
  timer: TimerState;
}

type Action =
  | { type: 'ADD_COINS'; amount: number }
  | { type: 'SPEND_COINS'; amount: number }
  | { type: 'BUY_SEED'; herb: HerbType }
  | { type: 'PLANT_SEED'; plotId: string; herb: HerbType }
  | { type: 'WATER_PLOT'; plotId: string }
  | { type: 'HARVEST_PLOT'; plotId: string }
  | { type: 'USE_HERB'; herb: HerbType; amount: number }
  | { type: 'SET_SETTINGS'; settings: Settings }
  | { type: 'SET_TIMER_RUNNING'; isRunning: boolean }
  | { type: 'SET_TIMER_MODE'; mode: 'focus' | 'break' }
  | { type: 'RESET_TIMER' }
  | { type: 'SKIP_BREAK' }
  | { type: 'TICK' }
  | { type: 'LOAD'; state: AppState };

function createPlots(): Plot[] {
  const plots: Plot[] = [];
  const total = DEFAULTS.gridRows * DEFAULTS.gridCols;
  for (let i = 0; i < total; i++) {
    plots.push({ id: String(i), herbType: null, stage: 0 });
  }
  return plots;
}

const initialState: AppState = {
  coins: 0,
  plots: createPlots(),
  inventory: { mint: 0, basil: 0, lavender: 0 },
  settings: {
    focusMinutes: DEFAULTS.focusMinutes,
    breakMinutes: DEFAULTS.breakMinutes,
    rewardCoins: DEFAULTS.rewardCoins,
  },
  timer: { mode: 'focus', isRunning: false, remainingSec: DEFAULTS.focusMinutes * 60, lastTick: null },
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD':
      return action.state;
    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.amount };
    case 'SPEND_COINS':
      return { ...state, coins: Math.max(0, state.coins - action.amount) };
    case 'BUY_SEED': {
      const price = DEFAULTS.seedPrices[action.herb];
      if (state.coins < price) return state;
      const inventory = { ...state.inventory, [action.herb]: state.inventory[action.herb] + 1 };
      return { ...state, coins: state.coins - price, inventory };
    }
    case 'PLANT_SEED': {
      const inventory = { ...state.inventory, [action.herb]: state.inventory[action.herb] - 1 };
      const plots = state.plots.map(p => p.id === action.plotId ? { ...p, herbType: action.herb, stage: 1 } : p);
      return { ...state, inventory, plots };
    }
    case 'WATER_PLOT': {
      const plots = state.plots.map(p => p.id === action.plotId ? { ...p, stage: (p.stage + 1) as PlotStage } : p);
      return { ...state, plots };
    }
    case 'HARVEST_PLOT': {
      const plot = state.plots.find(p => p.id === action.plotId);
      if (!plot || plot.stage < 3 || !plot.herbType) return state;
      const plots = state.plots.map(p => p.id === action.plotId ? { ...p, stage: 0, herbType: null } : p);
      const inventory = { ...state.inventory, [plot.herbType]: state.inventory[plot.herbType] + 1 };
      return { ...state, plots, inventory };
    }
    case 'USE_HERB': {
      const inventory = { ...state.inventory, [action.herb]: state.inventory[action.herb] - action.amount };
      return { ...state, inventory };
    }
    case 'SET_SETTINGS':
      return { ...state, settings: action.settings };
    case 'SET_TIMER_RUNNING':
      return { ...state, timer: { ...state.timer, isRunning: action.isRunning, lastTick: action.isRunning ? Date.now() : state.timer.lastTick } };
    case 'SET_TIMER_MODE':
      return { ...state, timer: { mode: action.mode, isRunning: false, remainingSec: (action.mode === 'focus' ? state.settings.focusMinutes : state.settings.breakMinutes) * 60, lastTick: null } };
    case 'RESET_TIMER':
      return { ...state, timer: { ...state.timer, isRunning: false, remainingSec: (state.timer.mode === 'focus' ? state.settings.focusMinutes : state.settings.breakMinutes) * 60, lastTick: null } };
    case 'SKIP_BREAK':
      if (state.timer.mode === 'break') {
        return { ...state, timer: { mode: 'focus', isRunning: false, remainingSec: state.settings.focusMinutes * 60, lastTick: null } };
      }
      return state;
    case 'TICK':
      if (!state.timer.isRunning) return state;
      return { ...state, timer: { ...state.timer, remainingSec: state.timer.remainingSec - 1, lastTick: Date.now() } };
    default:
      return state;
  }
}

const AppCtx = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stored = loadState();
    if (stored) {
      if (stored.timer.isRunning && stored.timer.lastTick) {
        const diff = Math.floor((Date.now() - stored.timer.lastTick) / 1000);
        stored.timer.remainingSec = Math.max(0, stored.timer.remainingSec - diff);
        stored.timer.lastTick = Date.now();
      }
      dispatch({ type: 'LOAD', state: stored });
    }
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <AppCtx.Provider value={{ state, dispatch }}>{children}</AppCtx.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('AppState missing');
  return ctx;
};

export const useAppDispatch = () => useAppState().dispatch;
