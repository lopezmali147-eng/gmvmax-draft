import { createTheme } from '@mui/material/styles';

/**
 * GMVMAX 全局主题：专业 SaaS 调性，靛蓝主色，克制圆角与阴影。
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5', // 靛蓝
      light: '#6573c3',
      dark: '#2e3d8c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00897b', // 青绿点缀
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f8fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1f36',
      secondary: '#5a6275',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'].join(','),
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 2px rgba(16,24,40,0.06)',
        },
      },
    },
  },
});

export default theme;
