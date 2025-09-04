import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAppState } from '../../context/AppState';
import { HerbType } from '../../context/AppState';
import { DEFAULTS } from '../../lib/constants';

export default function ShopButton() {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useAppState();

  const buy = (herb: HerbType) => {
    dispatch({ type: 'BUY_SEED', herb });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Shop</Button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-2">
            {(Object.keys(DEFAULTS.seedPrices) as HerbType[]).map(h => (
              <Button key={h} onClick={() => buy(h)} disabled={state.coins < DEFAULTS.seedPrices[h]}>
                {h} - {DEFAULTS.seedPrices[h]} coins
              </Button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
