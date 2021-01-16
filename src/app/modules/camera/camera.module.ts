import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './camera.component';



@NgModule({
  declarations: [CameraComponent],
  imports: [
    CommonModule
  ],
  exports: [CameraComponent]
})
export class CameraModule { }
