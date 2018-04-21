import { Bird } from './bird';
import { NeuralNetwork } from './neural-network';

export class GeneticAlgorith {
  public currentBestAvrgFitness = 0;
  public currentBestGeneration: Array<Bird>;
  public generationsCount = 0;
  public maxGenerationsWithNoImprovement = 20;
  public generationsSinceBestOne = 0;

  constructor(private p, private birds: Bird[], private total) {}

  public nextGeneration(birds) {
    this.generationsCount++;

    birds = this.caluclateFitness(birds);

    const newBirds = [];
    for (let i = 0; i < birds.length; i++) {
      newBirds[i] = this.pickOne(birds);
    }
    return newBirds;
  }

  private pickOne(birds: Bird[]) {
    let index = 0;
    let r = this.p.random(1);

    while (r > 0) {
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
      bird.score = this.p.pow(bird.score, 2);
      sum += bird.score;
    }

    for (const bird of birds) {
      bird.fitness = bird.score / sum;
    }

    let birdsToReturn;

    if (sum > this.currentBestAvrgFitness) {
      this.currentBestAvrgFitness = sum;
      this.currentBestGeneration = birds;
      console.log('new best', this.currentBestGeneration);
      this.generationsSinceBestOne = 0;
    }

    birdsToReturn = birds;

    console.log('best avrg fitness', this.currentBestAvrgFitness / this.currentBestGeneration.length);
    console.log('current avrg fitness', sum / birds.length);

    return birdsToReturn;
  }
}
