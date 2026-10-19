import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  server: {
    host: true,
    allowedHosts: ['.e2b.app'],
  },
  preview: {
    host: true,
    allowedHosts: ['.e2b.app'],
  },
});
