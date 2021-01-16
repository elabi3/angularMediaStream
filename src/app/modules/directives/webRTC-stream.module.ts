import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRTCStreamDirective } from './webRTC-stream.directive';

@NgModule({
    declarations: [
        WebRTCStreamDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [WebRTCStreamDirective]
})
export class WebRTCStreamModule { }
