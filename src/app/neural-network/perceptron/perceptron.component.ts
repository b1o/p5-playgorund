import { Component, OnInit } from '@angular/core';
import { NeuralNetwork } from './neural-network';
import { Matrix } from './matrix';
import { Bird } from './bird';
import { GeneticAlgorith } from './ga';
import { bestnn } from './bestnn';

declare var p5;

@Component({
  selector: 'app-perceptron',
  templateUrl: './perceptron.component.html',
  styleUrls: ['./perceptron.component.css']
})
export class PerceptronComponent implements OnInit {
  private p;
  private p5;

  private population = 50;

  private brain: NeuralNetwork;
  private birds: Bird[];
  private savedBirds: Bird[];
  private ga: GeneticAlgorith;

  public cylces = 1;
  public debug = false;
  private food = [];
  public best: Bird;
  public iterations = 0;

  runningBest = false;

  private trainingData = [
    { inputs: [0, 0], targets: [0] },
    { inputs: [1, 0], targets: [1] },
    { inputs: [0, 1], targets: [1] },
    { inputs: [1, 1], targets: [0] }
  ];
  public generations = 0;
  public lowest: Bird;

  constructor() { }

  private generateFood() {
    const foodCount = 200;

    for (let i = 0; i < foodCount; i++) {
      this.food.push(
        this.p.createVector(
          this.p.random(this.p.width),
          this.p.random(this.p.height)
        )
      );
    }
  }

  private exportBest() {
    console.log(this.best.brain.serialize());
  }

  private drawing(p) {
    this.p = p;
    this.p.setup = () => {
      this.p.createCanvas(window.innerWidth, window.innerHeight);
      this.p.background(0);
      this.birds = new Array<Bird>();
      this.food = [];
      for (let i = 0; i < 50; i++) {
        this.birds.push(new Bird(this.p));
      }
      this.generateFood();

      this.ga = new GeneticAlgorith(this.p, this.birds, this.population);
    };

    this.p.draw = () => {
      for (let i = 0; i < this.cylces; i++) {
        while (this.food.length < 200) {
          this.food.push(
            this.p.createVector(
              this.p.random(this.p.width),
              this.p.random(this.p.height)
            )
          );
        }

        let record = -1;
        let lowest = Infinity;
        for (const bird of this.birds) {
          // bird.eat(this.food);
          bird.think(this.food);
          bird.update(this.food);
        }

        for (let j = this.birds.length - 1; j >= 0; j--) {
          const b = this.birds[j];

          if (!b.alive) {
            this.birds.splice(j, 1);
          } else {
            if (b.score > record) {
              record = b.score;
              this.best = b;
            }

            if (b.score < lowest) {
              lowest = b.score;
              this.lowest = b;
            }
          }
        }

        if (this.birds.length < 50) {
          for (const b of this.birds) {
            const newBird = b.clone(0.1 * b.score / record);

            if (newBird != null) {
              this.birds.push(newBird);
              this.generations++;
            }
          }
        }

        // if (this.iterations % 1000 === 0) {
        //   this.lowest.alive = false;
        //   console.log('culling weakest', this.lowest)
        // }

        this.iterations++;
      }

      this.p.background(0);
      for (const food of this.food) {
        this.p.stroke(255);
        this.p.point(food.x, food.y);
      }

      this.best.highlight();
      this.lowest.highlight();

      for (const bird of this.birds) {
        if (bird.alive) {
          bird.show(this.debug);
        }
      }
    };
  }

  ngOnInit() {
    this.p5 = new p5(this.drawing.bind(this));
  }
}
