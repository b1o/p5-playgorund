import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowFieldComponent } from './flow-field/flow-field.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', component: FlowFieldComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [FlowFieldComponent]
})
export class FlowFieldModule { }
