import { useState } from 'react';
import { useAppState, HerbType, Plot } from '../../context/AppState';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import seedImg from '../../assets/seed.png';
import sproutImg from '../../assets/sprout.png';
import herbImg from '../../assets/herb.png';

export default function PlotCard({ plot }: { plot: Plot }) {
  const { state, dispatch } = useAppState();
  const [selectPlant, setSelectPlant] = useState(false);

  const plant = (herb: HerbType) => {
    dispatch({ type: 'PLANT_SEED', plotId: plot.id, herb });
    setSelectPlant(false);
  };
  const water = () => dispatch({ type: 'WATER_PLOT', plotId: plot.id });
  const harvest = () => dispatch({ type: 'HARVEST_PLOT', plotId: plot.id });

  let img;
  if (plot.stage === 1) img = seedImg;
  if (plot.stage === 2) img = sproutImg;
  if (plot.stage === 3) img = herbImg;

  let actionButton;
  if (plot.stage === 0) actionButton = <Button onClick={() => setSelectPlant(true)}>Plant</Button>;
  else if (plot.stage === 3) actionButton = <Button onClick={harvest}>Harvest</Button>;
  else actionButton = <Button onClick={water}>Water</Button>;

  return (
    <div className="border border-green-700 rounded-lg p-2 flex flex-col items-center justify-center h-32 gap-2">
      {img && <img src={img} alt="" className="w-8 h-8" />}
      {actionButton}
      {selectPlant && (
        <Modal onClose={() => setSelectPlant(false)}>
          <div className="flex flex-col gap-2">
            {(['mint', 'basil', 'lavender'] as HerbType[]).map(h => (
              <Button key={h} disabled={state.inventory[h] <= 0} onClick={() => plant(h)}>
                {h} ({state.inventory[h]})
              </Button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
