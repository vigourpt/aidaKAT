export interface KeywordMetrics {
  keyword: string;
  volume: number;
  cpc: number;
  competition: number;
}

export interface KeywordWithMetrics extends KeywordMetrics {
  keyword: string;
}

export interface AidaStageResults {
  awareness: KeywordWithMetrics[];
  interest: KeywordWithMetrics[];
  desire: KeywordWithMetrics[];
  action: KeywordWithMetrics[];
}

export interface BridgeTransition {
  from: string;
  to: string;
  connection: string;
  transitionText: string;
}

export interface BridgeResult {
  path: string[];
  transitions: BridgeTransition[];
}

export interface ApiKeys {
  openai: string;
  openRouter: string;
  keywordsEverywhere: string;
}

export interface Settings {
  apiKeys: ApiKeys;
  preferredModel: string;
  activeApiType: 'openai' | 'openrouter';
}

export interface StageCardProps {
  stage: string;
  keywords: KeywordWithMetrics[];
  color: string;
}

export interface KeywordInputProps {
  onAnalyze: (keyword: string) => void;
  isLoading: boolean;
}

export interface AidaResultsProps {
  results: AidaStageResults;
}

export interface BridgeGeneratorProps {
  onGenerate: (start: string, end: string) => void;
  isLoading: boolean;
}

export interface SettingsTabProps {
  isOpen: boolean;
  onClose: () => void;
}
