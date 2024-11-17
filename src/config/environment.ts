// Environment configuration for browser
export const CONFIG = {
  apiUrl: import.meta.env.VITE_KEYWORD_API_URL || 'https://api.example.com',
  apiKey: import.meta.env.VITE_KEYWORD_API_KEY || '',
  environment: import.meta.env.MODE,
};