export default class StreamManager {
    constructor(canvas, fps, vbps, abps) {
        this._canvas = canvas;

        this._fps = fps;

        this._vbps = vbps;

        this._abps = abps;

        this._mediaStream = this._canvas.captureStream(this._fps);

        this._recorder = new MediaRecorder(
            this._mediaStream,
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

    dataAvailable(call) {
        this._recorder.addEventListener('dataavailable', (event) => {
            call(event);
        });
    }
}