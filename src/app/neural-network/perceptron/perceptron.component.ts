import { Component, OnInit } from '@angular/core';
import { NeuralNetwork } from './neural-network';
import { Matrix } from './matrix';

declare var p5;

@Component({
  selector: 'app-perceptron',
  templateUrl: './perceptron.component.html',
  styleUrls: ['./perceptron.component.css']
})
export class PerceptronComponent implements OnInit {
  private p;
  private p5;

  private brain: NeuralNetwork;

  private trainingData = [

  ];

  constructor() {}

  private drawing(p) {
    this.p = p;
    this.p.setup = () => {
      this.p.createCanvas(20, 20);
      this.p.background(0);

      this.p.loadPixels();
      console.log(this.p.pixels.length);

      for (let i = 1; i < 255; i++) {
        this.trainingData.push({inputs: this.p.pixels.map(pixel => pixel / 255), targets: [i / 255]});
        this.p.background(i);
        this.p.loadPixels();
      }

      console.log(this.trainingData);
      this.brain = new NeuralNetwork(1600, 800, 1);

      for (let i = 0; i < 10000; i++) {
        const data = this.p.random(this.trainingData);
        this.brain.train(data.inputs, data.targets);
        console.log('training complete: ', (i / 5000) * 100);
      }

      console.log('training done');

      // console.log(this.brain.feedForward([0, 1]));
      // console.log(this.brain.feedForward([1, 0]));
      // console.log(this.brain.feedForward([0, 0]));
      // console.log(this.brain.feedForward([1, 1]));
    };

    this.p.mouseClicked = () => {
      const value = this.p.random(255);
      this.p.background(value);
      this.p.loadPixels();
      console.log(this.brain.feedForward(this.p.pixels), value / 255);
    };

    this.p.draw = () => {};
  }

  ngOnInit() {
    this.p5 = new p5(this.drawing.bind(this));
  }
}
