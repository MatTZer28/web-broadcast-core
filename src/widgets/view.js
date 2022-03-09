export default class View {
    constructor(video, videoContainer) {
        this.video = video;
        this.videoContainer = videoContainer;
    }

    addMovableObject(element) {
        this.videoContainer.appendChild(element);
    }

    setVideoStream(videoStream) {
        this.video.srcObject = videoStream;
    }
}