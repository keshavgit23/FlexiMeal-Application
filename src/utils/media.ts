import { API_URL } from '../config/api-url';

export const getMediaUrl = (
  path: string | null
): string | undefined => {
  if (!path) return undefined;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_URL}${path}`;
};