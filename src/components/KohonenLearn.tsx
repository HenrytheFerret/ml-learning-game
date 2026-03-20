/**
 * KohonenLearn - Interactive explanation of Kohonen Self-Organizing Maps
 * Styled to match PerceptronLearn aesthetic with step indicators
 * Refactored for multi-step progression (TASK-002)
 */

import React, { useState } from 'react';
import { LESSONS } from '../lib/lessons';

interface KohonenLearnProps {
  onComplete?: () => void;
  lessonId: string;
}

interface LessonStep {
  title: string;
  content: JSX.Element;
}

// ─── BMU Finder Sub-component ────────────────────────────────────────────────
const BMUFinder: React.FC = () => {
  const [demoInput, setDemoInput] = useState([0.8, 0.6]);
  const units = [
    [0.9, 0.1],
    [0.1, 0.9],
    [0.5, 0.5],
    [0.8, 0.7],
  ];

  const euclidean = (a: number[], b: number[]) =>
    Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));

  const distances = units.map((u, i) => ({ idx: i, dist: euclidean(demoInput, u) }));
  const bmuIdx = distances.reduce((best, d) => (d.dist < best.dist ? d : best), distances[0]).idx;

  return (
    <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-indigo-900">🎮 Find the Best-Matching Unit (BMU)</h3>
      <p className="text-sm text-indigo-700">Adjust the input vector and watch which neuron becomes the winner.</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Input[0]: {demoInput[0].toFixed(2)}
          </label>
          <input type="range" min="0" max="1" step="0.05"
            value={demoInput[0]}
            onChange={e => setDemoInput([+e.target.value, demoInput[1]])}
            className="w-full cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Input[1]: {demoInput[1].toFixed(2)}
          </label>
          <input type="range" min="0" max="1" step="0.05"
            value={demoInput[1]}
            onChange={e => setDemoInput([demoInput[0], +e.target.value])}
            className="w-full cursor-pointer" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-200 text-indigo-900 font-bold">
              <th className="p-2 text-left border border-indigo-300">Neuron</th>
              <th className="p-2 text-left border border-indigo-300">Weights</th>
              <th className="p-2 text-left border border-indigo-300">Distance</th>
              <th className="p-2 text-left border border-indigo-300">Winner?</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u, i) => (
              <tr key={i} className={`${i === bmuIdx ? 'bg-green-100 font-bold' : 'bg-white'} hover:bg-gray-50 transition`}>
                <td className="p-2 border border-gray-200">N{i + 1}</td>
                <td className="p-2 border border-gray-200 font-mono text-xs">[{u.map(v => v.toFixed(2)).join(', ')}]</td>
                <td className="p-2 border border-gray-200 font-mono">{distances[i].dist.toFixed(4)}</td>
                <td className="p-2 border border-gray-200 font-bold text-center">{i === bmuIdx ? '✅' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <p className="text-sm text-green-900">
          <strong>🏆 Winner:</strong> Neuron N{bmuIdx + 1} is the BMU (shortest distance: {distances[bmuIdx].dist.toFixed(4)})
        </p>
      </div>
    </div>
  );
};

// ─── SOM Grid Sub-component ───────────────────────────────────────────────────
const SOMGrid: React.FC = () => (
  <div className="bg-teal-50 border-l-4 border-teal-500 rounded-lg p-6 space-y-4">
    <h3 className="text-lg font-bold text-teal-900">🗺️ Self-Organizing Map Grid (3×3)</h3>
    <p className="text-sm text-teal-700">
      Each cell represents a neuron. After training, similar inputs activate nearby neurons,
      forming a topology-preserving map.
    </p>
    <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i}
            className="w-20 h-20 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: `hsl(${i * 40}, 70%, 55%)` }}
            title={`Neuron N${i + 1}`}>
            N{i + 1}
          </div>
        ))}
      </div>
    </div>
    <p className="text-xs text-teal-600 text-center">
      💡 Tip: Neurons that activate for similar inputs tend to be close together on the map.
    </p>
  </div>
);

// ─── Step builder ─────────────────────────────────────────────────────────────
const buildLessonSteps = (lesson: any): LessonStep[] => {
  const { learnContent } = lesson;

  const explanationStep: LessonStep = {
    title: learnContent.title,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">{learnContent.explanation}</p>
        {learnContent.keyFormulas.length > 0 && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
            <p className="font-semibold text-green-300">Key Formulas:</p>
            {learnContent.keyFormulas.map((f: string, i: number) => (
              <p key={i}>{f}</p>
            ))}
          </div>
        )}
      </div>
    ),
  };

  switch (lesson.id) {
    case 'kohonen-1':
      return [
        explanationStep,
        { title: 'SOM Grid Visualization', content: <SOMGrid /> },
      ];
    case 'kohonen-2':
      return [
        explanationStep,
        { title: 'Interactive BMU Finder', content: <BMUFinder /> },
      ];
    default:
      return [explanationStep];
  }
};

// ─── Main component ───────────────────────────────────────────────────────────
const KohonenLearn: React.FC<KohonenLearnProps> = ({ onComplete, lessonId }) => {
  const [step, setStep] = useState(0);
  const lesson = LESSONS.kohonen.find(l => l.id === lessonId);

  if (!lesson) {
    return <div className="text-center text-red-600 py-8">❌ Lesson not found: {lessonId}</div>;
  }

  const steps = buildLessonSteps(lesson);
  const currentStep = steps[step];

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-10 h-10 rounded-full font-bold transition-all ${
                i === step
                  ? 'bg-teal-600 text-white scale-110 shadow-lg'
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
      <h2 className="text-3xl font-bold text-gray-900">🗺️ {currentStep.title}</h2>

      {/* Step content */}
      <div className="text-gray-700">{currentStep.content}</div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-lg transition"
        >
          ← Previous
        </button>
        <div className="text-sm text-gray-600">{step + 1} / {steps.length}</div>
        <button
          onClick={() => (step === steps.length - 1 ? onComplete?.() : setStep(step + 1))}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition shadow-md"
        >
          {step === steps.length - 1 ? '✓ Complete!' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default KohonenLearn;
