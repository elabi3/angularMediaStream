import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { from, Observable } from 'rxjs';

/**
 * Wraps access to [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement),
 * exposing typed native element for:
 *
 * ```html
 *   <video></video>
 * ```
 *
 * in your component.ts
 *
 * ```ts
 *   ViewChild(HTMLVideoDirective)
 *   public htmlVideo: HTMLVideoDirective;
 *
 *   this.htmlVideo.element; // access to the element
 * ```
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
 * Wraps [webRTC MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
 * and plays camera content directly on html's video tag allowing to use native functionality like autoplay 
 * attribute to initilize it:
 *
 * ```html
 *   <video webRTCStream></video>
 * ```
 *
 * or:
 *
 * ```html
 *   <video autoplay webRTCStream></video>
 * ```
 *
 * in your component.ts
 *
 * ```ts
 *   ViewChild(WebRTCStreamDirective)
 *   public webRTCStream: WebRTCStreamDirective;
 *
 *   this.webRTCStream.play(); // play video from camera
 *   this.webRTCStream.pause(); // pause video
 * ```
 */
@Directive({
    selector: 'video[webRTCStream]'
})
export class WebRTCStreamDirective extends HTMLVideoDirective implements AfterViewInit {

    /**
     * Config is using [MediaStreamConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints)
     */
    @Input()
    public webRTCStream: MediaStreamConstraints;

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
            // No need to cancel subscription because when finish it's also completed
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

    public stop(): void { // TODO: not stops camera - review how to stop stream
        this.mStream = null;
        this.mediaStream.emit(null);
        this.element.pause();
        this.element.srcObject = null;
    }

    /**
     * Take pictures from the displaying video
     * @param config mixing of [toDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)
     * and [drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
     */
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


    // TODO: debug play, stop, pause
    // TODO: check perm change
    // TODO: debug take - verify
    // TODO: check if the output makes sense!