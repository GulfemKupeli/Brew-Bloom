import { Routes, Route } from 'react-router-dom';
import HomeTimer from './routes/HomeTimer';
import Garden from './routes/Garden';
import Kitchen from './routes/Kitchen';
import NavBar from './components/layout/NavBar';
import PageShell from './components/layout/PageShell';

function App() {
  return (
    <PageShell>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeTimer />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/kitchen" element={<Kitchen />} />
      </Routes>
    </PageShell>
  );
}

export default App;
