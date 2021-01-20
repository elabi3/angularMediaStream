import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaStreamDirective } from './media-stream.directive';

@NgModule({
    declarations: [
        MediaStreamDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [MediaStreamDirective]
})
export class MediaStreamModule { }
