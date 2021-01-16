import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { from, Observable } from 'rxjs';

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
// TODO: debug take
// TODO: check if the output makes sense
@Directive({
    selector: 'video[webRTCStream]'
})
export class WebRTCStreamDirective extends HTMLVideoDirective implements AfterViewInit {

    @Input()
    public webRTCStream: MediaStreamConstraints;

    @Input()
    public autoPlay: boolean;

    @Output()
    public mediaStream: EventEmitter<MediaStream> = new EventEmitter();

    private readonly mediaDevices: MediaDevices = navigator.mediaDevices;
    private readonly document: Document = document;
    private mStream: MediaStream;

    constructor(elRef: ElementRef) {
        super(elRef);
    }

    ngAfterViewInit(): void {
        if (this.element.autoplay) {
            this.play();
        }
    }

    public play(): void {
        if (!this.mStream) {
            this.userMediaObs(this.webRTCStream).subscribe(stream => { // TODO: verify obs completed and add note
                this.mStream = stream;
                this.mediaStream.emit(stream);
                this.play();
            });
            return;
        }
        if (!this.element.srcObject) {
            this.element.srcObject = this.mStream;
        }
        this.element.play();
    }

    public pause(): void {
        this.element.pause();
    }

    public stop(): void {
        this.mStream = null;
        this.mediaStream.emit(null);
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

    // TODO: start & stop? check zone & return bytes or stream??
    public record(): void {

    }

    private userMediaObs(config: MediaStreamConstraints): Observable<MediaStream> {
        return from(this.mediaDevices.getUserMedia({
            ...{ video: true, audio: false },
            ...config
        }));
    }
}
