/**
 * ImprovedDashboard - Better UX with lesson progression
 * Shows which lessons to tackle next, clear progression path
 */

import React from 'react';
import { LESSONS, TopicId, Lesson, getNextModeForLesson, getProgressForLesson } from '../lib/lessons';
import useGameStore from '../lib/store';

interface ImprovedDashboardProps {
  onSelectLesson?: (lesson: Lesson) => void;
  onSelectTopic?: (topicId: TopicId) => void;
}

const ImprovedDashboard: React.FC<ImprovedDashboardProps> = ({
  onSelectLesson,
  onSelectTopic,
}) => {
  const { progress } = useGameStore();

  // Get recommendation for next lesson
  const getRecommendedLesson = (): { topicId: TopicId; lesson: Lesson } | null => {
    for (const [topicId, lessons] of Object.entries(LESSONS)) {
      for (const lesson of lessons) {
        // Check if lesson is started but not complete
        const learnDone = true; // Would check completion status
        const practiceDone = false;
        
        if (!practiceDone) {
          return { topicId: topicId as TopicId, lesson };
        }
      }
    }
    return null;
  };

  const recommended = getRecommendedLesson();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">🦦 ML Learning Game</h1>
            <p className="text-blue-100">Master Machine Learning for your SMc30402 exam</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Level {progress.level + 1}</p>
            <p className="text-3xl font-bold">{progress.totalXP} XP</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-blue-100">
            <span>Progress to next level</span>
            <span>{progress.totalXP % 300} / 300 XP</span>
          </div>
          <div className="w-full bg-blue-400 rounded-full h-3">
            <div
              className="bg-blue-200 h-3 rounded-full transition-all"
              style={{ width: `${((progress.totalXP % 300) / 300) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommended Next Action */}
      {recommended && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700 mb-1">📍 RECOMMENDED NEXT STEP</p>
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                {recommended.lesson.title}
              </h3>
              <p className="text-green-800 mb-4">{recommended.lesson.description}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-sm font-semibold">
                  {recommended.topicId.charAt(0).toUpperCase() + recommended.topicId.slice(1)}
                </span>
                <span className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-semibold">
                  Lesson {recommended.lesson.order}
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectLesson?.(recommended.lesson)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg whitespace-nowrap transition-all transform hover:scale-105"
            >
              Start Now →
            </button>
          </div>
        </div>
      )}

      {/* Topics Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Topics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'perceptron' as TopicId,
              name: 'Perceptron',
              emoji: '🧠',
              weight: '40%',
              description: 'Single neuron learning',
              color: 'from-blue-500 to-blue-600',
            },
            {
              id: 'multilayer' as TopicId,
              name: 'Multilayer Networks',
              emoji: '🕸️',
              weight: '27%',
              description: 'Feed-forward & backprop',
              color: 'from-purple-500 to-purple-600',
            },
            {
              id: 'kohonen' as TopicId,
              name: 'Kohonen Maps',
              emoji: '🗺️',
              weight: '31%',
              description: 'Self-organizing networks',
              color: 'from-pink-500 to-pink-600',
            },
            {
              id: 'hopfield' as TopicId,
              name: 'Hopfield Networks',
              emoji: '💾',
              weight: '27%',
              description: 'Associative memory',
              color: 'from-green-500 to-green-600',
            },
          ].map((topic) => {
            const lessons = LESSONS[topic.id] || [];
            const totalLessons = lessons.length;
            const completedLessons = lessons.filter(
              (l) => getProgressForLesson(l.id, []) === 100
            ).length;

            return (
              <button
                key={topic.id}
                onClick={() => onSelectTopic?.(topic.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 p-0 overflow-hidden text-left group"
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${topic.color} text-white p-4 group-hover:shadow-md`}>
                  <div className="text-4xl mb-2">{topic.emoji}</div>
                  <h3 className="font-bold text-lg">{topic.name}</h3>
                  <p className="text-sm opacity-90">{topic.weight} of exam</p>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-600">{topic.description}</p>

                  {/* Lessons progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>
                        {completedLessons}/{totalLessons} lessons
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${topic.color} h-2 rounded-full transition-all`}
                        style={{
                          width: `${
                            totalLessons > 0
                              ? (completedLessons / totalLessons) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-sm font-semibold text-gray-700">
                    {completedLessons === 0 && '🔒 Locked'}
                    {completedLessons > 0 && completedLessons < totalLessons && `🟡 ${completedLessons} started`}
                    {completedLessons === totalLessons && '✅ Complete!'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Perceptron Lessons Detailed */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🧠 Perceptron Lessons</h2>

        <div className="space-y-4">
          {LESSONS.perceptron.map((lesson, idx) => {
            const progress = getProgressForLesson(lesson.id, []);
            const nextMode = getNextModeForLesson([]);

            return (
              <div
                key={lesson.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">
                        {progress === 100 ? '✅' : progress > 0 ? '🟡' : '🔒'}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">
                        Lesson {idx + 1}: {lesson.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm ml-8">{lesson.description}</p>
                  </div>
                  <button
                    onClick={() => onSelectLesson?.(lesson)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      progress === 100
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {progress === 100 ? 'Review' : nextMode === 'learn' ? 'Start' : 'Continue'}
                  </button>
                </div>

                {/* Progress bar */}
                <div className="ml-8 space-y-2">
                  <div className="flex gap-1 text-xs text-gray-600">
                    <span>🎓 Learn</span>
                    <span>→</span>
                    <span>🔧 Practice ×{lesson.practiceCount}</span>
                    <span>→</span>
                    <span>⚔️ Master</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      {progress.badges.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Achievements</h2>
          <div className="flex gap-3 flex-wrap">
            {progress.badges.map((badge) => (
              <div key={badge} className="px-4 py-2 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-full text-sm font-semibold text-yellow-900 shadow-sm">
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Lessons Completed</p>
          <p className="text-3xl font-bold text-blue-600">
            {LESSONS.perceptron.filter((l) => getProgressForLesson(l.id, []) === 100).length}/{LESSONS.perceptron.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Current Streak</p>
          <p className="text-3xl font-bold text-orange-500">🔥 {progress.streak}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Overall Accuracy</p>
          <p className="text-3xl font-bold text-green-600">
            {progress.topicScores['perceptron']?.accuracy
              ? `${(progress.topicScores['perceptron'].accuracy * 100).toFixed(0)}%`
              : '—'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Challenges Completed</p>
          <p className="text-3xl font-bold text-purple-600">
            {progress.topicScores['perceptron']?.completed || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovedDashboard;
