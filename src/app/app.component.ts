import { Component, ViewChild } from '@angular/core';
import { MediaStreamDirective } from './mediaStream/media-stream.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(MediaStreamDirective)
  public mediaStream: MediaStreamDirective;

  public picSrc: string;

  constructor() { }

  public onVideo(data: [Blob, ArrayBuffer]) {
    console.log(data);
  }

}

// TODO: add demo video player
// TODO: check rebase