import { Link } from 'react-router-dom'
import CoinCounter from '../ui/CoinCounter'
import logo from '../../assets/logo.png'

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between mb-4">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Brew & Bloom" className="w-8 h-8" />
        <span className="text-3xl font-pixel text-yellow-400">Brew & Bloom</span>
      </Link>

      <div className="flex items-center gap-4">
        <CoinCounter />
        <Link
          to="/"
          className="text-yellow-300 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Timer
        </Link>
        <Link
          to="/garden"
          className="text-yellow-300 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Garden
        </Link>
        <Link
          to="/kitchen"
          className="text-yellow-300 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Kitchen
        </Link>
      </div>
    </nav>
  )
}
