/**
 * MultilayerPractice - Graded challenges for Multilayer Networks
 * Topics: forward pass, backprop, loss functions, overfitting
 */

import React, { useState, useMemo } from 'react';
import { MLFFN } from '../lib/nn-math';

interface MultilayerPracticeProps {
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
    title: '➡️ Forward Pass — Hidden Neuron',
    description: 'Calculate activation of a single hidden neuron',
    difficulty: 'easy',
    type: 'fill-blank',
    prompt: `Network: 2 inputs → 1 hidden neuron → 1 output (sigmoid activation)
Input: [1, 0]
Hidden weights: [0.5, 0.3], bias: -0.1

net_h = (1×0.5) + (0×0.3) + (-0.1) = ?`,
    expectedAnswer: 0.4,
    tolerance: 0.01,
    baseXP: 25,
  },
  {
    id: 2,
    title: '🔢 Sigmoid Activation',
    description: 'Apply sigmoid to a net value',
    difficulty: 'easy',
    type: 'fill-blank',
    prompt: `net = 0.0
sigmoid(net) = 1 / (1 + e^(-0.0)) = ?

Hint: e^0 = 1`,
    expectedAnswer: 0.5,
    tolerance: 0.01,
    baseXP: 25,
  },
  {
    id: 3,
    title: '📊 Two-Layer Forward Pass',
    description: 'Full forward pass through two layers',
    difficulty: 'medium',
    type: 'fill-blank',
    prompt: `Layer 1 (threshold activation):
  Input: [1, 1]
  Weights: [0.6, 0.4], bias: -0.5
  net_h = (1×0.6) + (1×0.4) + (-0.5) = 0.5 → activation = 1

Layer 2 output neuron (threshold activation):
  Input from hidden: [1]
  Weight: [0.8], bias: -0.5
  net_o = (1×0.8) + (-0.5) = ?`,
    expectedAnswer: 0.3,
    tolerance: 0.01,
    baseXP: 40,
  },
  {
    id: 4,
    title: '❓ Why Hidden Layers?',
    description: 'Conceptual understanding of multilayer networks',
    difficulty: 'medium',
    type: 'multiple-choice',
    prompt: `Which problem CANNOT be solved by a single-layer perceptron?`,
    choices: ['AND gate', 'OR gate', 'XOR gate', 'NOT gate'],
    correctChoiceIndex: 2,
    baseXP: 35,
  },
  {
    id: 5,
    title: '📉 Output Error (Backprop Step 1)',
    description: 'Calculate the output layer error signal',
    difficulty: 'hard',
    type: 'fill-blank',
    prompt: `Sigmoid output neuron:
  Output = 0.7, Target = 1.0
  Sigmoid derivative: f'(net) = output × (1 - output)

  δ_out = (Target - Output) × f'(output)
  δ_out = (1.0 - 0.7) × (0.7 × 0.3) = ?`,
    expectedAnswer: 0.063,
    tolerance: 0.005,
    baseXP: 55,
  },
  {
    id: 6,
    title: '⚖️ Weight Delta (Backprop)',
    description: 'Calculate the weight update for one connection',
    difficulty: 'hard',
    type: 'fill-blank',
    prompt: `Learning rate η = 0.5
Error signal δ = 0.063
Input to this connection = 0.8

Δw = η × δ × input = 0.5 × 0.063 × 0.8 = ?`,
    expectedAnswer: 0.0252,
    tolerance: 0.001,
    baseXP: 60,
  },
  {
    id: 7,
    title: '🏆 MSE Loss Function',
    description: 'Calculate Mean Squared Error for a prediction',
    difficulty: 'expert',
    type: 'fill-blank',
    prompt: `Predictions: [0.8, 0.3]
Targets:     [1.0, 0.0]

MSE = (1/n) × Σ(target_i - output_i)²
    = (1/2) × [(1.0-0.8)² + (0.0-0.3)²]
    = (1/2) × [0.04 + 0.09]
    = ?`,
    expectedAnswer: 0.065,
    tolerance: 0.005,
    baseXP: 75,
  },
];

const MultilayerPractice: React.FC<MultilayerPracticeProps> = ({
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

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const xpMultiplier = { easy: 1.0, medium: 1.5, hard: 2.0, expert: 2.5 }[challenge.difficulty] ?? 1.0;

  const handleSubmit = () => {
    if (!userAnswer) {
      setFeedback({ type: 'error', message: '⚠️ Please enter an answer' });
      return;
    }

    let correct = false;
    if (challenge.type === 'fill-blank' && challenge.expectedAnswer !== undefined) {
      correct = Math.abs(parseFloat(userAnswer) - challenge.expectedAnswer) < (challenge.tolerance ?? 0.01);
    } else if (challenge.type === 'multiple-choice') {
      correct = parseInt(userAnswer) === challenge.correctChoiceIndex;
    }

    const xpEarned = correct ? Math.round(challenge.baseXP * xpMultiplier) : 0;

    if (correct) {
      setFeedback({ type: 'success', message: `✅ Correct! +${xpEarned} XP` });
      const newCompleted = new Set([...completed, currentIdx]);
      setCompleted(newCompleted);
      setTotalXP(prev => prev + xpEarned);
      onChallengeComplete?.(currentIdx, 1.0, xpEarned);

      setTimeout(() => {
        if (currentIdx < challenges.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setUserAnswer('');
          setFeedback(null);
          setSubmitted(false);
        } else {
          onAllComplete?.(totalXP + xpEarned);
        }
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: '❌ Not quite. Check your arithmetic and try again!' });
    }
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx < challenges.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserAnswer('');
      setFeedback(null);
      setSubmitted(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">🕸️ Multilayer Practice</h2>
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
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${(completed.size / challenges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Challenge Card */}
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
              <input
                type="number" step="0.001" value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                disabled={completed.has(currentIdx)}
                placeholder="Enter your answer..."
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 disabled:bg-gray-100"
              />
            </div>
          )}

          {challenge.type === 'multiple-choice' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Select your answer:</label>
              <div className="grid grid-cols-2 gap-2">
                {challenge.choices?.map((choice, idx) => (
                  <button key={idx}
                    onClick={() => setUserAnswer(String(idx))}
                    disabled={completed.has(currentIdx)}
                    className={`p-3 rounded-lg font-semibold transition-all ${userAnswer === String(idx) ? 'bg-purple-600 text-white border-2 border-purple-700' : 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:border-purple-300'} disabled:cursor-not-allowed`}
                  >
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

      {/* Buttons */}
      <div className="flex gap-4">
        {!completed.has(currentIdx) ? (
          <>
            <button onClick={handleSubmit} disabled={submitted && !!feedback && feedback.type === 'success'}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50">
              Check Answer
            </button>
            <button onClick={handleNext}
              className="px-6 py-3 text-gray-700 border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-50">
              Skip
            </button>
          </>
        ) : (
          <button onClick={handleNext} disabled={currentIdx >= challenges.length - 1}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:bg-gray-300">
            {currentIdx >= challenges.length - 1 ? '✅ All Complete!' : 'Next Challenge →'}
          </button>
        )}
      </div>

      {/* Completed chips */}
      {completed.size > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Completed:</p>
          <div className="flex gap-2 flex-wrap">
            {Array.from(completed).map(idx => (
              <button key={idx} onClick={() => setCurrentIdx(idx)}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold hover:bg-green-200">
                #{idx + 1} ✓
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultilayerPractice;
