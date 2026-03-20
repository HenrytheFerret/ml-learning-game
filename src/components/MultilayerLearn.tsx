/**
 * MultilayerLearn - Interactive explanation of Multilayer Perceptrons
 * With animated networks, formula breakdown, and interactive demos
 * Styled to match PerceptronLearn aesthetic
 */

import React, { useState, useEffect } from 'react';
import { LESSONS } from '../lib/lessons';

interface MultilayerLearnProps {
  onComplete?: () => void;
  lessonId: string;
}

interface LessonStep {
  title: string;
  content: JSX.Element;
}

// Helper function to build steps dynamically
const buildLessonSteps = (lesson: any): LessonStep[] => {
  const steps: LessonStep[] = [];

  // Initial explanation step
  steps.push({
    title: lesson.learnContent.title,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          {lesson.learnContent.explanation}
        </p>
        {lesson.learnContent.keyFormulas.length > 0 && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
            <p className="font-semibold text-green-300">Key Formulas:</p>
            {lesson.learnContent.keyFormulas.map((formula: string, idx: number) => (
              <p key={idx}>{formula}</p>
            ))}
          </div>
        )}
      </div>
    ),
  });

  // Add context-specific interactive hints as separate steps
  switch (lesson.id) {
    case 'multilayer-1':
      steps.push({
        title: 'Interactive Demo: XOR Classification',
        content: (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex gap-3">
              <span className="text-2xl flex-shrink-0">💡</span>
              <div>
                <p className="font-semibold text-green-900">Interactive Demo Available:</p>
                <p className="text-green-800 text-sm mt-1">
                  Try to classify XOR with a single perceptron vs. a small multilayer network.
                </p>
              </div>
          </div>
        ),
      });
      break;
    case 'multilayer-2':
      steps.push({
        title: 'Forward Pass Visualization',
        content: (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg flex gap-3">
              <span className="text-2xl flex-shrink-0">➡️</span>
              <div>
                <p className="font-semibold text-indigo-900">Forward Pass Visualization:</p>
                <p className="text-indigo-800 text-sm mt-1">
                  Step-by-step forward pass through hidden and output layers.
                </p>
              </div>
          </div>
        ),
      });
      break;
    case 'multilayer-3':
      steps.push({
        title: 'Backpropagation Visualization',
        content: (
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg flex gap-3">
              <span className="text-2xl flex-shrink-0">↩️</span>
              <div>
                <p className="font-semibold text-purple-900">Backpropagation:</p>
                <p className="text-purple-800 text-sm mt-1">
                  Visualize error propagation backwards through network layers.
                </p>
              </div>
          </div>
        ),
      });
      break;
    case 'multilayer-4':
      steps.push({
        title: 'Understanding Learning Rates',
        content: (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg flex gap-3">
              <span className="text-2xl flex-shrink-0">📉</span>
              <div>
                <p className="font-semibold text-yellow-900">Learning Rates:</p>
                <p className="text-yellow-800 text-sm mt-1">
                  Explore how different learning rates affect gradient descent convergence.
                </p>
              </div>
          </div>
        ),
      });
      break;
    case 'multilayer-5':
      steps.push({
        title: 'Overfitting & Regularization',
        content: (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3">
              <span className="text-2xl flex-shrink-0">🚫</span>
              <div>
                <p className="font-semibold text-red-900">Overfitting & Regularization:</p>
                <p className="text-red-800 text-sm mt-1">
                  See training/validation loss curves with and without regularization.
                </p>
              </div>
          </div>
        ),
      });
      break;
    case 'multilayer-6':
      steps.push({
        title: 'Weight Initialization Strategies',
        content: (
          <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-lg flex gap-3">
              <span className="text-2xl flex-shrink-0">🛠️</span>
              <div>
                <p className="font-semibold text-cyan-900">Weight Initialization:</p>
                <p className="text-cyan-800 text-sm mt-1">
                  Simulate different initialization strategies and their convergence impact.
                </p>
              </div>
          </div>
        ),
      });
      break;
  }

  return steps;
};

const MultilayerLearn: React.FC<MultilayerLearnProps> = ({ onComplete, lessonId }) => {
  const [step, setStep] = useState(0);
  
  const lesson = LESSONS.multilayer.find(l => l.id === lessonId);

  if (!lesson) {
    return <div className="text-center text-red-600 py-8">❌ Lesson not found for ID: {lessonId}</div>;
  }

  const steps = buildLessonSteps(lesson);
  
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
      <h2 className="text-3xl font-bold text-gray-900">{currentStep.title}</h2>

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

export default MultilayerLearn;
