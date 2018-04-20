import { Bird } from './bird';

export class GeneticAlgorith {
  constructor(private p, private birds: Bird[], private total) {

  }

  public nextGeneration(birds) {

    birds = this.caluclateFitness(birds);

    const newBirds= []
    for (let i = 0; i < birds.length; i++) {
      newBirds[i] = this.pickOne(birds);
    }
    return newBirds;
  }

  private pickOne(birds: Bird[]) {
    let index = 0;
    let r = this.p.random(1);

    while(r > 0) {
      r = r - birds[index].fitness;
      index++;
    }
    index--;
    const bird = birds[index];
    const child = bird.copy();
    return child;
  }

  private caluclateFitness(birds) {
    let sum = 0;
    for (const bird of birds) {
      // bird.score = this.p.pow(bird.score, 2);
      sum += bird.score;
    }

    for (const bird of birds) {
      bird.fitness = bird.score / sum;
    }
    console.log('avrg fitness', sum);
    return birds;
  }
}
