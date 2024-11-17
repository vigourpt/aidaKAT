import React from 'react';
import StageCard from './StageCard';
import type { AidaResultsProps } from '../types';

const stageColors = {
  action: 'bg-red-100',
  desire: 'bg-yellow-100',
  interest: 'bg-green-100',
  awareness: 'bg-blue-100',
};

const AidaResults: React.FC<AidaResultsProps> = ({ results }) => {
  return (
    <div className="mt-8 space-y-4">
      {(Object.keys(results) as Array<keyof typeof results>).map((stage) => (
        <StageCard
          key={stage}
          stage={stage}
          keywords={results[stage]}
          color={stageColors[stage]}
        />
      ))}
    </div>
  );
};

export default AidaResults;