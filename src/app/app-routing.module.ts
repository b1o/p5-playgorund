import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'nn',
    loadChildren: 'app/neural-network/neural-network.module#NeuralNetworkModule'
  },
  {
    path: 'flow-field',
    loadChildren: 'app/flow-field/flow-field.module#FlowFieldModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
