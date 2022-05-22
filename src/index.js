import ScenesWrapper from './display/scenes_wrapper';
import StreamManager from './lib/utils/stream_manager';

import * as PIXI from 'pixi.js'

PIXI.utils.skipHello();

export class WebBroadcastSystem {
    constructor(settings) {
        this.appWidth = settings.width;

        this.appHeight = settings.height;

        this._setrequestAnimationFrame();
        
        this._pixiApp = this._createApplication();

        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this._initBackground();

        this._scenesWrapper = new ScenesWrapper(this);

        const stream_settings = {
            platform: settings.platform,
            stream_key: settings.stream_key,
            fps: settings.fps,
            vbps: settings.vbps,
            abps: settings.abps
        }

        this._streamManager = new StreamManager(this._pixiApp.view, stream_settings);
    }

    _setrequestAnimationFrame() {
        window.requestAnimationFrame = (callback) => {
            const worker = new Worker(new URL('./lib/utils/worker.js', import.meta.url));
            worker.postMessage('start');
            worker.onmessage = () => {
                callback();
                worker.terminate();
            };
        }
    }

    _createApplication() {
        return new PIXI.Application({
            width: this.appWidth,
            height: this.appHeight
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

    getStreamManager() {
        return this._streamManager;
    }

    addStageChild(child) {
        this._pixiApp.stage.addChild(child);
    }

    clearStageChild() {
        if (this._pixiApp.stage.children.length > 1) {
            this._pixiApp.stage.removeChild(this._pixiApp.stage.children[1]);
        }
    }

    removeStageChild(child) {
        if (this._pixiApp.stage.children.includes(child)) {
            this._pixiApp.stage.removeChild(child);
        }
    }

    setCursor(mode) {
        this._pixiApp.view.style.cursor = mode;
    }
}