import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Caminho base exato do repositório no GitHub Pages
  base: '/portal-estudos-ads/',
  server: {
    port: 3000,
    open: true
  }
});
