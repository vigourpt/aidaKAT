import type { ApiKeys } from '../types';

const STORAGE_KEY = 'keyword_analyzer_api_keys';

export const loadApiKeys = (): ApiKeys => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load API keys:', error);
  }
  return { openai: '', keywordsEverywhere: '' };
};

export const saveApiKeys = async (keys: ApiKeys): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error('Failed to save API keys:', error);
    throw new Error('Failed to save API keys. Please try again.');
  }
};