/**
 * Progress Bar Component
 */

import React from 'react';
import { ScoreCalculator, LEVELS } from '../lib/scoring';

interface ProgressBarProps {
  currentXP: number;
  level: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentXP, level }) => {
  const progress = ScoreCalculator.calculateProgressToNextLevel(currentXP);
  const levelData = LEVELS[level as keyof typeof LEVELS];
  const nextLevelData = LEVELS[(level + 1) as keyof typeof LEVELS];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold">{levelData.name}</h3>
        <p className="text-sm text-gray-600">
          {currentXP} / {nextLevelData.minXP === Infinity ? 'Max' : nextLevelData.minXP} XP
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-purple-400 to-blue-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {Math.round(progress)}% to next level
      </p>
    </div>
  );
};

export default ProgressBar;
