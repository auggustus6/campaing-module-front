import { theme } from '../styles/theme';

type ThemeType = typeof theme;
declare module '@mui/material/styles' {
  interface Theme extends ThemeType {}
  // allow configuration using `createTheme`
  interface ThemeOptions {}
}
