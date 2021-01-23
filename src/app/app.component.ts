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

  public record(): void {
    this.mediaStream.recordStart();
  }

  public onVideo(data: [Blob, ArrayBuffer]): void {
    console.log(data);
  }

  public onError(err: DOMException | ReferenceError): void {
    if (err instanceof DOMException) {
      alert('Impossible to instanciate MediaStream' + err);
    } else {
      alert('Impossible to instanciate MediaRecorder' + err);
    }
  }

}

// TODO: add demo video player
// TODO: check rebase