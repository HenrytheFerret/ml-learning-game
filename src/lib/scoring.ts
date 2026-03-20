/**
 * Scoring & Gamification System
 */

export interface UserProgress {
  totalXP: number;
  level: number;
  streaks: {
    current: number;
    longest: number;
  };
  topicScores: {
    [topicName: string]: {
      completed: number;
      accuracy: number;
      bestTime: number;
    };
  };
  badges: string[];
}

export const SCORING = {
  // Base XP rewards
  CORRECT_DIAGRAM: 50,
  CORRECT_TRUTH_TABLE_ROW: 25,
  CORRECT_TRAINING_EPOCH: 50,
  EXAM_CHALLENGE_PERFECT: 200,
  CONCEPT_EXPLANATION: 75,
  SPEED_BONUS: 5,
  PERFECT_STREAK_5: 100,
  PERFECT_STREAK_10: 200,

  // Accuracy thresholds for unlocking
  UNLOCK_NEXT_LEVEL: 0.7, // 70% correct
  UNLOCK_MASTER_MODE: 0.8, // 80% correct
};

export const LEVELS = {
  0: { name: 'Novice', minXP: 0, maxXP: 100 },
  1: { name: 'Apprentice', minXP: 100, maxXP: 300 },
  2: { name: 'Practitioner', minXP: 300, maxXP: 700 },
  3: { name: 'Expert', minXP: 700, maxXP: 1500 },
  4: { name: 'Master Ferret 🦦', minXP: 1500, maxXP: Infinity },
};

export const BADGES = {
  CIRCUIT_DESIGNER: { name: 'Circuit Designer', emoji: '🎯', topic: 'perceptron' },
  CALCULATION_MASTER: { name: 'Calculation Master', emoji: '✅', topic: 'perceptron' },
  NETWORK_TRAINER: { name: 'Network Trainer', emoji: '🏋️', topic: 'perceptron' },
  TRAINING_ANALYST: { name: 'Training Analyst', emoji: '📊', topic: 'perceptron' },
  EXAM_WARRIOR: { name: 'Exam Warrior', emoji: '⚔️', topic: 'perceptron' },

  ARCHITECT: { name: 'Architect', emoji: '🧠', topic: 'multilayer' },
  FORWARD_PASS_SPEEDSTER: { name: 'Forward Pass Speedster', emoji: '🔀', topic: 'multilayer' },
  BACKPROP_WIZARD: { name: 'Backprop Wizard', emoji: '🚀', topic: 'multilayer' },
  ERROR_DETECTIVE: { name: 'Error Detective', emoji: '📈', topic: 'multilayer' },

  MAP_ARCHITECT: { name: 'Map Architect', emoji: '🗺️', topic: 'kohonen' },
  CLUSTERING_EXPERT: { name: 'Clustering Expert', emoji: '📍', topic: 'kohonen' },

  MEMORY_PALACE_MASTER: { name: 'Memory Palace Master', emoji: '💾', topic: 'hopfield' },
  ENERGY_MINIMIZER: { name: 'Energy Minimizer', emoji: '🧩', topic: 'hopfield' },

  ML_EXAM_READY: { name: 'ML Exam Ready', emoji: '🦦', topic: 'grand' },
  CONCEPT_MASTER: { name: 'Concept Master', emoji: '📚', topic: 'grand' },
  FERRETES_KNOWLEDGE: { name: "Ferret's Knowledge", emoji: '⭐', topic: 'grand' },
};

export class ScoreCalculator {
  static calculateLevel(xp: number): number {
    for (let level = 4; level >= 0; level--) {
      if (xp >= LEVELS[level as keyof typeof LEVELS].minXP) {
        return level;
      }
    }
    return 0;
  }

  static calculateXPForLevel(level: number): number {
    return LEVELS[level as keyof typeof LEVELS].minXP;
  }

