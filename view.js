class View {
    constructor() {
        this.video = initVideo();
        this.videoContainer = document.createElement('div');
        this.videoContainer.appendChild(this.video);
    }

    initVideo() {
        let video = document.createElement("video");
        video.setAttribute("autoplay", true);
        video.setAttribute("muted", true);
        video.setAttribute("height", "100%");
        return video;
    }

    addMovableObject(element) {
        this.video.appendChild(element);
    }

    setVideoStream(videoStream) {
        this.video.srcObject = videoStream;
    }

    getVideoContainer() {
        return this.videoContainer;
    }
}