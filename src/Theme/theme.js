import { extendTheme } from '@mui/joy/styles';

const palette = {
  neutral: {
    solidBg: '#6c757d',
    solidBorder: '#6c757d',
    solidHoverBg: '#5c636a',
    solidHoverBorder: '#565e64',
    solidActiveBg: '#565e64',
    solidActiveBorder: '#51585e',
    solidDisabledBg: '#6c757d',
    solidDisabledBorder: '#6c757d',
    // btn-light
    softColor: '#000',
    softBg: '#f2f2f2',
    softBorder: '#f2f2f2',
    softHoverBg: '#f9fafb',
    softHoverBorder: '#f9fafb',
    softActiveBg: '#f9fafb',
    softActiveBorder: '#f9fafb',
    softDisabledBg: '#f2f2f2',
    softDisabledBorder: '#f2f2f2',
  },
  danger: {
    solidBg: '#dc3545',
    solidBorder: '#dc3545',
    solidHoverBg: '#bb2d3b',
    solidHoverBorder: '#b02a37',
    solidActiveBg: '#b02a37',
    solidActiveBorder: '#a52834',
    solidDisabledBg: '#dc3545',
    solidDisabledBorder: '#dc3545',
  },
};

export const theme = extendTheme({
  cssVarPrefix: 'bs',
  colorSchemes: {
    light: { palette },
    dark: { palette },
  },
});
