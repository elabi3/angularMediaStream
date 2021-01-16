import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExampleComponentComponent } from './example-component.component';

const routes: Routes = [{ path: '', component: ExampleComponentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExampleComponentRoutingModule { }
