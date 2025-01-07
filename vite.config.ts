import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    exclude: ['ffi-rs']  // Exclude ffi-rs from optimization
  },
  base: './',
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      external: [/\.node$/],  // Mark .node files as external
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  server: {
    fs: {
      strict: false  // Allow serving files from outside the root directory
    }
  },
  resolve: {
    extensions: ['.js', '.ts', '.svelte']
  }
})
