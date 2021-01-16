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
 * Camera configuration for WebRTCStreamDirective
 */
export interface WebRTCStreamConfig {
    video: boolean;
    audio: boolean;
}

// TODO: verify ready
@Directive({
    selector: 'video[webRTCStream]'
})
export class WebRTCStreamDirective extends HTMLVideoDirective {

    // TODO: prepare for changes and reload camera
    @Input()
    public webRTCStream: WebRTCStreamConfig;

    private readonly mediaDevices: MediaDevices = navigator.mediaDevices;
    private readonly document: Document = document;

    // TODO: verify lifeCycle of Directive and remove it
    private mediaStream: Observable<MediaStream>;

    constructor(elRef: ElementRef) {
        super(elRef);
    }

    // TODO: loading & perm-error & return stream??
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
    }

    // TODO: stop and remove everything
    public stop(): void {

    }

    // TODO: destroy canvas & improve code && check zone
    public take(width: number = 1024, height: number = 768): string {
        const canvas: HTMLCanvasElement = this.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(this.element, 0, 0, width, height);
        return canvas.toDataURL('image/png');
    }

    // TODO: start & stop? check zone & return stream??
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
