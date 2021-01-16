import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'e3-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraComponent implements AfterViewInit {

  @Input()
  public config: CameraConfiguration;

  // TODO: make type check here and create a directive for it
  @ViewChild('videoHolder')
  public set mainVideoEl(el: ElementRef) {
    this.videoHolder = el.nativeElement;
  }

  private videoHolder: HTMLVideoElement;

  constructor() { }

  ngAfterViewInit(): void {
    // TODO: autoplay, verify permissions

    this.startCamera();
  }


  private startCamera(): void {
    userMediaObs(this.config?.stream)
      .subscribe(stream => {
        this.videoHolder.srcObject = stream;
        this.videoHolder.play();
      });
  }

  private pauseCamera(): void {
    this.videoHolder.pause();
  }

  private takePic(): void {

  }

  private recordVideo(): void {

  }

}


export interface CameraConfiguration {
  stream: StreamingConfig;
}

export interface StreamingConfig {
  video: boolean;
  audio: boolean;
}




function userMediaPromise(config: StreamingConfig): Promise<MediaStream> {
  return navigator.mediaDevices
    .getUserMedia({
      ...{ video: true, audio: false },
      ...config
    });
}

function userMediaObs(config: StreamingConfig): Observable<MediaStream> {
  return from(userMediaPromise(config));
}
