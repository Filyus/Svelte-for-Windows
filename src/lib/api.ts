import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { open, close, define, DataType } from 'ffi-rs';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

// API Types
export type ApiType = {
  'message': {
    input: { text: string },
    output: { ok: true }
  },
  'screen-size': {
    input: undefined,
    output: { width: number, height: number }
  }
};

// Initialize Windows API
try {
  open({ library: 'user32', path: 'user32.dll' });
} catch (error) {
  console.error('Failed to load user32.dll:', error);
  process.exit(1);
}

export function cleanupApi() {
  close('user32');
}

// Define Windows API functions
const winAPI = define({
  MessageBoxW: {
    library: 'user32',
    retType: DataType.I32,
    paramsType: [DataType.I32, DataType.String, DataType.String, DataType.I32]
  },
  GetSystemMetrics: {
    library: 'user32',
    retType: DataType.I32,
    paramsType: [DataType.I32]
  }
});

// MessageBox constants
const MB_OK = 0x00000000;
const MB_ICONINFORMATION = 0x00000040;

const toWideString = (str: string) => {
  return Buffer.from(str + '\0', 'utf16le').toString();
}

// Create Hono app
export const app = new Hono();
app.use('/*', cors());

// API Routes
app.get('/api/screen-size', (c) => {
  const width = winAPI.GetSystemMetrics([0]);
  const height = winAPI.GetSystemMetrics([1]);
  return c.json({ width, height });
});

app.post('/api/message', zValidator('json', z.object({ text: z.string().min(1) })), async (c) => {
  const { text } = c.req.valid('json');
  winAPI.MessageBoxW([0, toWideString(text), toWideString('Windows API'), MB_OK | MB_ICONINFORMATION]);
  return c.json({ ok: true });
}); 