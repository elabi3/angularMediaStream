import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleComponentRoutingModule } from './example-component-routing.module';
import { ExampleComponentComponent } from './example-component.component';
import { WebRTCStreamModule } from '../../directives/webRTC-stream.module';

@NgModule({
  declarations: [ExampleComponentComponent],
  imports: [
    CommonModule,
    ExampleComponentRoutingModule,
    WebRTCStreamModule
  ]
})
export class ExampleComponentModule { }
