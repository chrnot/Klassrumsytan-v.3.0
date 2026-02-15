
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Gör process.env tillgängligt i webbläsaren för Gemini SDK
    'process.env': {
      API_KEY: process.env.API_KEY
    }
  },
  build: {
    target: 'esnext'
  }
});
