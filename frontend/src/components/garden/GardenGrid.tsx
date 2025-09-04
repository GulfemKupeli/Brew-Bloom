import { useAppState } from '../../context/AppState';
import PlotCard from './PlotCard';

export default function GardenGrid() {
  const { state } = useAppState();
  return (
    <div className="grid grid-cols-4 gap-2">
      {state.plots.map(p => (
        <PlotCard key={p.id} plot={p} />
      ))}
    </div>
  );
}
