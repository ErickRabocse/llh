import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom'], // Ensure React is properly optimized
  },
  build: {
    minify: false, // Disable minification to debug the issue
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor' // Bundle React separately
            return 'vendor'
          }
        },
      },
    },
  },
})
