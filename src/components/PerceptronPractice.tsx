/**
 * PerceptronPractice - 7 graded challenges building from easy to expert
 * Progressive difficulty: calculate nets → apply activations → fill truth tables
 */

import React, { useState, useMemo } from 'react';
import { Perceptron } from '../lib/nn-math';
import { SCORING } from '../lib/scoring';

interface PerceptronPracticeProps {
  onChallengeComplete?: (challengeIndex: number, accuracy: number, xpEarned: number) => void;
  onAllComplete?: (totalXP: number) => void;
}

interface PracticeChallenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  type: 'fill-blank' | 'truth-table' | 'multiple-choice' | 'diagram';
  
  // Challenge setup
  weights?: number[];
  bias?: number;
  activationFn?: 'threshold' | 'sigmoid' | 'linear';
  
  // For fill-blank challenges
  prompt?: string;
  expectedAnswer?: number | number[];
  tolerance?: number;
  
  // For multiple choice
  choices?: string[];
  correctChoiceIndex?: number;
  
  // Scoring
  baseXP: number;
  timeLimit?: number; // in seconds
}

const generateChallenges = (): PracticeChallenge[] => [
  {
    id: 1,
    title: '🔢 Calculate Net Value',
    description: 'Basic net calculation with positive weights',
    difficulty: 'easy',
    type: 'fill-blank',
    weights: [0.5, 0.3],
    bias: -0.1,
    activationFn: 'threshold',
    prompt: 'Calculate net for inputs [1, 1]:\nnet = (1 × 0.5) + (1 × 0.3) + (-0.1) = ?',
    expectedAnswer: 0.7,
    tolerance: 0.01,
    baseXP: 25,
  },
  {
    id: 2,
    title: '🔢 Net with Negative Weights',
    description: 'Net calculation with negative weights and bias',
    difficulty: 'easy',
    type: 'fill-blank',
    weights: [1.2, -0.5],
    bias: 0.2,
    activationFn: 'threshold',
    prompt: 'Calculate net for inputs [1, 0]:\nnet = (1 × 1.2) + (0 × -0.5) + 0.2 = ?',
    expectedAnswer: 1.4,
    tolerance: 0.01,
    baseXP: 25,
  },
  {
    id: 3,
    title: '✅ Apply Threshold Activation',
    description: 'Given a net value, apply threshold function',
    difficulty: 'medium',
    type: 'multiple-choice',
    prompt: 'Net value is 0.5. Using threshold activation, what is the output?\n(Remember: if net ≥ 0 then 1, else 0)',
    choices: ['0', '1', '-1', '0.5'],
    correctChoiceIndex: 1, // "1"
    baseXP: 35,
  },
  {
    id: 4,
    title: '✅ Threshold with Negative Net',
    description: 'Threshold activation with negative net',
    difficulty: 'medium',
    type: 'multiple-choice',
    prompt: 'Net value is -0.3. Using threshold activation, what is the output?',
    choices: ['0', '1', '-1', '0.3'],
    correctChoiceIndex: 0, // "0"
    baseXP: 35,
  },
  {
    id: 5,
    title: '📊 Complete Truth Table (2-input)',
    description: 'Fill in complete truth table for a 2-input perceptron',
    difficulty: 'hard',
    type: 'truth-table',
    weights: [2.0, 1.1],
    bias: -1.2,
    activationFn: 'threshold',
    prompt: 'Complete the truth table for weights [2.0, 1.1] and bias -1.2',
    baseXP: 50,
  },
  {
    id: 6,
    title: '📊 Truth Table with Sigmoid',
    description: 'Truth table using sigmoid activation',
    difficulty: 'hard',
    type: 'truth-table',
    weights: [1.0, 0.5],
    bias: 0,
    activationFn: 'sigmoid',
    prompt: 'Complete truth table using sigmoid: 1/(1+e^(-net))',
    baseXP: 60,
  },
  {
    id: 7,
    title: '🏆 Multi-Step Challenge',
    description: 'Calculate net, apply activation, interpret results',
    difficulty: 'expert',
    type: 'fill-blank',
    weights: [0.8, -0.2, 1.5],
    bias: -0.5,
    activationFn: 'threshold',
    prompt: 'Weights: [0.8, -0.2, 1.5], Bias: -0.5\nFor inputs [1, 0, 1]:\nCalculate: (1×0.8) + (0×-0.2) + (1×1.5) + (-0.5) = ?',
    expectedAnswer: 1.8,
    tolerance: 0.01,
    baseXP: 75,
  },
];

