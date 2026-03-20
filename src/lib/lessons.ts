/**
 * Lesson Content & Progression System
 * Defines all LEARN/PRACTICE/MASTER content for each topic
 */

export type TopicId = 'perceptron' | 'multilayer' | 'kohonen' | 'hopfield' | 'applications';
export type ChallengeMode = 'learn' | 'practice' | 'master';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'boss';

export interface Lesson {
  id: string;
  topicId: TopicId;
  title: string;
  description: string;
  order: number;
  
  // LEARN phase
  learnContent: {
    title: string;
    explanation: string;
    keyFormulas: string[];
    animationKey?: string;
  };
  
  // PRACTICE challenges
  practiceCount: number;
  practiceDifficulties: Difficulty[];
  
  // MASTER challenge
  masterQuestion: {
    text: string;
    solution: string;
    keyPoints: string[];
    examSource?: string; // e.g., "Q2, 2024"
  };
}

export interface Challenge {
  id: string;
  lessonId: string;
  topicId: TopicId;
  mode: ChallengeMode;
  difficulty: Difficulty;
  
  // Challenge content
  type: 'truth-table' | 'fill-blank' | 'multiple-choice' | 'diagram' | 'sequence' | 'comparison';
  question: string;
  
  // For auto-grading
  expectedOutput?: any;
  gradingFn?: (userAnswer: any) => { correct: boolean; score: number };
  
  // XP rewards
  baseXP: number;
  timeLimit?: number; // in seconds
  hints?: string[];
}

// =============================================================================
// TOPIC DEFINITIONS
// =============================================================================

