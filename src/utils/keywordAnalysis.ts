import { loadSettings } from './storage';
import type { AidaStageResults, BridgeResult, KeywordMetrics } from '../types';

interface AidaKeywords {
  awareness: string[];
  interest: string[];
  desire: string[];
  action: string[];
}

const getKeywordsEverywhereHeaders = () => {
  const settings = loadSettings();
  const apiKey = settings.apiKeys.keywordsEverywhere;
  
  if (!apiKey) {
    throw new Error('Keywords Everywhere API key is not configured. Please add it in the settings.');
  }
  
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
  };
};

async function getKeywordMetrics(keywords: string[]): Promise<KeywordMetrics[]> {
  // Format the keywords as required by the API
  const formData = new URLSearchParams();
  formData.append('dataSource', 'gkp');
  formData.append('country', 'us');
  formData.append('currency', 'USD');
  keywords.forEach(kw => formData.append('kw[]', kw));

  const response = await fetch('https://api.keywordseverywhere.com/v1/get_keyword_data', {
    method: 'POST',
    headers: getKeywordsEverywhereHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Keywords Everywhere API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.data.map((item: any) => ({
    keyword: item.keyword,
    volume: item.vol || 0,
    cpc: item.cpc?.value ? parseFloat(item.cpc.value) : 0,
    competition: item.competition || 0,
  }));
}

// Process keywords in batches to respect API limits
async function batchProcessKeywords(keywords: string[]): Promise<KeywordMetrics[]> {
  const BATCH_SIZE = 100; // Keywords Everywhere API limit
  const results: KeywordMetrics[] = [];
  
  for (let i = 0; i < keywords.length; i += BATCH_SIZE) {
    const batch = keywords.slice(i, i + BATCH_SIZE);
    const batchResults = await getKeywordMetrics(batch);
    results.push(...batchResults);
  }
  
  return results;
}

async function makeAIRequest(prompt: string): Promise<string> {
  const settings = loadSettings();
  const apiKey = settings.activeApiType === 'openai' ? settings.apiKeys.openai : settings.apiKeys.openRouter;
  
  if (!apiKey) {
    throw new Error(`${settings.activeApiType === 'openai' ? 'OpenAI' : 'OpenRouter'} API key is not configured. Please add it in the settings.`);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  const requestBody = {
    messages: [{
      role: 'user',
      content: prompt
    }],
    temperature: 0.7,
    max_tokens: 2000
  };

  if (settings.activeApiType === 'openrouter') {
    headers['HTTP-Referer'] = window.location.href;
    headers['X-Title'] = 'ImVigour AIDA Analysis';
  }

  const response = await fetch(
    settings.activeApiType === 'openrouter' ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...requestBody,
        model: settings.preferredModel
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('AI API Error:', errorData);
    throw new Error(errorData?.error?.message || `API request failed (${response.status})`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content in AI response');
  }

  return content;
}

export const analyzeKeyword = async (keyword: string): Promise<AidaStageResults> => {
  if (!keyword.trim()) {
    throw new Error('Please enter a keyword to analyze');
  }

  // Generate keywords for each AIDA stage
  const prompt = `Generate 50 keywords for each AIDA stage based on: "${keyword}".
  
  Format the response as a JSON object with these keys:
  - awareness: Array of informational and problem-awareness keywords
  - interest: Array of research and comparison keywords
  - desire: Array of product/solution specific keywords
  - action: Array of purchase and conversion keywords
  
  Each array should contain exactly 50 keywords.`;

  const content = await makeAIRequest(prompt);

  let aidaKeywords: AidaKeywords;
  try {
    aidaKeywords = JSON.parse(content) as AidaKeywords;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI response');
  }
  
  // Get metrics for all keywords in batches
  const allKeywords = Object.values(aidaKeywords).flat();
  const metrics = await batchProcessKeywords(allKeywords);
  
  // Create a lookup map for quick access to metrics
  const metricsMap = new Map(metrics.map(m => [m.keyword, m]));
  
  // Combine keywords with their metrics
  const results: AidaStageResults = {
    awareness: aidaKeywords.awareness.map((kw: string) => ({
      ...metricsMap.get(kw) || { keyword: kw, volume: 0, cpc: 0, competition: 0 }
    })),
    interest: aidaKeywords.interest.map((kw: string) => ({
      ...metricsMap.get(kw) || { keyword: kw, volume: 0, cpc: 0, competition: 0 }
    })),
    desire: aidaKeywords.desire.map((kw: string) => ({
      ...metricsMap.get(kw) || { keyword: kw, volume: 0, cpc: 0, competition: 0 }
    })),
    action: aidaKeywords.action.map((kw: string) => ({
      ...metricsMap.get(kw) || { keyword: kw, volume: 0, cpc: 0, competition: 0 }
    }))
  };

  return results;
};

export const generateBridge = async (
  start: string,
  end: string
): Promise<BridgeResult> => {
  if (!start.trim() || !end.trim()) {
    throw new Error('Please enter both start and end keywords');
  }

  const prompt = `Create a content bridge plan from "${start}" to "${end}" that shows how to naturally transition between these topics in a single piece of content.

  Format the response as a JSON object with:
  - path: Array of subtopics creating a logical flow
  - transitions: Array of objects containing:
    - from: starting subtopic
    - to: ending subtopic
    - connection: description of how these topics connect
    - transitionText: suggested transition sentence`;

  const content = await makeAIRequest(prompt);

  try {
    const bridgePlan = JSON.parse(content);
    return {
      path: bridgePlan.path,
      transitions: bridgePlan.transitions
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI response');
  }
};
