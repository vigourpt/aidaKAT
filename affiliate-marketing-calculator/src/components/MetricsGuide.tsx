import { Activity } from 'lucide-react';
import { Formula } from '../types/formula';

interface MetricsGuideProps {
  formulas: Record<string, Formula>;
}

export function MetricsGuide({ formulas }: MetricsGuideProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        <Activity className="inline-block mr-2 mb-1" />
        Metrics Guide
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.values(formulas).map((formula) => (
          <div key={formula.name} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">{formula.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{formula.description}</p>
            <div className="text-xs text-gray-500">Formula: {formula.formula}</div>
          </div>
        ))}
      </div>
    </div>
  );
}