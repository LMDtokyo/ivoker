import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Button,
  Text,
  Group,
  Badge,
  Stack,
  Divider,
} from '@mantine/core';
import { useSpell } from '../hooks/useSpell';
import { SPELL_IMAGES } from '../constants/spellImages';
import type { CastResult } from '../api/spell'; 

const ORB_IMAGES: Record<string, string> = {
  Q: '/orbs/q.png',
  W: '/orbs/w.png',
  E: '/orbs/e.png',
};

interface Props {
  onFinish: () => void;
  keyPressed: string | null;
  onKeyHandled: () => void;
}

function InvokerTrainer({ onFinish, keyPressed, onKeyHandled }: Props) {
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);
  const [lastRank, setLastRank] = useState<string | null>(null);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [rAnimating, setRAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { spell, sendInput, invoke, refresh } = useSpell();

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFinished(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started]);

  useEffect(() => {
    if (started && containerRef.current) {
      containerRef.current.focus();
    }
  }, [started]);

  const handleKey = useCallback(
    async (key: string) => {
      if (!started || finished) return;

      if (['Q', 'W', 'E'].includes(key)) {
        setInput((prev) => {
          const next = prev.length < 3 ? [...prev, key] : [key];
          return next;
        });
        await sendInput(key);
      }

      if (key === 'R') {
        setRAnimating(true);
        const result: CastResult | null = await invoke();
        if (result?.success) {
          setScore((s) => s + 1);
          setLastRank(result.rank);
          setLastTime(result.cast_time_ms);
        } else {
          setLastRank('Fail');
          setLastTime(0);
        }
        setRounds((r) => r + 1);
        setInput([]);
        setTimeout(() => setRAnimating(false), 300);
      }
    },
    [started, finished, sendInput, invoke]
  );

  useEffect(() => {
    if (!started || finished || !keyPressed) return;
    handleKey(keyPressed);
    onKeyHandled();
  }, [keyPressed, started, finished, handleKey, onKeyHandled]);

  const startGame = async () => {
    await refresh();
    setScore(0);
    setRounds(0);
    setTimeLeft(30);
    setFinished(false);
    setLastRank(null);
    setLastTime(null);
    setInput([]);
    setStarted(true);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={(e) => {
        const key = e.key.toUpperCase();
        handleKey(key);
      }}
      style={{
        position: 'relative',
        outline: 'none',
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <img
        src="/art/invoker.png"
        alt="Invoker"
        style={{
          position: 'absolute',
          bottom: -40,
          right: -30,
          width: '140px',
          opacity: 0.1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      <Stack align="center" style={{ gap: '1.5rem' }}>
        {!started ? (
          <>
            <Text size="lg" ta="center">
              🧠 Cast as many Invoker spells as you can in 30 seconds.
            </Text>
            <Button color="red" size="lg" radius="xl" onClick={startGame}>
              Start Challenge
            </Button>
          </>
        ) : (
          <>
            <Badge color="yellow" size="lg">
              Time Left: {timeLeft}s
            </Badge>

            {spell?.id && (
              <img
                src={SPELL_IMAGES[spell.id]}
                width={96}
                height={96}
                alt={spell.id}
                style={{ filter: 'drop-shadow(0 0 6px #e63946)', objectFit: 'contain' }}
              />
            )}

            <Group style={{ gap: '0.5rem', justifyContent: 'center', flexWrap: 'nowrap' }}>
              {[0, 1, 2].map((i) =>
                input[i] ? (
                  <div
                    key={i}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      background: '#111',
                      border: '2px solid #444',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={ORB_IMAGES[input[i]]}
                      alt={input[i]}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    key={i}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      background: '#111',
                      border: '2px solid #444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    ?
                  </div>
                )
              )}
            </Group>

            <Group mt="sm" style={{ gap: '0.5rem' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  background: rAnimating ? '#0f0' : '#222',
                  border: '2px solid #555',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#eee',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  transition: 'background 0.2s',
                }}
              >
                R
              </div>
            </Group>

            <Text c="dimmed">
              Progress: {score} / {rounds}
            </Text>

            {lastRank && lastTime !== null && (
              <Text>
                ⏱ {lastTime}ms — <strong>{lastRank}</strong>
              </Text>
            )}

            {finished && (
              <>
                <Divider />
                <Text size="xl" fw={800}>
                  🏆 Your Rank: {lastRank || 'Unknown'}
                </Text>
                <Button color="red" mt="md" onClick={onFinish}>
                  Close
                </Button>
              </>
            )}
          </>
        )}
      </Stack>
    </div>
  );
}

export default InvokerTrainer;
