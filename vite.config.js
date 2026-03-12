import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Forward Ollama API calls (avoids CORS)
      '/ollama': {
        target:      'https://ollama.com',
        changeOrigin: true,
        rewrite:     (path) => path.replace(/^\/ollama/, ''),
        secure:      true,
      },
      // Forward blog upload/list API to Express
      '/api': {
        target:      'http://localhost:3001',
        changeOrigin: true,
      },
    }
  }
})