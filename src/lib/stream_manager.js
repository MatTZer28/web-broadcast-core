import * as FFmpeg from "@ffmpeg/ffmpeg"

export default class StreamManager {
    constructor(canvas, fps, vbps, abps) {
        this._canvas = canvas;

        this._fps = fps;

        this._vbps = vbps;

        this._abps = abps;

        this._ffmpeg = FFmpeg.createFFmpeg({
            corePath: "http://localhost:8080/public/ffmpeg-core.js",
            log: true
        });
    }

    async startStreaming() {
        await this._ffmpeg.load();

        let mediaStream = this._canvas.captureStream(this._fps);

        let mediaRecorder = new MediaRecorder(
            mediaStream,
            {
                mimeType: 'video/webm;codecs=h264',
                videoBitsPerSecond: this._vbps,
                audioBitsPerSecond: this._abps
            }
        );

        mediaRecorder.addEventListener('dataavailable', async (e) => {
            this._ffmpeg.FS('writeFile', 'video.webm', await FFmpeg.fetchFile(e.data));
            await this._ffmpeg.run('-i', 'video.webm', '-vcodec', 'copy', '-acodec', 'aac', '-f', 'flv', 'rtmp://a.rtmp.youtube.com/live2');
        });

        // mediaRecorder.start(1000);
    }
}