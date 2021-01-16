import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { WebRTCStreamDirective } from './webRTC/webRTC-stream.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild(WebRTCStreamDirective)
  public webRTCStream: WebRTCStreamDirective;

  constructor() { }

  ngAfterViewInit(): void { }

  public start(): void {
    this.webRTCStream.start();
  }

  public pause(): void {
    this.webRTCStream.pause();
  }

  public stop(): void {
    this.webRTCStream.stop();
  }

  public take(): void {
    const pic = this.webRTCStream.take();
    console.log(pic);
  }

  public record(): void {
    this.webRTCStream.record();
  }
}

// TODO: add demo pic for take
// TODO: add demo video player
