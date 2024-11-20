import { useState } from 'react';
import { Formula } from '../types/formula';

interface CalculatorProps {
  formula: Formula;
  onClear: () => void;
}

export function Calculator({ formula, onClear }: CalculatorProps) {
  const [inputValues, setInputValues] = useState<Record<number, number>>({});
  const [result, setResult] = useState<string>('');

  const handleInputChange = (index: number, value: string) => {
    setInputValues({ ...inputValues, [index]: parseFloat(value) || 0 });
  };

  const calculate = () => {
    const values = formula.inputs.map((_, index) => inputValues[index] || 0);
    const calculatedResult = formula.calculate(values);
    setResult(formula.formatResult?.(calculatedResult) ?? calculatedResult.toFixed(2));
  };

  const clear = () => {
    setInputValues({});
    setResult('');
    onClear();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {formula.name} Calculator
        </h2>
        <p className="text-gray-600 text-sm">Formula: {formula.formula}</p>
      </div>

      <div className="space-y-4 mb-6">
        {formula.inputs.map((input, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {input}
            </label>
            <input
              type="number"
              value={inputValues[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Enter ${input.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={calculate}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate
        </button>
        <button
          onClick={clear}
          className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-600 font-medium mb-1">Result</div>
          <div className="text-2xl font-bold text-blue-900">{result}</div>
        </div>
      )}
    </div>
  );
}