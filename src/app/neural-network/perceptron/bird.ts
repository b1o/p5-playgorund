import { NeuralNetwork } from './neural-network';

declare var p5;

export class Sensor {
  public dir;
  public val;

  constructor(angle) {
    this.dir = p5.Vector.fromAngle(angle);

    this.val = 0;
  }
}

export class Bird {
  public pos;
  public gravity = 0.6;
  public lift = -20;
  public velocity;

  public alive = true;
  public brain: NeuralNetwork;

  public score = 1;
  public fitness = 0;

  public visionRadius = 32 * 5;
  public health = 6;
  public maxHealth = 6;
  public minSpeed = 0.25;
  public maxSpeed = 5;
  public acc;

  private totalSensors = 8;
  private sensorAngle = (Math.PI * 2) / this.totalSensors;

  private sensors: Array<Sensor>;

  constructor(private p, x: number | NeuralNetwork) {
    this.sensors = [];
    for (let angle = 0; angle < this.p.TWO_PI; angle += this.sensorAngle) {
      this.sensors.push(new Sensor(angle));
    }


    if (x instanceof NeuralNetwork) {
      this.brain = x;
      this.brain.mutate(this.mutate.bind(this));
    } else {
      const inputs = this.sensors.length + 7;

      this.brain = new NeuralNetwork(inputs, 64, 2);

    }

    this.pos = this.p.createVector(this.p.random(this.p.width), this.p.random(this.p.height));
    this.velocity = this.p.createVector(0, 0);
    this.acc = this.p.createVector(0, 0);
  }

  public mutate(x) {
    if (this.p.random(1) < 0.1) {
      const offset = this.p.randomGaussian() * 0.5;
      const newx = x + offset;
      return newx;
    } else {
      return x;
    }
  }

  public think(food) {

    if(!this.alive) {
      return;
    }

    for (let j = 0; j < this.sensors.length; j++) {
      this.sensors[j].val = 150;
    }

    for (let i = 0; i < food.length; i++) {
      const otherPos = food[i];

      const dist = p5.Vector.dist(this.pos, otherPos);

      if (dist > 150) {
        continue;
      }

      const toFood = p5.Vector.sub(otherPos, this.pos);
      for (let j = 0; j < this.sensors.length; j++) {
        const delta = this.sensors[j].dir.angleBetween(toFood);
        if (delta < this.sensorAngle / 2) {
          
          this.sensors[j].val = this.p.min(this.sensors[j].val, dist);
        }
      }
    }

    const inputs = [];
    // current pos
    inputs[0] = this.p.constrain(this.p.map(this.pos.x, 50, 0, 0, 1), 0, 1);
    inputs[1] = this.p.constrain(this.p.map(this.pos.y, 50, 0, 0, 1), 0, 1);
    inputs[2] = this.p.constrain(this.p.map(this.pos.x, this.p.width - 50, this.p.width, 0, 1), 0, 1);
    inputs[3] = this.p.constrain(this.p.map(this.pos.y, this.p.height - 50, this.p.height, 0, 1), 0, 1);
    inputs[4] = this.velocity.x / this.maxSpeed;
    inputs[5] = this.velocity.y / this.maxSpeed;
    inputs[6] = this.health / this.maxHealth;

    for (let j = 0; j < this.sensors.length; j++) {
      inputs[j + 7] = this.p.map(this.sensors[j].val, 0, 150, 1, 0);

    }


    const outputs = this.brain.predict(inputs);
    const desired = this.p.createVector(2 * outputs[0] - 1, 2 * outputs[1] - 1);
    desired.mult(this.maxSpeed);
    // Craig Reynolds steering formula
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(0.5);
    // Apply the force
    this.acc.add(steer);
  }

  public copy() {
    return new Bird(this.p, this.brain);
  }

  public eat(food) {

    for (let i = food.length - 1; i >= 0; i--) {
      const d = p5.Vector.dist(food[i], this.pos);


      if (d < 32) {
        food.splice(i, 1);
        this.health++;
      }
    }

  }

  public update(food) {
    this.velocity.add(this.acc);
    this.velocity.limit(this.maxSpeed);
    if
    (this.velocity.mag() < this.minSpeed) {
      this.velocity.setMag(this.minSpeed);
    }

    this.pos.add(this.velocity);

    this.acc.mult(0);

    this.health = this.p.constrain(this.health, 0, this.maxHealth);
    this.health -= 0.005;
    this.score++;
    if (this.health < 0) {
      this.alive = false;
      this.score -= 100;
    }

    if (this.pos.y > this.p.height) {
      this.score -= 100;
      this.alive = false;
    }

    if (this.pos.y < 0) {
      this.score -= 100;
      this.alive = false;
    }

    if (this.pos.x > this.p.width) {
      this.score -= 100;
      this.alive = false;
    }

    if (this.pos.x < 0) {
      this.score -= 100;
      this.alive = false;
    }
  }

  public up() {
    this.velocity += this.lift;
  }

  public show() {
    // this.p.stroke(0, 255, 0);
    // this.p.noFill();
    // this.p.ellipse(this.pos.x, this.pos.y, this.visionRadius, this.visionRadius);

    this.p.fill(100, 0, 0);
    this.p.ellipse(this.pos.x, this.pos.y, 32, 32);

    this.p.fill(255);
    this.p.rect(this.pos.x - 16, this.pos.y, this.p.map(this.health, 0, this.maxHealth, 0, 32), 2);


    this.p.textSize(10);
    this.p.text(this.score, this.pos.x, this.pos.y);
    this.p.fill(0, 102, 153);

  }
}
