import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  const showPrototype = process.env.VITE_SHOW_PROTOTYPE === 'true'
  const apiTarget = process.env.VITE_SURVEY_API_PROXY_TARGET ?? 'http://localhost:8080'

  return {
    plugins: [react(), tailwindcss()],
    // Substituted at transform time, so `if (false)` branches are eliminated
    // before tree-shaking — the prototype pages and their mock data never reach
    // the public bundle. See src/config.js.
    define: {
      __SHOW_PROTOTYPE__: JSON.stringify(showPrototype),
    },
    server: {
      allowedHosts: ['.ngrok-free.app', '.orbitaly.in', 'orbitaly.in', 'orbitalyos.com', '.orbitalyos.com', 'localhost'],
      // The survey API lives on another port in development. Proxying keeps the
      // browser same-origin, so no CORS configuration is needed on the backend
      // and cookies/auth headers behave the same as they will in production.
      // Override the target with VITE_SURVEY_API_PROXY_TARGET.
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
