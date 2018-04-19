import { Component } from '@angular/core';

declare var p5;

export class Particle {
  private pos;
  private vel;
  private acc;
  private maxSpeed = 4;
  private prevPos;
  private h = 0;
  private randomInc;

  constructor(public p) {
    this.pos = p.createVector(p.random(p.width), p.random(p.height));
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.prevPos = this.pos.copy();
    this.randomInc = this.p.random(10);
  }

  public update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.edges();
  }

  public applyForce(force) {
    this.acc.add(force);
  }

  public show() {
    this.p.stroke(this.h, 255, 255, 5);
    this.h ++;

    if (this.h > 200) {
      this.h = 0;
    }

    this.p.strokeWeight(1);
    this.p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    // this.p.point();

    this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
  }

  private edges() {
    if (this.pos.x > this.p.width) {
      this.pos.x = 0;
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;

    }

    if (this.pos.x < 0) {
      this.pos.x = this.p.width;
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }

    if (this.pos.y > this.p.height) {
      this.pos.y = 0;
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }

    if (this.pos.y < 0) {
      this.pos.y = this.p.height;
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }
  }
}
