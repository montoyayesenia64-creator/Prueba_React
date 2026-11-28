/**
 * @file Configuración de Vite para desarrollo y compilación de React.
 * El plugin procesa JSX y habilita la actualización de componentes al guardar.
 * .qa se excluye de la vigilancia porque contiene perfiles de navegador bloqueados.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // El perfil aislado de QA contiene archivos que Edge bloquea en Windows.
  server: { watch: { ignored: ['**/.qa/**'] } },
})
