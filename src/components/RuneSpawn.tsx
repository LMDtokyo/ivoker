import { useEffect, useState } from 'react';
import {
  Card,
  Image,
  Text,
  Transition,
  Title,
  Divider,
  Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { fetchRune } from '../api/rune';
import type { Rune as APIRune } from '../api/rune';
import './runeStyles.css'; 

const runeImageMap: Record<string, string> = {
  haste: '/runes/Rune_of_Haste_model.webp',
  illusion: '/runes/Rune_of_Illusion_model.webp',
  bounty: '/runes/Rune_of_Bounty_model.webp',
  arcane: '/runes/Runes_Header_Arcane.webp',
  regeneration: '/runes/Rune_of_Regeneration_model.webp',
};

interface Rune extends APIRune {
  image: string;
}

interface Props {
  onPickUp: (rune: Rune) => void;
}

function RuneSpawn({ onPickUp }: Props) {
  const [rune, setRune] = useState<Rune | null>(null);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const updateRune = async () => {
    try {
      const apiRune = await fetchRune();
      const image =
        runeImageMap[apiRune.name as keyof typeof runeImageMap] ||
        '/runes/default.png';
      setRune({ ...apiRune, image });
    } catch {
      setRune(null);
    }
  };

  useEffect(() => {
    updateRune().then(() => setVisible(true));

    const interval = setInterval(() => {
      if (disabled) return;
      setVisible(false);
      setTimeout(() => {
        updateRune().then(() => setVisible(true));
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [disabled]);

  const handlePickUp = () => {
    if (!rune) return;
    onPickUp(rune);
    setVisible(false);
    setDisabled(true);

    notifications.show({
      title: `Rune Acquired!`,
      message: `${rune.name} rune activated.`,
      color: 'red',
      autoClose: 3000,
    });
  };

  if (!rune || !visible) return null;

  return (
    <Transition mounted={visible} transition="pop" duration={400} timingFunction="ease-out">
      {(styles) => (
        <div className="rune-container" style={{ ...styles }}>
          <Card
            className="rune-card"
            shadow="xl"
            radius="lg"
            p="lg"
            style={{
              maxWidth: 280,
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            <Title
              order={3}
              style={{
                fontFamily: `'Cinzel', serif`,
                color: '#e63946',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {rune.name} Rune
            </Title>

            <Divider my="sm" color="dark.4" />

            <Image
              src={rune.image}
              alt={rune.name}
              draggable={false}
              mx="auto"
              style={{
                width: '96px',
                height: '96px',
                objectFit: 'contain',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 0 8px #e63946)',
              }}
            />

            <Text
              size="sm"
              style={{
                color: '#bbb',
                fontStyle: 'italic',
                fontFamily: 'serif',
                lineHeight: 1.4,
                marginBottom: '1rem',
              }}
            >
              {rune.description}
            </Text>

            <Button
              variant="outline"
              size="sm"
              color="red"
              onClick={handlePickUp}
              disabled={disabled}
            >
              Pick up Rune
            </Button>
          </Card>
        </div>
      )}
    </Transition>
  );
}

export default RuneSpawn;
