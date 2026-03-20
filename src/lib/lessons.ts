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
      title: "What's a Perceptron?",
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
    {
      id: 'multilayer-2',
      topicId: 'multilayer',
      title: 'Forward Propagation',
      description: 'Computing outputs layer-by-layer through the network',
      order: 2,
      learnContent: {
        title: 'Forward Pass Through Layers',
        explanation: `Forward propagation moves data from input → hidden → output layer.

Each layer:
1. Take inputs from previous layer
2. Calculate net = Σ(input × weight) + bias for each neuron
3. Apply activation function
4. Pass outputs to next layer

The final layer output is the network's prediction!`,
        keyFormulas: [
          'Layer 1 output: a1 = f(W1 × input + b1)',
          'Layer 2 output: a2 = f(W2 × a1 + b2)',
          'f() is sigmoid or ReLU activation',
        ],
        animationKey: 'forward-propagation',
      },
      practiceCount: 6,
      practiceDifficulties: ['easy', 'easy', 'medium', 'medium', 'hard', 'expert'],
      masterQuestion: {
        text: 'Perform complete forward pass: calculate hidden layer activation, then output.',
        solution: 'Show all layer-by-layer calculations with correct net and activation values',
        keyPoints: [
          'Correct input-to-hidden calculation',
          'Hidden-to-output calculation',
          'Proper activation functions applied',
        ],
        examSource: 'Q6, variant',
      },
    },
    {
      id: 'multilayer-3',
      topicId: 'multilayer',
      title: 'Backpropagation Algorithm',
      description: 'How networks learn: propagate errors backward',
      order: 3,
      learnContent: {
        title: 'Learning with Backprop',
        explanation: `Backpropagation learns by:
1. Calculate error at output layer
2. Propagate error backward to hidden layers
3. Update weights using chain rule

Key insight: Each weight update is proportional to the error it caused!

Formula: Δw = -η × ∂E/∂w (negative gradient of error)`,
        keyFormulas: [
          'Output error: δ_out = (target - output) x f\'(net)',
          'Hidden error: δ_hidden = Σ(δ_next × w) x f\'(net)',
          'Weight update: Δw = η × δ × input',
        ],
        animationKey: 'backpropagation',
      },
      practiceCount: 5,
      practiceDifficulties: ['medium', 'medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Perform one backprop step: show error calculation and weight updates.',
        solution: 'Calculate output error, hidden layer error, all weight deltas',
        keyPoints: [
          'Correct output layer error',
          'Correct backpropagated error',
          'Proper weight delta calculation',
        ],
        examSource: 'Q7, variant',
      },
    },
    {
      id: 'multilayer-4',
      topicId: 'multilayer',
      title: 'Loss Functions & Gradient Descent',
      description: 'Measuring error and optimizing weights',
      order: 4,
      learnContent: {
        title: 'Optimization & Learning Rate',
        explanation: `Loss functions measure how wrong the network is:
- MSE: (target - output)²
- Cross-entropy: -Σ(target × log(output))

Gradient descent moves weights down the error slope:
- Large learning rate: fast but risky
- Small learning rate: slow but stable
- Learning rate = how big a step we take`,
        keyFormulas: [
          'MSE = (1/n) × Σ(target_i - output_i)²',
          'new_weight = old_weight - learning_rate × gradient',
          'Gradient = ∂Loss/∂weight',
        ],
        animationKey: 'gradient-descent',
      },
      practiceCount: 5,
      practiceDifficulties: ['medium', 'medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Analyze a loss curve: identify overtraining, good learning rate, underfitting.',
        solution: 'Interpret loss trajectory and suggest learning rate adjustment',
        keyPoints: [
          'Understands overfitting signs',
          'Identifies good vs bad learning curves',
          'Can suggest improvements',
        ],
        examSource: 'Q8, variant',
      },
    },
    {
      id: 'multilayer-5',
      topicId: 'multilayer',
      title: 'Overfitting & Regularization',
      description: 'Preventing memorization, generalizing to new data',
      order: 5,
      learnContent: {
        title: 'Avoiding Overfitting',
        explanation: `Overfitting: Network memorizes training data but fails on new data.

Signs: training loss keeps decreasing, validation loss increases.

Fixes:
1. **Early stopping**: Stop when validation loss stops improving
2. **Regularization**: Add penalty for large weights
3. **Dropout**: Randomly disable neurons during training
4. **More data**: More examples = less memorization`,
        keyFormulas: [
          'L2 regularization: Loss_total = Loss_data + λ × Σ(w²)',
          'L1 regularization: Loss_total = Loss_data + λ × Σ|w|',
          'λ controls regularization strength',
        ],
        animationKey: 'overfitting',
      },
      practiceCount: 4,
      practiceDifficulties: ['medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Given training/validation curves, diagnose the problem and suggest fixes.',
        solution: 'Identify overfitting or underfitting and propose solutions',
        keyPoints: [
          'Correct diagnosis',
          'Appropriate solutions',
          'Understands trade-offs',
        ],
        examSource: 'Q9, variant',
      },
    },
    {
      id: 'multilayer-6',
      topicId: 'multilayer',
      title: 'Training Tips & Tricks',
      description: 'Practical advice for optimizing and debugging networks',
      order: 6,
      learnContent: {
        title: 'Fine-Tuning Your MLFFN',
        explanation: `Training deep neural networks can be tricky! Here are some common tips:

- **Learning Rate:** Too high -> divergent, too low -> slow convergence. Use schedulers!
- **Batch Size:** Affects stability and training speed.
- **Initialization:** Small random weights break symmetry.
- **Monitoring:** Track train/validation loss to detect overfitting.
- **Activation Functions:** ReLU is popular for hidden layers.`,
        keyFormulas: [
          'AdaGrad: adapts learning rates per parameter',
          'Adam: combines momentum and adaptive learning rates',
        ],
        animationKey: 'training-tips-viz',
      },
      practiceCount: 4,
      practiceDifficulties: ['easy', 'medium', 'hard', 'expert'],
      masterQuestion: {
        text: 'You are training a multilayer network, and the training loss is decreasing, but validation loss is increasing. What does this indicate and what steps can you take?',
        solution: 'Identify overfitting. Suggest regularization, more data, early stopping, complexity reduction.',
        keyPoints: [
          'Recognize overfitting',
          'Suggest data augmentation',
          'Suggest regularization techniques',
          'Suggest early stopping',
          'Consider model complexity reduction',
        ],
        examSource: 'Q10, variant',
      },
    }
  ],
  
  kohonen: [
    {
      id: 'kohonen-1',
      topicId: 'kohonen',
      title: 'Self-Organizing Maps Intro',
      description: 'Unsupervised learning: discover patterns without labels',
      order: 1,
      learnContent: {
        title: 'What are Self-Organizing Maps?',
        explanation: `SOMs are unsupervised learning networks that organize data into a 2D map.

Key ideas:
- No target outputs needed
- Similar inputs map to nearby neurons
- Automatically discovers clusters
- Used for dimensionality reduction & visualization

Example: Kohonen used SOMs to map phonemes of Finnish language!`,
        keyFormulas: [
          'Similarity = 1 - distance (normalized dot product)',
          'BMU = best matching unit (most similar weight vector)',
          'Neighborhood = neurons near BMU',
        ],
        animationKey: 'kohonen-intro',
      },
      practiceCount: 5,
      practiceDifficulties: ['easy', 'easy', 'medium', 'medium', 'hard'],
      masterQuestion: {
        text: 'Explain how an SOM organizes high-dimensional data into 2D.',
        solution: 'Describe BMU selection, neighborhood update, and resulting structure',
        keyPoints: [
          'BMU concept clear',
          'Neighborhood function understood',
          'Topology preservation explained',
        ],
        examSource: 'Q10, variant',
      },
    },
    {
      id: 'kohonen-2',
      topicId: 'kohonen',
      title: 'Distance Metrics & BMU',
      description: 'Finding the best matching unit in the map',
      order: 2,
      learnContent: {
        title: 'Similarity & BMU Selection',
        explanation: `Distance metric: How similar are two vectors?

Common metrics:
1. **Euclidean**: √(Σ(xi - yi)²) - straight-line distance
2. **Manhattan**: Σ|xi - yi| - grid distance
3. **Cosine**: dot product of normalized vectors

BMU = neuron with smallest distance to input vector.

Formula: BMU = argmin_i distance(input, weight_i)`,
        keyFormulas: [
          'Euclidean: d = √(Σ(xi - yi)²) ',
          'Manhattan: d = Σ|xi - yi|',
          'Cosine: d = 1 - (x·y)/(|x|×|y|)',
        ],
        animationKey: 'bmu-selection',
      },
      practiceCount: 6,
      practiceDifficulties: ['easy', 'easy', 'medium', 'medium', 'hard', 'expert'],
      masterQuestion: {
        text: 'Calculate distances and identify BMU from weight vectors.',
        solution: 'Show all distance calculations and BMU selection',
        keyPoints: [
          'Correct distance calculations',
          'Identifies BMU correctly',
          'Shows work step-by-step',
        ],
        examSource: 'Q11, variant',
      },
    },
    {
      id: 'kohonen-3',
      topicId: 'kohonen',
      title: 'Kohonen Update Rule',
      description: 'How the map adapts: weight updates around the BMU',
      order: 3,
      learnContent: {
        title: 'Training the SOM',
        explanation: `Kohonen rule updates weights in a neighborhood around BMU:

1. Find BMU (closest neuron to input)
2. Update BMU: W_new = W + η(input - W)
3. Update neighbors with decreasing strength
4. Repeat with new inputs

Neighborhood decreases over training iterations!

Early: Large neighborhood = global organization
Late: Small neighborhood = local refinement`,
        keyFormulas: [
          'BMU update: W = W + η(input - W)',
          'Neighbor: W = W + η × h(distance) × (input - W)',
          'h(distance) = exp(-distance²/(2σ²))',
        ],
        animationKey: 'kohonen-update',
      },
      practiceCount: 6,
      practiceDifficulties: ['medium', 'medium', 'hard', 'hard', 'expert', 'expert'],
      masterQuestion: {
        text: 'Perform one Kohonen training step: find BMU and update weights.',
        solution: 'Show distance calculation, BMU identification, weight updates for BMU and neighbors',
        keyPoints: [
          'Correct BMU found',
          'Weight updates calculated properly',
          'Neighborhood effect shown',
        ],
        examSource: 'Q12, variant',
      },
    },
    {
      id: 'kohonen-4',
      topicId: 'kohonen',
      title: 'Topology Preservation',
      description: 'How SOMs maintain spatial relationships',
      order: 4,
      learnContent: {
        title: 'Preserving Input Space Structure',
        explanation: `Topology preservation = similar inputs remain nearby in SOM.

Why it works:
1. BMU and neighbors learn together
2. Neighborhood makes nearby neurons similar
3. Over time, input structure emerges on the map

Example: Color SOM shows natural color ordering!
Example: Country SOM shows geographic clustering

Result: The 2D map preserves input space structure!`,
        keyFormulas: [
          'Neighborhood radius: σ(t) = σ0 × exp(-t/τ)',
          'Learning rate: η(t) = η0 × exp(-t/τ)',
          't = training iteration, τ = time constant',
        ],
        animationKey: 'topology-preservation',
      },
      practiceCount: 5,
      practiceDifficulties: ['medium', 'medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Analyze an SOM output: identify clusters and explain topological relationships.',
        solution: 'Describe cluster patterns and how they relate to input structure',
        keyPoints: [
          'Clusters identified correctly',
          'Topology preservation understood',
          'Can predict new data placement',
        ],
        examSource: 'Q13, variant',
      },
    },
    {
      id: 'kohonen-5',
      topicId: 'kohonen',
      title: 'Applications & Interpretation',
      description: 'Real-world uses: clustering, visualization, anomaly detection',
      order: 5,
      learnContent: {
        title: 'From Theory to Practice',
        explanation: `SOMs are used for:

1. **Data visualization**: Reduce 100D data to 2D map
2. **Clustering**: Similar items group naturally
3. **Anomaly detection**: Weird points far from clusters
4. **Feature extraction**: Map neurons as features

Interpreting SOM:
- Cluster position = feature values
- Cluster size = how common in data
- Distance = dissimilarity

Companies use SOMs for market analysis, image organization, sensor data!`,
        keyFormulas: [
          'Data point similarity ≈ SOM map distance',
          'Cluster quality = compactness + separation',
          'Outlier score = distance to nearest cluster',
        ],
        animationKey: 'kohonen-applications',
      },
      practiceCount: 4,
      practiceDifficulties: ['medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Given a business problem, design an SOM solution and explain output interpretation.',
        solution: 'Propose SOM approach and explain how to extract actionable insights',
        keyPoints: [
          'Appropriate problem selection',
          'Sound SOM design',
          'Practical interpretation',
        ],
        examSource: 'Q14, variant',
      },
    },
  ],
  
  hopfield: [
    {
      id: 'hopfield-1',
      topicId: 'hopfield',
      title: 'Content-Addressable Memory',
      description: 'Networks that retrieve patterns from partial or noisy input',
      order: 1,
      learnContent: {
        title: 'Associative Recall Networks',
        explanation: `Hopfield networks store patterns and recall them from partial cues.

Unlike feedforward networks:
- No training phase labels
- Recurrent: neurons connect to each other
- Symmetric weights: w_ij = w_ji
- Update until convergence (fixed point)

Key insight: State evolves until it reaches stored pattern!

Example: Show partial face → network completes it`,
        keyFormulas: [
          'Recurrent connection: neuron output feeds back to inputs',
          'Symmetric weights ensure convergence',
          'Update rule: neuron fires if net ≥ 0',
        ],
        animationKey: 'hopfield-intro',
      },
      practiceCount: 5,
      practiceDifficulties: ['easy', 'medium', 'medium', 'hard', 'expert'],
      masterQuestion: {
        text: 'Design a Hopfield network to store one pattern and show convergence.',
        solution: 'Show weight calculation and state trajectory to stored pattern',
        keyPoints: [
          'Weights calculated correctly (Hebbian)',
          'State transitions shown',
          'Convergence to pattern demonstrated',
        ],
        examSource: 'Q15, variant',
      },
    },
    {
      id: 'hopfield-2',
      topicId: 'hopfield',
      title: 'Hebbian Learning Rule',
      description: 'Storing patterns: "neurons that fire together wire together"',
      order: 2,
      learnContent: {
        title: 'Weight Calculation (Hebb Rule)',
        explanation: `Hebb's rule: If two neurons are active together, strengthen their connection.

For storing one pattern [1, 0, 1, 0]:
- w_ij = (1/N) × pattern_i × pattern_j (for i ≠ j)
- w_ii = 0 (no self-connections)

For multiple patterns: W = Σ(pattern_k × pattern_k^T) / N

Result: Network learns to recreate the pattern!`,
        keyFormulas: [
          'Hebbian: w_ij = (1/N) × p_i × p_j',
          'Multiple patterns: W = (1/N) × Σ(p_k × p_k^T)',
          'For binary: multiply +1/-1 or 1/0 values',
        ],
        animationKey: 'hebbian-learning',
      },
      practiceCount: 6,
      practiceDifficulties: ['easy', 'medium', 'medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Calculate Hopfield weights to store given patterns.',
        solution: 'Apply Hebb rule to compute full weight matrix',
        keyPoints: [
          'Correct Hebbian calculation',
          'Symmetric matrix',
          'Zero diagonal',
        ],
        examSource: 'Q16, variant',
      },
    },
    {
      id: 'hopfield-3',
      topicId: 'hopfield',
      title: 'Energy Function & Convergence',
      description: 'Why Hopfield networks settle to stable states',
      order: 3,
      learnContent: {
        title: 'Energy Landscape',
        explanation: `Hopfield networks have an energy function that always decreases or stays same.

Energy = -0.5 × Σ(w_ij × s_i × s_j) - Σ(b_i × s_i)
(Lower energy = more stable state)

Key insight: Each neuron update decreases energy!

Result: Network converges to local minima (stored patterns or spurious states)

This guarantees convergence - no oscillations!`,
        keyFormulas: [
          'Energy: E = -0.5 × Σ(w_ij × s_i × s_j) - Σ(b_i × s_i)',
          'ΔE ≤ 0 for any update (energy never increases)',
          'Convergence when ΔE = 0 (fixed point)',
        ],
        animationKey: 'hopfield-energy',
      },
      practiceCount: 5,
      practiceDifficulties: ['medium', 'medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Calculate energy for given state and predict convergence path.',
        solution: 'Show energy calculations and trace state transitions',
        keyPoints: [
          'Correct energy calculation',
          'Understands energy decrease',
          'Predicts convergence',
        ],
        examSource: 'Q17, variant',
      },
    },
    {
      id: 'hopfield-4',
      topicId: 'hopfield',
      title: 'Spurious States & Capacity',
      description: 'Limitations: network confabulates unintended memories',
      order: 4,
      learnContent: {
        title: 'Network Limitations',
        explanation: `Spurious states: Stable states that aren't stored patterns.

Example: If network stores [1,0] and [0,1], it might also stabilize at [1,1]!

Capacity limit: Network can reliably store ~0.14N patterns (N = neurons)
- More patterns → more interference
- Capacity reached → spurious states appear

Basin of attraction: How far from pattern can you start and still converge?
- Storage errors corrected: 10-30% (depends on capacity)

Trade-off: Can store many patterns OR recall from very noisy input, not both!`,
        keyFormulas: [
          'Capacity: M ≈ 0.14 × N (empirical)',
          'Noise tolerance: typically 10-30% bit flip',
          'Basin size: depends on capacity and pattern similarity',
        ],
        animationKey: 'spurious-states',
      },
      practiceCount: 5,
      practiceDifficulties: ['medium', 'hard', 'hard', 'expert', 'expert'],
      masterQuestion: {
        text: 'Given stored patterns and initial state, identify spurious states and analyze capacity.',
        solution: 'Trace convergence, identify spurious states, estimate noise tolerance',
        keyPoints: [
          'Identifies spurious states',
          'Understands capacity limits',
          'Can estimate robustness',
        ],
        examSource: 'Q18, variant',
      },
    },
    {
      id: 'hopfield-5',
      topicId: 'hopfield',
      title: 'Pattern Recall & Applications',
      description: 'Associative memory: from noisy cues to clean patterns',
      order: 5,
      learnContent: {
        title: 'Memory Retrieval in Action',
        explanation: `Hopfield retrieval process:
1. Initialize network with partial/noisy pattern
2. Neurons update: if net ≥ 0 then fire
3. Repeat until state stabilizes
4. Read out retrieved pattern

Applications:
- **Image reconstruction**: Store faces, recover from scratched photos
- **Pattern completion**: Part of melody → recall full song
- **Noise filtering**: Noisy sensor data → clean measurement
- **Optimization**: Find good solutions to combinatorial problems

Limitation: Only works for small, well-separated patterns`,
        keyFormulas: [
          'Update: s_i(t+1) = 1 if Σ(w_ij × s_j) ≥ 0, else 0',
          'Convergence in finite updates (proven)',
          'Recall quality: depends on basin of attraction',
        ],
        animationKey: 'hopfield-recall',
      },
      practiceCount: 4,
      practiceDifficulties: ['medium', 'hard', 'hard', 'expert'],
      masterQuestion: {
        text: 'Design a Hopfield network for a real application and trace recall from noisy input.',
        solution: 'Propose storage strategy and show convergence from degraded pattern',
        keyPoints: [
          'Appropriate application choice',
          'Correct weight calculation',
          'Successful recall demonstrated',
        ],
        examSource: 'Q19, variant',
      },
    },
  ],
  
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
