import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Progress lives in localStorage, which is scoped to hostname+port.
    // Pin the port so the origin (and therefore saved progress) never changes.
    // strictPort makes Vite fail loudly instead of silently moving to another
    // port, which would look like lost progress.
    port: 5199,
    strictPort: true,
  },
})
