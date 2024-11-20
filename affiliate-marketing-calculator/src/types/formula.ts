import { LucideIcon } from 'lucide-react';

export interface Formula {
  name: string;
  inputs: string[];
  description: string;
  formula: string;
  calculate: (values: number[]) => number;
  icon: LucideIcon;
  formatResult?: (result: number) => string;
}