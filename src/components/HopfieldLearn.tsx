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

  if (!lesson) return <div className="text-red-500">Lesson not found: {lessonId}</div>;
  const { learnContent } = lesson;

  return (
    <div className="space-y-8 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-gray-900">💾 {learnContent.title}</h2>

      {/* Explanation */}
      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
        {learnContent.explanation}
      </div>

      {/* Key Formulas */}
      {learnContent.keyFormulas.length > 0 && (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <p className="font-semibold text-purple-900 mb-2">Key Formulas</p>
          <ul className="space-y-1">
            {learnContent.keyFormulas.map((f, i) => (
              <li key={i} className="font-mono text-sm text-purple-800">{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive pattern recall demo (hopfield-5 and hopfield-1) */}
      {(lessonId === 'hopfield-1' || lessonId === 'hopfield-5') && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-purple-900">🎮 Pattern Recall Demo</h3>
          <p className="text-sm text-purple-700">
            Stored pattern: <span className="font-mono font-bold">[{storedPattern.join(', ')}]</span>.
            Starting from noisy input <span className="font-mono">[1, 1, 1, 0]</span>, click Step to watch the network converge.
          </p>

          {/* Current state */}
          <div className="flex gap-3 items-center">
            <span className="text-sm font-semibold text-gray-700">Current state:</span>
            <div className="flex gap-2">
              {state.map((s, i) => (
                <div key={i}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl ${s === 1 ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  {s}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">Energy: {calcEnergy(state).toFixed(1)}</span>
          </div>

          {/* History */}
          <div className="space-y-1">
            {history.map((h, idx) => (
              <div key={idx} className="flex gap-2 items-center text-sm">
                <span className="text-gray-400 w-8">t={idx}</span>
                {h.map((v, i) => (
                  <span key={i}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${v === 1 ? 'bg-purple-200 text-purple-800' : 'bg-gray-100 text-gray-500'}`}>
                    {v}
                  </span>
                ))}
                <span className="text-gray-400">E={calcEnergy(h).toFixed(1)}</span>
              </div>
            ))}
          </div>

          {converged && (
            <div className="bg-green-100 border border-green-300 rounded p-3 text-green-800 font-semibold">
              ✅ Converged! Network recalled the stored pattern.
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={stepNetwork} disabled={converged}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition">
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-amber-900">📊 Hebbian Weight Matrix</h3>
          <p className="text-sm text-amber-700">
            Storing pattern <span className="font-mono font-bold">[{storedPattern.join(', ')}]</span> using w_ij = p_i × p_j
          </p>
          <div className="overflow-x-auto">
            <table className="border-collapse text-center text-sm font-mono">
              <thead>
                <tr>
                  <th className="w-8"></th>
                  {Array.from({ length: N }).map((_, j) => (
                    <th key={j} className="w-10 p-1 text-amber-900">N{j + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weights.map((row, i) => (
                  <tr key={i}>
                    <td className="p-1 font-bold text-amber-900">N{i + 1}</td>
                    {row.map((w, j) => (
                      <td key={j}
                        className={`p-2 border ${i === j ? 'bg-gray-200' : w > 0 ? 'bg-green-100' : w < 0 ? 'bg-red-100' : 'bg-white'}`}>
                        {w}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-amber-600">Gray = diagonal (always 0). Green = positive connection. Red = negative.</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={() => onComplete?.()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
          ✓ Complete Lesson
        </button>
      </div>
    </div>
  );
};

export default HopfieldLearn;
