import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const slicePublicApiPatterns = [
  {
    group: [
      '@pages/*/*',
      '@widgets/*/*',
      '@features/*/*',
      '@entities/*/*',
    ],
    message: 'Use the slice public API instead of importing internals.',
  },
]

const restrictImports = (layers) => [
  'error',
  {
    patterns: [
      ...slicePublicApiPatterns,
      ...(layers.length > 0
        ? [
            {
              group: layers.flatMap((layer) => [`@${layer}`, `@${layer}/*`]),
              message: 'Do not import from upper FSD layers.',
            },
          ]
        : []),
    ],
  },
]

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': restrictImports([]),
    },
  },
  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports(['app']),
    },
  },
  {
    files: ['src/widgets/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports(['app', 'pages']),
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports(['app', 'pages', 'widgets']),
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports([
        'app',
        'pages',
        'widgets',
        'features',
      ]),
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports([
        'app',
        'pages',
        'widgets',
        'features',
        'entities',
      ]),
    },
  },
])
