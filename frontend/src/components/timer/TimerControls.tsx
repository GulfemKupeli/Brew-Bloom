import { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useAppState } from '../../context/AppState';

export default function TimerControls() {
  const { state, dispatch } = useAppState();
  const { timer, settings } = state;
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(settings.focusMinutes);
  const [brk, setBrk] = useState(settings.breakMinutes);

  const toggle = () => dispatch({ type: 'SET_TIMER_RUNNING', isRunning: !timer.isRunning });
  const reset = () => dispatch({ type: 'RESET_TIMER' });
  const skip = () => dispatch({ type: 'SKIP_BREAK' });
  const save = () => {
    dispatch({ type: 'SET_SETTINGS', settings: { ...settings, focusMinutes: focus, breakMinutes: brk } });
    dispatch({ type: 'RESET_TIMER' });
    setOpen(false);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={toggle}>{timer.isRunning ? 'Pause' : 'Start'}</Button>
      <Button onClick={reset}>Reset</Button>
      <Button onClick={skip} disabled={timer.mode === 'focus'}>Skip Break</Button>
      <Button onClick={() => setOpen(true)}>Settings</Button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              Focus
              <input type="number" className="border p-1 w-16" value={focus} onChange={e => setFocus(Number(e.target.value))} />
            </label>
            <label className="flex items-center gap-2">
              Break
              <input type="number" className="border p-1 w-16" value={brk} onChange={e => setBrk(Number(e.target.value))} />
            </label>
            <Button onClick={save}>Save</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
