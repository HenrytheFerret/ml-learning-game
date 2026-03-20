/**
 * Perceptron Master Challenge - Exam-style questions with narrative framing
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Perceptron } from '../lib/nn-math';
import { SCORING } from '../lib/scoring';

interface MasterChallengeProps {
  onComplete?: (score: number, feedback: string) => void;
}

const PerceptronMaster: React.FC<MasterChallengeProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  // Challenge data: Real exam question
  const challenge = {
    scenario: "🔐 SECURITY CHALLENGE: Email Spam Detection",
    description:
      "You're building a spam detector for an email system. A perceptron has been trained with weights [0.8, 1.2] and bias -0.5. The activation function is threshold (output = 1 if net ≥ 0, else 0).",
    question:
      "A new email arrives with features: [1, 1] (1 = contains money keywords, 1 = suspicious links). Calculate the net value and predict if it's spam (1) or safe (0).",
    parts: [
      {
        id: 'net-value',
        label: 'Part A: Calculate Net Value',
        question: 'net = (1 × 0.8) + (1 × 1.2) + (-0.5) = ?',
        expectedAnswer: '2.0',
        weight: 40,
        points: 4,
      },
      {
        id: 'prediction',
        label: 'Part B: Predict Output',
        question: 'Is the email spam? (net = 2.0, threshold at 0)',
        expectedAnswer: '1',
        weight: 30,
        points: 3,
      },
      {
        id: 'reasoning',
        label: 'Part C: Explain Your Reasoning',
        question: 'Why did the perceptron classify it this way?',
        expectedAnswer: '',
        weight: 30,
        points: 3,
        isText: true,
      },
    ],
  };

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});

  // Timer countdown
  useEffect(() => {
    if (!timerActive || submitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, submitted]);

  const handleAutoSubmit = () => {
    if (!submitted) {
      setSubmitted(true);
      calculateScore();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let totalScore = 0;

    challenge.parts.forEach((part) => {
      const userAnswer = userAnswers[part.id] || '';

      if (part.isText) {
        // Text answers graded more leniently
        if (userAnswer.length > 20) {
          totalScore += Math.round(part.points * 0.7);
        }
      } else {
        // Numeric/exact answers
        if (userAnswer.trim() === part.expectedAnswer) {
          totalScore += part.points;
        } else if (parseFloat(userAnswer) && Math.abs(parseFloat(userAnswer) - parseFloat(part.expectedAnswer)) < 0.1) {
          // Partial credit for very close answers
          totalScore += Math.round(part.points * 0.5);
        }
      }
    });

    setScore(totalScore);
    return totalScore;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimerActive(false);
    calculateScore();
    if (onComplete) {
      const percentage = (score / 10) * 100;
      onComplete(percentage, `Scored ${score}/10 on Master Challenge`);
    }
  };

  const handleAnswerChange = (partId: string, value: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [partId]: value,
    }));
  };

  const totalScore = 10;
  const percentage = Math.round((score / totalScore) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">⚔️ {challenge.scenario}</h1>
              <p className="text-red-100">Exam-Style Challenge • 10 minutes</p>
            </div>
            <div className={`text-3xl font-black px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-700 animate-pulse' : 'bg-white bg-opacity-20'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h2 className="font-bold text-lg text-blue-900 mb-2">Scenario</h2>
            <p className="text-blue-800">{challenge.description}</p>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-bold text-lg text-gray-900 mb-3">📝 Question</h2>
            <p className="text-gray-800 text-lg">{challenge.question}</p>
          </div>

          {/* Answer Sections */}
          <div className="space-y-6">
            {challenge.parts.map((part, idx) => (
              <div
                key={part.id}
                className={`p-4 rounded-lg border-2 ${
                  submitted ? 'border-gray-300 bg-gray-50' : 'border-purple-300 bg-purple-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{part.label}</h3>
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-bold">
                    {part.points} pts
                  </span>
                </div>

                <p className="text-gray-700 mb-4 font-semibold">{part.question}</p>

                {part.isText ? (
                  <textarea
                    value={userAnswers[part.id] || ''}
                    onChange={(e) => handleAnswerChange(part.id, e.target.value)}
                    disabled={submitted}
                    rows={3}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-200"
                    placeholder="Type your explanation here..."
                  />
                ) : (
                  <input
                    type="text"
                    value={userAnswers[part.id] || ''}
                    onChange={(e) => handleAnswerChange(part.id, e.target.value)}
                    disabled={submitted}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-200 font-mono text-lg"
                    placeholder="Your answer..."
                  />
                )}

                {submitted && (
                  <div className="mt-3 p-3 rounded-lg bg-white">
                    {part.isText ? (
                      <p className="text-sm text-gray-600">
                        <strong>Length:</strong> {(userAnswers[part.id] || '').length} characters
                      </p>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold">
                          {userAnswers[part.id] === part.expectedAnswer ? (
                            <span className="text-green-700">✅ Correct!</span>
                          ) : (
                            <span className="text-red-700">❌ Expected: {part.expectedAnswer}</span>
                          )}
                        </p>
                        {userAnswers[part.id] && userAnswers[part.id] !== part.expectedAnswer && (
                          <p className="text-sm text-gray-600 mt-1">You answered: {userAnswers[part.id]}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reference Info */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <p className="font-bold text-yellow-900 mb-2">📐 Formula Reference</p>
            <p className="text-yellow-800 font-mono text-sm">net = Σ(input × weight) + bias</p>
            <p className="text-yellow-800 text-sm mt-2">
              Threshold activation: output = 1 if net ≥ 0, else 0
            </p>
          </div>
        </div>

        {/* Score Display (after submission) */}
        {submitted && (
          <div
            className={`mb-6 rounded-lg shadow-lg p-8 ${
              percentage >= 80
                ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                : percentage >= 60
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  : 'bg-gradient-to-r from-orange-600 to-red-600'
            }`}
          >
            <div className="text-center text-white">
              <p className="text-lg font-semibold mb-2">Your Score</p>
              <h2 className="text-6xl font-black mb-4">
                {score}/{totalScore}
              </h2>
              <p className="text-2xl font-bold">{percentage}%</p>
              <p className="text-sm mt-2 opacity-90">
                {percentage >= 80
                  ? '🎉 Outstanding! Ready for the exam!'
                  : percentage >= 60
                    ? '👍 Good effort! Review and try again.'
                    : '📚 Keep practicing! You\'ll get it!'}
              </p>

              {/* XP Display */}
              <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                <p className="text-sm">
                  {Math.round(percentage * 2)} XP earned
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg text-lg"
            >
              Submit Challenge
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setUserAnswers({});
                  setScore(0);
                  setTimeLeft(600);
                  setTimerActive(true);
                }}
                className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition shadow-lg text-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition shadow-lg text-lg"
              >
                {showSolution ? 'Hide' : 'Show'} Solution
              </button>
            </>
          )}
        </div>

        {/* Solution (Optional) */}
        {showSolution && submitted && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4">📖 Model Solution</h3>
            <div className="space-y-4 text-gray-800">
              <div>
                <p className="font-semibold text-green-800">Part A: Net Value Calculation</p>
                <p className="font-mono text-sm mt-1">
                  net = (input₁ × w₁) + (input₂ × w₂) + bias
                  <br />
                  net = (1 × 0.8) + (1 × 1.2) + (-0.5)
                  <br />
                  net = 0.8 + 1.2 - 0.5 = <strong>2.0</strong>
                </p>
              </div>

              <div>
                <p className="font-semibold text-green-800">Part B: Prediction</p>
                <p className="text-sm mt-1">
                  Since net (2.0) ≥ threshold (0), the output is <strong>1</strong> (SPAM)
                </p>
              </div>

              <div>
                <p className="font-semibold text-green-800">Part C: Reasoning</p>
                <p className="text-sm mt-1">
                  The email contains both money keywords and suspicious links. Both weights are
                  positive and significant. Their combined contribution (2.0) exceeds the bias
                  (-0.5), pushing the net value into the positive territory, which triggers the
                  threshold activation to classify the email as spam.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerceptronMaster;
