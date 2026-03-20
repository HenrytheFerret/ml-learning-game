/**
 * Neural Network Math Library
 * Core calculations for perceptron, multilayer networks, Kohonen, Hopfield
 */

// =============================================================================
// ACTIVATION FUNCTIONS
// =============================================================================

export const activationFunctions = {
  threshold: (net: number): number => {
    return net >= 0 ? 1 : 0;
  },

  sigmoidal: (net: number): number => {
    // Avoid overflow: clamp extreme values
    const clamped = Math.max(-500, Math.min(500, net));
    return 1 / (1 + Math.exp(-clamped));
  },

  sigmoid_derivative: (activation: number): number => {
    return activation * (1 - activation);
  },

  linear: (net: number): number => {
    return net;
  },

  linear_derivative: (): number => {
    return 1;
  },
};

// =============================================================================
// PERCEPTRON & SINGLE UNIT
// =============================================================================

export interface PerceptronConfig {
  weights: number[];
  bias: number;
  learningRate?: number;
  activationFn?: 'threshold' | 'sigmoidal' | 'linear';
}

export interface PerceptronState extends PerceptronConfig {
  lastInputs?: number[];
  lastNet?: number;
  lastActivation?: number;
}

export class Perceptron {
  config: PerceptronConfig;

  constructor(config: PerceptronConfig) {
    this.config = {
      learningRate: 0.1,
      activationFn: 'threshold',
      ...config,
    };
  }

  /**
   * Calculate net value (weighted sum + bias)
   */
  calculateNet(inputs: number[]): number {
    if (inputs.length !== this.config.weights.length) {
      throw new Error('Input count must match weight count');
    }
    const sum = inputs.reduce((acc, input, i) => acc + input * this.config.weights[i], 0);
    return sum + this.config.bias;
  }

  /**
   * Get activation function
   */
  getActivationFn(): (net: number) => number {
    switch (this.config.activationFn) {
      case 'sigmoidal':
        return activationFunctions.sigmoidal;
      case 'linear':
        return activationFunctions.linear;
      case 'threshold':
      default:
        return activationFunctions.threshold;
    }
  }

  /**
   * Forward pass: inputs → net → activation
   */
  forward(inputs: number[]): { net: number; activation: number } {
    const net = this.calculateNet(inputs);
    const activationFn = this.getActivationFn();
    const activation = activationFn(net);
    return { net, activation };
  }

  /**
   * Training step for perceptron
   * Error = target - activation
   * Weight_new = Weight_old + (lr × error × input)
   */
  train(inputs: number[], target: number): { error: number; weightChanges: number[] } {
    const { net, activation } = this.forward(inputs);
    const error = target - activation;

    const weightChanges: number[] = [];

    // Update weights
    if (this.config.learningRate) {
      for (let i = 0; i < this.config.weights.length; i++) {
        const change = this.config.learningRate * error * inputs[i];
        this.config.weights[i] += change;
        weightChanges.push(change);
      }

      // Update bias
      const biasChange = this.config.learningRate * error * 1;
      this.config.bias += biasChange;
    }

    return { error, weightChanges };
  }

  /**
   * Generate truth table for given inputs
   */
  truthTable(inputBits: number): Array<{
    inputs: number[];
    net: number;
    activation: number;
  }> {
    const rows = [];
    const numInputs = this.config.weights.length;

    for (let i = 0; i < Math.pow(2, numInputs); i++) {
      const inputs = [];
      for (let j = 0; j < numInputs; j++) {
        inputs.push((i >> j) & 1);
      }
      const { net, activation } = this.forward(inputs);
      rows.push({ inputs, net, activation });
    }

    return rows;
  }

  /**
   * Clone the perceptron state
   */
  clone(): Perceptron {
    return new Perceptron({
      weights: [...this.config.weights],
      bias: this.config.bias,
      learningRate: this.config.learningRate,
      activationFn: this.config.activationFn,
    });
  }
}

// =============================================================================
// MULTILAYER FEED-FORWARD NETWORK (MLFFN)
// =============================================================================

export interface MLFFNLayer {
  weights: number[][];
  biases: number[];
  activationFn: 'threshold' | 'sigmoidal' | 'linear';
}

export interface MLFFNConfig {
  layers: MLFFNLayer[];
  learningRate?: number;
}

export class MLFFN {
  config: MLFFNConfig;
  lastActivations: number[][] = [];
  lastNets: number[][] = [];

  constructor(config: MLFFNConfig) {
    this.config = {
      learningRate: 0.1,
      ...config,
    };
  }

