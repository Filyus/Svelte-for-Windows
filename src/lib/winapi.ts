import { fetchApi } from './client.js';
import type { ApiType } from './api.js';

// Type-safe Windows API client
class WindowsAPIClient {
  async showMessage(text: string): Promise<void> {
    await fetchApi('message', { text });
  }

  async getScreenSize(): Promise<ApiType['screen-size']['output']> {
    return fetchApi('screen-size');
  }
}

export const WindowsAPI = new WindowsAPIClient();
