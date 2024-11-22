import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Settings, ApiKeys } from '../types';
import { loadSettings, saveSettings, migrateLegacySettings } from '../utils/storage';

interface SettingsTabProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: Settings) => void;
}

export function SettingsTab({ isOpen, onClose, onSettingsChange }: SettingsTabProps) {
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
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
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
                  <option value="gpt-4o">GPT-4 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4o-mini">GPT-4o-mini</option>
                </>
              ) : (
                <>
                  <option value="openai/gpt-4o-mini">GPT-4o-mini - OpenAI</option>
                  <option value="openai/gpt-4-0125-preview">GPT-4 Turbo - OpenAI</option>
                  <option value="openai/gpt-4">GPT-4 - OpenAI</option>
                  <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet - Anthropic</option>
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
  );
}
