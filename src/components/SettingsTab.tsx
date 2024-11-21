import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { Settings, ApiKeys } from '../types';
import { loadSettings, saveSettings, migrateLegacySettings } from '../utils/storage';

interface SettingsTabProps {
  onSettingsChange?: (settings: Settings) => void;
}

export function SettingsTab({ onSettingsChange }: SettingsTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => loadSettings());

  useEffect(() => {
    migrateLegacySettings();
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSettings(settings);
      if (onSettingsChange) {
        onSettingsChange(settings);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const updateApiKey = (type: keyof ApiKeys, value: string) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [type]: value
      }
    }));
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Settings"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  API Type
                </label>
                <select
                  value={settings.activeApiType}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    activeApiType: e.target.value as 'openai' | 'openrouter'
                  }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="openrouter">OpenRouter API</option>
                  <option value="openai">OpenAI API</option>
                </select>
              </div>

              {settings.activeApiType === 'openrouter' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    OpenRouter API Key
                  </label>
                  <input
                    type="password"
                    value={settings.apiKeys.openRouter}
                    onChange={(e) => updateApiKey('openRouter', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter OpenRouter API Key"
                  />
                </div>
              )}

              {settings.activeApiType === 'openai' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={settings.apiKeys.openai}
                    onChange={(e) => updateApiKey('openai', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter OpenAI API Key"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Keywords Everywhere API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKeys.keywordsEverywhere}
                  onChange={(e) => updateApiKey('keywordsEverywhere', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter Keywords Everywhere API Key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  AI Model
                </label>
                <select
                  value={settings.preferredModel}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferredModel: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                >
                  {settings.activeApiType === 'openai' ? (
                    <>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </>
                  ) : (
                    <>
                      <option value="anthropic/claude-3.5-opus">Claude 3.5 Opus - Anthropic</option>
                      <option value="anthropic/claude-3.5-haiku">Claude 3.5 Haiku - Anthropic</option>
                      <option value="openai/gpt-4">GPT-4 - OpenAI</option>
                      <option value="google/gemini-pro">Gemini Pro - Google</option>
                      <option value="meta-llama/llama-2-70b-chat">Llama 2 70B - Meta</option>
                      <option value="mistral/mixtral-8x7b">Mixtral - Mistral</option>
                    </>
                  )}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
