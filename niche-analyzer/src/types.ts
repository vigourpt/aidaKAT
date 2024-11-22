export interface TrafficBackdoor {
  channel: string;
  strategy: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  potentialTraffic: string;
}

export interface Tool {
  name: string;
  description: string;
  type: 'Calculator' | 'Template' | 'Checklist' | 'Generator';
  complexity: 'Simple' | 'Medium' | 'Complex';
  conversionPotential: 'High' | 'Medium' | 'Low';
}

export interface NicheAlternative {
  niche: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  competition: string;
  potential: string;
  rationale: string;
  monthlyTraffic: string;
  profitPotential: string;
  startupCost: string;
  timeToFirstSale: string;
}

export interface KeywordMetrics {
  keyword: string;
  volume: number;
  cpc: number;
  competition: number;
}

export interface KeywordWithMetrics extends KeywordMetrics {
  keyword: string;
}

export interface NicheData {
  position: string;
  suggestedFocus: string;
  keywords: KeywordWithMetrics[];
  contentStrategy: string;
  analysis: string;
  trafficBackdoors: TrafficBackdoor[];
  tools: Tool[];
  alternatives: NicheAlternative[];
}
