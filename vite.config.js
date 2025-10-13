import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Brew-Bloom/' : '/',
  build: {
    sourcemap: false, // Disable source maps to prevent 404 errors
  },
}))
