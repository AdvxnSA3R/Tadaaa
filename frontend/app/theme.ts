import { createTheme, DEFAULT_THEME } from '@mantine/core';
import { palettes } from './palettes';

export const createAppTheme = (palette: typeof palettes[0]) => createTheme({
  /** Put your mantine theme override here */
  fontFamily: 'Roboto, sans-serif',
  headings: {
    fontFamily: 'Roboto, sans-serif',
  },
  colors: palette.colors,
  primaryColor: palette.primaryColor,
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadows: {
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  components: {
    TextInput: {
      styles: {
        input: {
          borderRadius: '8px',
        },
      },
    },
    ActionIcon: {
      styles: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});
