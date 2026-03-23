/**
 * KohonenPractice - Graded challenges for Kohonen / SOM Networks
 */

import React, { useState, useMemo } from 'react';
import { KohonenMap } from '../lib/nn-math';

interface KohonenPracticeProps {
  onChallengeComplete?: (challengeIndex: number, accuracy: number, xpEarned: number) => void;
  onAllComplete?: (totalXP: number) => void;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  type: 'fill-blank' | 'multiple-choice';
  prompt: string;
  expectedAnswer?: number;
  tolerance?: number;
  choices?: string[];
  correctChoiceIndex?: number;
  baseXP: number;
}

const generateChallenges = (): Challenge[] => [
  {
    id: 1,
    title: '📏 Euclidean Distance',
    description: 'Calculate distance between input and neuron weight vectors',
    difficulty: 'easy',
    type: 'fill-blank',
    prompt: `Input vector: [0.8, 0.6]
Neuron weights: [0.6, 0.4]

Euclidean distance = √((0.8-0.6)² + (0.6-0.4)²)
                   = √(0.04 + 0.04)
                   = √0.08
                   ≈ ?  (round to 3 decimal places)`,
    expectedAnswer: 0.283,
    tolerance: 0.01,
    baseXP: 25,
  },
  {
    id: 2,
    title: '🏆 Find the BMU',
    description: 'Identify the Best-Matching Unit from distances',
    difficulty: 'easy',
    type: 'multiple-choice',
    prompt: `Input: [1.0, 0.0]
Neuron distances:
  N1: 0.72
  N2: 0.14
  N3: 0.53
  N4: 0.38

Which neuron is the BMU (Best-Matching Unit)?`,
    choices: ['N1', 'N2', 'N3', 'N4'],
    correctChoiceIndex: 1,
    baseXP: 25,
  },
  {
    id: 3,
    title: '🔄 Kohonen Weight Update',
    description: 'Apply the Kohonen update rule to the BMU',
    difficulty: 'medium',
    type: 'fill-blank',
    prompt: `BMU weight vector: W = [0.6, 0.4]
Input vector:    x = [0.8, 0.6]
Learning rate:   η = 0.5

New W[0] = W[0] + η × (x[0] - W[0])
         = 0.6 + 0.5 × (0.8 - 0.6)
         = ?`,
    expectedAnswer: 0.7,
    tolerance: 0.01,
    baseXP: 40,
  },
  {
    id: 4,
    title: '🌍 Neighbor Update',
    description: 'Apply neighborhood function to an adjacent neuron',
    difficulty: 'medium',
    type: 'fill-blank',
    prompt: `Neighbor weight vector: W_n = [0.3, 0.7]
Input vector:           x   = [0.8, 0.6]
Learning rate:          η   = 0.5
Neighborhood strength:  h   = 0.5

New W_n[0] = W_n[0] + η × h × (x[0] - W_n[0])
           = 0.3 + 0.5 × 0.5 × (0.8 - 0.3)
           = ?`,
    expectedAnswer: 0.425,
    tolerance: 0.01,
    baseXP: 45,
  },
  {
    id: 5,
    title: '❓ SOM Concept Check',
    description: 'Understand what topology preservation means',
    difficulty: 'hard',
    type: 'multiple-choice',
    prompt: `After training a SOM, you notice that data points from the same category 
activate neurons that are far apart on the map grid. This indicates:`,
    choices: [
      'The SOM trained correctly and preserved topology',
      'The SOM failed to organize the data — training needs more iterations',
      'The learning rate was too high during training',
      'The data has no meaningful clusters',
    ],
    correctChoiceIndex: 1,
    baseXP: 55,
  },
  {
    id: 6,
    title: '📉 Full 3-Neuron BMU + Update',
    description: 'Find BMU and compute all weight updates in one step',
    difficulty: 'expert',
    type: 'fill-blank',
    prompt: `Input: [1.0, 0.0]
Neurons:
  N1: [0.9, 0.1]  dist = √((1.0-0.9)²+(0.0-0.1)²) = 0.141
  N2: [0.1, 0.9]  dist = √((1.0-0.1)²+(0.0-0.9)²) = 1.273
  N3: [0.5, 0.5]  dist = √((1.0-0.5)²+(0.0-0.5)²) = 0.707

BMU = N1 (smallest distance).
Learning rate η = 0.3.

New N1[0] = 0.9 + 0.3 × (1.0 - 0.9) = ?`,
    expectedAnswer: 0.93,
    tolerance: 0.01,
    baseXP: 75,
  },
];

