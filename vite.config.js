import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/Brew-Bloom/' : '/',
  build: {
    sourcemap: false, // Disable source maps to prevent 404 errors
  },
})
