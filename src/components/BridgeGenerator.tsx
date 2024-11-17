import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { BridgeGeneratorProps, BridgeResult } from '../types';

const BridgeGenerator: React.FC<BridgeGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [startKeyword, setStartKeyword] = useState('');
  const [endKeyword, setEndKeyword] = useState('');
  const [result, setResult] = useState<BridgeResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (startKeyword.trim() && endKeyword.trim()) {
      const result = await onGenerate(startKeyword.trim(), endKeyword.trim());
      setResult(result);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={startKeyword}
            onChange={(e) => setStartKeyword(e.target.value)}
            placeholder="Start keyword"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={endKeyword}
            onChange={(e) => setEndKeyword(e.target.value)}
            placeholder="End keyword"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !startKeyword.trim() || !endKeyword.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            'Generate Bridge'
          )}
        </button>
      </form>

      {result && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Content Bridge Plan</h3>
            <div className="space-y-4">
              {result.transitions.map((transition, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{transition.from}</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="font-medium">{transition.to}</span>
                  </div>
                  <p className="text-sm text-gray-700">{transition.connection}</p>
                  <p className="text-sm italic text-gray-600">"{transition.transitionText}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BridgeGenerator;