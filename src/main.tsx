import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import App from './App';
import { LangProvider } from './i18n';

/**
 * 应用入口：挂载语言 Provider、路由、MUI 主题与 CssBaseline。
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <LangProvider>
          <App />
        </LangProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
