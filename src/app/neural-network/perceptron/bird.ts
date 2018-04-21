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
  public health = 2;
  public maxHealth = 3;
  public minSpeed = 0.25;
  public maxSpeed = 8;
  public sensorLength = 50;
  public acc;

  private totalSensors = 8;
  private r = 4;
  private foodEaten = 0;
  private sensorAngle = (Math.PI * 2) / this.totalSensors;

  private sensors: Array<Sensor>;
  public mutationRate = 0.1;

  constructor(private p, x: number | NeuralNetwork) {
    this.sensors = [];
    for (let angle = 0; angle < this.p.TWO_PI; angle += this.sensorAngle) {
      this.sensors.push(new Sensor(angle));
    }


    if (x instanceof NeuralNetwork) {
      this.brain = x.copy();
      this.brain.mutate(this.mutate.bind(this));
    } else {
      const inputs = this.sensors.length + 9;

      this.brain = new NeuralNetwork(inputs, 128, 2);

    }

    this.pos = this.p.createVector(this.p.random(200, this.p.width - 200), this.p.random(200, this.p.height - 200));
    this.velocity = this.p.createVector(0, 0);
    this.acc = this.p.createVector(0, 0);
  }

  public mutate(x) {
    if (this.p.random(1) < this.mutationRate) {
      const offset = this.p.randomGaussian() * 0.5;
      const newx = x + offset;
      return newx;
    } else {
      return x;
    }
  }

  public think(food) {

    if (!this.alive) {
      return;
    }

    for (let j = 0; j < this.sensors.length; j++) {
      this.sensors[j].val = this.sensorLength;
    }

    for (let i = 0; i < food.length; i++) {
      const otherPos = food[i];

      const dist = p5.Vector.dist(this.pos, otherPos);

      if (dist > this.sensorLength) {
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
    inputs[0] = this.p.constrain(this.p.map(this.pos.x, 0, 0, 0, 1), 0, 1);
    inputs[1] = this.p.constrain(this.p.map(this.pos.y, 0, 0, 0, 1), 0, 1);
    inputs[2] = this.p.constrain(this.p.map(this.pos.x, this.p.width, this.p.width, 0, 1), 0, 1);
    inputs[3] = this.p.constrain(this.p.map(this.pos.y, this.p.height, this.p.height, 0, 1), 0, 1);
    inputs[4] = this.velocity.x / this.maxSpeed;
    inputs[5] = this.velocity.y / this.maxSpeed;
    inputs[6] = this.health / this.maxHealth;
    inputs[7] = this.pos.x / this.p.width;
    inputs[8] = this.pos.y / this.p.height;

    for (let j = 0; j < this.sensors.length; j++) {
      inputs[j + 9] = this.p.map(this.sensors[j].val, 0, this.sensorLength, 1, 0);

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

  public clone(prob) {
    const r = this.p.random(1);

    if (r < prob) {
      return new Bird(this.p, this.brain);
    }
  }

  public eat(food) {

    for (let i = food.length - 1; i >= 0; i--) {
      const d = p5.Vector.dist(food[i], this.pos);


      if (d < 8) {
        food.splice(i, 1);
        this.score++;
        this.foodEaten++;
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
    this.health = this.p.constrain(this.health, 0, this.maxHealth);


    if (this.velocity.mag() < 1) {
      this.health -= 0.005;
      this.score--;
    }

    if (this.velocity.mag() >= 2) {
      this.health += 0.005;
    }

    this.acc.mult(0);

    this.health -= 0.01;
    this.score++;
    if (this.health < 0) {
      this.alive = false;
    }

    if (this.pos.y > this.p.height) {
      this.alive = false;
    }

    if (this.pos.y < 0) {
      this.alive = false;
    }

    if (this.pos.x > this.p.width) {
      this.alive = false;
    }

    if (this.pos.x < 0) {
      this.alive = false;
    }
  }

  public up() {
    this.velocity += this.lift;
  }

  public show(debug) {

    const green = this.p.color(0, 255, 255, 255);
    const red = this.p.color(255, 0, 100, 100);
    const col = this.p.lerpColor(red, green, this.health);


    this.p.push();
    this.p.translate(this.pos.x, this.pos.y);

   if (debug) {
    for (let i = 0; i < this.sensors.length; i++) {
      const val = this.sensors[i].val;

      if (val > 0) {
        this.p.stroke(col);
        this.p.strokeWeight(this.p.map(val, 0, this.sensorLength, 4, 0));
        const position = this.sensors[i].dir;
        this.p.line(0, 0, position.x * val, position.y * val);
      }
  }
   }

    this.p.noStroke();
    this.p.fill(255, 200);
    this.p.text(this.p.int(this.score) + '/' + this.p.int(this.velocity.mag()), 0, 0);

    const theta = this.velocity.heading() + this.p.PI / 2;
    this.p.rotate(theta);
    this.p.fill(col);
    this.p.strokeWeight(1);
    this.p.stroke(col);
    this.p.beginShape();
    this.p.vertex(0, -this.r * 2);
    this.p.vertex(-this.r, this.r * 2);
    this.p.vertex(this.r, this.r * 2);
    this.p.endShape(this.p.CLOSE);

    this.p.pop();

  }

  public highlight() {
    this.p.fill(255, 255, 255, 50);
    this.p.stroke(255);
    this.p.ellipse(this.pos.x, this.pos.y, 32, 32);
  }
}
