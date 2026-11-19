/**
 * @file Reglas de análisis estático de JavaScript, JSX y hooks de React.
 * Las reglas de React Refresh ayudan a mantener módulos compatibles con recarga.
 * El código del navegador y los scripts de Node tienen variables globales distintas.
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // La salida de compilación es generada y no se revisa como código fuente.
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Las pruebas y automatizaciones usan process, Buffer y otros objetos de Node.
    files: ['tests/**/*.js', 'scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
])
