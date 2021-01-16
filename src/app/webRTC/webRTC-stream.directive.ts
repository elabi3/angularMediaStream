import { Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';

/**
 * Wraps access to HTMLVideoElement, exposing typed native element
 *
 * component.html:
 *   <video></video>
 *
 * component.ts:
 *   @ViewChild(HTMLVideoDirective)
 *   public htmlVideo: HTMLVideoDirective;
 *
 *   this.htmlVideo.element; // access to the element
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

// TODO: debug play, stop, pause
// TODO: check zone
// TODO: check if the output makes sense
@Directive({
    selector: 'video[webRTCStream]'
})
export class WebRTCStreamDirective extends HTMLVideoDirective implements OnDestroy {

    @Input()
    public webRTCStream: MediaStreamConstraints;

    @Input()
    public autoPlay: boolean;

    @Output()
    public mediaStream: EventEmitter<MediaStream> = new EventEmitter();

    private readonly mediaDevices: MediaDevices = navigator.mediaDevices;
    private readonly document: Document = document;
    private mediaStreamSubs: Subscription;

    constructor(elRef: ElementRef) {
        super(elRef);
    }

    ngOnDestroy(): void {
        this.stop();
    }

    public play(): void {
        if (!this.mediaStreamSubs) {
            this.mediaStreamSubs = this.userMediaObs(this.webRTCStream).subscribe(stream => {
                this.element.srcObject = stream;
                this.mediaStream.emit(stream);
                this.element.play();
            });
        }
        if (this.element.paused) {
            this.element.play();
        }
    }

    public pause(): void {
        if (!this.mediaStreamSubs || !this.element.played) {
            return;
        }
        this.element.pause();
    }

    public stop(): void {
        if (!this.mediaStreamSubs) {
            return;
        }
        this.mediaStreamSubs.unsubscribe();
        this.mediaStreamSubs = null;
        this.element.pause();
        this.element.srcObject = null;
    }

    public take(config?: {
        width?: number,
        height?: number,
        type?: string,
        encoderOptions?: number
    }): string {
        const canvas: HTMLCanvasElement = this.document.createElement('canvas');
        canvas.width = config?.width || 1024;
        canvas.height = config?.height || 768;
        canvas.getContext('2d').drawImage(this.element, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL(config?.type, config?.encoderOptions);
    }

    // TODO: start & stop? check zone & return stream??
    public record(): void {

    }

    private userMediaObs(config: MediaStreamConstraints): Observable<MediaStream> {
        return from(this.mediaDevices.getUserMedia({
            ...{ video: true, audio: false },
            ...config
        }));
    }
}
