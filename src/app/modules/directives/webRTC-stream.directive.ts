import { Directive, ElementRef, Input } from '@angular/core';
import { from, Observable } from 'rxjs';

/**
 * This directive wrap the access to HTMLVideoElement
 * from a video tag exposing the native element
 *
 * component.html:
 * <video></video>
 *
 * component.ts:
 * @ViewChild(HTMLVideoDirective)
 * public htmlVideo: HTMLVideoDirective;
 *
 * this.htmlVideo.element;
 */
@Directive({
    selector: 'video'
})
export class HTMLVideoDirective {

    public element: HTMLVideoElement;

    constructor(elRef: ElementRef) {
        this.element = elRef.nativeElement;
    }

}

/**
 * Camera configuration for WebRTC
 */
export interface WebRTCStreamConfig {
    video: boolean;
    audio: boolean;
}

@Directive({
    selector: 'video[webRTCStream]'
})
export class WebRTCStreamDirective extends HTMLVideoDirective {

    // TODO: prepare for changes and reload camera
    @Input()
    public webRTCStream: WebRTCStreamConfig;

    private readonly mediaDevices: MediaDevices = navigator.mediaDevices;

    // TODO: verify lifeCycle of Directive and remove it
    private mediaStream: Observable<MediaStream>;

    constructor(
        elRef: ElementRef
    ) {
        super(elRef);
    }

    // TODO: loading & perm-error
    public start(): void {
        if (!this.mediaStream) {
            this.mediaStream = this.userMediaObs(this.webRTCStream);
        }
        // TODO: be careful with multiple subscriptions
        this.mediaStream
            .subscribe(stream => {
                this.element.srcObject = stream;
                this.element.play();
            });
    }

    // TODO: check if it is playing
    public pause(): void {
        this.element.pause();
        this.element.srcObject = null;
    }

    // TODO: return the pic
    public take(): void {

    }

    public record(): void {

    }

    private userMediaObs(config: WebRTCStreamConfig): Observable<MediaStream> {
        return from(
            this.mediaDevices.getUserMedia({
                ...{ video: true, audio: false },
                ...config
            })
        );
    }

}
