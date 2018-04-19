import { Bird } from './bird';

export class GeneticAlgorith {
  constructor(private p, private birds, private total) {

  }

  public nextGeneration() {
    for (let i = 0; i < this.total; i++) {
      this.birds[i] = new Bird(this.p, this.p.random(this.p.width));
    }

    return this.birds;
  }
}