const PerceptronPractice: React.FC<PerceptronPracticeProps> = ({
  onChallengeComplete,
  onAllComplete,
}) => {
  const challenges = useMemo(() => generateChallenges(), []);
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(new Set());
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [totalXPEarned, setTotalXPEarned] = useState(0);

  const challenge = challenges[currentChallengeIdx];
  const isComplete = completedChallenges.has(currentChallengeIdx);

  const getDifficultyColor = (
    difficulty: string
  ): string => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateScore = (): { correct: boolean; accuracy: number; xpEarned: number } => {
    if (!challenge) return { correct: false, accuracy: 0, xpEarned: 0 };

    let correct = false;
    let accuracy = 0;

    if (challenge.type === 'fill-blank' && typeof challenge.expectedAnswer === 'number') {
      const userNum = parseFloat(userAnswer);
      const tolerance = challenge.tolerance || 0.01;
      correct = Math.abs(userNum - challenge.expectedAnswer) < tolerance;
      accuracy = correct ? 1.0 : 0;
    } else if (challenge.type === 'multiple-choice') {
      const selectedIndex = parseInt(userAnswer);
      correct = selectedIndex === challenge.correctChoiceIndex;
      accuracy = correct ? 1.0 : 0;
    }

    const xpMultiplier =
      challenge.difficulty === 'easy'
        ? 1.0
        : challenge.difficulty === 'medium'
          ? 1.5
          : challenge.difficulty === 'hard'
            ? 2.0
            : 2.5;

    const baseXP = challenge.baseXP;
    const xpEarned = Math.round(baseXP * xpMultiplier * accuracy);

    return { correct, accuracy, xpEarned };
  };

  const handleSubmit = () => {
    if (!userAnswer) {
      setFeedback({ type: 'error', message: '⚠️ Please enter an answer' });
      return;
    }

    const { correct, accuracy, xpEarned } = calculateScore();

    if (correct) {
      setFeedback({
        type: 'success',
        message: `✅ Correct! +${xpEarned} XP earned`,
      });
      setCompletedChallenges((prev) => new Set([...prev, currentChallengeIdx]));
      setTotalXPEarned((prev) => prev + xpEarned);
      onChallengeComplete?.(currentChallengeIdx, accuracy, xpEarned);

      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        if (currentChallengeIdx < challenges.length - 1) {
          setCurrentChallengeIdx(currentChallengeIdx + 1);
          setUserAnswer('');
          setFeedback(null);
          setSubmitted(false);
        } else {
          onAllComplete?.(totalXPEarned + xpEarned);
        }
      }, 1500);
    } else {
      setFeedback({
        type: 'error',
        message: `❌ Not quite right. Try again!`,
      });
    }

    setSubmitted(true);
  };

  const handleNextChallenge = () => {
    if (currentChallengeIdx < challenges.length - 1) {
      setCurrentChallengeIdx(currentChallengeIdx + 1);
      setUserAnswer('');
      setFeedback(null);
      setSubmitted(false);
    }
  };

  const handleSkip = () => {
    handleNextChallenge();
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">🔧 Practice Challenges</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Session XP</p>
            <p className="text-3xl font-bold text-orange-500">+{totalXPEarned}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Challenge {currentChallengeIdx + 1} of {challenges.length}
            </span>
            <span>{completedChallenges.size} completed</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
              style={{ width: `${((completedChallenges.size) / challenges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty.toUpperCase()}
            </span>
            {isComplete && <span className="text-2xl">✅</span>}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{challenge.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{challenge.description}</p>
        </div>

        {/* Challenge Content */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 space-y-4">
          <p className="text-gray-800 whitespace-pre-wrap font-mono">{challenge.prompt}</p>

          {/* Input based on type */}
          {challenge.type === 'fill-blank' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Your Answer:</label>
              <input
                type="number"
                step="0.01"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                disabled={isComplete}
                className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          )}

          {challenge.type === 'multiple-choice' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Select your answer:</label>
              <div className="grid grid-cols-2 gap-2">
                {challenge.choices?.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserAnswer(String(idx))}
                    disabled={isComplete}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      userAnswer === String(idx)
                        ? 'bg-blue-600 text-white border-2 border-blue-700'
                        : 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:border-blue-300'
                    } ${isComplete && 'cursor-not-allowed'}`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`p-4 rounded-lg ${
              feedback.type === 'success'
                ? 'bg-green-50 border-l-4 border-green-500 text-green-800'
                : 'bg-red-50 border-l-4 border-red-500 text-red-800'
            }`}
          >
            <p className="font-semibold">{feedback.message}</p>
            {isComplete && (
              <p className="text-sm mt-2">
                Expected: {challenge.expectedAnswer} (your answer: {userAnswer})
              </p>
            )}
          </div>
        )}

        {/* Hints (optional) */}
        {!isComplete && challenge.difficulty !== 'easy' && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-900">
              💡 <strong>Hint:</strong> Re-read the formula at the top. Double-check your order of operations!
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!isComplete ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              Check Answer
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-700 border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-50"
            >
              Skip
            </button>
          </>
        ) : (
          <button
            onClick={handleNextChallenge}
            disabled={currentChallengeIdx >= challenges.length - 1}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:bg-gray-300"
          >
            {currentChallengeIdx >= challenges.length - 1 ? '✅ All Complete!' : 'Next Challenge →'}
          </button>
        )}
      </div>

      {/* Challenge List Sidebar (optional) */}
      {completedChallenges.size > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Completed:</p>
          <div className="flex gap-2 flex-wrap">
            {Array.from(completedChallenges).map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentChallengeIdx(idx)}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold hover:bg-green-200"
              >
                Challenge {idx + 1} ✓
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerceptronPractice;
