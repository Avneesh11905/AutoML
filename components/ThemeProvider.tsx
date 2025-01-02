'use client'
import { ReactNode, useState } from 'react';
import { MantineProvider, ActionIcon, localStorageColorSchemeManager } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <MantineProvider
      theme={{}}  // Leave theme empty if no other theme customization is needed
      forceColorScheme={colorScheme} // Pass colorScheme as a separate prop
      colorSchemeManager={localStorageColorSchemeManager()}
      >
      {children}
      <ActionIcon
        variant="transparent"
        color={colorScheme === 'dark' ? 'white' : 'light'}
        onClick={toggleTheme}
        style={{ position: 'fixed', top: 20, right: 20 }}
        >
        {colorScheme === 'dark' ? <IconSun size={23} /> : <IconMoon size={23} />}
      </ActionIcon>
    </MantineProvider>
  );
}