  /**
   * Forward pass through all layers
   */
  forward(inputs: number[]): { activations: number[][]; nets: number[][] } {
    const activations: number[][] = [inputs];
    const nets: number[][] = [];

    let currentActivation = inputs;

    for (let layerIdx = 0; layerIdx < this.config.layers.length; layerIdx++) {
      const layer = this.config.layers[layerIdx];
      const layerNets: number[] = [];
      const layerActivations: number[] = [];

      for (let neuronIdx = 0; neuronIdx < layer.weights.length; neuronIdx++) {
        const weights = layer.weights[neuronIdx];
        const bias = layer.biases[neuronIdx];

        // Calculate net
        let net = bias;
        for (let i = 0; i < currentActivation.length; i++) {
          net += currentActivation[i] * weights[i];
        }
        layerNets.push(net);

        // Calculate activation
        const activationFn = this.getActivationFn(layer.activationFn);
        const activation = activationFn(net);
        layerActivations.push(activation);
      }

      nets.push(layerNets);
      activations.push(layerActivations);
      currentActivation = layerActivations;
    }

    this.lastActivations = activations;
    this.lastNets = nets;

    return { activations, nets };
  }

  /**
   * Backpropagation: calculate errors and weight updates
   */
  backward(target: number[]): {
    errors: number[][];
    weightUpdates: number[][][];
    biasUpdates: number[][];
  } {
    const errors: number[][] = [];
    const weightUpdates: number[][][] = [];
    const biasUpdates: number[][] = [];
    const numLayers = this.config.layers.length;

    // Calculate output layer error
    const outputErrors: number[] = [];
    const lastLayer = this.config.layers[numLayers - 1];
    const lastActivation = this.lastActivations[numLayers];

    for (let i = 0; i < target.length; i++) {
      const diff = target[i] - lastActivation[i];
      const derivative = activationFunctions.sigmoid_derivative(lastActivation[i]);
      const error = diff * derivative;
      outputErrors.push(error);
    }
    errors[numLayers - 1] = outputErrors;

    // Backpropagate errors to hidden layers
    for (let layerIdx = numLayers - 2; layerIdx >= 0; layerIdx--) {
      const layer = this.config.layers[layerIdx];
      const nextLayer = this.config.layers[layerIdx + 1];
      const nextErrors = errors[layerIdx + 1];
      const currentActivation = this.lastActivations[layerIdx + 1];

      const layerErrors: number[] = [];
      for (let neuronIdx = 0; neuronIdx < layer.weights.length; neuronIdx++) {
        let error = 0;
        for (let nextNeuronIdx = 0; nextNeuronIdx < nextLayer.weights.length; nextNeuronIdx++) {
          const weight = nextLayer.weights[nextNeuronIdx][neuronIdx];
          error += nextErrors[nextNeuronIdx] * weight * currentActivation[neuronIdx] * (1 - currentActivation[neuronIdx]);
        }
        layerErrors.push(error);
      }
      errors[layerIdx] = layerErrors;
    }

    // Calculate weight and bias updates
    for (let layerIdx = 0; layerIdx < numLayers; layerIdx++) {
      const layer = this.config.layers[layerIdx];
      const layerErrors = errors[layerIdx];
      const prevActivation = this.lastActivations[layerIdx];

      const layerWeightUpdates: number[][] = [];
      const layerBiasUpdates: number[] = [];

      for (let neuronIdx = 0; neuronIdx < layer.weights.length; neuronIdx++) {
        const error = layerErrors[neuronIdx];
        const lr = this.config.learningRate || 0.1;

        const neuronWeightUpdates: number[] = [];
        for (let i = 0; i < prevActivation.length; i++) {
          const update = lr * error * prevActivation[i];
          neuronWeightUpdates.push(update);
        }
        layerWeightUpdates.push(neuronWeightUpdates);

        const biasUpdate = lr * error * 1;
        layerBiasUpdates.push(biasUpdate);
      }

      weightUpdates.push(layerWeightUpdates);
      biasUpdates.push(layerBiasUpdates);
    }

    return { errors, weightUpdates, biasUpdates };
  }

  /**
   * Apply weight updates
   */
  applyUpdates(weightUpdates: number[][][], biasUpdates: number[][]): void {
    for (let layerIdx = 0; layerIdx < this.config.layers.length; layerIdx++) {
      const layer = this.config.layers[layerIdx];
      for (let neuronIdx = 0; neuronIdx < layer.weights.length; neuronIdx++) {
        for (let i = 0; i < layer.weights[neuronIdx].length; i++) {
          layer.weights[neuronIdx][i] += weightUpdates[layerIdx][neuronIdx][i];
        }
        layer.biases[neuronIdx] += biasUpdates[layerIdx][neuronIdx];
      }
    }
  }

