import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications'; // <-- подключаем уведомления
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css'; // <-- стили для уведомлений
import './App.css';

// Настраиваем тему
const theme = createTheme({
  primaryColor: 'red',
  defaultRadius: 'md',
  fontFamily: 'Cinzel, serif',
  colors: {
    dark: ['#181818', '#1e1e1e', '#232323', '#292929', '#2f2f2f'],
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" zIndex={1000} /> {/* Магия */}
      <App />
    </MantineProvider>
  </React.StrictMode>
);
