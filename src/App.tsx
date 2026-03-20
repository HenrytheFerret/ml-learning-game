/**
 * ML Learning Game - Main App (Phase 2: All Topics)
 */

import React, { useState, useEffect } from 'react';
import useGameStore from './lib/store';
import { LESSONS } from './lib/lessons';
import './styles/globals.css';

// Components
import EnhancedDashboard from './components/EnhancedDashboard';
import EnhancedTruthTableBuilder from './components/EnhancedTruthTableBuilder';
import PerceptronMaster from './components/PerceptronMaster';
import PerceptronLearn from './components/PerceptronLearn';
import PerceptronPractice from './components/PerceptronPractice';

// Multilayer
import MultilayerLearn from './components/MultilayerLearn';
import MultilayerPractice from './components/MultilayerPractice';
import MultilayerMaster from './components/MultilayerMaster';

// Kohonen
import KohonenLearn from './components/KohonenLearn';
import KohonenPractice from './components/KohonenPractice';
import KohonenMaster from './components/KohonenMaster';

// Hopfield
import HopfieldLearn from './components/HopfieldLearn';
import HopfieldPractice from './components/HopfieldPractice';
import HopfieldMaster from './components/HopfieldMaster';

type ViewMode = 'dashboard' | 'topic' | 'learn' | 'practice' | 'master';

interface PerceptronChallenge {
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

const TOPIC_META: Record<string, { emoji: string; label: string; color: string }> = {
  perceptron: { emoji: '🧠', label: 'Perceptron', color: 'from-blue-600 to-purple-600' },
  multilayer: { emoji: '🕸️', label: 'Multilayer Networks', color: 'from-purple-600 to-indigo-600' },
  kohonen: { emoji: '🗺️', label: 'Kohonen Networks', color: 'from-teal-600 to-cyan-600' },
  hopfield: { emoji: '💾', label: 'Hopfield Networks', color: 'from-violet-600 to-purple-700' },
};

const App: React.FC = () => {
  const { progress, currentTopic, addXP, setCurrentTopic, recordChallengeResult } = useGameStore();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  // Perceptron-specific legacy challenge state
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);

  useEffect(() => {
    const tracker = useGameStore.getState().progressTracker;
    tracker.load();
    useGameStore.setState({ progress: tracker.getProgress() });
  }, []);

  const perceptronChallenges: PerceptronChallenge[] = [
    { id: 'spam-detector', type: 'warm-up', title: '🔐 Email Spam Detector', story: 'An email system uses a perceptron to filter spam. Weights: [0.8, 1.2], Bias: -0.5.', emoji: '📧', weights: [0.8, 1.2], bias: -0.5, activationFn: 'threshold', canModifyWeights: false },
    { id: 'iris-classifier', type: 'build', title: '🌸 Iris Flower Classifier', story: 'Build your own classifier! Adjust weights to separate iris species.', emoji: '🌺', weights: [1.5, 0.8], bias: -1.0, activationFn: 'threshold', canModifyWeights: true },
    { id: 'medical-diagnosis', type: 'build', title: '⚕️ Medical Diagnosis', story: 'Classify patient conditions based on two factors. Weights: [2.1, 1.3], Bias: -2.2.', emoji: '🏥', weights: [2.1, 1.3], bias: -2.2, activationFn: 'threshold', canModifyWeights: true },
    { id: 'image-recognition', type: 'master', title: '🖼️ Image Recognition', story: 'A trained perceptron identifies whether an image contains a face.', emoji: '📸', weights: [1.2, 2.0], bias: -1.5, activationFn: 'threshold', canModifyWeights: false },
  ];

  const handleXP = (xpEarned: number, success: boolean) => {
    addXP(xpEarned);
    recordChallengeResult({ success, accuracy: success ? 1.0 : 0, xpEarned, timeMs: 0, feedback: `+${xpEarned} XP` });
  };

  const handleMasterComplete = (score: number, feedback: string) => {
    const xp = Math.round(score * 2);
    addXP(xp);
    recordChallengeResult({ success: score >= 80, accuracy: score / 100, xpEarned: xp, timeMs: 0, feedback });
  };

  const goBack = () => {
    if (viewMode === 'learn' || viewMode === 'practice' || viewMode === 'master') {
      setViewMode('topic');
      setActiveLessonId(null);
    } else {
      setViewMode('dashboard');
      setCurrentChallenge(null);
    }
  };

  const topicMeta = TOPIC_META[currentTopic ?? ''] ?? { emoji: '📚', label: currentTopic, color: 'from-gray-600 to-gray-700' };

  // ─── LESSONS for current topic ─────────────────────────────────────────────
  const topicLessons = currentTopic ? (LESSONS[currentTopic as keyof typeof LESSONS] ?? []) : [];

  // ─── Render helpers ────────────────────────────────────────────────────────
  const renderLearn = () => {
    if (!activeLessonId) return null;
    const done = () => { handleXP(50, true); setViewMode('topic'); setActiveLessonId(null); };
    switch (currentTopic) {
      case 'perceptron': return <PerceptronLearn onComplete={done} />;
      case 'multilayer': return <MultilayerLearn onComplete={done} lessonId={activeLessonId} />;
      case 'kohonen':    return <KohonenLearn    onComplete={done} lessonId={activeLessonId} />;
      case 'hopfield':   return <HopfieldLearn   onComplete={done} lessonId={activeLessonId} />;
      default: return <p className="text-white">No learn component for this topic.</p>;
    }
  };

