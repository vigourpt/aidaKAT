import type { Settings, ApiKeys } from '../types';

const STORAGE_KEY = 'imvigour_settings';

const defaultSettings: Settings = {
  apiKeys: {
    openai: import.meta.env.VITE_OPENAI_API_KEY || '',
    openRouter: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    keywordsEverywhere: import.meta.env.VITE_KEYWORDS_EVERYWHERE_API_KEY || ''
  },
  preferredModel: 'anthropic/claude-3-sonnet',
  activeApiType: 'openrouter'
};

export const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      // Use stored API keys if they exist, otherwise fall back to env variables
      return {
        ...defaultSettings,
        ...settings,
        apiKeys: {
          openai: settings.apiKeys?.openai || defaultSettings.apiKeys.openai,
          openRouter: settings.apiKeys?.openRouter || defaultSettings.apiKeys.openRouter,
          keywordsEverywhere: settings.apiKeys?.keywordsEverywhere || defaultSettings.apiKeys.keywordsEverywhere
        }
      };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw new Error('Failed to save settings. Please try again.');
  }
};

// Legacy support for old storage key
const OLD_STORAGE_KEY = 'keyword_analyzer_api_keys';

export const migrateLegacySettings = (): void => {
  try {
    const oldStored = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldStored) {
      const oldKeys: ApiKeys = JSON.parse(oldStored);
      const newSettings: Settings = {
        ...defaultSettings,
        apiKeys: {
          ...defaultSettings.apiKeys,
          openai: oldKeys.openai || defaultSettings.apiKeys.openai,
          keywordsEverywhere: oldKeys.keywordsEverywhere || defaultSettings.apiKeys.keywordsEverywhere
        }
      };
      saveSettings(newSettings);
      localStorage.removeItem(OLD_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to migrate legacy settings:', error);
  }
};
