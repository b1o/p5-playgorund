import { Matrix } from './matrix';

export const sigmoid = x => {
  return 1 / (1 + Math.exp(-x));
};

export const dsigmoid = (y) => {
  return y * (1 - y);
};

export class NeuralNetwork {
  private input_nodes: number;
  private hidden_nodes: number;
  private output_nodes: number;

  private weights_ih: Matrix;
  private weights_ho: Matrix;

  private bias_h: Matrix;
  private bias_o: Matrix;

  private learningRate = 0.3;

  constructor(numInput: number, numHidden: number, numOutput: number) {
    this.input_nodes = numInput;
    this.hidden_nodes = numHidden;
    this.output_nodes = numOutput;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);

    this.weights_ho.randomize();
    this.weights_ih.randomize();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);

    this.bias_h.randomize();
    this.bias_o.randomize();
  }

  public feedForward(input_array) {
    // Generating hidden outputs
    const inputs = Matrix.fromArray(input_array);
    const hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function
    hidden.map(sigmoid);

    const output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid);

    return output.toArray();
  }

  public train(inputs_array, targets_array) {
    // Generating hidden outputs
    const inputs = Matrix.fromArray(inputs_array);
    const hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function
    hidden.map(sigmoid);

    const outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);


    const targets = Matrix.fromArray(targets_array);
    // Calc the error
    // ERROR = TARGETS - OUPUTS

    const outputErrors = Matrix.substract(targets, outputs);

    const gradients = Matrix.map(outputs, dsigmoid);
    // gradients.print();
    gradients.multiply(outputErrors);
    gradients.multiply(this.learningRate);


    const hidden_T = Matrix.transpose(hidden);
    const weights_ho_deltas = Matrix.multiply(gradients, hidden_T);
    this.bias_o.add(gradients);

    this.weights_ho.add(weights_ho_deltas);

    // Calculate hidden layer errors
    const transposed = Matrix.transpose(this.weights_ho);
    const hiddenErrors = Matrix.multiply(transposed, outputErrors);

    const hidden_gradient = Matrix.map(hidden, dsigmoid);
    hidden_gradient.multiply(hiddenErrors);
    hidden_gradient.multiply(this.learningRate);

    const inputs_T = Matrix.transpose(inputs);
    const weights_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

    this.weights_ih.add(weights_ih_deltas);
    this.bias_h.add(hidden_gradient);


  }
}
