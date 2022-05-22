export default class StreamManager {
    constructor(canvas, stream_settings) {
        this._canvas = canvas;

        this._platform = stream_settings.platform;

        this._stream_key = stream_settings.stream_key;

        this._createStreamURL();

        this._fps = stream_settings.fps;

        this._vbps = stream_settings.vbps;

        this._abps = stream_settings.abps;

        this._mediaStream = null;

        this._recorder = null;

        this._ws = null;

        this._isStartRecording = false;

        this._isStartStreaming = false;
    }

    _createStreamURL() {
        switch (this._platform.toLowerCase()) {
            case 'youtube':
                this._streamURL = 'rtmp://a.rtmp.youtube.com/live2' + '/' + this._stream_key;
                break;
            case 'twitch':
                this._streamURL = 'rtmp://tpe03.contribute.live-video.net/app' + '/' + this._stream_key;
                break;
            default:
                this._streamURL = null;
                break;
        }
    }

    startRecording() {
        this._mediaStream = this._canvas.captureStream(this._fps);

        this._recorder = new MediaRecorder(
            this._mediaStream,
            {
                mimeType: 'video/webm;codecs=h264',
                videoBitsPerSecond: this._vbps,
                audioBitsPerSecond: this._abps
            }
        );

        this._recorder.start();

        this._isStartRecording = true;
    }

    stopRecording() {
        if (!this._isStartRecording) return new Promise((resolve) => resolve(document.createElement('video')));
        
        this._recorder.stop();

        this._mediaStream = null;

        this._recorder = null;

        this._isStartRecording = false;

        return new Promise((resolve) => {
            this._recorder.addEventListener('dataavailable', (event) => {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(event.data);
                resolve(video);
            });
        });
    }

    getRecordedFile() {
        this._recorder.addEventListener('dataavailable', (event) => {
            call(event);
        });
    }

    startStreaming() {
        if (this._stream_key === null) return;

        this._mediaStream = this._canvas.captureStream(this._fps);

        this._recorder = new MediaRecorder(
            this._mediaStream,
            {
                mimeType: 'video/webm;codecs=h264',
                videoBitsPerSecond: this._vbps,
                audioBitsPerSecond: this._abps
            }
        );

        const wsUrl = window.location.protocol.replace('http', 'ws') + '//' + window.location.hostname + ':3000' + '/rtmp/' + encodeURIComponent(this._streamURL);

        const ws = new WebSocket(wsUrl);

        ws.addEventListener('open', () => {
            this._recorder.start();

            this._isStartStreaming = true;
        });

        const interval = setInterval(() => {
            if (this._recorder.state === 'inactive') {
                clearInterval(interval);
                return;
            }

            this._recorder.requestData();
        }, 1000);

        this._recorder.addEventListener('dataavailable', (event) => {
            ws.send(event.data);
        })

        this._recorder.addEventListener('stop', () => {
            clearInterval(interval);

            ws.close();

            this._mediaStream = null;

            this._recorder = null;
        });
    }

    stopStreaming() {
        if (this._stream_key === null || !this._isStartStreaming) return;

        this._recorder.stop();

        this._isStartStreaming = false;
    }
}