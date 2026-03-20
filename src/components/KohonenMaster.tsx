/**
 * KohonenMaster - Exam-style master challenge for Kohonen Networks
 */

import React, { useState, useEffect } from 'react';

interface MasterChallengeProps {
  onComplete?: (score: number, feedback: string) => void;
}

const KohonenMaster: React.FC<MasterChallengeProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  const challenge = {
    scenario: '🗺️ CHALLENGE: SOM Training Step',
    description:
      'You are training a Kohonen SOM with 3 neurons. The SOM uses Euclidean distance to find the BMU. Learning rate η = 0.4.',
    question:
      'Neuron weights:\n  N1: [0.2, 0.8]\n  N2: [0.9, 0.1]\n  N3: [0.5, 0.5]\n\nInput vector: x = [0.8, 0.2]\n\n' +
      '(A) Calculate Euclidean distance from x to each neuron.\n' +
      '(B) Identify the BMU.\n' +
      '(C) Calculate the new weight W_BMU[0] after one update step.',
    parts: [
      {
        id: 'dist-n2',
        label: 'Part A: Distance from x=[0.8,0.2] to N2=[0.9,0.1]',
        question: 'd(x, N2) = √((0.8-0.9)² + (0.2-0.1)²) = √(0.01 + 0.01) = √0.02 ≈ ?',
        expectedAnswer: '0.1414',
        points: 3,
        tolerance: 0.005,
      },
      {
        id: 'bmu',
        label: 'Part B: Which neuron is the BMU?',
        question: 'd(x,N1) ≈ 0.849, d(x,N2) ≈ 0.141, d(x,N3) ≈ 0.424.\nEnter the BMU number (1, 2, or 3):',
        expectedAnswer: '2',
        points: 3,
        tolerance: 0,
      },
      {
        id: 'weight-update',
        label: 'Part C: New weight W_BMU[0] after update',
        question: 'BMU = N2, W_N2[0] = 0.9, x[0] = 0.8, η = 0.4\n\nW_new[0] = W_old[0] + η × (x[0] - W_old[0])\n         = 0.9 + 0.4 × (0.8 - 0.9) = ?',
        expectedAnswer: '0.86',
        points: 4,
        tolerance: 0.01,
      },
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
      const ans = (userAnswers[part.id] || '').trim();
      const expected = part.expectedAnswer;
      const tol = part.tolerance ?? 0.01;
      if (tol === 0) {
        if (ans === expected) total += part.points;
      } else {
        const parsed = parseFloat(ans);
        if (!isNaN(parsed) && Math.abs(parsed - parseFloat(expected)) <= tol) total += part.points;
      }
    });
    setScore(total);
    return total;
  };

  const handleSubmit = () => {
    setSubmitted(true); setTimerActive(false);
    const s = doScore();
    onComplete?.((s / 10) * 100, `Scored ${s}/10 on Kohonen Master`);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const totalPoints = 10;
  const percentage = Math.round((score / totalPoints) * 100);

  const isCorrect = (part: typeof challenge.parts[0]) => {
    const ans = (userAnswers[part.id] || '').trim();
    const tol = part.tolerance ?? 0.01;
    if (tol === 0) return ans === part.expectedAnswer;
    const parsed = parseFloat(ans);
    return !isNaN(parsed) && Math.abs(parsed - parseFloat(part.expectedAnswer)) <= tol;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">⚔️ {challenge.scenario}</h1>
              <p className="text-teal-100">Exam-Style Challenge • 10 minutes</p>
            </div>
            <div className={`text-3xl font-black px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-700 animate-pulse' : 'bg-white bg-opacity-20'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="mb-6 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
            <h2 className="font-bold text-lg text-teal-900 mb-2">Scenario</h2>
            <p className="text-teal-800">{challenge.description}</p>
          </div>
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-bold text-lg text-gray-900 mb-3">📝 Question</h2>
            <p className="text-gray-800 text-base whitespace-pre-line font-mono text-sm">{challenge.question}</p>
          </div>

          <div className="space-y-6">
            {challenge.parts.map(part => (
              <div key={part.id} className={`p-4 rounded-lg border-2 ${submitted ? 'border-gray-300 bg-gray-50' : 'border-teal-300 bg-teal-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{part.label}</h3>
                  <span className="bg-teal-600 text-white px-2 py-1 rounded text-sm font-bold">{part.points} pts</span>
                </div>
                <p className="text-gray-700 mb-4 font-semibold whitespace-pre-line">{part.question}</p>
                <input type="text" value={userAnswers[part.id] || ''}
                  onChange={e => setUserAnswers(prev => ({ ...prev, [part.id]: e.target.value }))}
                  disabled={submitted}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none disabled:bg-gray-200 font-mono text-lg"
                  placeholder="Your answer..." />
                {submitted && (
                  <div className="mt-3 p-3 rounded-lg bg-white">
                    {isCorrect(part)
                      ? <p className="text-sm font-semibold text-green-700">✅ Correct!</p>
                      : <p className="text-sm font-semibold text-red-700">❌ Expected: {part.expectedAnswer}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <p className="font-bold text-yellow-900 mb-2">📐 Formula Reference</p>
            <p className="text-yellow-800 font-mono text-sm">Euclidean: d = √(Σ(xi - yi)²)</p>
            <p className="text-yellow-800 font-mono text-sm">Kohonen update: W_new = W_old + η × (x - W_old)</p>
            <p className="text-yellow-800 font-mono text-sm">BMU = neuron with minimum distance</p>
          </div>
        </div>

        {submitted && (
          <div className={`mb-6 rounded-lg shadow-lg p-8 ${percentage >= 80 ? 'bg-gradient-to-r from-green-600 to-emerald-600' : percentage >= 60 ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-orange-600 to-red-600'}`}>
            <div className="text-center text-white">
              <p className="text-lg font-semibold mb-2">Your Score</p>
              <h2 className="text-6xl font-black mb-4">{score}/{totalPoints}</h2>
              <p className="text-2xl font-bold">{percentage}%</p>
              <p className="text-sm mt-2 opacity-90">
                {percentage >= 80 ? '🎉 Map Architect unlocked!' : percentage >= 60 ? '👍 Good effort!' : '📚 Keep practising!'}
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
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition shadow-lg text-lg">
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
              <div><p className="font-sans font-semibold text-green-800">Part A: Distances</p>
                <p>d(x, N1) = √((0.8-0.2)²+(0.2-0.8)²) = √(0.36+0.36) ≈ 0.849</p>
                <p>d(x, N2) = √((0.8-0.9)²+(0.2-0.1)²) = √(0.01+0.01) ≈ <strong>0.141</strong></p>
                <p>d(x, N3) = √((0.8-0.5)²+(0.2-0.5)²) = √(0.09+0.09) ≈ 0.424</p>
              </div>
              <div><p className="font-sans font-semibold text-green-800">Part B: BMU</p><p>N2 has smallest distance → <strong>BMU = N2</strong></p></div>
              <div><p className="font-sans font-semibold text-green-800">Part C: Weight Update</p>
                <p>W_new[0] = 0.9 + 0.4 × (0.8 - 0.9) = 0.9 - 0.04 = <strong>0.86</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KohonenMaster;
