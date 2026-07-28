import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// GMVMAX 草案站点为纯静态产物，无需后端代理配置。
export default defineConfig({
  plugins: [react()],
});
