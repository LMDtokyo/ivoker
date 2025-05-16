import { useState } from 'react';
import { Button, Container, Stack, Title, Text } from '@mantine/core';
import InvokerTrainer from './InvokerTrainer';

function InvokerTrainerSection() {
  const [show, setShow] = useState(false);

  return (
    <Container size="md" py={80}>
      {!show ? (
        <Stack align="center" style={{ gap: '2.5rem' }}>
          <Title order={2} style={{ fontFamily: `'Cinzel', serif` }}>
            🧠 Invoker Procast Challenge
          </Title>
          <Text ta="center" c="dimmed" size="lg">
            Use Q/W/E to input the right combination for the spell shown. Can you master the elements?
          </Text>
          <Button
            size="xl"
            radius="xl"
            color="red"
            onClick={() => setShow(true)}
            style={{
              fontFamily: `'Cinzel', serif`,
              textTransform: 'uppercase',
              fontSize: '1.2rem',
              fontWeight: 700,
              padding: '1rem 2.5rem',
              boxShadow: '0 0 12px rgba(255, 0, 0, 0.4)',
            }}
          >
            Start Training
          </Button>
        </Stack>
      ) : (
        <InvokerTrainer onFinish={() => setShow(false)} />
      )}
    </Container>
  );
}

export default InvokerTrainerSection;
