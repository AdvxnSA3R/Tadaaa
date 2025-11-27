'use client';
import { createContext, useContext } from 'react';
import { palettes } from './palettes';

type Palette = typeof palettes[0];

interface ThemeContextType {
  cyclePalette: () => void;
  palette: Palette;
}

export const ThemeContext = createContext<ThemeContextType>({
  cyclePalette: () => {},
  palette: palettes[0],
});

export const useThemeContext = () => useContext(ThemeContext);
