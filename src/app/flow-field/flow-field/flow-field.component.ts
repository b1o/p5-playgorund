import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Particle } from './particle';

declare var p5;

@Component({
  selector: 'app-flow-field',
  templateUrl: './flow-field.component.html',
  styleUrls: ['./flow-field.component.css']
})
export class FlowFieldComponent implements OnInit {

  private p5;
  private p;

  public inc = 0.1;
  public scale = 10;
  public cols;
  public rows;

  public framerate;
  public zOff = 0;

  private particles = [];
  private flowField = [];

  constructor(private cd: ChangeDetectorRef) {
    this.cd.detach();
  }

  ngOnInit() {
    this.p5 = new p5(this.drawing.bind(this));
    console.log(this.p5);
  }

  private drawing(p) {
    this.p = p;
    this.p.setup = () => {
      this.p.createCanvas(window.innerWidth, window.innerHeight);
      this.p.colorMode(this.p.HSB, 100);
      this.p.background(0);
      this.cols = this.p.floor(this.p.width / this.scale);
      this.rows = this.p.floor(this.p.height / this.scale);

      this.flowField = new Array(this.cols * this.rows);

      for (let i = 0; i < 2000; i++) {
        this.particles[i] = new Particle(this.p);
      }
    };

    this.p.draw = this.drawFunc.bind(this);
  }

  public drawNoise() {
    // this.p.background(255);
    let yOff = 0;
    for (let y = 0; y <= this.rows; y++) {
      let xOff = 0;
      for (let x = 0; x <= this.cols; x++) {
        const index = x + y * this.cols;
        const angle = this.p.noise(xOff, yOff, this.zOff) * this.p.TWO_PI;
        const v = p5.Vector.fromAngle(angle);
        v.setMag(0.4);
        this.flowField[index] = v;

        xOff += this.inc;
        // this.p.stroke(0, 50);
        // this.p.push();
        // this.p.translate(x * this.scale, y * this.scale);
        // this.p.rotate(v.heading());
        // this.p.strokeWeight(1);
        // this.p.line(0, 0, this.scale, 0);
        // this.p.pop();
      }
      yOff += this.inc;

      this.zOff += 0.0003;
    }

    for (const particle of this.particles) {
      const x = this.p.floor(particle.pos.x / this.scale);
      const y = this.p.floor(particle.pos.y / this.scale);

      const index = x + y * this.cols;
      particle.applyForce(this.flowField[index]);
      particle.update();
      particle.show();
    }
  }

  private drawFunc(p) {
    this.drawNoise();
  }
}
