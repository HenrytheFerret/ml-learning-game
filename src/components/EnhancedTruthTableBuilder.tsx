/**
 * Enhanced Truth Table Builder - With Weight Sliders & 2D Decision Boundary Visualization
 * Features:
 * - Real-time weight sliders with instant truth table updates
 * - 2D visualization showing decision boundary
 * - Narrative framing for challenges
 * - Challenge progression (warm-up → build → master)
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Perceptron } from '../lib/nn-math';
import { SCORING } from '../lib/scoring';

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
  targetOutputs?: { inputs: number[], expected: number }[];
}

interface EnhancedTruthTableBuilderProps {
  challenge: Challenge;
  difficulty?: 'easy' | 'medium' | 'hard';
  onComplete?: (accuracy: number, xpEarned: number) => void;
  onStreakUpdate?: (streak: number) => void;
}

const EnhancedTruthTableBuilder: React.FC<EnhancedTruthTableBuilderProps> = ({
  challenge,
  difficulty = 'medium',
  onComplete,
  onStreakUpdate,
}) => {
  const [weights, setWeights] = useState<number[]>(challenge.weights);
  const [bias, setBias] = useState<number>(challenge.bias);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [showVisualization, setShowVisualization] = useState(true);

  const perceptron = useMemo(
    () => new Perceptron({ weights, bias, activationFn: challenge.activationFn }),
    [weights, bias, challenge.activationFn]
  );

  const correctAnswers = useMemo(() => perceptron.truthTable(weights.length), [perceptron, weights.length]);

  const [userInputs, setUserInputs] = useState<{
    [rowIdx: number]: { net?: string; activation?: string };
  }>({});

  const showNetColumn = difficulty !== 'hard';
  const showActivationHelper = difficulty === 'easy';
  const xpMultiplier = { 'warm-up': 1, 'build': 1.5, 'master': 2, 'expert': 2.5 }[challenge.type];

  // Handle weight slider changes
  const handleWeightChange = (index: number, value: number) => {
    if (!challenge.canModifyWeights) return;
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  const handleBiasChange = (value: number) => {
    if (!challenge.canModifyWeights) return;
    setBias(value);
  };

  // Handle user input for truth table
  const handleNetChange = (rowIdx: number, value: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [rowIdx]: { ...prev[rowIdx], net: value },
    }));
  };

  const handleActivationChange = (rowIdx: number, value: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [rowIdx]: { ...prev[rowIdx], activation: value },
    }));
  };

  // Submit challenge
  const handleSubmit = () => {
    let correctCount = 0;
    let totalCells = 0;

    correctAnswers.forEach((row, rowIdx) => {
      const userRow = userInputs[rowIdx];

      if (showNetColumn) {
        totalCells++;
        if (userRow?.net !== undefined) {
          const userNet = parseFloat(userRow.net);
          if (Math.abs(userNet - row.net) < 0.01) {
            correctCount++;
          }
        }
      }

      totalCells++;
      if (userRow?.activation !== undefined) {
        const userActivation = parseInt(userRow.activation);
        if (userActivation === row.activation) {
          correctCount++;
        }
      }
    });

    const accuracy = correctCount / totalCells;
    const baseXP = SCORING.CORRECT_TRUTH_TABLE_ROW * correctAnswers.length;
    const xpEarned = Math.round(accuracy === 1 ? baseXP * 1.5 * xpMultiplier : baseXP * accuracy * xpMultiplier);

    const perfectionBonus = accuracy === 1 ? ' 🎉 PERFECT!' : '';
    setFeedback(
      accuracy === 1
        ? `Perfect! All values correct!${perfectionBonus}`
        : `${Math.round(accuracy * 100)}% correct. Review the highlighted rows.`
    );
    setSubmitted(true);

    if (onComplete) {
      onComplete(accuracy, xpEarned);
    }
  };

  const checkRowCorrect = (rowIdx: number): boolean => {
    const userRow = userInputs[rowIdx];
    const correctRow = correctAnswers[rowIdx];

    let netCorrect = true;
    let activationCorrect = true;

    if (showNetColumn && userRow?.net !== undefined) {
      const userNet = parseFloat(userRow.net);
      netCorrect = Math.abs(userNet - correctRow.net) < 0.01;
    }

    if (userRow?.activation !== undefined) {
      const userActivation = parseInt(userRow.activation);
      activationCorrect = userActivation === correctRow.activation;
    }

    return netCorrect && activationCorrect;
  };

  // 2D Decision Boundary Visualization
  const DecisionBoundary = () => {
    const canvasSize = 300;
    const scale = 50;
    const ctx = React.useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
      const canvas = document.getElementById('decision-boundary') as HTMLCanvasElement;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      context.clearRect(0, 0, canvasSize, canvasSize);
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvasSize, canvasSize);

      // Draw grid
      context.strokeStyle = '#e0e0e0';
      context.lineWidth = 1;
      for (let i = 0; i <= canvasSize; i += scale) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvasSize);
        context.stroke();

        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(canvasSize, i);
        context.stroke();
      }

      // Draw decision boundary line: w1*x1 + w2*x2 + bias = 0
      if (weights.length >= 2) {
        const w1 = weights[0];
        const w2 = weights[1];

        context.strokeStyle = '#FF6B6B';
        context.lineWidth = 2;
        context.beginPath();

        let started = false;
        for (let x1 = -5; x1 <= 5; x1 += 0.1) {
          // x2 = -(w1 * x1 + bias) / w2
          if (w2 === 0) continue;
          const x2 = -(w1 * x1 + bias) / w2;
          const pixelX = (x1 + 2.5) * scale;
          const pixelY = canvasSize - (x2 + 2.5) * scale;

          if (pixelX >= 0 && pixelX <= canvasSize && pixelY >= 0 && pixelY <= canvasSize) {
            if (!started) {
              context.moveTo(pixelX, pixelY);
              started = true;
            } else {
              context.lineTo(pixelX, pixelY);
            }
          }
        }
        context.stroke();
      }

      // Draw data points from truth table
      correctAnswers.forEach((row) => {
        if (row.inputs.length >= 2) {
          const x1 = row.inputs[0];
          const x2 = row.inputs[1];
          const pixelX = (x1 + 2.5) * scale;
          const pixelY = canvasSize - (x2 + 2.5) * scale;

          context.fillStyle = row.activation === 1 ? '#4ECDC4' : '#FFE66D';
          context.beginPath();
          context.arc(pixelX, pixelY, 6, 0, 2 * Math.PI);
          context.fill();

          // Draw border
          context.strokeStyle = row.activation === 1 ? '#2A9D8F' : '#F4A261';
          context.lineWidth = 2;
          context.stroke();
        }
      });

      // Legend
      context.font = '12px sans-serif';
      context.fillStyle = '#333';
      context.fillText('Activation = 1 (Cyan)', 10, canvasSize - 10);
      context.fillStyle = '#FFE66D';
      context.fillRect(200, canvasSize - 20, 12, 12);
      context.fillStyle = '#333';
      context.fillText('Activation = 0 (Yellow)', 215, canvasSize - 10);
    }, [weights, bias, correctAnswers]);

    return (
      <canvas
        id="decision-boundary"
        width={canvasSize}
        height={canvasSize}
        className="border-2 border-gray-300 rounded-lg bg-white"
      />
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg">
      {/* Story Section */}
      <div className="mb-6 p-4 bg-white rounded-lg border-l-4 border-purple-500">
        <div className="flex gap-3 items-start">
          <span className="text-3xl">{challenge.emoji}</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">{challenge.title}</h2>
            <p className="text-gray-700">{challenge.story}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              {challenge.type.toUpperCase()} • +{Math.round(SCORING.CORRECT_TRUTH_TABLE_ROW * correctAnswers.length * xpMultiplier)} XP
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Weight Sliders & Truth Table */}
        <div>
          {/* Weight Sliders */}
          {challenge.canModifyWeights && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4">⚙️ Adjust Weights</h3>
              {weights.map((w, i) => (
                <div key={`weight-${i}`} className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weight {i + 1}: {w.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={w}
                    onChange={(e) => handleWeightChange(i, parseFloat(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    disabled={submitted}
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bias: {bias.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={bias}
                  onChange={(e) => handleBiasChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  disabled={submitted}
                />
              </div>
            </div>
          )}

          {/* Formula Reference */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm border-l-4 border-blue-500">
            <p className="font-semibold text-blue-900 mb-2">📐 Formula</p>
            <p className="text-blue-800 font-mono">
              net = Σ(input × weight) + bias
            </p>
            <p className="text-blue-700 text-xs mt-1">
              Activation: {challenge.activationFn === 'threshold' ? 'if net ≥ 0 then 1, else 0' : 'sigmoidal'}
            </p>
          </div>

          {/* Truth Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <tr>
                  <th className="border border-gray-300 p-2">Inputs</th>
                  {showNetColumn && <th className="border border-gray-300 p-2">Net</th>}
                  <th className="border border-gray-300 p-2">Output</th>
                  {submitted && <th className="border border-gray-300 p-2">✓</th>}
                </tr>
              </thead>
              <tbody>
                {correctAnswers.map((row, rowIdx) => {
                  const isCorrect = submitted && checkRowCorrect(rowIdx);
                  const rowClass = submitted
                    ? isCorrect
                      ? 'bg-green-50 hover:bg-green-100'
                      : 'bg-red-50 hover:bg-red-100'
                    : 'hover:bg-gray-50';

                  return (
                    <tr key={rowIdx} className={rowClass}>
                      <td className="border border-gray-300 p-2 font-mono text-xs">
                        {row.inputs.join(', ')}
                      </td>
                      {showNetColumn && (
                        <td className="border border-gray-300 p-2">
                          {submitted ? (
                            <div>
                              <span className={isCorrect ? 'text-green-700 font-bold' : 'text-red-700'}>
                                {row.net.toFixed(2)}
                              </span>
                              {!isCorrect && userInputs[rowIdx]?.net && (
                                <p className="text-xs text-gray-500">Got: {userInputs[rowIdx]?.net}</p>
                              )}
                            </div>
                          ) : (
                            <input
                              type="number"
                              step="0.01"
                              value={userInputs[rowIdx]?.net || ''}
                              onChange={(e) => handleNetChange(rowIdx, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                              placeholder="0.00"
                              disabled={submitted}
                            />
                          )}
                        </td>
                      )}
                      <td className="border border-gray-300 p-2">
                        {submitted ? (
                          <div>
                            <span className={isCorrect ? 'text-green-700 font-bold text-lg' : 'text-red-700 text-lg'}>
                              {row.activation}
                            </span>
                            {!isCorrect && userInputs[rowIdx]?.activation && (
                              <p className="text-xs text-gray-500">Got: {userInputs[rowIdx]?.activation}</p>
                            )}
                          </div>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            max="1"
                            value={userInputs[rowIdx]?.activation || ''}
                            onChange={(e) => handleActivationChange(rowIdx, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="0/1"
                            disabled={submitted}
                          />
                        )}
                      </td>
                      {submitted && (
                        <td className="border border-gray-300 p-2 text-center text-lg">
                          {isCorrect ? '✅' : '❌'}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: 2D Decision Boundary Visualization */}
        {showVisualization && weights.length >= 2 && (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold mb-3">📊 Decision Boundary</h3>
            <div className="mb-3">
              <DecisionBoundary />
            </div>
            <p className="text-xs text-gray-600 text-center">
              The red line separates the two classes. Adjust weights to see the boundary move!
            </p>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-lg font-semibold ${
            feedback.includes('Perfect')
              ? 'bg-green-100 text-green-800 border-2 border-green-500'
              : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Helper Text */}
      {showActivationHelper && !submitted && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm border-l-4 border-yellow-500">
          💡 <strong>Tip:</strong> Calculate the net value first, then apply the activation function.
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`px-6 py-2 rounded-lg font-bold text-white transition ${
            submitted
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
          }`}
        >
          {submitted ? '✓ Submitted' : 'Submit Answer'}
        </button>

        {submitted && (
          <>
            <button
              onClick={() => {
                setSubmitted(false);
                setUserInputs({});
                setFeedback('');
              }}
              className="px-6 py-2 rounded-lg font-bold text-white bg-orange-500 hover:bg-orange-600 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => setShowVisualization(!showVisualization)}
              className="px-6 py-2 rounded-lg font-bold text-white bg-gray-500 hover:bg-gray-600 transition"
            >
              {showVisualization ? 'Hide' : 'Show'} Visualization
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedTruthTableBuilder;
