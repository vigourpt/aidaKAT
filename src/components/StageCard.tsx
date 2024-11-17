import React from 'react';
import type { StageCardProps } from '../types';

const StageCard: React.FC<StageCardProps> = ({ stage, keywords, color }) => {
  const stageTitle = stage.charAt(0).toUpperCase() + stage.slice(1);
  
  return (
    <div className={`p-4 rounded-lg ${color} shadow-sm`}>
      <h3 className="text-lg font-semibold mb-3">{stageTitle}</h3>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {keywords.map((kw, idx) => (
          <div
            key={idx}
            className="bg-white bg-opacity-50 p-3 rounded-md space-y-1"
          >
            <div className="font-medium">{kw.keyword}</div>
            <div className="text-sm text-gray-600 grid grid-cols-3 gap-2">
              <span>Vol: {kw.volume.toLocaleString()}</span>
              <span>CPC: ${kw.cpc.toFixed(2)}</span>
              <span>Comp: {(kw.competition * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageCard;