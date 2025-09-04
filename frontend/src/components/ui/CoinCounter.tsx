import { useAppState } from '../../context/AppState';
import coinImg from '../../assets/coin.png';

export default function CoinCounter() {
  const { state } = useAppState();
  return (
    <div className="flex items-center gap-1">
      <img src={coinImg} alt="coins" className="w-5 h-5" />
      <span aria-label="coins">{state.coins}</span>
    </div>
  );
}
