/**
 * MultilayerLearn - Interactive explanation of Multilayer Perceptrons
 * With animated networks, formula breakdown, and interactive demos
 */

import React, { useState, useEffect } from 'react';
import { LESSONS } from '../lib/lessons';

interface MultilayerLearnProps {
  onComplete?: () => void;
  lessonId: string;
}

const MultilayerLearn: React.FC<MultilayerLearnProps> = ({ onComplete, lessonId }) => {
  const [step, setStep] = useState(0);
  
  const lesson = LESSONS.multilayer.find(l => l.id === lessonId);

  if (!lesson) {
    return <div className="text-red-500">Lesson not found for ID: {lessonId}</div>;
  }

  const { learnContent } = lesson;

  const steps = [
    {
      title: learnContent.title,
      content: (
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            {learnContent.explanation}
          </p>
          {learnContent.keyFormulas.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-semibold text-blue-900">Key Formulas:</p>
              <ul className="list-disc list-inside text-blue-800">
                {learnContent.keyFormulas.map((formula, idx) => (
                  <li key={idx} className="font-mono text-sm">{formula}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Placeholder for specific animations/interactive demos for this lesson */}
          {lesson.id === 'multilayer-1' && (
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <p className="text-green-800">
                    Interactive: Try to classify XOR with a single perceptron vs. a small multilayer network.
                </p>
            </div>
          )}
          {lesson.id === 'multilayer-2' && (
            <div className="bg-indigo-50 p-4 rounded-lg flex items-center gap-3">
                <span className="text-2xl">➡️</span>
                <p className="text-indigo-800">
                    Interactive: Step-by-step forward pass visualization.
                </p>
            </div>
          )}
           {lesson.id === 'multilayer-3' && (
            <div className="bg-purple-50 p-4 rounded-lg flex items-center gap-3">
                <span className="text-2xl">↩️</span>
                <p className="text-purple-800">
                    Interactive: Visualize error propagation backwards through a network.
                </p>
            </div>
          )}
           {lesson.id === 'multilayer-4' && (
            <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-3">
                <span className="text-2xl">📉</span>
                <p className="text-yellow-800">
                    Interactive: Explore how different learning rates affect gradient descent visually.
                </p>
            </div>
          )}
           {lesson.id === 'multilayer-5' && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
                <span className="text-2xl">🚫</span>
                <p className="text-red-800">
                    Interactive: See training/validation loss curves change with and without regularization.
                </p>
            </div>
          )}
           {lesson.id === 'multilayer-6' && (
            <div className="bg-cyan-50 p-4 rounded-lg flex items-center gap-3">
                <span className="text-2xl">🛠️</span>
                <p className="text-cyan-800">
                    Interactive: Simulate different initialization strategies and their impact on convergence.
                </p>
            </div>
          )}
        </div>
      ),
    },
    // More steps can be added for complex lessons if needed, similar to PerceptronLearn.tsx
  ];

  const currentStep = steps[step];

  return (
    <div className="space-y-8 p-6 bg-white shadow-lg rounded-xl">
      {/* Step title */}
      <h2 className="text-3xl font-bold text-gray-900">{currentStep.title}</h2>

      {/* Step content */}
      <div className="text-gray-700">{currentStep.content}</div>

      {/* Navigation */}
      <div className="flex justify-end items-center pt-8 border-t">
        <button
          onClick={() => onComplete?.()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          ✓ Complete Lesson
        </button>
      </div>
    </div>
  );
};

export default MultilayerLearn;
