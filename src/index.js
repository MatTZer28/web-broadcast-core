import ScenesWrapper from './display/scenes_wrapper';
import StreamManager from './lib/stream_manager';

import * as PIXI from 'pixi.js'

export class WebBroadcastSystem {
    constructor(appWidth, appHeight) {
        this.appWidth = appWidth;

        this.appHeight = appHeight;
        
        this._pixiApp = this._createApplication();
        this._offTabRunning();

        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this._initBackground();
        
        this._scenesWrapper = new ScenesWrapper(this);

        this._streamManager = new StreamManager(this._pixiApp.view, 60, 5971968, 160000);

        // this._streamManager.startRecording();

        // setTimeout(async () => {
        //     this._streamManager.stopRecording();

        //     this._streamManager.getRecorder().addEventListener('dataavailable', (e) => {
        //         let video = document.querySelector('video');

        //         let videoUrl = window.URL.createObjectURL(e.data);

        //         video.src = videoUrl;
        //     });
        // }, 10000);
    }

    _createApplication() {
        return new PIXI.Application({
            width: this.appWidth,
            height: this.appHeight
        });
    }

    _offTabRunning() {
        let worker = new Worker(new URL('./lib/offscreen_worker.js', import.meta.url));

        let ticker = this._pixiApp.ticker;

        let renderer = this._pixiApp.renderer;

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState == "hidden") {
                ticker.stop();
                worker.postMessage('start');
            } else {
                worker.postMessage('stop');
                ticker.start();
            }
        });

        worker.addEventListener('message', (e) => {
            console.log(new Date().toLocaleTimeString());
            ticker.update();
            renderer.render(this._pixiApp.stage);
        });
    }

    _initBackground() {
        this.background.width = this.appWidth;
        this.background.height = this.appHeight;
        this.background.tint = 0xD7D7D6;
        this.background.interactive = true;
        this._pixiApp.stage.addChild(this.background);
    }

    getApplicationView() {
        return this._pixiApp.view;
    }
    
    getApplication() {
        return this._pixiApp;
    }

    getScenesWrapper() {
        return this._scenesWrapper;
    }

    addStageChild(child) {
        this._pixiApp.stage.addChild(child);
    }

    setCursor(mode) {
        this._pixiApp.view.style.cursor = mode;
    }
}