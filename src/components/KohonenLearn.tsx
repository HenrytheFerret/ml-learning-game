/**
 * KohonenLearn - Interactive explanation of Kohonen Self-Organizing Maps
 */

import React, { useState } from 'react';
import { LESSONS } from '../lib/lessons';
import { KohonenMap } from '../lib/nn-math';

interface KohonenLearnProps {
  onComplete?: () => void;
  lessonId: string;
}

const KohonenLearn: React.FC<KohonenLearnProps> = ({ onComplete, lessonId }) => {
  const lesson = LESSONS.kohonen.find(l => l.id === lessonId);

  // Demo state for BMU finder (lesson kohonen-2)
  const [demoInput, setDemoInput] = useState([0.8, 0.6]);
  const [units] = useState([
    [0.9, 0.1],
    [0.1, 0.9],
    [0.5, 0.5],
    [0.8, 0.7],
  ]);

  const som = new KohonenMap({ units: units.map(u => [...u]), learningRate: 0.3 });

  const euclidean = (a: number[], b: number[]) =>
    Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));

  const distances = units.map((u, i) => ({
    idx: i,
    dist: euclidean(demoInput, u),
  }));
  const bmuIdx = distances.reduce((best, d) => (d.dist < best.dist ? d : best), distances[0]).idx;

  if (!lesson) return <div className="text-red-500">Lesson not found: {lessonId}</div>;

  const { learnContent } = lesson;

  return (
    <div className="space-y-8 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-gray-900">🗺️ {learnContent.title}</h2>

      {/* Explanation */}
      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
        {learnContent.explanation}
      </div>

      {/* Key Formulas */}
      {learnContent.keyFormulas.length > 0 && (
        <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
          <p className="font-semibold text-teal-900 mb-2">Key Formulas</p>
          <ul className="space-y-1">
            {learnContent.keyFormulas.map((f, i) => (
              <li key={i} className="font-mono text-sm text-teal-800">{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Demo: BMU finder (kohonen-2) */}
      {lessonId === 'kohonen-2' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-indigo-900">🎮 Find the BMU</h3>
          <p className="text-sm text-indigo-700">Adjust the input vector and watch which neuron wins.</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Input[0]: {demoInput[0].toFixed(2)}
              </label>
              <input type="range" min="0" max="1" step="0.05"
                value={demoInput[0]}
                onChange={e => setDemoInput([+e.target.value, demoInput[1]])}
                className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Input[1]: {demoInput[1].toFixed(2)}
              </label>
              <input type="range" min="0" max="1" step="0.05"
                value={demoInput[1]}
                onChange={e => setDemoInput([demoInput[0], +e.target.value])}
                className="w-full" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-200">
                  <th className="p-2 text-left">Neuron</th>
                  <th className="p-2 text-left">Weights</th>
                  <th className="p-2 text-left">Distance</th>
                  <th className="p-2 text-left">Winner?</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u, i) => (
                  <tr key={i} className={i === bmuIdx ? 'bg-green-100 font-bold' : 'bg-white'}>
                    <td className="p-2 border">N{i + 1}</td>
                    <td className="p-2 border font-mono">[{u.map(v => v.toFixed(2)).join(', ')}]</td>
                    <td className="p-2 border font-mono">{distances[i].dist.toFixed(4)}</td>
                    <td className="p-2 border">{i === bmuIdx ? '✅ BMU' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOM Grid viz for kohonen-1 */}
      {lessonId === 'kohonen-1' && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-teal-900 mb-3">🗺️ SOM Grid (3×3)</h3>
          <p className="text-sm text-teal-700 mb-4">Each cell is a neuron. After training, similar inputs activate nearby neurons.</p>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i}
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: `hsl(${i * 40}, 70%, 55%)` }}>
                N{i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={() => onComplete?.()}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          ✓ Complete Lesson
        </button>
      </div>
    </div>
  );
};

export default KohonenLearn;
