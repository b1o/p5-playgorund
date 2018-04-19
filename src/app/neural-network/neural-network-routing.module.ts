import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerceptronComponent } from './perceptron/perceptron.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'perceptron'},
  { path: 'perceptron', component: PerceptronComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeuralNetworkRoutingModule { }
