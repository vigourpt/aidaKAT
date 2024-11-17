import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { SettingsTabProps } from '../types';
import { loadApiKeys, saveApiKeys } from '../utils/storage';

const SettingsTab: React.FC<SettingsTabProps> = ({ isOpen, onClose }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [keywordsEverywhereKey, setKeywordsEverywhereKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const keys = loadApiKeys();
    setOpenaiKey(keys.openai || '');
    setKeywordsEverywhereKey(keys.keywordsEverywhere || '');
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      await saveApiKeys({
        openai: openaiKey.trim(),
        keywordsEverywhere: keywordsEverywhereKey.trim(),
      });
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => {
        onClose();
        setSaveMessage('');
      }, 1500);
    } catch (error) {
      setSaveMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">API Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="openai" className="block text-sm font-medium text-gray-700">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="openai"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="sk-..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="keywordsEverywhere" className="block text-sm font-medium text-gray-700">
              Keywords Everywhere API Key
            </label>
            <input
              type="password"
              id="keywordsEverywhere"
              value={keywordsEverywhereKey}
              onChange={(e) => setKeywordsEverywhereKey(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {saveMessage && (
            <div className={`p-3 rounded-lg text-center ${
              saveMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {saveMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;