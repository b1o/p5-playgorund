import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NeuralNetworkRoutingModule } from './neural-network-routing.module';
import { PerceptronComponent } from './perceptron/perceptron.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NeuralNetworkRoutingModule
  ],
  declarations: [PerceptronComponent]
})
export class NeuralNetworkModule { }
