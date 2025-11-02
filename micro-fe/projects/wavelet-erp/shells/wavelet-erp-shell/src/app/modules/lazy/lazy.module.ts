import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondComponent } from './second/second.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SecondComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [SecondComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: [SecondComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LazyModule { }
