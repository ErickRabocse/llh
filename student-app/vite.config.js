import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor'
            }
            if (id.includes('lodash')) {
              return 'lodash-vendor'
            }
            return 'vendor' // Create a separate "vendor" chunk for large dependencies
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // (Optional) Adjust warning limit if necessary
  },
})
