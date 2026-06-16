// Configuration ESLint « flat » — bibliothèque de composants Vue 3 (ESM).
//
// Décrit l'environnement de chaque zone (composants/composables navigateur,
// fichiers de config Node, preset Tailwind en CommonJS) et active les
// recommandations ESLint + eslint-plugin-vue, ainsi que la règle de qualité
// max-lines-per-function (seuil 100, aligné sur l'audit).

import js from '@eslint/js';
import globals from 'globals';
import vue from 'eslint-plugin-vue';

export default [
  // Artefacts générés, dépendances et ressources non-JS.
  {
    ignores: [
      '**/node_modules/**',
      'dist/**',
      'storybook-static/**',
      'html/**',
      'docs/**',
      'powershell/**',
      '**/*.min.js',
    ],
  },

  js.configs.recommended,
  ...vue.configs['flat/recommended'],

  // Composants Vue, composables et point d'entrée (modules ES, navigateur).
  {
    files: ['src/**/*.{js,vue}', 'stories/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },

  // Fichiers de configuration en modules ES (Node).
  {
    files: ['*.config.js', '.storybook/**/*.js', 'eslint.config.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },

  // Preset Tailwind partagé : volontairement en CommonJS (.cjs) pour rester
  // consommable via require() par les projets clients.
  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },

  // Règle de qualité (seuil aligné sur l'audit).
  {
    files: ['**/*.{js,vue}'],
    rules: {
      'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
      }],
    },
  },
];
