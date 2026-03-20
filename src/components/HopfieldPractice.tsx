/**
 * HopfieldPractice - Graded challenges for Hopfield Networks
 */

import React, { useState, useMemo } from 'react';
import { HopfieldNetwork } from '../lib/nn-math';

interface HopfieldPracticeProps {
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
    title: '🔗 Hebbian Weight (2 Neurons)',
    description: 'Calculate the synaptic weight between two neurons',
    difficulty: 'easy',
    type: 'fill-blank',
    prompt: `Pattern: [1, 0, 1]  (storing one pattern, N=3)
Hebbian rule: w_ij = p_i × p_j  (for i ≠ j)

What is w_12 (connection from neuron 1 to neuron 2)?
p_1 = 1, p_2 = 0

w_12 = p_1 × p_2 = ?`,
    expectedAnswer: 0,
    tolerance: 0.01,
    baseXP: 25,
  },
  {
    id: 2,
    title: '🔗 Hebbian Weight (Active Pair)',
    description: 'Calculate weight for two co-active neurons',
    difficulty: 'easy',
    type: 'fill-blank',
    prompt: `Pattern: [1, 0, 1]  (N=3)
What is w_13 (neuron 1 to neuron 3)?
p_1 = 1, p_3 = 1

w_13 = p_1 × p_3 = ?`,
    expectedAnswer: 1,
    tolerance: 0.01,
    baseXP: 25,
  },
  {
    id: 3,
    title: '⚡ Net Input Calculation',
    description: 'Calculate net input to a neuron',
    difficulty: 'medium',
    type: 'fill-blank',
    prompt: `4-neuron Hopfield network.
State: s = [1, 0, 1, 0]
Weights for neuron 1: w_1j = [0, 1, -1, 1]
Bias: 0

net_1 = Σ(w_1j × s_j) = w_11×s_1 + w_12×s_2 + w_13×s_3 + w_14×s_4
(w_11 = 0 always)
      = 0×1 + 1×0 + (-1)×1 + 1×0
      = ?`,
    expectedAnswer: -1,
    tolerance: 0.01,
    baseXP: 40,
  },
  {
    id: 4,
    title: '🔁 State Update Rule',
    description: 'Apply threshold activation to update a neuron state',
    difficulty: 'medium',
    type: 'multiple-choice',
    prompt: `Neuron 1 has net input = -1.
Hopfield threshold activation: s_i = 1 if net ≥ 0, else 0.

What is the new state of neuron 1?`,
    choices: ['1 (fires)', '0 (silent)', '-1', '0.5'],
    correctChoiceIndex: 1,
    baseXP: 35,
  },
  {
    id: 5,
    title: '⚡ Energy Calculation',
    description: 'Calculate the energy of a given Hopfield state',
    difficulty: 'hard',
    type: 'fill-blank',
    prompt: `2-neuron network (no bias):
State: s = [1, 1]
Weight: w_12 = w_21 = 0.5

Energy E = -0.5 × Σ(w_ij × s_i × s_j)
(sum over all i≠j pairs: only (1,2) and (2,1))

E = -0.5 × (w_12 × s_1 × s_2 + w_21 × s_2 × s_1)
  = -0.5 × (0.5×1×1 + 0.5×1×1)
  = ?`,
    expectedAnswer: -0.5,
    tolerance: 0.01,
    baseXP: 55,
  },
  {
    id: 6,
    title: '💾 Capacity Rule',
    description: 'Estimate how many patterns a Hopfield network can store',
    difficulty: 'hard',
    type: 'fill-blank',
    prompt: `A Hopfield network has 10 neurons.
Empirical capacity: M ≈ 0.14 × N

Maximum reliable storage capacity = 0.14 × 10 = ?`,
    expectedAnswer: 1.4,
    tolerance: 0.1,
    baseXP: 50,
  },
  {
    id: 7,
    title: '🎯 Spurious State Recognition',
    description: 'Identify which states are genuine memories vs spurious',
    difficulty: 'expert',
    type: 'multiple-choice',
    prompt: `A Hopfield network is trained to store patterns A and B.
After running from a noisy initial state, it converges to pattern C,
which is neither A nor B, but is stable.

Pattern C is called:`,
    choices: [
      'A stored attractor',
      'A spurious state (false memory)',
      'An energy maximum',
      'A training error',
    ],
    correctChoiceIndex: 1,
    baseXP: 75,
  },
];

const HopfieldPractice: React.FC<HopfieldPracticeProps> = ({
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
      setFeedback({ type: 'error', message: '❌ Not quite. Recheck the formula!' });
    }
    setSubmitted(true);
  };

  const advance = () => { setCurrentIdx(i => i + 1); setUserAnswer(''); setFeedback(null); setSubmitted(false); };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg border border-violet-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">💾 Hopfield Practice</h2>
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
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-3 rounded-full transition-all"
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
              <input type="number" step="0.01" value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                disabled={completed.has(currentIdx)}
                placeholder="Enter your answer..."
                className="w-full px-4 py-2 border-2 border-violet-300 rounded-lg focus:outline-none focus:border-violet-600 disabled:bg-gray-100" />
            </div>
          )}

          {challenge.type === 'multiple-choice' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Select your answer:</label>
              <div className="grid grid-cols-1 gap-2">
                {challenge.choices?.map((choice, idx) => (
                  <button key={idx} onClick={() => setUserAnswer(String(idx))}
                    disabled={completed.has(currentIdx)}
                    className={`p-3 rounded-lg font-semibold text-left transition-all ${userAnswer === String(idx) ? 'bg-violet-600 text-white border-2 border-violet-700' : 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:border-violet-300'} disabled:cursor-not-allowed`}>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all">
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

export default HopfieldPractice;