  /**
   * Training step
   */
  train(inputs: number[], target: number[]): { error: number } {
    this.forward(inputs);
    const { weightUpdates, biasUpdates } = this.backward(target);
    this.applyUpdates(weightUpdates, biasUpdates);

    // Calculate total error
    const output = this.lastActivations[this.lastActivations.length - 1];
    let totalError = 0;
    for (let i = 0; i < target.length; i++) {
      totalError += Math.pow(target[i] - output[i], 2);
    }

    return { error: totalError / 2 };
  }

  private getActivationFn(name: string): (net: number) => number {
    switch (name) {
      case 'sigmoidal':
        return activationFunctions.sigmoidal;
      case 'linear':
        return activationFunctions.linear;
      case 'threshold':
      default:
        return activationFunctions.threshold;
    }
  }
}

// =============================================================================
// KOHONEN SELF-ORGANIZING MAP
// =============================================================================

export interface KohonenConfig {
  units: number[][];
  learningRate?: number;
}

export class KohonenMap {
  config: KohonenConfig;

  constructor(config: KohonenConfig) {
    this.config = {
      learningRate: 0.3,
      ...config,
    };
  }

  /**
   * Normalize vector
   */
  normalize(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    if (magnitude === 0) return vector;
    return vector.map((v) => v / magnitude);
  }

  /**
   * Calculate distance (dot product of normalized vectors)
   */
  distance(vector1: number[], vector2: number[]): number {
    const v1 = this.normalize(vector1);
    const v2 = this.normalize(vector2);
    return v1.reduce((sum, v, i) => sum + v * v2[i], 0);
  }

  /**
   * Find winner (maximum distance)
   */
  findWinner(input: number[]): number {
    let maxDistance = -Infinity;
    let winnerIdx = 0;

    for (let i = 0; i < this.config.units.length; i++) {
      const dist = this.distance(input, this.config.units[i]);
      if (dist > maxDistance) {
        maxDistance = dist;
        winnerIdx = i;
      }
    }

    return winnerIdx;
  }

  /**
   * Kohonen training step
   */
  train(input: number[]): number {
    const winner = this.findWinner(input);
    const lr = this.config.learningRate || 0.3;

    // Update winner: W_new = W_old + η(input - W_old)
    for (let i = 0; i < this.config.units[winner].length; i++) {
      const change = lr * (input[i] - this.config.units[winner][i]);
      this.config.units[winner][i] += change;
    }

    // Re-normalize winner
    this.config.units[winner] = this.normalize(this.config.units[winner]);

    return winner;
  }

  /**
   * Clone the map
   */
  clone(): KohonenMap {
    return new KohonenMap({
      units: this.config.units.map((u) => [...u]),
      learningRate: this.config.learningRate,
    });
  }
}

// =============================================================================
// HOPFIELD NETWORK
// =============================================================================

export interface HopfieldConfig {
  weights: number[][];
  biases: number[];
}

export class HopfieldNetwork {
  config: HopfieldConfig;

  constructor(config: HopfieldConfig) {
    this.config = config;
  }

  /**
   * Calculate net for a single neuron
   */
  calculateNet(state: number[], neuronIdx: number): number {
    let net = this.config.biases[neuronIdx];
    for (let i = 0; i < state.length; i++) {
      net += state[i] * this.config.weights[neuronIdx][i];
    }
    return net;
  }

  /**
   * State transition: given current state and firing neuron
   */
  stateTransition(state: number[], neuronIdx: number): number[] {
    const newState = [...state];
    const net = this.calculateNet(state, neuronIdx);
    newState[neuronIdx] = net >= 0 ? 1 : 0;
    return newState;
  }

  /**
   * Full state transition table
   */
  buildStateTransitionTable(): Array<{
    state: number;
    stateVector: number[];
    transitions: Array<{ neuron: number; newState: number; newStateVector: number[] }>;
  }> {
    const numNeurons = this.config.weights.length;
    const numStates = Math.pow(2, numNeurons);
    const table = [];

    for (let stateNum = 0; stateNum < numStates; stateNum++) {
      const stateVector: number[] = [];
      for (let i = 0; i < numNeurons; i++) {
        stateVector.push((stateNum >> i) & 1);
      }

      const transitions = [];
      for (let neuronIdx = 0; neuronIdx < numNeurons; neuronIdx++) {
        const newStateVector = this.stateTransition(stateVector, neuronIdx);
        let newStateNum = 0;
        for (let i = 0; i < numNeurons; i++) {
          newStateNum |= newStateVector[i] << i;
        }
        transitions.push({ neuron: neuronIdx, newState: newStateNum, newStateVector });
      }

      table.push({ state: stateNum, stateVector, transitions });
    }

    return table;
  }
}
