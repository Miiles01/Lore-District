import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5201,
    // En local, la API PHP corre en el puerto 8022 (php -S localhost:8022)
    proxy: {
      '/api': 'http://localhost:8022',
    },
  },
})
