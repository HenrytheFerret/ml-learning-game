/**
 * LessonScaffold - Template for LEARN/PRACTICE/MASTER modes
 * Provides consistent structure and progression for all lessons
 */

import React, { useState } from 'react';
import { ChallengeMode, Lesson } from '../lib/lessons';

interface LessonScaffoldProps {
  lesson: Lesson;
  currentMode: ChallengeMode;
  onModeChange: (mode: ChallengeMode) => void;
  onComplete: (mode: ChallengeMode, accuracy: number, xpEarned: number) => void;
  
  // Render functions for each mode
  renderLearn: () => React.ReactNode;
  renderPractice: () => React.ReactNode;
  renderMaster: () => React.ReactNode;
}

const LessonScaffold: React.FC<LessonScaffoldProps> = ({
  lesson,
  currentMode,
  onModeChange,
  onComplete,
  renderLearn,
  renderPractice,
  renderMaster,
}) => {
  const [learnComplete, setLearnComplete] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);
  
  const getModeStatus = (mode: ChallengeMode): 'locked' | 'active' | 'complete' => {
    if (mode === 'learn') {
      return learnComplete ? 'complete' : 'active';
    }
    if (mode === 'practice') {
      if (!learnComplete) return 'locked';
      return practiceComplete ? 'complete' : 'active';
    }
    if (mode === 'master') {
      if (!practiceComplete) return 'locked';
      return 'active';
    }
    return 'locked';
  };

  const handleLearnComplete = (xpEarned: number) => {
    setLearnComplete(true);
    onComplete('learn', 1.0, xpEarned);
    // Auto-advance to practice after 1 second
    setTimeout(() => onModeChange('practice'), 1000);
  };

  const handlePracticeComplete = (accuracy: number, xpEarned: number) => {
    setPracticeComplete(true);
    onComplete('practice', accuracy, xpEarned);
    // Ask if they want to go to master
    setTimeout(() => {
      const shouldMaster = window.confirm(
        `Great work! ${(accuracy * 100).toFixed(0)}% accuracy.\n\nReady to try MASTER challenge?`
      );
      if (shouldMaster) onModeChange('master');
    }, 1000);
  };

  const handleMasterComplete = (accuracy: number, xpEarned: number) => {
    onComplete('master', accuracy, xpEarned);
    alert(`Master complete! ${(accuracy * 100).toFixed(0)}% - ${xpEarned} XP earned!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header with lesson info */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          <p className="text-gray-600 text-sm">{lesson.description}</p>
        </div>
      </header>

      {/* Mode selector */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-8 flex-wrap">
          {(['learn', 'practice', 'master'] as ChallengeMode[]).map((mode) => {
            const status = getModeStatus(mode);
            const isActive = mode === currentMode;
            
            const modeLabel = {
              learn: '🎓 Learn',
              practice: '🔧 Practice',
              master: '⚔️ Master',
            }[mode];

            const statusStyle = {
              locked: 'bg-gray-200 text-gray-600 cursor-not-allowed opacity-50',
              active: isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer',
              complete: 'bg-green-100 text-green-700 border-2 border-green-500 cursor-pointer',
            }[status];

            return (
              <button
                key={mode}
                onClick={() => status !== 'locked' && onModeChange(mode)}
                disabled={status === 'locked'}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${statusStyle}`}
              >
                {modeLabel}
                {status === 'complete' && ' ✓'}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Lesson Progress</span>
            <span>{learnComplete && practiceComplete ? '100' : learnComplete ? '50' : '0'}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  learnComplete && practiceComplete ? 100 : learnComplete ? 50 : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentMode === 'learn' && !learnComplete && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {renderLearn()}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => handleLearnComplete(50)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                ✓ I understand! → PRACTICE
              </button>
            </div>
          </div>
        )}

        {learnComplete && currentMode === 'practice' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {renderPractice()}
          </div>
        )}

        {practiceComplete && currentMode === 'master' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {renderMaster()}
          </div>
        )}

        {/* Mode-locked messages */}
        {currentMode === 'practice' && !learnComplete && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <p className="text-yellow-800 font-semibold">🔒 Complete LEARN first</p>
            <p className="text-yellow-700 text-sm mt-1">You must understand the concept before practicing.</p>
          </div>
        )}

        {currentMode === 'master' && !practiceComplete && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
            <p className="text-orange-800 font-semibold">🔒 Complete PRACTICE first</p>
            <p className="text-orange-700 text-sm mt-1">You need to practice before attempting the master challenge.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonScaffold;
