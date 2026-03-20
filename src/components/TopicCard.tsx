/**
 * Topic Card Component
 */

import React from 'react';

interface TopicCardProps {
  id: string;
  name: string;
  emoji: string;
  description: string;
  progress: number;
  completed: number;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  name,
  emoji,
  description,
  progress,
  completed,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <div className="text-4xl mb-2">{emoji}</div>
      <h3 className="text-lg font-bold mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Accuracy</span>
            <span className="text-xs font-bold text-blue-600">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {completed > 0 && (
          <p className="text-xs text-gray-600">
            ✅ {completed} challenge{completed !== 1 ? 's' : ''} completed
          </p>
        )}
      </div>
    </button>
  );
};

export default TopicCard;
