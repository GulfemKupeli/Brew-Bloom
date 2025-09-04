import { useEffect } from 'react';
import { useAppState } from '../../context/AppState';
import { formatTime } from '../../lib/format';
import TimerControls from './TimerControls';

export default function DeskTimer() {
  const { state, dispatch } = useAppState();
  const { timer, settings } = state;

  useEffect(() => {
    let id: number | undefined;
    if (timer.isRunning) {
      id = window.setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => id && clearInterval(id);
  }, [timer.isRunning, dispatch]);

  useEffect(() => {
    if (timer.remainingSec <= 0) {
      if (timer.mode === 'focus') {
        dispatch({ type: 'ADD_COINS', amount: settings.rewardCoins });
        dispatch({ type: 'SET_TIMER_MODE', mode: 'break' });
      } else {
        dispatch({ type: 'SET_TIMER_MODE', mode: 'focus' });
      }
    }
  }, [timer.remainingSec, timer.mode, dispatch, settings.rewardCoins]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-5xl font-bold" aria-live="polite">
        {formatTime(timer.remainingSec)}
      </div>
      <TimerControls />
    </div>
  );
}
