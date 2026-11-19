import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // El perfil aislado de QA contiene archivos que Edge bloquea en Windows.
  server: { watch: { ignored: ['**/.qa/**'] } },
})
