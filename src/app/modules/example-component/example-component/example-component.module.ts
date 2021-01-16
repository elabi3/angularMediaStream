import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExampleComponentRoutingModule } from './example-component-routing.module';
import { ExampleComponentComponent } from './example-component.component';
import { CameraModule } from '../../camera/camera.module';


@NgModule({
  declarations: [ExampleComponentComponent],
  imports: [
    CommonModule,
    ExampleComponentRoutingModule,
    CameraModule
  ]
})
export class ExampleComponentModule { }