export const LESSONS: Record<TopicId, Lesson[]> = {
  perceptron: [
    {
      id: 'perceptron-1',
      topicId: 'perceptron',
      title: 'What\'s a Perceptron?',
      description: 'Meet the artificial neuron - the building block of all neural networks',
      order: 1,
      learnContent: {
        title: 'The Perceptron Neuron',
        explanation: `A perceptron is the simplest neural network - a single artificial neuron. It takes inputs, weighs them, and produces an output.

Key idea: Each input is multiplied by a weight. These weighted inputs are summed, then an activation function decides: fire or not?`,
        keyFormulas: [
          'net = Σ(input_i × weight_i) + bias',
          'output = activation(net)',
        ],
        animationKey: 'perceptron-intro',
      },
      practiceCount: 4,
      practiceDifficulties: ['easy', 'easy', 'medium', 'medium'],
      masterQuestion: {
        text: 'A perceptron has weights [2.0, 1.1] and bias -1.2. Draw the perceptron diagram and label all parts.',
        solution: 'Diagram should show: inputs on left, weights on connections, summation node, bias input, activation function, output.',
        keyPoints: [
          'All weights labeled correctly',
          'Bias shown as separate input',
          'Activation function identified',
          'Output clearly marked',
        ],
        examSource: 'Q1, variant',
      },
    },
    {
      id: 'perceptron-2',
      topicId: 'perceptron',
      title: 'Calculating Net Value',
      description: 'The heart of the perceptron: weighted sum + bias',
      order: 2,
      learnContent: {
        title: 'Net Value Formula',
        explanation: `The net value is where all the computation happens:

net = (input_1 × weight_1) + (input_2 × weight_2) + ... + bias

Example:
- Inputs: [1, 0]
- Weights: [2.0, 1.1]
- Bias: -1.2
- net = (1 × 2.0) + (0 × 1.1) + (-1.2) = 2.0 + 0 - 1.2 = 0.8`,
        keyFormulas: [
          'net = Σ(input_i × weight_i) + bias',
          'This is a dot product!',
        ],
        animationKey: 'net-calculation',
      },
      practiceCount: 7,
      practiceDifficulties: ['easy', 'easy', 'medium', 'medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Calculate net values for all 8 input combinations given weights and bias.',
        solution: 'Fill truth table with net calculations',
        keyPoints: [
          'Correct calculation of all nets',
          'Proper sign handling',
          'Consistent decimal places',
        ],
        examSource: 'Q2a, 2024',
      },
    },
    {
      id: 'perceptron-3',
      topicId: 'perceptron',
      title: 'Activation Functions',
      description: 'How the perceptron decides: threshold, sigmoid, or linear?',
      order: 3,
      learnContent: {
        title: 'Activation Functions',
        explanation: `The activation function takes the net value and produces the final output.

Three main types:
1. **Threshold**: If net ≥ 0 then 1, else 0 (binary decision)
2. **Sigmoid**: 1/(1+e^(-net)) (smooth 0-1 output)
3. **Linear**: output = net (passes through)

The choice affects what the perceptron can learn!`,
        keyFormulas: [
          'threshold(net) = 1 if net ≥ 0, else 0',
          'sigmoid(net) = 1 / (1 + e^(-net))',
          'linear(net) = net',
        ],
        animationKey: 'activation-functions',
      },
      practiceCount: 6,
      practiceDifficulties: ['easy', 'easy', 'medium', 'medium', 'hard', 'expert'],
      masterQuestion: {
        text: 'Given net values, apply three different activation functions and compare outputs.',
        solution: 'Show all three activations for given net values',
        keyPoints: [
          'Correct threshold calculations',
          'Sigmoid values in [0,1]',
          'Linear = input',
        ],
        examSource: 'Q2b, variant',
      },
    },
    {
      id: 'perceptron-4',
      topicId: 'perceptron',
      title: 'Truth Tables',
      description: 'Build complete I/O tables for a perceptron',
      order: 4,
      learnContent: {
        title: 'Truth Tables from Weights',
        explanation: `A truth table shows all possible inputs and corresponding outputs.

For a perceptron with 2 inputs, there are 2^2 = 4 combinations:
[0,0], [0,1], [1,0], [1,1]

For each row:
1. Calculate net = Σ(input × weight) + bias
2. Apply activation function
3. Record output

The pattern of 1s and 0s shows what the perceptron can classify!`,
        keyFormulas: [
          'For n inputs: 2^n rows in truth table',
          'Each row: calculate net, then apply activation',
        ],
        animationKey: 'truth-table-building',
      },
      practiceCount: 6,
      practiceDifficulties: ['easy', 'medium', 'medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Build complete truth table with net and activation columns.',
        solution: '4 or 8 row truth table (depends on input count)',
        keyPoints: [
          'All rows completed',
          'Correct net calculations',
          'Correct activations applied',
          'Proper formatting',
        ],
        examSource: 'Q2, 2024-2025',
      },
    },
    {
      id: 'perceptron-5',
      topicId: 'perceptron',
      title: 'Training the Perceptron',
      description: 'Watch the perceptron learn: weight updates in action',
      order: 5,
      learnContent: {
        title: 'Perceptron Learning Rule',
        explanation: `The perceptron learns by updating weights based on errors.

Training Rule (for threshold activation):
- If output is correct: do nothing
- If output is wrong:
  - new_weight = old_weight + (learning_rate × input × error)
  - error = target - output

This process repeats until all training examples are correct!`,
        keyFormulas: [
          'weight_update = learning_rate × input × (target - output)',
          'bias_update = learning_rate × (target - output)',
        ],
        animationKey: 'perceptron-training',
      },
      practiceCount: 5,
      practiceDifficulties: ['easy', 'medium', 'medium', 'hard', 'expert'],
      masterQuestion: {
        text: 'Perform one iteration of perceptron training: show weight updates.',
        solution: 'Calculate and show all weight deltas for one training step',
        keyPoints: [
          'Correct error calculation',
          'Proper weight update formula',
          'All weights updated consistently',
        ],
        examSource: 'Q3, variant',
      },
    },
    {
      id: 'perceptron-6',
      topicId: 'perceptron',
      title: 'Geometry & Decision Boundaries',
      description: 'See how weights create decision boundaries in input space',
      order: 6,
      learnContent: {
        title: 'Visualizing Perceptron Decisions',
        explanation: `Weights and bias define a line (in 2D) or hyperplane (in nD) that separates the input space.

Points on one side → output 1
Points on other side → output 0

The weights determine the slope of the line.
The bias determines where it's positioned.

This is why perceptrons can only solve linearly separable problems!`,
        keyFormulas: [
          'Decision boundary: Σ(input_i × weight_i) + bias = 0',
          'Weights = normal vector to the boundary',
        ],
        animationKey: 'decision-boundary',
      },
      practiceCount: 4,
      practiceDifficulties: ['easy', 'medium', 'hard', 'expert'],
      masterQuestion: {
        text: 'Given weights, draw the decision boundary on a 2D plot. Mark separable vs. non-separable cases.',
        solution: 'Correct line equation and visual representation',
        keyPoints: [
          'Correct decision boundary line',
          'Proper labeling of regions',
          'Understanding of linearity limitation',
        ],
        examSource: 'Q4, variant',
      },
    },
  ],
  
  multilayer: [
    {
      id: 'multilayer-1',
      topicId: 'multilayer',
      title: 'Why Hidden Layers?',
      description: 'The limitation of single neurons and the power of depth',
      order: 1,
      learnContent: {
        title: 'Beyond Single Neurons',
        explanation: `Single perceptrons can only solve linear problems (XOR is famous example they can't solve).

Adding hidden layers = non-linear feature transformation = can solve any problem!

The hidden layer learns features, output layer makes final decision.`,
        keyFormulas: [
          'Output = f(W2 × f(W1 × input + b1) + b2)',
          'f() can be sigmoid, ReLU, tanh, etc.',
        ],
        animationKey: 'hidden-layers-intro',
      },
      practiceCount: 5,
      practiceDifficulties: ['easy', 'medium', 'medium', 'hard', 'expert'],
      masterQuestion: {
        text: 'Explain why XOR cannot be solved by a single perceptron but can be solved with hidden layers.',
        solution: 'Draw truth table, show XOR linear inseparability, hidden layer solution',
        keyPoints: [
          'Correct XOR explanation',
          'Geometric understanding',
          'Hidden layer role clarified',
        ],
        examSource: 'Q5, variant',
      },
    },
  ],
  
  kohonen: [],
  hopfield: [],
  applications: [],
};

export const getChallengesForLesson = (lessonId: string): Challenge[] => {
  // This would generate practice challenges dynamically
  // For now, return empty array - challenges built in components
  return [];
};

export const getProgressForLesson = (lessonId: string, completedModes: ChallengeMode[]): number => {
  // Calculate % completion: 0 (locked), 25 (learn), 50 (practice), 100 (master)
  if (completedModes.includes('master')) return 100;
  if (completedModes.includes('practice')) return 50;
  if (completedModes.includes('learn')) return 25;
  return 0;
};

export const getNextModeForLesson = (completedModes: ChallengeMode[]): ChallengeMode => {
  if (!completedModes.includes('learn')) return 'learn';
  if (!completedModes.includes('practice')) return 'practice';
  if (!completedModes.includes('master')) return 'master';
  return 'learn';
};
