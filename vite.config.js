import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // './' assegura caminhos relativos funcionais para deploy em qualquer subpasta do GitHub Pages
  base: './',
  server: {
    port: 3000,
    open: true
  }
});
