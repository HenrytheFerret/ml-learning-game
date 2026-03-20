/**
 * Truth Table Builder - Interactive Challenge for Perceptron
 * User fills in net values and activations for given inputs and weights
 */

import React, { useState, useMemo } from 'react';
import { Perceptron } from '../lib/nn-math';
import { SCORING } from '../lib/scoring';

interface TruthTableBuilderProps {
  weights: number[];
  bias: number;
  activationFn?: 'threshold' | 'sigmoidal' | 'linear';
  difficulty?: 'easy' | 'medium' | 'hard';
  onComplete?: (accuracy: number, xpEarned: number) => void;
}

const TruthTableBuilder: React.FC<TruthTableBuilderProps> = ({
  weights,
  bias,
  activationFn = 'threshold',
  difficulty = 'medium',
  onComplete,
}) => {
  const perceptron = useMemo(
    () => new Perceptron({ weights, bias, activationFn }),
    [weights, bias, activationFn]
  );

  const correctAnswers = useMemo(() => perceptron.truthTable(weights.length), [perceptron, weights.length]);

  const [userInputs, setUserInputs] = useState<{
    [rowIdx: number]: { net?: string; activation?: string };
  }>({});

  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  const showNetColumn = difficulty !== 'hard';
  const showActivationHelper = difficulty === 'easy';

  const handleNetChange = (rowIdx: number, value: string): void => {
    setUserInputs((prev) => ({
      ...prev,
      [rowIdx]: { ...prev[rowIdx], net: value },
    }));
  };

  const handleActivationChange = (rowIdx: number, value: string): void => {
    setUserInputs((prev) => ({
      ...prev,
      [rowIdx]: { ...prev[rowIdx], activation: value },
    }));
  };

  const handleSubmit = (): void => {
    let correctCount = 0;
    let totalCells = 0;

    // Check accuracy
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
    const xpEarned = accuracy === 1 ? SCORING.CORRECT_TRUTH_TABLE_ROW * correctAnswers.length * 1.5 : SCORING.CORRECT_TRUTH_TABLE_ROW * correctCount;

    setFeedback(
      accuracy === 1
        ? '🎉 Perfect! All values correct!'
        : `${Math.round(accuracy * 100)}% correct. Review the highlighted rows below.`
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Build the Truth Table</h2>
        <p className="text-gray-600">Given weights and bias, calculate the output for each input combination.</p>
        <div className="mt-2 p-3 bg-blue-50 rounded text-sm">
          <p>
            <strong>Weights:</strong> {weights.map((w) => w.toFixed(2)).join(', ')} | <strong>Bias:</strong> {bias.toFixed(2)}
          </p>
          <p>
            <strong>Formula:</strong> net = Σ(input × weight) + bias
          </p>
          <p>
            <strong>Activation:</strong> {activationFn === 'threshold' ? 'if net ≥ 0 then 1, else 0' : 'sigmoidal (1 / (1 + e^-net))'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2">Inputs</th>
              {showNetColumn && <th className="border border-gray-300 p-2">Net Value</th>}
              <th className="border border-gray-300 p-2">Activation</th>
              {submitted && <th className="border border-gray-300 p-2">Correct?</th>}
            </tr>
          </thead>
          <tbody>
            {correctAnswers.map((row, rowIdx) => {
              const isCorrect = submitted && checkRowCorrect(rowIdx);
              const rowClass = submitted ? (isCorrect ? 'bg-green-50' : 'bg-red-50') : '';

              return (
                <tr key={rowIdx} className={rowClass}>
                  <td className="border border-gray-300 p-2 font-mono">
                    {row.inputs.join(', ')}
                  </td>
                  {showNetColumn && (
                    <td className="border border-gray-300 p-2">
                      {submitted ? (
                        <div>
                          <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600'}>
                            {row.net.toFixed(2)}
                          </span>
                          {!isCorrect && (
                            <p className="text-xs text-gray-500 mt-1">
                              Your answer: {userInputs[rowIdx]?.net}
                            </p>
                          )}
                        </div>
                      ) : (
                        <input
                          type="number"
                          step="0.01"
                          value={userInputs[rowIdx]?.net || ''}
                          onChange={(e) => handleNetChange(rowIdx, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          placeholder="0.00"
                          disabled={submitted}
                        />
                      )}
                    </td>
                  )}
                  <td className="border border-gray-300 p-2">
                    {submitted ? (
                      <div>
                        <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600'}>
                          {row.activation}
                        </span>
                        {!isCorrect && userInputs[rowIdx]?.activation && (
                          <p className="text-xs text-gray-500 mt-1">
                            Your answer: {userInputs[rowIdx]?.activation}
                          </p>
                        )}
                      </div>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max="1"
                        value={userInputs[rowIdx]?.activation || ''}
                        onChange={(e) => handleActivationChange(rowIdx, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        placeholder="0 or 1"
                        disabled={submitted}
                      />
                    )}
                  </td>
                  {submitted && (
                    <td className="border border-gray-300 p-2 text-center">
                      {isCorrect ? '✅' : '❌'}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showActivationHelper && !submitted && (
        <div className="mb-4 p-3 bg-yellow-50 rounded text-sm">
          <p className="text-gray-700">
            <strong>Hint:</strong> Calculate net first, then apply the activation function to determine the output.
          </p>
        </div>
      )}

      {feedback && (
        <div className={`mb-4 p-3 rounded ${submitted && feedback.includes('Perfect') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
          {feedback}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitted}
        className={`px-6 py-2 rounded font-bold text-white ${
          submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {submitted ? 'Submitted ✓' : 'Submit Answer'}
      </button>

      {submitted && (
        <button
          onClick={() => {
            setSubmitted(false);
            setUserInputs({});
            setFeedback('');
          }}
          className="ml-2 px-6 py-2 rounded font-bold text-white bg-gray-500 hover:bg-gray-600"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default TruthTableBuilder;
