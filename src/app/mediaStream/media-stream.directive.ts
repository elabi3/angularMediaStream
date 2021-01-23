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
 * Wraps [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
 * and plays camera content directly on html's video tag allowing to use native functionality like autoplay
 * attribute to initilize it:
 *
 * ```html
 *   <video mediaStream></video>
 * ```
 *
 * or
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
 *   this.mediaStream.pause(); // pause video
 * ```
 */
@Directive({
    selector: 'video[mediaStream]'
})
export class MediaStreamDirective extends HTMLVideoDirective implements AfterViewInit {

    /**
     * mediaStream config is using [MediaStreamConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints)
     */
    @Input()
    public mediaStream: MediaStreamConstraints;

    @Output()
    public videoRecorded: EventEmitter<[Blob, ArrayBuffer]> = new EventEmitter();

    private readonly mediaDevices: MediaDevices = navigator.mediaDevices;
    private readonly document: Document = document;
    private mediaRecorder: MediaRecorder;
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
            this.userMediaObs(this.mediaStream).subscribe(stream => { // TODO: verify obs completed and add note
                this.mStream = stream;
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
        // Stop camera devices streaming
        this.mStream.getTracks().forEach(track => track.stop());
        this.mStream = null;
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
     * This meethod is using a couple of native APIs:
     *
     * (MediaRecorder)[https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder]
     * (FileReader)[https://developer.mozilla.org/en-US/docs/Web/API/FileReader]
     */
    public recordStart(): void | never {
        if (this.mediaRecorder) {
            return;
        }

        // If API is not available this will throw an error
        this.mediaRecorder = new MediaRecorder(this.mStream);

        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
            const blob = event.data;
            if (blob?.size <= 0) {
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                // The contents of the BLOB are in reader.result:
                this.videoRecorded.emit([blob, reader.result as ArrayBuffer]);
            };
            reader.readAsArrayBuffer(blob);
        };
        this.mediaRecorder.start();
    }

    public recordStop(): void {
        if (!this.mediaRecorder) {
            return;
        }
        this.mediaRecorder.stop(); // Fires ondataavailable's event
    }

    private userMediaObs(config: MediaStreamConstraints): Observable<MediaStream> {
        return from(this.mediaDevices.getUserMedia({
            // Default config in case nothing is provided
            ...{ video: true, audio: false },
            ...config
        }));
    }
}
     
    // Expose mediaStream or make it public
    // TODO: check perm change
    // TODO: review how to throw error or verify is MediaRecorder is availble - probably expose a method that checks
