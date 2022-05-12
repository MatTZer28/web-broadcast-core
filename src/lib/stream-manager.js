export class StreamManager {
    constructor(canvas, fps, vbps, abps) {
        this._canvas = canvas;

        this._fps = fps;

        this._vbps = vbps;

        this._abps = abps;

        this._recorder = new MediaRecorder(
            this._canvas.captureStream(this._fps),
            {
                mimeType: 'video/webm;codecs=h264',
                videoBitsPerSecond: this._vbps,
                audioBitsPerSecond: this._abps
            }
        );
    }

    startRecording() {
        this._recorder.start();
    }

    stopRecording() {
        this._recorder.stop();
    }

    getRecorder() {
        return this._recorder;
    }
}