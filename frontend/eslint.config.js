import js from '@eslint/js' // Core ESLint rules
import globals from 'globals' // Browser globals
import reactHooks from 'eslint-plugin-react-hooks' // React Hooks rules
import reactRefresh from 'eslint-plugin-react-refresh' // Vite React Refresh rules
import { defineConfig, globalIgnores } from 'eslint/config' // Flat config helpers

export default defineConfig([
  globalIgnores(['dist']), // Ignore build output
  {
    files: ['**/*.{js,jsx}'], // Apply to JS/JSX files
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020, // ECMAScript version baseline
      globals: globals.browser, // Enable browser globals
      parserOptions: {
        ecmaVersion: 'latest', // Parse latest syntax
        ecmaFeatures: { jsx: true }, // Enable JSX
        sourceType: 'module', // Use ES modules
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // Allow unused constants/components
    },
  },
])
