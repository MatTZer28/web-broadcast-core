export default class DisplayMedia {
    constructor() {
        this._displayMediaOptions = {
            video: {
              cursor: "always",
              frameRate: { ideal: 60, max: 60 }
            },
            audio: true
          };
    }

    async createVideoTexture() { 
      const mediaDevices = navigator.mediaDevices;

      const videoElement = document.createElement('video');
      videoElement.srcObject = await mediaDevices.getDisplayMedia(this._displayMediaOptions);

      return videoElement;
    }

    closeMediaStream() {
      const tracks = this._mediaStream.getTracks();
      
      tracks.forEach(track => track.stop());
    }
}