/**
 * HopfieldLearn - Interactive explanation of Hopfield Networks
 */

import React, { useState } from 'react';
import { LESSONS } from '../lib/lessons';
import { HopfieldNetwork } from '../lib/nn-math';

interface HopfieldLearnProps {
  onComplete?: () => void;
  lessonId: string;
}

const HopfieldLearn: React.FC<HopfieldLearnProps> = ({ onComplete, lessonId }) => {
  const lesson = LESSONS.hopfield.find(l => l.id === lessonId);

  // Demo: 4-neuron Hopfield — store pattern [1,0,1,0]
  const storedPattern = [1, 0, 1, 0];
  const N = storedPattern.length;

  // Build Hebbian weights
  const weights: number[][] = Array.from({ length: N }, (_, i) =>
    Array.from({ length: N }, (_, j) =>
      i === j ? 0 : storedPattern[i] * storedPattern[j]
    )
  );
  const biases = Array(N).fill(0);
  const network = new HopfieldNetwork({ weights, biases });

  const [state, setState] = useState<number[]>([1, 1, 1, 0]); // noisy start
  const [history, setHistory] = useState<number[][]>([[1, 1, 1, 0]]);
  const [converged, setConverged] = useState(false);

  const stepNetwork = () => {
    if (converged) return;
    const newState = [...state];
    let changed = false;
    for (let i = 0; i < N; i++) {
      const updated = network.stateTransition(newState, i);
      if (updated[i] !== newState[i]) { newState[i] = updated[i]; changed = true; }
    }
    const nextHistory = [...history, [...newState]];
    setState(newState);
    setHistory(nextHistory);
    if (!changed) setConverged(true);
  };

  const resetDemo = () => {
    const noisy = [1, 1, 1, 0];
    setState(noisy);
    setHistory([noisy]);
    setConverged(false);
  };

  const calcEnergy = (s: number[]) => {
    let e = 0;
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++)
        e -= 0.5 * weights[i][j] * s[i] * s[j];
    return e;
  };

  if (!lesson) return <div className="text-center text-red-600 py-8">❌ Lesson not found: {lessonId}</div>;
  const { learnContent } = lesson;

  const [step, setStep] = useState(0);

  const steps = [
    {
      title: learnContent.title,
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            {learnContent.explanation}
          </p>

          {/* Key Formulas */}
          {learnContent.keyFormulas.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
              <p className="font-semibold text-green-300">Key Formulas:</p>
              {learnContent.keyFormulas.map((f, i) => (
                <p key={i}>{f}</p>
              ))}
            </div>
          )}

          {/* Interactive pattern recall demo (hopfield-5 and hopfield-1) */}
          {(lessonId === 'hopfield-1' || lessonId === 'hopfield-5') && (
            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-purple-900">🎮 Pattern Recall Demo</h3>
              <p className="text-sm text-purple-700">
                Stored pattern: <span className="font-mono font-bold">[{storedPattern.join(', ')}]</span>.
                Starting from noisy input <span className="font-mono">[1, 1, 1, 0]</span>, click Step to watch the network converge.
              </p>

              {/* Current state */}
              <div className="flex gap-3 items-center flex-wrap">
                <span className="text-sm font-semibold text-gray-700">Current state:</span>
                <div className="flex gap-2">
                  {state.map((s, i) => (
                    <div key={i}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md transition-colors ${s === 1 ? 'bg-purple-600' : 'bg-gray-300'}`}>
                      {s}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-semibold">Energy: {calcEnergy(state).toFixed(1)}</span>
              </div>

              {/* History */}
              <div className="space-y-2 bg-white p-4 rounded border border-gray-200">
                <p className="text-sm font-semibold text-gray-700">Evolution:</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {history.map((h, idx) => (
                    <div key={idx} className="flex gap-2 items-center text-sm">
                      <span className="text-gray-400 w-12 font-semibold">t={idx}</span>
                      {h.map((v, i) => (
                        <span key={i}
                          className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${v === 1 ? 'bg-purple-200 text-purple-800' : 'bg-gray-100 text-gray-500'}`}>
                          {v}
                        </span>
                      ))}
                      <span className="text-gray-400 ml-2">E={calcEnergy(h).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {converged && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-800 font-semibold">
                  ✅ Converged! Network successfully recalled the stored pattern.
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={stepNetwork} disabled={converged}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition shadow-md">
                  Step →
                </button>
                <button onClick={resetDemo}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Weight matrix display for hopfield-2 */}
          {lessonId === 'hopfield-2' && (
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-amber-900">📊 Hebbian Weight Matrix</h3>
              <p className="text-sm text-amber-700">
                Storing pattern <span className="font-mono font-bold">[{storedPattern.join(', ')}]</span> using the Hebbian rule: w_ij = p_i × p_j
              </p>
              <div className="overflow-x-auto">
                <table className="border-collapse text-center text-sm font-mono bg-white">
                  <thead>
                    <tr className="bg-amber-100">
                      <th className="w-8 p-2 border border-amber-200"></th>
                      {Array.from({ length: N }).map((_, j) => (
                        <th key={j} className="w-10 p-2 border border-amber-200 text-amber-900 font-bold">N{j + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weights.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 border border-amber-200 font-bold text-amber-900">N{i + 1}</td>
                        {row.map((w, j) => (
                          <td key={j}
                            className={`p-2 border ${i === j ? 'bg-gray-200 text-gray-600' : w > 0 ? 'bg-green-100 text-green-800' : w < 0 ? 'bg-red-100 text-red-800' : 'bg-white'}`}>
                            {w}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-amber-700">💡 Gray diagonal = 0 (no self-connections). Green = positive weights (correlated). Red = negative (anti-correlated).</p>
            </div>
          )}
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="space-y-8">
      {/* Step indicator (matching PerceptronLearn) */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-10 h-10 rounded-full font-bold transition-all ${
                i === step
                  ? 'bg-purple-600 text-white scale-110 shadow-lg'
                  : i < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Step {step + 1} of {steps.length}
        </div>
      </div>

      {/* Step title */}
      <h2 className="text-3xl font-bold text-gray-900">💾 {currentStep.title}</h2>

      {/* Step content */}
      <div className="text-gray-700">{currentStep.content}</div>

      {/* Navigation (matching PerceptronLearn) */}
      <div className="flex justify-between items-center pt-8 border-t">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-lg transition"
        >
          ← Previous
        </button>

        <div className="text-sm text-gray-600">
          {step + 1} / {steps.length}
        </div>

        <button
          onClick={() => (step === steps.length - 1 ? onComplete?.() : setStep(step + 1))}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md"
        >
          {step === steps.length - 1 ? '✓ Complete!' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default HopfieldLearn;
