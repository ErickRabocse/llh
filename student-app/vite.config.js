import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // Disable minification
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable manual chunking
      },
    },
  },
})
