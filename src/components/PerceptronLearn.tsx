/**
 * PerceptronLearn - Interactive explanation of what a perceptron is
 * With animated neuron, formula breakdown, and interactive demo
 */

import React, { useState, useEffect } from 'react';

interface PerceptronLearnProps {
  onComplete?: () => void;
}

const PerceptronLearn: React.FC<PerceptronLearnProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [neuronAnimationActive, setNeuronAnimationActive] = useState(false);
  const [demoWeight1, setDemoWeight1] = useState(0.5);
  const [demoWeight2, setDemoWeight2] = useState(0.8);
  const [demoInput1, setDemoInput1] = useState(1);
  const [demoInput2, setDemoInput2] = useState(0);
  const [demoBias, setDemoBias] = useState(-0.3);

  // Calculate demo values
  const demoNet =
    demoInput1 * demoWeight1 + demoInput2 * demoWeight2 + demoBias;
  const demoOutput = demoNet >= 0 ? 1 : 0;

  // Animation trigger
  useEffect(() => {
    setNeuronAnimationActive(true);
    const timer = setTimeout(() => setNeuronAnimationActive(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      title: '🧠 Meet the Perceptron',
      content: (
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            A perceptron is the simplest artificial neuron. It's inspired by how biological neurons work.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900">Key Idea:</p>
            <p className="text-blue-800">
              Inputs come in → get weighted → sum together → activate → output!
            </p>
          </div>
          <p className="text-gray-700">
            Think of it like a decision maker that weighs different pieces of evidence before deciding.
          </p>
        </div>
      ),
    },
    {
      title: '📊 The Perceptron Structure',
      content: (
        <div className="space-y-6">
          {/* Neuron diagram */}
          <div className="flex justify-center mb-8">
            <svg width="400" height="300" viewBox="0 0 400 300" className="max-w-full">
              {/* Inputs */}
              <circle cx="50" cy="80" r="8" fill="#3b82f6" />
              <text x="50" y="110" textAnchor="middle" fill="#1f2937" fontSize="14" fontWeight="bold">
                Input 1
              </text>
              <circle cx="50" cy="170" r="8" fill="#3b82f6" />
              <text x="50" y="200" textAnchor="middle" fill="#1f2937" fontSize="14" fontWeight="bold">
                Input 2
              </text>
              <circle cx="50" cy="260" r="8" fill="#10b981" />
              <text x="50" y="285" textAnchor="middle" fill="#1f2937" fontSize="14" fontWeight="bold">
                Bias
              </text>

              {/* Weights on connections */}
              <line x1="58" y1="80" x2="160" y2="120" stroke="#8b5cf6" strokeWidth="3" />
              <text x="100" y="95" fill="#8b5cf6" fontSize="12" fontWeight="bold">
                w₁
              </text>
              <line x1="58" y1="170" x2="160" y2="140" stroke="#8b5cf6" strokeWidth="3" />
              <text x="100" y="160" fill="#8b5cf6" fontSize="12" fontWeight="bold">
                w₂
              </text>
              <line x1="58" y1="260" x2="160" y2="150" stroke="#10b981" strokeWidth="3" />
              <text x="100" y="215" fill="#10b981" fontSize="12" fontWeight="bold">
                bias
              </text>

              {/* Summation node */}
              <circle cx="180" cy="130" r="30" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
              <text x="180" y="140" textAnchor="middle" fill="#1f2937" fontSize="20" fontWeight="bold">
                Σ
              </text>

              {/* Activation function */}
              <rect x="260" y="100" width="60" height="60" fill="#ec4899" rx="8" />
              <text x="290" y="115" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                Threshold
              </text>
              <text x="290" y="130" textAnchor="middle" fill="white" fontSize="10">
                f()
              </text>
              <text x="290" y="150" textAnchor="middle" fill="white" fontSize="9">
                ≥0 → 1
              </text>

              {/* Output */}
              <circle cx="350" cy="130" r="12" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
              <text x="350" y="140" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                y
              </text>

              {/* Arrows */}
              <path d="M 220 130 L 260 130" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <path d="M 320 130 L 338 130" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />

              {/* Arrow marker */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#666" />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900">Inputs (x)</p>
              <p className="text-xs text-blue-700 mt-1">Data comes from the world</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm font-semibold text-purple-900">Weights (w)</p>
              <p className="text-xs text-purple-700 mt-1">How much we care about each input</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <p className="text-sm font-semibold text-pink-900">Output (y)</p>
              <p className="text-xs text-pink-700 mt-1">The decision: 1 (yes) or 0 (no)</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '🧮 The Math',
      content: (
        <div className="space-y-6">
          <div>
            <p className="font-semibold text-gray-900 mb-3">Step 1: Calculate Net Value</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <p>net = (input₁ × weight₁) + (input₂ × weight₂) + bias</p>
              <p className="text-gray-500 mt-2">or in short:</p>
              <p>net = Σ(input_i × weight_i) + bias</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-3">Step 2: Apply Activation Function</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <p>if net ≥ 0:</p>
              <p className="ml-4">output = 1 (fire!)</p>
              <p>else:</p>
              <p className="ml-4">output = 0 (silent)</p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900">💡 Insight:</p>
            <p className="text-amber-800 text-sm mt-1">
              The weights determine HOW MUCH each input influences the decision. Large weight = big influence.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '🎮 Try It Yourself!',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Input 1: {demoInput1}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="1"
                  value={demoInput1}
                  onChange={(e) => setDemoInput1(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Input 2: {demoInput2}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="1"
                  value={demoInput2}
                  onChange={(e) => setDemoInput2(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight 1: {demoWeight1.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={demoWeight1}
                  onChange={(e) => setDemoWeight1(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight 2: {demoWeight2.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={demoWeight2}
                  onChange={(e) => setDemoWeight2(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bias: {demoBias.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={demoBias}
                  onChange={(e) => setDemoBias(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Output */}
            <div className="space-y-4 flex flex-col justify-center">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-gray-600">Calculation:</p>
                <div className="mt-2 bg-white p-3 rounded font-mono text-sm text-gray-700">
                  <p>({demoInput1} × {demoWeight1.toFixed(2)}) + ({demoInput2} × {demoWeight2.toFixed(2)}) + {demoBias.toFixed(2)}</p>
                  <p className="text-blue-600 font-bold mt-2">= {demoNet.toFixed(3)}</p>
                </div>
              </div>

              <div
                className={`p-6 rounded-lg border-4 text-center transition-all ${
                  demoOutput === 1
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                }`}
              >
                <p className="text-sm text-gray-700 mb-2">Output:</p>
                <p className={`text-5xl font-bold ${demoOutput === 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {demoOutput}
                </p>
                <p className="text-sm mt-2 font-semibold">
                  {demoOutput === 1 ? '✅ Neuron fires!' : '❌ Neuron stays silent'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900">🎯 Try this:</p>
            <p className="text-green-800 text-sm mt-1">
              Change the weights and see how the output changes. What happens when you make a weight negative?
            </p>
          </div>
        </div>
      ),
    },
  ];

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
                  ? 'bg-blue-600 text-white scale-110'
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

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-lg"
        >
          ← Previous
        </button>

        <div className="text-sm text-gray-600">
          {step + 1} / {steps.length}
        </div>

        <button
          onClick={() => (step === steps.length - 1 ? onComplete?.() : setStep(step + 1))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          {step === steps.length - 1 ? '✓ Complete!' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default PerceptronLearn;
