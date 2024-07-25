import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // vite.config.js (assuming you are using Vite)
  build: {
    chunkSizeWarningLimit: 600, // Adjust the limit as needed
  },
  server: {
    host: '0.0.0.0',
    port: 5173, // or any other port you want to use
  },
})
