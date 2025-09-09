import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize for production - use esbuild instead of terser for better compatibility
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion']
        }
      }
    },
    // Generate source maps for debugging
    sourcemap: false,
    // Optimize assets
    assetsDir: 'assets',
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  // Enable compression
  server: {
    compress: true
  },
  // PWA and mobile optimization
  base: './',  // Relative base for better compatibility
  publicDir: 'public'
})
