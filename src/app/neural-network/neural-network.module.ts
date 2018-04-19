import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeuralNetworkRoutingModule } from './neural-network-routing.module';
import { PerceptronComponent } from './perceptron/perceptron.component';

@NgModule({
  imports: [
    CommonModule,
    NeuralNetworkRoutingModule
  ],
  declarations: [PerceptronComponent]
})
export class NeuralNetworkModule { }
