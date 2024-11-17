import { loadApiKeys } from './storage';
import OpenAI from 'openai';
import type { AidaStageResults, BridgeResult, KeywordMetrics } from '../types';

const getOpenAIClient = () => {
  const { openai: apiKey } = loadApiKeys();
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add it in the settings.');
  }
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

const getKeywordsEverywhereHeaders = () => {
  const { keywordsEverywhere: apiKey } = loadApiKeys();
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

async function generateAIDAKeywords(keyword: string): Promise<{ [key: string]: string[] }> {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a keyword research expert. Generate 50 highly relevant keywords for each AIDA stage based on the main keyword. Return only a JSON object with no additional text."
      },
      {
        role: "user",
        content: `Generate 50 keywords for each AIDA stage based on: "${keyword}".
        
        Format the response as a JSON object with these keys:
        - awareness: Array of informational and problem-awareness keywords
        - interest: Array of research and comparison keywords
        - desire: Array of product/solution specific keywords
        - action: Array of purchase and conversion keywords
        
        Each array should contain exactly 50 keywords.`
      }
    ],
    temperature: 0.7
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error('Failed to generate keywords');
  }

  try {
    return JSON.parse(response);
  } catch (error) {
    throw new Error('Failed to parse AI response');
  }
}

export const analyzeKeyword = async (keyword: string): Promise<AidaStageResults> => {
  if (!keyword.trim()) {
    throw new Error('Please enter a keyword to analyze');
  }

  // Generate keywords for each AIDA stage
  const aidaKeywords = await generateAIDAKeywords(keyword);
  
  // Get metrics for all keywords in batches
  const allKeywords = Object.values(aidaKeywords).flat();
  const metrics = await batchProcessKeywords(allKeywords);
  
  // Create a lookup map for quick access to metrics
  const metricsMap = new Map(metrics.map(m => [m.keyword, m]));
  
  // Combine keywords with their metrics
  const results: AidaStageResults = {
    awareness: aidaKeywords.awareness.map(kw => ({
      ...metricsMap.get(kw) || { keyword: kw, volume: 0, cpc: 0, competition: 0 }
    })),
    interest: aidaKeywords.interest.map(kw => ({
      ...metricsMap.get(kw) || { keyword: kw, volume: 0, cpc: 0, competition: 0 }
    })),
    desire: aidaKeywords.desire.map(kw => ({
      ...metricsMap.get(kw) || { keyword: kw, volume: 0, cpc: 0, competition: 0 }
    })),
    action: aidaKeywords.action.map(kw => ({
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

  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a content strategy expert. Create a detailed content bridge plan that shows how to naturally transition from one topic to another in a single piece of content. Return only a JSON object with no additional text."
      },
      {
        role: "user",
        content: `Create a content bridge plan from "${start}" to "${end}" that shows how to naturally transition between these topics in a single piece of content.

        Format the response as a JSON object with:
        - path: Array of subtopics creating a logical flow
        - transitions: Array of objects containing:
          - from: starting subtopic
          - to: ending subtopic
          - connection: description of how these topics connect
          - transitionText: suggested transition sentence`
      }
    ],
    temperature: 0.7
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error('Failed to generate content bridge');
  }

  try {
    const bridgePlan = JSON.parse(response);
    return {
      path: bridgePlan.path,
      transitions: bridgePlan.transitions
    };
  } catch (error) {
    throw new Error('Failed to parse AI response');
  }
};