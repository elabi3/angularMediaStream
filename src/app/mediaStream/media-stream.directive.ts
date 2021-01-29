import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { EMPTY, from, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Comment this line if you're using @types/dom-mediacapture-record
declare const MediaRecorder: any;

/**
 * Wraps access to [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement) :
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
 * Wraps [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
 * playing content in <video></video>:
 *
 * ```html
 *   <video mediaStream></video>
 * ```
 *
 * usign autoplay
 *
 * ```html
 *   <video autoplay mediaStream></video>
 * ```
 *
 * in your component.ts
 *
 * ```ts
 *   ViewChild(MediaStreamDirective)
 *   public mediaStream: MediaStreamDirective;
 *
 *   this.mediaStream.play(); // play video from camera
 * ```
 */
@Directive({
    selector: 'video[mediaStream]'
})
export class MediaStreamDirective extends HTMLVideoDirective implements AfterViewInit {

    /**
     * config is using [MediaStreamConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints)
     */
    @Input('mediaStream')
    public config: MediaStreamConstraints;

    /**
     * DOMException - MediaStream has no perm to start
     * ReferenceError - MediaRecorder is not available on browser
     */
    @Output()
    public intitError: EventEmitter<DOMException | ReferenceError> = new EventEmitter();

    @Output()
    public mediaStreamRef: EventEmitter<MediaStream> = new EventEmitter();

    @Output()
    public videoRecorded: EventEmitter<Blob> = new EventEmitter();

    private readonly mediaDevices: MediaDevices = navigator.mediaDevices;
    private readonly document: Document = document;
    private mediaRecorder: typeof MediaRecorder;
    private mediaStream: MediaStream;

    constructor(elRef: ElementRef, private ngZone: NgZone) {
        super(elRef);
    }

    ngAfterViewInit(): void {
        if (this.element.autoplay) {
            this.play();
        }
    }

    public play(): void {
        if (!this.mediaStream) {
            this.userMediaObs(this.config)
                .pipe(
                    catchError(err => {
                        this.intitError.emit(err);
                        return EMPTY;
                    })
                )
                .subscribe(stream => { // No need to cancel subscription because will complete
                    this.mediaStream = stream;
                    this.mediaStreamRef.emit(this.mediaStream);
                    this.play(); // Recursive call to assing video stream
                });
            return;
        }
        if (!this.element.srcObject) {
            this.element.srcObject = this.mediaStream;
        }
        this.element.play();
    }

    public pause(): void {
        this.element.pause();
    }

    public stop(): void {
        // Stop camera devices streaming
        this.mediaStream?.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
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
        canvas.width = config?.width || this.element.offsetWidth;
        canvas.height = config?.height || this.element.offsetHeight;
        canvas.getContext('2d').drawImage(this.element, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL(config?.type, config?.encoderOptions);
    }

    /**
     * This method is using a native APIs:
     * (MediaRecorder)[https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder]
     */
    public recordStart(): void {
        if (this.mediaRecorder || !this.mediaStream) {
            return;
        }
        try {
            this.mediaRecorder = new MediaRecorder(this.mediaStream);
        } catch (err) {
            this.intitError.emit(err);
        }
        this.mediaRecorder.ondataavailable = event => {
            const blob = event.data;
            if (blob?.size > 0) {
                this.ngZone.run(() => this.videoRecorded.emit(blob));
            }
        };
        this.mediaRecorder.start();
    }

    public recordStop(): void {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
            return;
        }
        this.mediaRecorder.stop(); // Fires ondataavailable's event
    }

    private userMediaObs(config: MediaStreamConstraints): Observable<MediaStream> {
        return from(this.mediaDevices.getUserMedia({
            ...{ video: true, audio: false }, // Default config
            ...config
        }));
    }
}
