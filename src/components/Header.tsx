import {
  Container,
  Flex,
  Group,
  Title,
  Text,
  Button,
  Burger,
  Drawer,
  Stack,
  Image,
  Badge,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Sword } from 'lucide-react';
import { fetchGreeting } from '../api/greeting';

interface Rune {
  name: string;
  description: string;
  image: string;
}

interface Hero {
  name: string;
  image: string;
}

interface GameHeaderProps {
  activeRune: Rune | null;
  runeTimer: number;
  selectedHero: Hero | null;
  onScrollToGame: () => void; 
}

const navItems = ['Home', 'Heroes', 'Lore', 'Play'];
const activePage = 'Home';

function GameHeader({
  activeRune,
  runeTimer,
  selectedHero,
  onScrollToGame,
}: GameHeaderProps) {
  const [visible, setVisible] = useState(false);
  const [drawerOpened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetchGreeting('Elrond')
      .then((text) => setGreeting(text))
      .catch(() => setGreeting('Failed to reach the server...'));

    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundImage: `
          url(https://www.transparenttextures.com/patterns/asfalt-dark.png),
          url(https://www.transparenttextures.com/patterns/cubes.png)
        `,
        backgroundColor: '#1a1a1a',
        padding: '1.5rem 0',
        borderBottom: '4px solid transparent',
        borderImage: 'linear-gradient(to right, #e63946, #ff6f61) 1',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        fontFamily: `'Cinzel', serif`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <Container size="lg" style={{ position: 'relative' }}>
        <Flex justify="space-between" align="center" wrap="nowrap">
          <Group
            align="center"
            gap="sm"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.6s ease-in-out',
              flex: 1,
              minWidth: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                height: '5rem',
                filter: 'drop-shadow(0 0 12px #e63946) brightness(1.3)',
              }}
            />

            <div style={{ minWidth: 0 }}>
              <Title
                order={1}
                style={{
                  color: '#e63946',
                  letterSpacing: '5px',
                  fontWeight: 700,
                  fontSize: '2.25rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                MythForge
              </Title>
              <Text
                size="sm"
                c="dimmed"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {greeting || 'Summoning server magic...'}
              </Text>

              {selectedHero && (
                <Group align="center" gap="xs" mt="xs">
                  <Image
                    src={selectedHero.image}
                    alt={selectedHero.name}
                    width={32}
                    height={32}
                    style={{
                      borderRadius: '4px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 6px #e0b322)',
                    }}
                  />
                  <Text size="sm" style={{ color: '#e0b322', fontWeight: 600 }}>
                    You will fight as: {selectedHero.name}
                  </Text>
                </Group>
              )}
            </div>
          </Group>

          {isMobile ? (
            <>
              <Burger opened={drawerOpened} onClick={open} color="#fff" />
              <Drawer
                opened={drawerOpened}
                onClose={close}
                size="xs"
                padding="md"
                title="Menu"
                overlayProps={{ opacity: 0.55, blur: 4 }}
                styles={{ title: { fontFamily: `'Cinzel', serif` } }}
              >
                <Stack>
                  {navItems.map((item) => (
                    <Text
                      key={item}
                      style={{
                        color: item === activePage ? '#e63946' : '#fff',
                        fontWeight: item === activePage ? 700 : 400,
                        borderBottom:
                          item === activePage ? '2px solid #e63946' : 'none',
                        fontSize: '1.1rem',
                        padding: '0.5rem 0',
                        cursor: 'pointer',
                      }}
                    >
                      {item}
                    </Text>
                  ))}
                </Stack>
              </Drawer>
            </>
          ) : (
            <Group gap="lg" align="center">
              {navItems.map((item) => (
                <Text
                  key={item}
                  style={{
                    color: item === activePage ? '#e63946' : '#fff',
                    fontWeight: item === activePage ? 700 : 400,
                    borderBottom:
                      item === activePage ? '2px solid #e63946' : 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    padding: '0.25rem 0.5rem',
                  }}
                >
                  {item}
                </Text>
              ))}

              {activeRune && runeTimer > 0 && (
                <Group align="center" gap="xs">
                  <Image
                    src={activeRune.image}
                    alt={activeRune.name}
                    width={32}
                    height={32}
                    draggable={false}
                    style={{
                      borderRadius: '4px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 4px #e63946)',
                    }}
                  />
                  <Badge color="red" variant="filled" size="sm">
                    {runeTimer}s
                  </Badge>
                </Group>
              )}

              <Button
                leftSection={<Sword size={16} />}
                color="red"
                radius="xl"
                size="sm"
                onClick={onScrollToGame} 
                style={{
                  fontFamily: `'Cinzel', serif`,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Fight Invoker
              </Button>
            </Group>
          )}
        </Flex>
      </Container>
    </header>
  );
}

export default GameHeader;