  static calculateProgressToNextLevel(xp: number): number {
    const currentLevel = this.calculateLevel(xp);
    const currentMinXP = LEVELS[currentLevel as keyof typeof LEVELS].minXP;
    const nextMinXP = LEVELS[(currentLevel + 1) as keyof typeof LEVELS].minXP;

    if (nextMinXP === Infinity) return 100; // Already at max

    const progress = ((xp - currentMinXP) / (nextMinXP - currentMinXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  static awardXP(
    baseXP: number,
    options?: {
      speedBonus?: boolean;
      perfectStreak?: number;
    }
  ): number {
    let total = baseXP;

    if (options?.speedBonus) {
      total += SCORING.SPEED_BONUS;
    }

    if (options?.perfectStreak) {
      if (options.perfectStreak >= 10) {
        total += SCORING.PERFECT_STREAK_10;
      } else if (options.perfectStreak >= 5) {
        total += SCORING.PERFECT_STREAK_5;
      }
    }

    return total;
  }

  static shouldAwardBadge(
    badgeName: keyof typeof BADGES,
    stats: {
      completedChallenges?: number;
      perfectAttempts?: number;
      totalAttempts?: number;
      fastestTime?: number;
    }
  ): boolean {
    switch (badgeName) {
      case 'CIRCUIT_DESIGNER':
        return stats.completedChallenges ? stats.completedChallenges >= 1 : false;
      case 'CALCULATION_MASTER':
        return stats.perfectAttempts ? stats.perfectAttempts >= 1 && stats.perfectAttempts === stats.totalAttempts : false;
      case 'NETWORK_TRAINER':
        return stats.completedChallenges ? stats.completedChallenges >= 1 : false;
      case 'EXAM_WARRIOR':
        return stats.perfectAttempts ? stats.perfectAttempts >= 1 : false;
      case 'FORWARD_PASS_SPEEDSTER':
        return stats.fastestTime ? stats.fastestTime < 60000 : false; // Under 1 minute
      case 'ERROR_DETECTIVE':
        return stats.perfectAttempts ? stats.perfectAttempts >= 5 : false;
      case 'ML_EXAM_READY':
        return stats.totalAttempts ? stats.totalAttempts >= 50 : false; // Rough estimate
      default:
        return false;
    }
  }
}

export class ProgressTracker {
  private progress: UserProgress = {
    totalXP: 0,
    level: 0,
    streaks: { current: 0, longest: 0 },
    topicScores: {},
    badges: [],
  };

  getProgress(): UserProgress {
    return this.progress;
  }

  addXP(amount: number): void {
    this.progress.totalXP += amount;
    this.progress.level = ScoreCalculator.calculateLevel(this.progress.totalXP);
  }

  updateStreak(success: boolean): void {
    if (success) {
      this.progress.streaks.current++;
      this.progress.streaks.longest = Math.max(this.progress.streaks.current, this.progress.streaks.longest);
    } else {
      this.progress.streaks.current = 0;
    }
  }

  recordChallengeAttempt(
    topicName: string,
    success: boolean,
    timeMs: number,
    accuracy: number
  ): void {
    if (!this.progress.topicScores[topicName]) {
      this.progress.topicScores[topicName] = {
        completed: 0,
        accuracy: 0,
        bestTime: Infinity,
      };
    }

    const topic = this.progress.topicScores[topicName];
    if (success) {
      topic.completed++;
    }

    // Update running average accuracy
    topic.accuracy = (topic.accuracy + accuracy) / 2;
    topic.bestTime = Math.min(topic.bestTime, timeMs);
  }

  addBadge(badgeName: string): void {
    if (!this.progress.badges.includes(badgeName)) {
      this.progress.badges.push(badgeName);
    }
  }

  hasBadge(badgeName: string): boolean {
    return this.progress.badges.includes(badgeName);
  }

  getTopicAccuracy(topicName: string): number {
    return this.progress.topicScores[topicName]?.accuracy || 0;
  }

  save(storageKey: string = 'ml_game_progress'): void {
    localStorage.setItem(storageKey, JSON.stringify(this.progress));
  }

  load(storageKey: string = 'ml_game_progress'): boolean {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      this.progress = JSON.parse(saved);
      return true;
    }
    return false;
  }

  reset(): void {
    this.progress = {
      totalXP: 0,
      level: 0,
      streaks: { current: 0, longest: 0 },
      topicScores: {},
      badges: [],
    };
  }
}
