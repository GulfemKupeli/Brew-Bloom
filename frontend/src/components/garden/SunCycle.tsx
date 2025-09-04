import { useEffect, useState } from 'react';
import sun from '../../assets/sun.png';
import moon from '../../assets/moon.png';

export default function SunCycle() {
  const [isDay, setIsDay] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setIsDay(d => !d), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-10 flex items-center">
      <img src={isDay ? sun : moon} alt="sun cycle" className="w-8 h-8" />
    </div>
  );
}
