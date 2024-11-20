import { DollarSign, Percent, BarChart2, TrendingUp, Users, ShoppingCart, Target, PieChart, CreditCard, LineChart } from 'lucide-react';
import { Formula } from '../types/formula';

export const formulas: Record<string, Formula> = {
  totalAdSpend: {
    name: 'Ad Spend',
    inputs: ['Cost per Click (CPC)', 'Total Clicks'],
    description: 'Calculate total advertising spend',
    formula: 'CPC × Total Clicks',
    calculate: (values) => values[0] * values[1],
    icon: DollarSign,
    formatResult: (result) => `$${result}`
  },
  cpm: {
    name: 'CPM',
    inputs: ['Total Ad Spend', 'Total Impressions'],
    description: 'Cost per thousand impressions',
    formula: '(Ad Spend / Impressions) × 1000',
    calculate: (values) => (values[0] / values[1]) * 1000,
    icon: BarChart2,
    formatResult: (result) => `$${result}`
  },
  ctr: {
    name: 'CTR',
    inputs: ['Total Clicks', 'Total Impressions'],
    description: 'Click-through rate percentage',
    formula: '(Clicks / Impressions) × 100',
    calculate: (values) => (values[0] / values[1]) * 100,
    icon: Percent,
    formatResult: (result) => `${result}%`
  },
  cvr: {
    name: 'CVR',
    inputs: ['Total Conversions', 'Total Clicks'],
    description: 'Conversion rate percentage',
    formula: '(Conversions / Clicks) × 100',
    calculate: (values) => (values[0] / values[1]) * 100,
    icon: Target,
    formatResult: (result) => `${result}%`
  },
  cpa: {
    name: 'CPA',
    inputs: ['Total Ad Spend', 'Total Conversions'],
    description: 'Cost per acquisition',
    formula: 'Ad Spend / Conversions',
    calculate: (values) => values[0] / values[1],
    icon: PieChart,
    formatResult: (result) => `$${result}`
  },
  epc: {
    name: 'EPC',
    inputs: ['Revenue', 'Total Clicks'],
    description: 'Earnings per click',
    formula: 'Revenue / Clicks',
    calculate: (values) => values[0] / values[1],
    icon: CreditCard,
    formatResult: (result) => `$${result}`
  },
  aov: {
    name: 'AOV',
    inputs: ['Revenue', 'Total Orders'],
    description: 'Average order value',
    formula: 'Revenue / Orders',
    calculate: (values) => values[0] / values[1],
    icon: ShoppingCart,
    formatResult: (result) => `$${result}`
  },
  roi: {
    name: 'ROI',
    inputs: ['Revenue', 'Total Ad Spend'],
    description: 'Return on investment percentage',
    formula: '((Revenue - Ad Spend) / Ad Spend) × 100',
    calculate: (values) => ((values[0] - values[1]) / values[1]) * 100,
    icon: LineChart,
    formatResult: (result) => `${result}%`
  },
  roas: {
    name: 'ROAS',
    inputs: ['Revenue', 'Total Ad Spend'],
    description: 'Return on ad spend ratio',
    formula: 'Revenue / Ad Spend',
    calculate: (values) => values[0] / values[1],
    icon: TrendingUp,
    formatResult: (result) => `${result}x`
  },
  ltv: {
    name: 'LTV',
    inputs: ['Average Order Value', 'Purchase Frequency', 'Customer Lifespan'],
    description: 'Customer lifetime value',
    formula: 'AOV × Frequency × Lifespan',
    calculate: (values) => values[0] * values[1] * values[2],
    icon: Users,
    formatResult: (result) => `$${result}`
  }
};