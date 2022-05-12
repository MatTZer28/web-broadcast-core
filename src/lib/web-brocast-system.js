const { ScenesWrapper } = require('../display/scenes-wrapper');

const PIXI = require('pixi.js');

export class WebBroadcastSystem {
    constructor(canvas, appWidth, appHeight) {
        this.canvas = canvas;

        this.appWidth = appWidth;

        this.appHeight = appHeight;
        
        this._pixiApp = this._createApplication();

        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this._initBackground();
        
        this._scenesWrapper = new ScenesWrapper(this);
    }

    _createApplication() {
        return new PIXI.Application({
            width: this.appWidth,
            height: this.appHeight,
            backgroundColor: 0xffffff,
            clearBeforeRender: true,
            backgroundAlpha: 0,
            antialias: true,
            view: this.canvas
        });
    }

    _initBackground() {
        this.background.width = this.appWidth;
        this.background.height = this.appHeight;
        this.background.tint = 0xD7D7D6;
        this.background.interactive = true;
        this._pixiApp.stage.addChild(this.background);
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

    removeStageChild(child) {
        this._pixiApp.stage.removeChild(child);
    }

    setCursor(mode) {
        this._pixiApp.view.style.cursor = mode;
    }
}