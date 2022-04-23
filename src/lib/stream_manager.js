export default class StreamManager {
    constructor(canvas, fps, vbps, abps) {
        this._canvas = canvas;
        this._fps = fps;
        this._vbps = vbps;
        this._abps = abps;
    }

    startStreaming() {
        let mediaStream = this._canvas.captureStream(this._fps);

        let mediaRecorder = new MediaRecorder(
            mediaStream,
            {
                mimeType: 'video/webm;codecs=h264',
                videoBitsPerSecond: this._vbps,
                audioBitsPerSecond: this._abps
            }
        );

        mediaRecorder.addEventListener('dataavailable', (e) => {
            console.log(e.data);
        });
    }
}