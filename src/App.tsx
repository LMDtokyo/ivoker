import { useRef } from 'react';
import GameHeader from './components/Header';
import RuneSpawn from './components/RuneSpawn';
import HeroSelect from './components/HeroSelect';
import InvokerTrainerSection from './components/InvokerTrainerSection';
import { useActiveRune } from './hooks/useActiveRune';
import { useSelectedHero } from './hooks/useSelectedHero';

function App() {
  const { activeRune, timer, pickUpRune } = useActiveRune(45);
  const { hero, chooseHero, error } = useSelectedHero();

  const gameRef = useRef<HTMLDivElement>(null);
  const scrollToGame = () => gameRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>
      <GameHeader
        activeRune={activeRune}
        runeTimer={timer}
        selectedHero={hero}
        onScrollToGame={scrollToGame}
      />

      <main style={{ padding: '2rem', color: '#ddd' }}>
        <h2>Summoning server magic...</h2>
        <p>Welcome to the future of server-powered RPG portals.</p>

        <HeroSelect onSelect={chooseHero} />
        <RuneSpawn onPickUp={pickUpRune} />

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <div ref={gameRef}>
          <InvokerTrainerSection />
        </div>
      </main>
    </div>
  );
}

export default App;
