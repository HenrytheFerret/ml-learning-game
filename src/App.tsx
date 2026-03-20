/**
 * ML Learning Game - Main App
 */

import React, { useState, useEffect } from 'react';
import useGameStore from './lib/store';
import './styles/globals.css';

// Components
import TruthTableBuilder from './components/TruthTableBuilder';
import ProgressBar from './components/ProgressBar';
import TopicCard from './components/TopicCard';

const App: React.FC = () => {
  const { progress, currentTopic, addXP, setCurrentTopic, recordChallengeResult } = useGameStore();
  const [showDashboard, setShowDashboard] = useState(true);

  useEffect(() => {
    // Load progress on mount
    const tracker = useGameStore.getState().progressTracker;
    tracker.load();
    useGameStore.setState({ progress: tracker.getProgress() });
  }, []);

  const topics = [
    {
      id: 'perceptron',
      name: 'Perceptron',
      emoji: '🧠',
      description: 'Single neuron learning (40% of exam)',
      progress: progress.topicScores['perceptron']?.accuracy || 0,
      completed: progress.topicScores['perceptron']?.completed || 0,
    },
    {
      id: 'multilayer',
      name: 'Multilayer Networks',
      emoji: '🕸️',
      description: 'Feed-forward & backpropagation (27% of exam)',
      progress: progress.topicScores['multilayer']?.accuracy || 0,
      completed: progress.topicScores['multilayer']?.completed || 0,
    },
    {
      id: 'kohonen',
      name: 'Kohonen Maps',
      emoji: '🗺️',
      description: 'Self-organizing networks (31% of exam)',
      progress: progress.topicScores['kohonen']?.accuracy || 0,
      completed: progress.topicScores['kohonen']?.completed || 0,
    },
    {
      id: 'hopfield',
      name: 'Hopfield Networks',
      emoji: '💾',
      description: 'Associative memory (27% of exam)',
      progress: progress.topicScores['hopfield']?.accuracy || 0,
      completed: progress.topicScores['hopfield']?.completed || 0,
    },
  ];

  const handleChallengeComplete = (accuracy: number, xpEarned: number) => {
    addXP(xpEarned);
    recordChallengeResult({
      success: accuracy >= 0.7,
      accuracy,
      xpEarned,
      timeMs: 0, // Would track actual time in real implementation
      feedback: `Great job! +${xpEarned} XP`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-purple-600">
            🦦 ML Learning Game
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total XP</p>
              <p className="text-2xl font-bold text-orange-500">{progress.totalXP}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Level</p>
              <p className="text-2xl font-bold text-blue-600">{progress.level + 1}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {showDashboard ? (
          <>
            {/* Dashboard View */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
              <ProgressBar currentXP={progress.totalXP} level={progress.level} />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    {...topic}
                    onClick={() => {
                      setCurrentTopic(topic.id as any);
                      setShowDashboard(false);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Badges Section */}
            {progress.badges.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                <div className="flex gap-2 flex-wrap">
                  {progress.badges.map((badge) => (
                    <div key={badge} className="px-3 py-2 bg-yellow-100 rounded-full text-sm font-semibold">
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Topic View */}
            <button
              onClick={() => setShowDashboard(true)}
              className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back to Dashboard
            </button>

            {currentTopic === 'perceptron' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">🧠 Perceptron Learning Path</h2>

                {/* Level 2: Truth Table Builder */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-2">Level 2: Build the Truth Table</h3>
                  <p className="text-gray-600 mb-4">
                    A threshold unit has weights [2.0, 1.1] and bias [-1.2].
                    Calculate the net value and activation for all input combinations.
                  </p>
                  <TruthTableBuilder
                    weights={[2.0, 1.1]}
                    bias={-1.2}
                    activationFn="threshold"
                    difficulty="medium"
                    onComplete={handleChallengeComplete}
                  />
                </div>

                {/* More challenges would go here */}
              </div>
            )}

            {currentTopic === 'multilayer' && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">🚀 Multilayer Networks coming soon!</p>
                <p className="text-gray-500">Currently in development. Check back soon!</p>
              </div>
            )}

            {currentTopic === 'kohonen' && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">🗺️ Kohonen Networks coming soon!</p>
                <p className="text-gray-500">Currently in development. Check back soon!</p>
              </div>
            )}

            {currentTopic === 'hopfield' && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">💾 Hopfield Networks coming soon!</p>
                <p className="text-gray-500">Currently in development. Check back soon!</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
