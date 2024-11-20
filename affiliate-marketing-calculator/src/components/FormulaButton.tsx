import { Formula } from '../types/formula';

interface FormulaButtonProps {
  formula: Formula;
  isSelected: boolean;
  onClick: () => void;
}

export function FormulaButton({ formula, isSelected, onClick }: FormulaButtonProps) {
  const Icon = formula.icon;
  
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg transition-all h-full flex flex-col items-center justify-center ${
        isSelected
          ? 'bg-blue-600 text-white shadow-lg scale-105'
          : 'bg-white hover:bg-blue-50 text-gray-800 shadow-md hover:scale-105'
      }`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <div className="font-semibold text-center">{formula.name}</div>
      <div className="text-xs mt-1 opacity-75 text-center">{formula.description}</div>
    </button>
  );
}