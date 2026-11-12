import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },

  // ── Dev Server Proxy ───────────────────────────────────────────────────
  // Forwards /api/* to the FastAPI backend during development.
  // Frontend calls /api/... and the proxy rewrites to http://localhost:8000/api/...
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ── Preview Server ─────────────────────────────────────────────────────
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },

  // ── Env Variables ──────────────────────────────────────────────────────
  // Expose VITE_* vars to the client bundle; never expose backend secrets.
  envPrefix: 'VITE_',
})
