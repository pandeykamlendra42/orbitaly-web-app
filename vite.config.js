import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  const showPrototype = process.env.VITE_SHOW_PROTOTYPE === 'true'

  return {
    plugins: [react(), tailwindcss()],
    // Substituted at transform time, so `if (false)` branches are eliminated
    // before tree-shaking — the prototype pages and their mock data never reach
    // the public bundle. See src/config.js.
    define: {
      __SHOW_PROTOTYPE__: JSON.stringify(showPrototype),
    },
  }
})
