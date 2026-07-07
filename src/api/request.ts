import { logger } from '@/logger';

const BASE_URL = '';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

async function request<T>(url: string): Promise<T> {
  logger.debug('API', `Request: ${url}`);

  try {
    const response = await fetch(`${BASE_URL}${url}`);
    const result: ApiResponse<T> = await response.json();

    if (result.code !== 200) {
      logger.error('API', `Request failed: ${url}`, result);
      throw new Error(result.message || '请求失败');
    }

    logger.debug('API', `Response success: ${url}`, result.data);
    return result.data;
  } catch (error) {
    logger.error('API', `Request error: ${url}`, error);
    throw error;
  }
}

export { request, USE_MOCK };
