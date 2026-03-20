/**
 * HopfieldMaster - Exam-style master challenge for Hopfield Networks
 */

import React, { useState, useEffect } from 'react';

interface MasterChallengeProps {
  onComplete?: (score: number, feedback: string) => void;
}

const HopfieldMaster: React.FC<MasterChallengeProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  const challenge = {
    scenario: '💾 CHALLENGE: Hopfield Pattern Storage & Recall',
    description:
      'A 3-neuron Hopfield network stores one pattern using Hebbian learning.',
    question:
      'Pattern to store: P = [1, 0, 1]   (using values 1 and 0)\n\n' +
      '(A) Calculate weight w_13 using the Hebbian rule.\n' +
      '(B) Calculate the net input to neuron 1 given state S = [1, 1, 1].\n      Use weights: w_12=0, w_13=1, w_21=0, w_23=0, w_31=1, w_32=0.\n' +
      '(C) Calculate the energy E of state [1, 0, 1] (no biases).\n      Full weight matrix: w_12=0, w_13=1, w_21=0, w_23=0, w_31=1, w_32=0.',
    parts: [
      {
        id: 'w13',
        label: 'Part A: Hebbian weight w_13',
        question: 'P = [1, 0, 1].  w_ij = p_i × p_j  (i ≠ j)\nw_13 = p_1 × p_3 = 1 × 1 = ?',
        expectedAnswer: '1',
        points: 3,
        tolerance: 0,
      },
      {
        id: 'net1',
        label: 'Part B: Net input to neuron 1 for state [1,1,1]',
        question: 'net_1 = w_12×s_2 + w_13×s_3\n       = 0×1 + 1×1 = ?',
        expectedAnswer: '1',
        points: 3,
        tolerance: 0,
      },
      {
        id: 'energy',
        label: 'Part C: Energy E of state [1,0,1]',
        question: 'E = -0.5 × Σ(w_ij × s_i × s_j)  (sum all pairs i≠j)\nActive pairs (s_i=1 and s_j=1): only (1,3) and (3,1)\n\nE = -0.5 × (w_13×s_1×s_3 + w_31×s_3×s_1)\n  = -0.5 × (1×1×1 + 1×1×1)\n  = ?',
        expectedAnswer: '-1',
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
      const tol = part.tolerance ?? 0.01;
      if (tol === 0) {
        if (ans === part.expectedAnswer) total += part.points;
      } else {
        const parsed = parseFloat(ans);
        if (!isNaN(parsed) && Math.abs(parsed - parseFloat(part.expectedAnswer)) <= tol) total += part.points;
      }
    });
    setScore(total);
    return total;
  };

  const handleSubmit = () => {
    setSubmitted(true); setTimerActive(false);
    const s = doScore();
    onComplete?.((s / 10) * 100, `Scored ${s}/10 on Hopfield Master`);
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
    <div className="min-h-screen bg-gradient-to-br from-violet-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">⚔️ {challenge.scenario}</h1>
              <p className="text-violet-100">Exam-Style Challenge • 10 minutes</p>
            </div>
            <div className={`text-3xl font-black px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-700 animate-pulse' : 'bg-white bg-opacity-20'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="mb-6 p-4 bg-violet-50 rounded-lg border-l-4 border-violet-500">
            <h2 className="font-bold text-lg text-violet-900 mb-2">Scenario</h2>
            <p className="text-violet-800">{challenge.description}</p>
          </div>
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-bold text-lg text-gray-900 mb-3">📝 Question</h2>
            <p className="text-gray-800 text-base whitespace-pre-line font-mono text-sm">{challenge.question}</p>
          </div>

          <div className="space-y-6">
            {challenge.parts.map(part => (
              <div key={part.id} className={`p-4 rounded-lg border-2 ${submitted ? 'border-gray-300 bg-gray-50' : 'border-violet-300 bg-violet-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{part.label}</h3>
                  <span className="bg-violet-600 text-white px-2 py-1 rounded text-sm font-bold">{part.points} pts</span>
                </div>
                <p className="text-gray-700 mb-4 font-semibold whitespace-pre-line">{part.question}</p>
                <input type="text" value={userAnswers[part.id] || ''}
                  onChange={e => setUserAnswers(prev => ({ ...prev, [part.id]: e.target.value }))}
                  disabled={submitted}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none disabled:bg-gray-200 font-mono text-lg"
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
            <p className="text-yellow-800 font-mono text-sm">Hebbian: w_ij = p_i × p_j  (i ≠ j), w_ii = 0</p>
            <p className="text-yellow-800 font-mono text-sm">Net input: net_i = Σ(w_ij × s_j)</p>
            <p className="text-yellow-800 font-mono text-sm">Energy: E = -0.5 × Σ_ij (w_ij × s_i × s_j)</p>
            <p className="text-yellow-800 font-mono text-sm">Update: s_i = 1 if net_i ≥ 0, else 0</p>
          </div>
        </div>

        {submitted && (
          <div className={`mb-6 rounded-lg shadow-lg p-8 ${percentage >= 80 ? 'bg-gradient-to-r from-green-600 to-emerald-600' : percentage >= 60 ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-orange-600 to-red-600'}`}>
            <div className="text-center text-white">
              <p className="text-lg font-semibold mb-2">Your Score</p>
              <h2 className="text-6xl font-black mb-4">{score}/{totalPoints}</h2>
              <p className="text-2xl font-bold">{percentage}%</p>
              <p className="text-sm mt-2 opacity-90">
                {percentage >= 80 ? '🎉 Memory Palace Master unlocked!' : percentage >= 60 ? '👍 Good work!' : '📚 Keep practising!'}
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
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-lg hover:from-violet-700 hover:to-purple-700 transition shadow-lg text-lg">
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
              <div><p className="font-sans font-semibold text-green-800">Part A: w_13</p><p>w_13 = p_1 × p_3 = 1 × 1 = <strong>1</strong></p></div>
              <div><p className="font-sans font-semibold text-green-800">Part B: net_1 for state [1,1,1]</p><p>net_1 = w_12×1 + w_13×1 = 0×1 + 1×1 = <strong>1</strong></p></div>
              <div><p className="font-sans font-semibold text-green-800">Part C: Energy of [1,0,1]</p>
                <p>Only active pairs: (i=1,j=3) and (i=3,j=1), both with s=1</p>
                <p>E = -0.5 × (1×1×1 + 1×1×1) = -0.5 × 2 = <strong>-1</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HopfieldMaster;
