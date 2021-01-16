import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WebRTCStreamDirective } from '../../directives/webRTC-stream.directive';

@Component({
  selector: 'app-example-component',
  templateUrl: './example-component.component.html',
  styleUrls: ['./example-component.component.scss']
})
export class ExampleComponentComponent implements AfterViewInit {

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

  public take(): void {
    this.webRTCStream.take();
  }

  public record(): void {
    this.webRTCStream.record();
  }
}
