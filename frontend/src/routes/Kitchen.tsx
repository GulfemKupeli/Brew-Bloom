import Button from '../components/ui/Button';
import { useAppState, HerbType } from '../context/AppState';

interface Recipe {
  name: string;
  requires: Partial<Record<HerbType, number>>;
}

const recipes: Recipe[] = [
  { name: 'Mint Tea', requires: { mint: 1 } },
  { name: 'Lavender Latte', requires: { lavender: 1 } },
];

export default function Kitchen() {
  const { state, dispatch } = useAppState();

  const canBrew = (r: Recipe) =>
    Object.entries(r.requires).every(([herb, amt]) => state.inventory[herb as HerbType] >= (amt || 0));

  const brew = (r: Recipe) => {
    if (!canBrew(r)) return;
    Object.entries(r.requires).forEach(([herb, amt]) =>
      dispatch({ type: 'USE_HERB', herb: herb as HerbType, amount: amt as number })
    );
    alert('Brewed!');
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Kitchen</h2>
      {recipes.map(r => (
        <div key={r.name} className="flex items-center gap-2">
          <div className="flex-1">{r.name}</div>
          <Button disabled={!canBrew(r)} onClick={() => brew(r)}>Brew</Button>
        </div>
      ))}
    </div>
  );
}
