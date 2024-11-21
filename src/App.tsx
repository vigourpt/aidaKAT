import React, { useState } from 'react';
import { Download, ArrowRight, Search, Sparkles, HelpCircle } from 'lucide-react';
import Navigation from './components/Navigation';
import KeywordInput from './components/KeywordInput';
import AidaResults from './components/AidaResults';
import BridgeGenerator from './components/BridgeGenerator';
import { SettingsTab } from './components/SettingsTab';
import InstructionsModal from './components/InstructionsModal';
import { analyzeKeyword, generateBridge } from './utils/keywordAnalysis';
import type { AidaStageResults, BridgeResult, Settings as SettingsType } from './types';

function App() {
  const [aidaResults, setAidaResults] = useState<AidaStageResults | null>(null);
  const [bridgeResults, setBridgeResults] = useState<BridgeResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingBridge, setIsGeneratingBridge] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSettingsChange = (newSettings: SettingsType) => {
    // Handle settings change if needed
    console.log('Settings updated:', newSettings);
  };

  const handleAnalyze = async (keyword: string) => {
    setError(null);
    setAidaResults(null);
    setIsAnalyzing(true);
    
    try {
      const results = await analyzeKeyword(keyword);
      setAidaResults(results);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBridgeGenerate = async (start: string, end: string) => {
    setIsGeneratingBridge(true);
    setError(null);
    setBridgeResults(null);
    
    try {
      const bridge = await generateBridge(start, end);
      setBridgeResults(bridge);
      return bridge;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsGeneratingBridge(false);
    }
  };

  const exportToCsv = () => {
    if (!aidaResults) return;

    const formatKeywords = (keywords: typeof aidaResults.action) => {
      return keywords.map(kw => 
        `"${kw.keyword}",${kw.volume},${kw.cpc.toFixed(2)},${(kw.competition * 100).toFixed(1)}%`
      ).join('\n');
    };

    const csvContent = [
      'Stage,Keyword,Volume,CPC,Competition',
      ...aidaResults.action.map(kw => `Action,${formatKeywords([kw])}`),
      ...aidaResults.desire.map(kw => `Desire,${formatKeywords([kw])}`),
      ...aidaResults.interest.map(kw => `Interest,${formatKeywords([kw])}`),
      ...aidaResults.awareness.map(kw => `Awareness,${formatKeywords([kw])}`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aida-keywords.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <Navigation onOpenSettings={() => setIsSettingsOpen(true)} />
      <div className="container mx-auto px-4 py-8 pt-24">
        <header className="text-center mb-12 relative">
          <div className="absolute right-0 top-0 flex gap-2">
            <button
              onClick={() => setIsInstructionsOpen(true)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              aria-label="Open Instructions"
            >
              <HelpCircle className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AIDA Keyword Analysis Tool
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive keyword insights using the AIDA framework and create content bridges
          </p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-indigo-600" />
              Keyword Analysis
            </h2>
            <KeywordInput 
              onAnalyze={handleAnalyze}
              isLoading={isAnalyzing}
            />
            {aidaResults && (
              <>
                <AidaResults results={aidaResults} />
                <button
                  onClick={exportToCsv}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export to CSV
                </button>
              </>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              Content Bridge Generator
            </h2>
            <BridgeGenerator 
              onGenerate={handleBridgeGenerate}
              isLoading={isGeneratingBridge}
            />
            {bridgeResults && bridgeResults.transitions.map((transition, idx) => (
              <div key={idx} className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{transition.from}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>{transition.to}</span>
                </div>
                <p className="mt-2 text-sm">{transition.connection}</p>
                <p className="mt-1 text-sm italic text-gray-600">"{transition.transitionText}"</p>
              </div>
            ))}
          </section>
        </div>
      </div>
      <SettingsTab onSettingsChange={handleSettingsChange} />
      <InstructionsModal isOpen={isInstructionsOpen} onClose={() => setIsInstructionsOpen(false)} />
    </div>
  );
}

export default App;
