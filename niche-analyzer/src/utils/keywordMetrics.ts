import { loadSettings } from '../../../src/utils/storage';

interface KeywordMetrics {
  keyword: string;
  volume: number;
  cpc: number;
  competition: number;
}

export async function getKeywordMetrics(keywords: string[]): Promise<KeywordMetrics[]> {
  const settings = loadSettings();
  const apiKey = settings.apiKeys.keywordsEverywhere;

  if (!apiKey) {
    throw new Error('Keywords Everywhere API key is not configured. Please add it in the settings.');
  }

  // Format the keywords as required by the API
  const formData = new URLSearchParams();
  formData.append('dataSource', 'gkp');
  formData.append('country', 'us');
  formData.append('currency', 'USD');
  keywords.forEach(kw => formData.append('kw[]', kw));

  const response = await fetch('https://api.keywordseverywhere.com/v1/get_keyword_data', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
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
export async function batchProcessKeywords(keywords: string[]): Promise<KeywordMetrics[]> {
  const BATCH_SIZE = 100; // Keywords Everywhere API limit
  const results: KeywordMetrics[] = [];
  
  for (let i = 0; i < keywords.length; i += BATCH_SIZE) {
    const batch = keywords.slice(i, i + BATCH_SIZE);
    const batchResults = await getKeywordMetrics(batch);
    results.push(...batchResults);
  }
  
  return results;
}
