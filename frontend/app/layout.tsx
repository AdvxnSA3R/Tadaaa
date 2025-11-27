'use client';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ColorSchemeScript, MantineProvider, useMantineColorScheme } from '@mantine/core';
import { createAppTheme } from './theme';
import { palettes } from './palettes';
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function ApplyBackgroundColor() {
  const { colorScheme } = useMantineColorScheme();
  const { palette } = useContext(ThemeContext);

  useEffect(() => {
    const backgroundColor = colorScheme === 'dark' 
      ? palette.backgroundColorDark 
      : palette.backgroundColorLight;
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.transition = 'background-color 0.3s ease';
  }, [colorScheme, palette]);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [paletteIndex, setPaletteIndex] = useState(0);

  useEffect(() => {
    const storedPaletteIndex = localStorage.getItem('paletteIndex');
    if (storedPaletteIndex) {
      setPaletteIndex(JSON.parse(storedPaletteIndex));
    }
  }, []);

  const cyclePalette = () => {
    setPaletteIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % palettes.length;
      localStorage.setItem('paletteIndex', JSON.stringify(newIndex));
      return newIndex;
    });
  };

  const palette = palettes[paletteIndex];
  const theme = createAppTheme(palette);

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeContext.Provider value={{ cyclePalette, palette }}>
          <MantineProvider theme={theme} defaultColorScheme='dark'>
            <ApplyBackgroundColor />
            {children}
          </MantineProvider>
        </ThemeContext.Provider>
      </body>
    </html>
  );
}
