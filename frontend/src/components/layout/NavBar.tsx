import { Link } from 'react-router-dom';
import CoinCounter from '../ui/CoinCounter';
import logo from '../../assets/logo.png';

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between mb-4">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Brew & Bloom" className="w-8 h-8" />
        <span className="font-bold">Brew & Bloom</span>
      </Link>
      <div className="flex items-center gap-4">
        <CoinCounter />
        <Link to="/" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-600">Timer</Link>
        <Link to="/garden" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-600">Garden</Link>
        <Link to="/kitchen" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-600">Kitchen</Link>
      </div>
    </nav>
  );
}
