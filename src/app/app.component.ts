import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebRTCStreamDirective } from './webRTC/webRTC-stream.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(WebRTCStreamDirective)
  public webRTCStream: WebRTCStreamDirective;

  public picSrc: string;

  constructor() { }

}

// TODO: add demo video player
// TODO: update to a10