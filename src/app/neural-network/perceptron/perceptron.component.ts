import { Component, OnInit } from '@angular/core';
import { NeuralNetwork } from './neural-network';
import { Matrix } from './matrix';
import { Bird } from './bird';
import { GeneticAlgorith } from './ga';

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
  private food = [];

  private trainingData = [
    { inputs: [0, 0], targets: [0] },
    { inputs: [1, 0], targets: [1] },
    { inputs: [0, 1], targets: [1] },
    { inputs: [1, 1], targets: [0] }
  ];

  constructor() {
  }

  private generateFood() {
    const foodCount = this.p.random(100, 150);

    for (let i = 0; i < foodCount; i++) {
      this.food.push(this.p.createVector(this.p.random(this.p.width), this.p.random(this.p.height)));
    }
  }

  private drawing(p) {
    this.p = p;
    this.p.setup = () => {
      this.p.createCanvas(window.innerWidth, window.innerHeight);
      this.p.background(0);
      this.birds = new Array<Bird>();
      this.food = [];
      for (let i = 0; i < this.population; i++) {
        this.birds.push(new Bird(this.p, this.p.random(this.p.width)));
      }
      this.ga = new GeneticAlgorith(this.p, this.birds, this.population);

    };

    this.p.draw = () => {

      for (let i = 0; i < this.cylces; i++) {
        while (this.food.length < 50) {
          this.food.push(this.p.createVector(this.p.random(50, this.p.width - 50), this.p.random(50, this.p.height - 50)));
        }

        for (const bird of this.birds) {
          if (bird.alive) {
            bird.eat(this.food);
            bird.think(this.food);
            bird.update(this.food);
          }
        }

        if (this.birds.filter(b => b.alive).length <= 0) {
          this.birds = this.ga.nextGeneration(this.birds);
          // this.p.noLoop();
        }
      }

      this.p.background(0);
      for (const food of this.food) {
        this.p.stroke(255);
        this.p.point(food.x, food.y);
      }

      for (const bird of this.birds) {
        if (bird.alive) {
          bird.show();
        }
      }
    };
  }

  ngOnInit() {
    this.p5 = new p5(this.drawing.bind(this));
  }
}
