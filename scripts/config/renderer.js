const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const { resolve } = require('path');
const root = resolve('src/renderer');
const outDir = resolve('dist/renderer');

// https://vitejs.dev/config/
module.exports = defineConfig({
  mode: process.env['rendererMode'] || 'production',
  root,
  base: './',
  build: {
    outDir
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  plugins: [vue()]
});
