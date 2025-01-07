import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    exclude: ['ffi-rs']  // Exclude ffi-rs from optimization
  },
  build: {
    rollupOptions: {
      external: [/\.node$/]  // Mark .node files as external
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