  const renderPractice = () => {
    const done = (idx: number, acc: number, xp: number) => handleXP(xp, acc >= 0.7);
    const allDone = (xp: number) => { handleXP(xp, true); setViewMode('topic'); };
    switch (currentTopic) {
      case 'perceptron':  return <PerceptronPractice onChallengeComplete={done} onAllComplete={allDone} />;
      case 'multilayer':  return <MultilayerPractice onChallengeComplete={done} onAllComplete={allDone} />;
      case 'kohonen':     return <KohonenPractice    onChallengeComplete={done} onAllComplete={allDone} />;
      case 'hopfield':    return <HopfieldPractice   onChallengeComplete={done} onAllComplete={allDone} />;
      default: return <p className="text-white">No practice component for this topic.</p>;
    }
  };

  const renderMaster = () => {
    switch (currentTopic) {
      case 'perceptron':  return <PerceptronMaster  onComplete={handleMasterComplete} />;
      case 'multilayer':  return <MultilayerMaster  onComplete={handleMasterComplete} />;
      case 'kohonen':     return <KohonenMaster     onComplete={handleMasterComplete} />;
      case 'hopfield':    return <HopfieldMaster    onComplete={handleMasterComplete} />;
      default: return <p className="text-white">No master component for this topic.</p>;
    }
  };

  // ─── Topic page (lesson selector) ─────────────────────────────────────────
  const renderTopicPage = () => {
    if (currentTopic === 'perceptron') {
      // Legacy perceptron flow
      return (
        <div className="space-y-8">
          {currentChallenge ? (
            <>
              <EnhancedTruthTableBuilder
                challenge={perceptronChallenges.find(c => c.id === currentChallenge)!}
                difficulty="medium"
                onComplete={(acc, xp) => handleXP(xp, acc >= 0.7)}
              />
              <button onClick={() => setCurrentChallenge(null)} className="w-full py-3 px-6 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition">← Back</button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">📚 Choose Your Challenge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {perceptronChallenges.map(ch => (
                  <button key={ch.id} onClick={() => setCurrentChallenge(ch.id)}
                    className="group text-left p-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition transform">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl">{ch.emoji}</h3>
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-bold">{ch.type.toUpperCase()}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{ch.title}</h3>
                    <p className="text-sm text-purple-100">{ch.story}</p>
                  </button>
                ))}
                <button onClick={() => setViewMode('master')}
                  className="text-left p-6 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition transform col-span-1 md:col-span-2">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-3xl">⚔️</h3>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm font-bold">EXAM MODE • 10 MIN</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">⚔️ Master Challenge</h3>
                  <p className="text-sm text-red-100">Exam-style question with time limit.</p>
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    // Generic topic page for multilayer / kohonen / hopfield
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-2">{topicMeta.emoji} {topicMeta.label} — Lessons</h2>

        {/* Lesson cards */}
        {topicLessons.map(lesson => (
          <div key={lesson.id} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Lesson {lesson.order}: {lesson.title}</h3>
              <p className="text-gray-500 text-sm">{lesson.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => { setActiveLessonId(lesson.id); setViewMode('learn'); }}
                className="py-2 px-4 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition text-sm">
                🎓 Learn
              </button>
              <button
                onClick={() => { setActiveLessonId(lesson.id); setViewMode('practice'); }}
                className="py-2 px-4 bg-yellow-100 text-yellow-800 font-semibold rounded-lg hover:bg-yellow-200 transition text-sm">
                🔧 Practice
              </button>
              <button
                onClick={() => { setActiveLessonId(lesson.id); setViewMode('master'); }}
                className="py-2 px-4 bg-red-100 text-red-800 font-semibold rounded-lg hover:bg-red-200 transition text-sm">
                ⚔️ Master
              </button>
            </div>
            <div className="text-xs text-gray-400">
              {lesson.practiceCount} practice challenges · {lesson.practiceDifficulties.join(', ')}
            </div>
          </div>
        ))}

        {/* Topic-level master CTA */}
        <button onClick={() => setViewMode('master')}
          className={`w-full p-6 bg-gradient-to-r ${topicMeta.color} text-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition transform`}>
          <h3 className="text-2xl font-bold mb-1">⚔️ Topic Master Challenge</h3>
          <p className="text-sm opacity-80">Full exam-style question. 10 minutes. No hints.</p>
        </button>
      </div>
    );
  };

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────
  if (viewMode === 'dashboard') {
    return (
      <EnhancedDashboard
        onTopicSelect={topic => {
          setCurrentTopic(topic as any);
          setViewMode('topic');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className={`bg-gradient-to-r ${topicMeta.color} shadow-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={goBack} className="text-white hover:text-purple-100 font-semibold mb-2 flex items-center gap-2">
            ← Back
          </button>
          <h2 className="text-3xl font-bold text-white">
            {topicMeta.emoji} {topicMeta.label}
            {viewMode === 'learn'     && ' — Learn'}
            {viewMode === 'practice'  && ' — Practice'}
            {viewMode === 'master'    && ' — Master Challenge'}
          </h2>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {viewMode === 'topic'    && renderTopicPage()}
        {viewMode === 'learn'    && renderLearn()}
        {viewMode === 'practice' && renderPractice()}
        {viewMode === 'master'   && renderMaster()}
      </main>
    </div>
  );
};

export default App;
