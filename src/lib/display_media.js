export default class DisplayMedia {
    constructor() {
        this._displayMediaOptions = {
            video: {
              cursor: "always",
              frameRate: { ideal: 60, max: 60 }
            },
            audio: true
          };
        this._mediaStream = null;
    }

    async createMediaStream() {
      const mediaDevices = navigator.mediaDevices;

      this._mediaStream = await mediaDevices.getDisplayMedia(this._displayMediaOptions);
    }

    getHTMLVideo() {
      const video = document.createElement('video');

      video.srcObject = this._mediaStream;

      return video;
    }

    closeMediaStream() {
      const tracks = this._mediaStream.getTracks();
      
      tracks.forEach(track => track.stop());
    }
}