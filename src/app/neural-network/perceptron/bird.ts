import { NeuralNetwork } from './neural-network';

export class Bird {
  public y;
  public x = 64;

  public gravity = 0.6;
  public lift = -20;
  public velocity = 0;

  public alive = true;
  public brain: NeuralNetwork;

  constructor(private p, x) {
      this.y = this.p.height / 2;
      this.x = x;
      this.brain = new NeuralNetwork(2, 4, 2);
  }

  public think() {


    const inputs = [this.y / this.p.height, this.p.height / this.p.height];
    const output = this.brain.feedForward(inputs);

    if (output[0] > output[1]) {
      this.up();
    }
  }

  public update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y > this.p.height) {
      this.alive = false;
    }

    if (this.y < 0) {
      this.alive = false;
    }
  }

  public up() {
    this.velocity += this.lift;
  }

  public show() {
    this.p.stroke(255);
    this.p.fill(255, 100);
    this.p.ellipse(this.x, this.y, 32, 32);
  }
}
