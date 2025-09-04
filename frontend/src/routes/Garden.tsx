import GardenGrid from '../components/garden/GardenGrid';
import SunCycle from '../components/garden/SunCycle';
import ShopButton from '../components/garden/ShopButton';

export default function Garden() {
  return (
    <div className="flex flex-col gap-4">
      <SunCycle />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Garden</h2>
        <ShopButton />
      </div>
      <GardenGrid />
    </div>
  );
}
