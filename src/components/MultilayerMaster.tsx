/**
 * MultilayerMaster - Exam-style master challenge for Multilayer Networks
 */

import React, { useState, useEffect } from 'react';

interface MasterChallengeProps {
  onComplete?: (score: number, feedback: string) => void;
}

const MultilayerMaster: React.FC<MasterChallengeProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  const challenge = {
    scenario: '🕸️ CHALLENGE: Train a 2-Layer Network on XOR',
    description:
      'You are training a 2-layer network to solve XOR. The network has 2 inputs, 1 hidden neuron (sigmoid), and 1 output neuron (sigmoid). Learning rate η = 0.5.',
    question:
      'Given weights W1=[0.5, -0.5] (hidden), b1=0.1, W2=[1.0] (output), b2=-0.5:\n' +
      '(A) Perform a forward pass for input [1, 0] (target = 1).\n' +
      '(B) Calculate the output error signal δ_out.\n' +
      '(C) Calculate Δw for the output weight W2[0].',
    parts: [
      { id: 'forward', label: 'Part A: Forward Pass — hidden activation a_h', question: 'net_h = 1×0.5 + 0×(-0.5) + 0.1 = 0.6  →  a_h = sigmoid(0.6) ≈ ?', expectedAnswer: '0.6457', weight: 30, points: 3, tolerance: 0.01 },
      { id: 'output-error', label: 'Part B: Output error δ_out', question: 'a_o = sigmoid(a_h × 1.0 + (-0.5)) ≈ sigmoid(0.146) ≈ 0.5364\nδ_out = (target - a_o) × a_o × (1 - a_o)\nδ_out = (1 - 0.5364) × 0.5364 × (1 - 0.5364) ≈ ?', expectedAnswer: '0.1155', weight: 35, points: 4, tolerance: 0.015 },
      { id: 'weight-update', label: 'Part C: Δw for W2[0]', question: 'Δw = η × δ_out × a_h = 0.5 × 0.1155 × 0.6457 ≈ ?', expectedAnswer: '0.0373', weight: 35, points: 3, tolerance: 0.01 },
    ],
  };

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!timerActive || submitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setTimerActive(false); handleAutoSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, submitted]);

  const handleAutoSubmit = () => { if (!submitted) { setSubmitted(true); doScore(); } };

  const doScore = () => {
    let total = 0;
    challenge.parts.forEach(part => {
      const ans = userAnswers[part.id] || '';
      const parsed = parseFloat(ans);
      const expected = parseFloat(part.expectedAnswer);
      if (!isNaN(parsed) && Math.abs(parsed - expected) <= (part.tolerance ?? 0.01)) {
        total += part.points;
      }
    });
    setScore(total);
    return total;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimerActive(false);
    const s = doScore();
    onComplete?.((s / 10) * 100, `Scored ${s}/10 on Multilayer Master`);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const totalPoints = 10;
  const percentage = Math.round((score / totalPoints) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">⚔️ {challenge.scenario}</h1>
              <p className="text-purple-100">Exam-Style Challenge • 10 minutes</p>
            </div>
            <div className={`text-3xl font-black px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-700 animate-pulse' : 'bg-white bg-opacity-20'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h2 className="font-bold text-lg text-blue-900 mb-2">Scenario</h2>
            <p className="text-blue-800">{challenge.description}</p>
          </div>
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-bold text-lg text-gray-900 mb-3">📝 Question</h2>
            <p className="text-gray-800 text-base whitespace-pre-line">{challenge.question}</p>
          </div>

          <div className="space-y-6">
            {challenge.parts.map(part => (
              <div key={part.id} className={`p-4 rounded-lg border-2 ${submitted ? 'border-gray-300 bg-gray-50' : 'border-purple-300 bg-purple-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{part.label}</h3>
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-bold">{part.points} pts</span>
                </div>
                <p className="text-gray-700 mb-4 font-semibold whitespace-pre-line">{part.question}</p>
                <input type="text" value={userAnswers[part.id] || ''}
                  onChange={e => setUserAnswers(prev => ({ ...prev, [part.id]: e.target.value }))}
                  disabled={submitted}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-200 font-mono text-lg"
                  placeholder="Your answer..." />
                {submitted && (
                  <div className="mt-3 p-3 rounded-lg bg-white">
                    {parseFloat(userAnswers[part.id] || 'x') !== undefined && Math.abs(parseFloat(userAnswers[part.id] || 'x') - parseFloat(part.expectedAnswer)) <= (part.tolerance ?? 0.01) ? (
                      <p className="text-sm font-semibold text-green-700">✅ Correct!</p>
                    ) : (
                      <p className="text-sm font-semibold text-red-700">❌ Expected ≈ {part.expectedAnswer}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <p className="font-bold text-yellow-900 mb-2">📐 Formula Reference</p>
            <p className="text-yellow-800 font-mono text-sm">sigmoid(x) = 1 / (1 + e^(-x))</p>
            <p className="text-yellow-800 font-mono text-sm">δ_out = (target - output) × output × (1 - output)</p>
            <p className="text-yellow-800 font-mono text-sm">Δw = η × δ × input_to_that_weight</p>
          </div>
        </div>

        {submitted && (
          <div className={`mb-6 rounded-lg shadow-lg p-8 ${percentage >= 80 ? 'bg-gradient-to-r from-green-600 to-emerald-600' : percentage >= 60 ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-orange-600 to-red-600'}`}>
            <div className="text-center text-white">
              <p className="text-lg font-semibold mb-2">Your Score</p>
              <h2 className="text-6xl font-black mb-4">{score}/{totalPoints}</h2>
              <p className="text-2xl font-bold">{percentage}%</p>
              <p className="text-sm mt-2 opacity-90">
                {percentage >= 80 ? '🎉 Outstanding! Ready for the exam!' : percentage >= 60 ? '👍 Good effort! Review and retry.' : '📚 Keep practising!'}
              </p>
              <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                <p className="text-sm">{Math.round(percentage * 2)} XP earned</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {!submitted ? (
            <button onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg text-lg">
              Submit Challenge
            </button>
          ) : (
            <>
              <button onClick={() => { setSubmitted(false); setUserAnswers({}); setScore(0); setTimeLeft(600); setTimerActive(true); }}
                className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition shadow-lg text-lg">
                Try Again
              </button>
              <button onClick={() => setShowSolution(!showSolution)}
                className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition shadow-lg text-lg">
                {showSolution ? 'Hide' : 'Show'} Solution
              </button>
            </>
          )}
        </div>

        {showSolution && submitted && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4">📖 Model Solution</h3>
            <div className="space-y-4 text-gray-800 font-mono text-sm">
              <div><p className="font-sans font-semibold text-green-800">Part A: Forward Pass</p><p>net_h = 1×0.5 + 0×(-0.5) + 0.1 = 0.6</p><p>a_h = sigmoid(0.6) ≈ 0.6457</p><p>net_o = 0.6457×1.0 + (-0.5) = 0.1457</p><p>a_o = sigmoid(0.1457) ≈ 0.5364</p></div>
              <div><p className="font-sans font-semibold text-green-800">Part B: Output Error</p><p>δ_out = (1 - 0.5364) × 0.5364 × (1 - 0.5364) ≈ 0.1155</p></div>
              <div><p className="font-sans font-semibold text-green-800">Part C: Weight Update</p><p>Δw = 0.5 × 0.1155 × 0.6457 ≈ 0.0373</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultilayerMaster;
