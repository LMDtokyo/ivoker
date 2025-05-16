import { useEffect, useRef, useState } from 'react';
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

  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['Q', 'W', 'E', 'R'].includes(key)) {
        setLastPressedKey(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyHandled = () => {
    setLastPressedKey(null);
  };

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
          <InvokerTrainerSection
            keyPressed={lastPressedKey}
            onKeyHandled={handleKeyHandled}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
