import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The backend API. In development, requests to /api and /uploads are forwarded to it,
// so the browser sees them as same-origin (no CORS or cross-origin image issues).
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:4000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': apiTarget,
      '/uploads': apiTarget,
    },
  },
})
