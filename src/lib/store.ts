/**
 * Global State Management (Zustand)
 */

import { create } from 'zustand';
import { ProgressTracker, UserProgress } from './scoring';
import { Perceptron, MLFFN, KohonenMap, HopfieldNetwork } from './nn-math';

export interface GameState {
  // User progress
  progress: UserProgress;
  progressTracker: ProgressTracker;

  // Current topic/level
  currentTopic: 'perceptron' | 'multilayer' | 'kohonen' | 'hopfield' | 'applications' | null;
  currentLevel: number;
  currentChallenge: number;

  // Network state
  perceptron: Perceptron | null;
  mlffn: MLFFN | null;
  kohonen: KohonenMap | null;
  hopfield: HopfieldNetwork | null;

  // Challenge results
  lastResult: {
    success: boolean;
    accuracy: number;
    xpEarned: number;
    timeMs: number;
    feedback: string;
  } | null;

  // Actions
  loadProgress: () => void;
  saveProgress: () => void;
  addXP: (amount: number) => void;
  setCurrentTopic: (topic: GameState['currentTopic']) => void;
  setCurrentLevel: (level: number) => void;
  initializePerceptron: (weights: number[], bias: number) => void;
  recordChallengeResult: (result: GameState['lastResult']) => void;
  reset: () => void;
}

const useGameStore = create<GameState>((set, get) => {
  const progressTracker = new ProgressTracker();
  progressTracker.load(); // Try to load saved progress

  return {
    progress: progressTracker.getProgress(),
    progressTracker,
    currentTopic: null,
    currentLevel: 0,
    currentChallenge: 0,
    perceptron: null,
    mlffn: null,
    kohonen: null,
    hopfield: null,
    lastResult: null,

    loadProgress: () => {
      const tracker = get().progressTracker;
      tracker.load();
      set({ progress: tracker.getProgress() });
    },

    saveProgress: () => {
      const tracker = get().progressTracker;
      tracker.save();
    },

    addXP: (amount: number) => {
      const tracker = get().progressTracker;
      tracker.addXP(amount);
      set({
        progress: tracker.getProgress(),
      });
      tracker.save();
    },

    setCurrentTopic: (topic: GameState['currentTopic']) => {
      set({ currentTopic: topic, currentLevel: 0, currentChallenge: 0 });
    },

    setCurrentLevel: (level: number) => {
      set({ currentLevel: level });
    },

    initializePerceptron: (weights: number[], bias: number) => {
      const perceptron = new Perceptron({
        weights,
        bias,
        learningRate: 0.6,
        activationFn: 'threshold',
      });
      set({ perceptron });
    },

    recordChallengeResult: (result: GameState['lastResult']) => {
      const tracker = get().progressTracker;

      if (result) {
        // Update XP
        tracker.addXP(result.xpEarned);

        // Update streak
        tracker.updateStreak(result.success);

        // Record attempt
        const topic = get().currentTopic || 'perceptron';
        tracker.recordChallengeAttempt(topic, result.success, result.timeMs, result.accuracy);

        // Save
        tracker.save();
      }

      set({
        lastResult: result,
        progress: tracker.getProgress(),
      });
    },

    reset: () => {
      const tracker = new ProgressTracker();
      set({
        progress: tracker.getProgress(),
        progressTracker: tracker,
        currentTopic: null,
        currentLevel: 0,
        currentChallenge: 0,
        perceptron: null,
        mlffn: null,
        kohonen: null,
        hopfield: null,
        lastResult: null,
      });
    },
  };
});

export default useGameStore;
