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

    async createMediaStream() { 
      const mediaDevices = navigator.mediaDevices;

      const mediaStream = await mediaDevices.getDisplayMedia(this._displayMediaOptions);
      
      return mediaStream;
    }

    closeMediaStream() {
      const tracks = this._mediaStream.getTracks();
      
      tracks.forEach(track => track.stop());
    }
}