const KohonenPractice: React.FC<KohonenPracticeProps> = ({
  onChallengeComplete,
  onAllComplete,
}) => {
  const challenges = useMemo(() => generateChallenges(), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [totalXP, setTotalXP] = useState(0);

  const challenge = challenges[currentIdx];
  const difficultyColor = (d: string) => ({ easy: 'bg-green-100 text-green-800', medium: 'bg-yellow-100 text-yellow-800', hard: 'bg-orange-100 text-orange-800', expert: 'bg-red-100 text-red-800' }[d] ?? 'bg-gray-100 text-gray-800');
  const xpMultiplier = { easy: 1.0, medium: 1.5, hard: 2.0, expert: 2.5 }[challenge.difficulty] ?? 1.0;

  const handleSubmit = () => {
    if (!userAnswer) { setFeedback({ type: 'error', message: '⚠️ Please enter an answer' }); return; }

    let correct = false;
    if (challenge.type === 'fill-blank' && challenge.expectedAnswer !== undefined) {
      correct = Math.abs(parseFloat(userAnswer) - challenge.expectedAnswer) < (challenge.tolerance ?? 0.01);
    } else if (challenge.type === 'multiple-choice') {
      correct = parseInt(userAnswer) === challenge.correctChoiceIndex;
    }

    const xpEarned = correct ? Math.round(challenge.baseXP * xpMultiplier) : 0;
    if (correct) {
      setFeedback({ type: 'success', message: `✅ Correct! +${xpEarned} XP` });
      setCompleted(prev => new Set([...prev, currentIdx]));
      setTotalXP(prev => prev + xpEarned);
      onChallengeComplete?.(currentIdx, 1.0, xpEarned);
      setTimeout(() => {
        if (currentIdx < challenges.length - 1) { advance(); }
        else { onAllComplete?.(totalXP + xpEarned); }
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: '❌ Not quite. Recheck your distance formula!' });
    }
    setSubmitted(true);
  };

  const advance = () => { setCurrentIdx(i => i + 1); setUserAnswer(''); setFeedback(null); setSubmitted(false); };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">🗺️ Kohonen Practice</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Session XP</p>
            <p className="text-3xl font-bold text-orange-500">+{totalXP}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Challenge {currentIdx + 1} of {challenges.length}</span>
            <span>{completed.size} completed</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 h-3 rounded-full transition-all"
              style={{ width: `${(completed.size / challenges.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty.toUpperCase()}
            </span>
            {completed.has(currentIdx) && <span className="text-2xl">✅</span>}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{challenge.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{challenge.description}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 space-y-4">
          <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm">{challenge.prompt}</p>

          {challenge.type === 'fill-blank' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Your Answer:</label>
              <input type="number" step="0.001" value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                disabled={completed.has(currentIdx)}
                placeholder="Enter your answer..."
                className="w-full px-4 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-600 disabled:bg-gray-100" />
            </div>
          )}

          {challenge.type === 'multiple-choice' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Select your answer:</label>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {challenge.choices?.map((choice, idx) => (
                  <button key={idx} onClick={() => setUserAnswer(String(idx))}
                    disabled={completed.has(currentIdx)}
                    className={`p-3 rounded-lg font-semibold text-center transition-all ${userAnswer === String(idx) ? 'bg-teal-600 text-white border-2 border-teal-700 shadow-md' : 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:border-teal-300 hover:bg-gray-50'} disabled:cursor-not-allowed disabled:opacity-50`}>
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg ${feedback.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-800' : 'bg-red-50 border-l-4 border-red-500 text-red-800'}`}>
            <p className="font-semibold">{feedback.message}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!completed.has(currentIdx) ? (
          <>
            <button onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transition-all">
              Check Answer
            </button>
            <button onClick={advance}
              className="px-6 py-3 text-gray-700 border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-50">
              Skip
            </button>
          </>
        ) : (
          <button onClick={advance} disabled={currentIdx >= challenges.length - 1}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:bg-gray-300">
            {currentIdx >= challenges.length - 1 ? '✅ All Complete!' : 'Next Challenge →'}
          </button>
        )}
      </div>
    </div>
  );
};

export default KohonenPractice;
