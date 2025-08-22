// ✅ SIMPLIFIED Vite config - Remove proxy to avoid conflicts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost',
    // ✅ REMOVED proxy - let frontend handle direct API calls
  }
})