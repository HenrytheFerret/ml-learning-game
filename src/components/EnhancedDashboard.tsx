/**
 * Enhanced Dashboard with Daily Streaks and Challenge Progression
 */

import React, { useState, useEffect } from 'react';
import useGameStore from '../lib/store';

interface DashboardProps {
  onTopicSelect: (topic: string) => void;
}

const EnhancedDashboard: React.FC<DashboardProps> = ({ onTopicSelect }) => {
  const { progress } = useGameStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  // Calculate level and XP progress
  const xpThresholds = [0, 100, 300, 700, 1500];
  const level = Math.min(4, xpThresholds.findIndex((threshold, i) => progress.totalXP < threshold) - 1);
  const currentLevelXP = xpThresholds[Math.max(0, level)];
  const nextLevelXP = xpThresholds[Math.min(4, level + 1)];
  const xpInLevel = progress.totalXP - currentLevelXP;
  const xpToNextLevel = nextLevelXP - currentLevelXP;
  const levelProgress = Math.round((xpInLevel / xpToNextLevel) * 100);

  const topics = [
    {
      id: 'perceptron',
      name: 'Perceptron',
      emoji: '🧠',
      color: 'from-purple-500 to-purple-600',
      description: 'Single neuron learning',
      examWeight: '40%',
      lessons: 6,
      completed: progress.topicScores['perceptron']?.completed || 0,
    },
    {
      id: 'multilayer',
      name: 'Multilayer Networks',
      emoji: '🕸️',
      color: 'from-blue-500 to-blue-600',
      description: 'Feed-forward & backpropagation',
      examWeight: '27%',
      lessons: 6,
      completed: progress.topicScores['multilayer']?.completed || 0,
    },
    {
      id: 'kohonen',
      name: 'Kohonen Maps',
      emoji: '🗺️',
      color: 'from-cyan-500 to-cyan-600',
      description: 'Self-organizing networks',
      examWeight: '31%',
      lessons: 6,
      completed: progress.topicScores['kohonen']?.completed || 0,
    },
    {
      id: 'hopfield',
      name: 'Hopfield Networks',
      emoji: '💾',
      color: 'from-orange-500 to-orange-600',
      description: 'Associative memory',
      examWeight: '27%',
      lessons: 6,
      completed: progress.topicScores['hopfield']?.completed || 0,
    },
  ];

  const levelNames = ['Novice', 'Apprentice', 'Practitioner', 'Expert', 'Master Ferret 🦦'];
  const levelName = levelNames[level] || 'Master Ferret 🦦';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                🦦 ML Learning Game
              </h1>
              <p className="text-purple-100">Master Neural Networks Before the Exam</p>
            </div>
            <div className="text-right text-white">
              <p className="text-sm text-purple-100">Today</p>
              <p className="text-lg font-semibold">{currentDate.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Level & XP Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-lg shadow-lg p-6">
            <p className="text-sm text-purple-200 mb-1">Current Level</p>
            <h2 className="text-4xl font-black mb-2">{level + 1}</h2>
            <p className="text-purple-100 font-semibold text-lg">{levelName}</p>
            <div className="mt-4 pt-4 border-t border-purple-500">
              <div className="flex justify-between text-xs text-purple-200 mb-2">
                <span>{xpInLevel} / {xpToNextLevel} XP</span>
                <span>{levelProgress}%</span>
              </div>
              <div className="w-full bg-purple-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-300 to-orange-300 h-full transition-all duration-300"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP Summary */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6">
            <p className="text-sm text-blue-200 mb-1">Total XP Earned</p>
            <h2 className="text-4xl font-black mb-2">{progress.totalXP.toLocaleString()}</h2>
            <p className="text-blue-100">Keep learning to level up!</p>
            <div className="mt-4 pt-4 border-t border-blue-500">
              <p className="text-xs text-blue-200">
                🎯 {Math.round(progress.totalXP / 10) || 0} challenges completed
              </p>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-lg shadow-lg p-6">
            <p className="text-sm text-orange-200 mb-1">Current Streak</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black">{progress.currentStreak}</h2>
              <span className="text-2xl animate-pulse">🔥</span>
            </div>
            <p className="text-orange-100 text-sm mt-2">days in a row</p>
            <div className="mt-4 pt-4 border-t border-orange-500">
              <p className="text-xs text-orange-200">
                Best: {progress.longestStreak} days 🏆
              </p>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        {progress.badges && progress.badges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🏅 Recent Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {progress.badges.slice(-6).map((badge, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-lg p-3 text-center shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  <p className="text-sm font-bold">{badge}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            📚 Your Learning Path
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic) => {
              const accuracy = progress.topicScores[topic.id]?.accuracy || 0;
              const progressPercent = (topic.completed / topic.lessons) * 100;

              return (
                <div
                  key={topic.id}
                  onClick={() => onTopicSelect(topic.id)}
                  className="group cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${topic.color} rounded-lg shadow-lg p-6 text-white hover:shadow-2xl transition transform hover:scale-105 h-full`}>
                    {/* Emoji & Title */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl">{topic.emoji}</h3>
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-bold">
                        {topic.examWeight}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
                    <p className="text-sm text-white text-opacity-80 mb-4">{topic.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{topic.completed}/{topic.lessons}</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-white h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Accuracy */}
                    {accuracy > 0 && (
                      <p className="text-sm font-semibold">
                        Accuracy: {Math.round(accuracy * 100)}%
                      </p>
                    )}

                    {/* CTA */}
                    <button className="mt-4 w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-2 px-4 rounded-lg transition">
                      {progressPercent === 0 ? 'Start Learning' : 'Continue'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Challenges Completed', value: Math.round(progress.totalXP / 25), icon: '✅' },
            { label: 'Correct Answers', value: `${Math.round((progress.topicScores['perceptron']?.accuracy || 0) * 100)}%`, icon: '🎯' },
            { label: 'Topics Unlocked', value: Math.min(1 + Math.floor(progress.totalXP / 500), 4), icon: '🔓' },
            { label: 'Study Streak', value: progress.currentStreak, icon: '🔥' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-gray-300 text-sm mb-1">{stat.label}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-16 py-8 text-center text-gray-400 text-sm">
        <p>🚀 Keep practicing! Every challenge brings you closer to exam mastery.</p>
      </footer>
    </div>
  );
};

export default EnhancedDashboard;
