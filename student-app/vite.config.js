import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // You can re-enable this if needed
    rollupOptions: {
      output: {
        manualChunks: undefined, // ✅ Disables code splitting to prevent the React issue
      },
    },
  },
})
