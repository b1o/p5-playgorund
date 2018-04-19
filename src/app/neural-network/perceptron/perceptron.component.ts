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

  private population = 100;

  private brain: NeuralNetwork;
  private slider;
  private birds: Bird[];
  private ga: GeneticAlgorith;

  private trainingData = [
    { inputs: [0, 0], targets: [0] },
    { inputs: [1, 0], targets: [1] },
    { inputs: [0, 1], targets: [1] },
    { inputs: [1, 1], targets: [0] }
  ];

  constructor() {
  }

  private drawing(p) {
    this.p = p;
    this.p.setup = () => {
      this.p.createCanvas(600, 400);
      this.p.background(0);
      this.birds = new Array<Bird>();


      for (let i = 0; i < this.population; i++) {
        this.birds.push(new Bird(this.p, this.p.random(this.p.width)));
      }
      this.ga = new GeneticAlgorith(this.p, this.birds, this.population);

    };

    this.p.draw = () => {
      this.p.background(0);
      for (const bird of this.birds) {
        bird.think();
        bird.update();
        bird.show();


      }

      this.birds = this.birds.filter(b => b.alive);
      console.log(this.birds.length);

      if (this.birds.length <= 0) {
       this.birds = this.ga.nextGeneration();
      }

    };
  }

  ngOnInit() {
    this.p5 = new p5(this.drawing.bind(this));
  }
}
