import {API_URL} from '../config/api-url';
export const getMediaUrl = (path: string | null) => {
  if (!path) return null;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_URL}${path}`;
};