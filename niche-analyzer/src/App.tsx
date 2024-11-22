import React, { useState } from 'react';
import { SettingsTab } from '../../src/components/SettingsTab';
import { NicheAnalyzer } from './components/NicheAnalyzer';
import Navigation from '../../src/components/Navigation';
import type { NicheData, KeywordWithMetrics } from './types';
import { loadSettings } from '../../src/utils/storage';
import { batchProcessKeywords } from './utils/keywordMetrics';

export default function App() {
  const [result, setResult] = useState<NicheData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const parseAIResponse = (content: string): Omit<NicheData, 'keywords'> & { keywords: string[] } => {
    try {
      if (typeof content === 'string') {
        // Try to find a JSON object in the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          // Ensure the response has the required structure
          if (!parsed.keywords || !Array.isArray(parsed.keywords)) {
            throw new Error('Invalid response format: missing keywords array');
          }
          return parsed;
        }
      }
      throw new Error('Could not find valid JSON in response');
    } catch (e) {
      console.error('Error parsing AI response:', e);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  };

  const analyzeNiche = async (niche: string) => {
    const settings = loadSettings();
    const aiApiKey = settings.activeApiType === 'openai' ? settings.apiKeys.openai : settings.apiKeys.openRouter;
    const keywordsApiKey = settings.apiKeys.keywordsEverywhere;
    
    if (!aiApiKey) {
      setError(`Please set your ${settings.activeApiType === 'openai' ? 'OpenAI' : 'OpenRouter'} API key in settings first`);
      return;
    }

    if (!keywordsApiKey) {
      setError('Keywords Everywhere API key is not configured. Please add it in the settings.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, get the niche analysis from AI
      let response;
      const prompt = `Analyze this niche market: "${niche}". Focus on beginner-friendly opportunities with low competition. If the niche is too competitive, suggest 3 closely related but easier alternatives. Return ONLY a JSON object with this structure:
{
  "position": "Brief description of current market position",
  "suggestedFocus": "Specific focus area recommendation for beginners",
  "keywords": ["keyword1", "keyword2", ...],
  "contentStrategy": "Content strategy overview focused on beginner-friendly approach",
  "analysis": "Detailed market analysis with emphasis on entry barriers",
  "trafficBackdoors": [
    {
      "channel": "Specific low-competition topic related to high-CPC main topic",
      "strategy": "How to leverage this opportunity as a beginner",
      "difficulty": "Easy",
      "potentialTraffic": "Estimated monthly visitors"
    }
  ],
  "tools": [
    {
      "name": "Tool name",
      "description": "Tool description",
      "type": "Calculator|Template|Checklist|Generator",
      "complexity": "Simple",
      "conversionPotential": "High|Medium|Low"
    }
  ],
  "alternatives": [
    {
      "niche": "More specific sub-niche",
      "difficulty": "Easy",
      "competition": "Low competition level description",
      "potential": "Revenue potential for beginners",
      "rationale": "Why this is good for beginners",
      "monthlyTraffic": "Estimated monthly visitors",
      "profitPotential": "Estimated monthly profit range",
      "startupCost": "Initial investment needed",
      "timeToFirstSale": "Estimated time to first sale"
    }
  ]
}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (settings.activeApiType === 'openai') {
        headers['Authorization'] = `Bearer ${aiApiKey}`;
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: settings.preferredModel,
            messages: [{
              role: 'user',
              content: prompt
            }]
          })
        });
      } else {
        headers['Authorization'] = `Bearer ${aiApiKey}`;
        headers['HTTP-Referer'] = window.location.href;
        headers['X-Title'] = 'ImVigour Niche Analyzer';
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: settings.preferredModel,
            messages: [{
              role: 'user',
              content: prompt
            }]
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', errorData);
        throw new Error(errorData?.error?.message || `Failed to analyze niche (${response.status})`);
      }

      const data = await response.json();
      console.log('AI Response:', data); // Debug log

      // Extract content from response
      let content;
      if (settings.activeApiType === 'openai') {
        content = data.choices?.[0]?.message?.content;
      } else {
        content = data.choices?.[0]?.message?.content;
      }

      if (!content) {
        throw new Error('No content in AI response');
      }

      const nicheData = parseAIResponse(content);

      // Then, get keyword metrics from Keywords Everywhere API
      const keywordMetrics = await batchProcessKeywords(nicheData.keywords);

      // Combine the AI analysis with keyword metrics
      const finalResult: NicheData = {
        ...nicheData,
        keywords: keywordMetrics
      };

      setResult(finalResult);
    } catch (err) {
      console.error('Error in analyzeNiche:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = () => {
    // Refresh the page or update state if needed when settings change
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="container mx-auto py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Beginner-Friendly Niche Analyzer
          </h1>
          <p className="text-gray-600">
            Discover low-competition niches perfect for beginners
          </p>
        </div>

        <NicheAnalyzer
          onAnalyze={analyzeNiche}
          result={result}
          isLoading={isLoading}
          error={error}
        />
      </main>

      <SettingsTab 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}
