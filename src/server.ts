import { serve } from '@hono/node-server';
import { app, cleanupApi } from './lib/api';

let server: ReturnType<typeof serve> | null = null;

const cleanup = () => {
  if (server) {
    server.close();
    cleanupApi();
    server = null;
  }
};

// Start server
export function startServer() {
  server = serve({ fetch: app.fetch, port: 3000 });
  
  // Handle normal process termination
  process.on('SIGINT', () => {
    cleanup();
    process.exit();
  });

  // Handle development hot reload
  if (import.meta.hot) {
    import.meta.hot.dispose(cleanup);
  }
}

startServer(); 