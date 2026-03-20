/**
 * ML Learning Game - Main App (Enhanced)
 */

import React, { useState, useEffect } from 'react';
import useGameStore from './lib/store';
import './styles/globals.css';

// Components
import EnhancedDashboard from './components/EnhancedDashboard';
import EnhancedTruthTableBuilder from './components/EnhancedTruthTableBuilder';
import PerceptronMaster from './components/PerceptronMaster';

interface Challenge {
  id: string;
  type: 'warm-up' | 'build' | 'master' | 'expert';
  title: string;
  story: string;
  emoji: string;
  weights: number[];
  bias: number;
  activationFn: 'threshold' | 'sigmoidal' | 'linear';
  canModifyWeights: boolean;
}

const App: React.FC = () => {
  const { progress, currentTopic, addXP, setCurrentTopic, recordChallengeResult } = useGameStore();
  const [showDashboard, setShowDashboard] = useState(true);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [showMaster, setShowMaster] = useState(false);

  useEffect(() => {
    // Load progress on mount
    const tracker = useGameStore.getState().progressTracker;
    tracker.load();
    useGameStore.setState({ progress: tracker.getProgress() });
  }, []);

  // Perceptron challenges with narrative framing
  const perceptronChallenges: Challenge[] = [
    {
      id: 'spam-detector',
      type: 'warm-up',
      title: '🔐 Email Spam Detector',
      story:
        'An email system uses a perceptron to filter spam. Weights: [0.8, 1.2], Bias: -0.5. Both features indicate spam (1).',
      emoji: '📧',
      weights: [0.8, 1.2],
      bias: -0.5,
      activationFn: 'threshold',
      canModifyWeights: false,
    },
    {
      id: 'iris-classifier',
      type: 'build',
      title: '🌸 Iris Flower Classifier',
      story:
        'Build your own classifier! Adjust weights to separate iris species. Weights: [1.5, 0.8], Bias: -1.0.',
      emoji: '🌺',
      weights: [1.5, 0.8],
      bias: -1.0,
      activationFn: 'threshold',
      canModifyWeights: true,
    },
    {
      id: 'medical-diagnosis',
      type: 'build',
      title: '⚕️ Medical Diagnosis',
      story:
        'Classify patient conditions based on two factors. Weights: [2.1, 1.3], Bias: -2.2. Can you find the decision boundary?',
      emoji: '🏥',
      weights: [2.1, 1.3],
      bias: -2.2,
      activationFn: 'threshold',
      canModifyWeights: true,
    },
    {
      id: 'image-recognition',
      type: 'master',
      title: '🖼️ Image Recognition',
      story:
        'A trained perceptron identifies whether an image contains a face. Master this challenge with perfect accuracy!',
      emoji: '📸',
      weights: [1.2, 2.0],
      bias: -1.5,
      activationFn: 'threshold',
      canModifyWeights: false,
    },
  ];

  const handleChallengeComplete = (accuracy: number, xpEarned: number) => {
    addXP(xpEarned);
    recordChallengeResult({
      success: accuracy >= 0.7,
      accuracy,
      xpEarned,
      timeMs: 0,
      feedback: `Excellent! +${xpEarned} XP earned!`,
    });

    // Show motivational message after short delay
    setTimeout(() => {
      if (accuracy === 1) {
        alert('🎉 Perfect! You\'ve mastered this challenge!');
      }
    }, 1000);
  };

  const handleMasterComplete = (score: number, feedback: string) => {
    addXP(Math.round(score * 2));
    recordChallengeResult({
      success: score >= 80,
      accuracy: score / 100,
      xpEarned: Math.round(score * 2),
      timeMs: 0,
      feedback,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {showDashboard ? (
        <EnhancedDashboard
          onTopicSelect={(topic) => {
            setCurrentTopic(topic as any);
            setShowDashboard(false);
          }}
        />
      ) : (
        <>
          {/* Topic View */}
          <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <button
                onClick={() => {
                  setShowDashboard(true);
                  setCurrentChallenge(null);
                  setShowMaster(false);
                }}
                className="text-white hover:text-purple-100 font-semibold mb-2 flex items-center gap-2"
              >
                ← Back to Dashboard
              </button>
              <h2 className="text-3xl font-bold text-white">
                {currentTopic === 'perceptron' && '🧠 Perceptron Learning Path'}
              </h2>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-8">
            {currentTopic === 'perceptron' && (
              <div className="space-y-8">
                {showMaster ? (
                  <>
                    <PerceptronMaster onComplete={handleMasterComplete} />
                    <button
                      onClick={() => setShowMaster(false)}
                      className="w-full py-3 px-6 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
                    >
                      ← Back to Challenges
                    </button>
                  </>
                ) : currentChallenge ? (
                  <>
                    <EnhancedTruthTableBuilder
                      challenge={perceptronChallenges.find((c) => c.id === currentChallenge)!}
                      difficulty="medium"
                      onComplete={handleChallengeComplete}
                    />
                    <button
                      onClick={() => setCurrentChallenge(null)}
                      className="w-full py-3 px-6 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
                    >
                      ← Back to Challenge List
                    </button>
                  </>
                ) : (
                  <>
                    {/* Challenge Selection */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">📚 Choose Your Challenge</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {perceptronChallenges.map((challenge) => (
                          <button
                            key={challenge.id}
                            onClick={() => setCurrentChallenge(challenge.id)}
                            className="group text-left p-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition transform"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-2xl">{challenge.emoji}</h3>
                              <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-bold group-hover:bg-opacity-30 transition">
                                {challenge.type.toUpperCase()}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
                            <p className="text-sm text-purple-100">{challenge.story}</p>
                          </button>
                        ))}

                        {/* Master Challenge Button */}
                        <button
                          onClick={() => setShowMaster(true)}
                          className="group text-left p-6 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition transform col-span-1 md:col-span-2"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-3xl">⚔️</h3>
                            <span className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm font-bold group-hover:bg-opacity-30 transition">
                              EXAM MODE • 10 MINUTES
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">⚔️ Master Challenge - Exam Simulation</h3>
                          <p className="text-sm text-red-100">
                            Test your knowledge against a real exam-style question. No time limit in practice mode, but conditions mimic the actual exam.
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center text-white">
                        <p className="text-2xl mb-1">📊</p>
                        <p className="text-gray-300 text-sm">Challenges Done</p>
                        <p className="text-2xl font-bold">{Math.round(progress.totalXP / 25) || 0}</p>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center text-white">
                        <p className="text-2xl mb-1">✅</p>
                        <p className="text-gray-300 text-sm">Accuracy</p>
                        <p className="text-2xl font-bold">
                          {Math.round((progress.topicScores['perceptron']?.accuracy || 0) * 100)}%
                        </p>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center text-white">
                        <p className="text-2xl mb-1">🔥</p>
                        <p className="text-gray-300 text-sm">Current Streak</p>
                        <p className="text-2xl font-bold">{progress.currentStreak}</p>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center text-white">
                        <p className="text-2xl mb-1">⭐</p>
                        <p className="text-gray-300 text-sm">Total XP</p>
                        <p className="text-2xl font-bold">{progress.totalXP}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {currentTopic === 'multilayer' && (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">🚀</p>
                <p className="text-2xl text-gray-200 mb-4 font-bold">Multilayer Networks Coming Soon!</p>
                <p className="text-gray-400">We're building the backpropagation challenges now. Check back soon!</p>
              </div>
            )}

            {currentTopic === 'kohonen' && (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">🗺️</p>
                <p className="text-2xl text-gray-200 mb-4 font-bold">Kohonen Networks Coming Soon!</p>
                <p className="text-gray-400">Self-organizing map visualization is in development.</p>
              </div>
            )}

            {currentTopic === 'hopfield' && (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">💾</p>
                <p className="text-2xl text-gray-200 mb-4 font-bold">Hopfield Networks Coming Soon!</p>
                <p className="text-gray-400">Pattern recall challenges are being created.</p>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default App;
