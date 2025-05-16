import { useEffect, useState, useRef } from 'react';
import { Button } from '@mantine/core';
import type { Hero } from '../api/hero';
import { selectHero } from '../api/hero';
import './heroStyles.css';

const heroes: Hero[] = [
  {
    name: 'Shadow Fiend',
    image: '/heroes/hero_1.png',
  },
  {
    name: 'Invoker',
    image: '/heroes/hero_2.png',
  },
  {
    name: 'Arc Warden',
    image: '/heroes/hero_3.png',
  },
];

interface Props {
  onSelect?: (hero: Hero) => Promise<boolean>;
}

function HeroSelect({ onSelect }: Props) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (event: WheelEvent) => {
    setIndex((prev) => {
      if (event.deltaY > 0) {
        return (prev + 1) % heroes.length;
      } else {
        return (prev - 1 + heroes.length) % heroes.length;
      }
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel);
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const hero = heroes[index];

  const handleSelect = async () => {
    try {
      await selectHero(hero);
      console.log(`Selected hero: ${hero.name}`);

      if (onSelect) {
        await onSelect(hero); // 🔁 обновляем глобальное состояние (например, в App)
      }
    } catch {
      alert('You can only select a hero once per minute.');
    }
  };

  return (
    <div className="hero-raw-container" ref={containerRef} title="Scroll to switch hero">
      <img src={hero.image} alt={hero.name} className="hero-image" />
      <div className="hero-name">{hero.name}</div>
      <Button
        variant="outline"
        size="md"
        className="hero-select-button"
        onClick={handleSelect}
      >
        Select Hero
      </Button>
    </div>
  );
}

export default HeroSelect;
