import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { str, port, bool, cleanEnv } from 'envalid'

const baseEnv = cleanEnv(process.env, {
  PORT: port({ default: 5173 }),
  OPEN: bool({ default: true }),
  BROWSER: str({ default: 'msedge' })
});

const derivedEnv = cleanEnv(process.env, {
  BROWSER_ARGS: str({
    default: [
      '--app=http://localhost:' + baseEnv.PORT
    ].join(' ')
  })
});

const env = {
  ...baseEnv,
  ...derivedEnv
};

for (const [key, value] of Object.entries(env) as [keyof typeof env, any][]) {
  if (
    key !== 'isDevelopment' &&
    key !== 'isDev' &&
    key !== 'isProduction' &&
    key !== 'isProd' &&
    key !== 'isTest'
  ) {
    process.env[key] = String(value);
  }
}

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
    },
    port: env.PORT,
    open: env.OPEN ? `http://localhost:${env.PORT}` : false
  },
  preview: {
    port: env.PORT,
    open: env.OPEN ? `http://localhost:${env.PORT}` : false
  },
  resolve: {
    extensions: ['.js', '.ts', '.svelte']
  }
})
