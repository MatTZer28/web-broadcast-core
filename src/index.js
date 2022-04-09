import ScenesWrapper from './display/scenes_wrapper';

import * as PIXI from 'pixi.js'

export class WebBroadcastSysten {
    constructor(appWidth, appHeight) {
        this.appWidth = appWidth;
        this.appHeight = appHeight;
        
        this._pixiApp = this._createApplication();

        this._background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this._initBackground();
        this._pixiApp.stage.addChild(this._background);
        
        this._scenesWrapper = new ScenesWrapper(this);
    }

    _createApplication() {
        return new PIXI.Application({
            width: this.appWidth,
            height: this.appHeight,
        });
    }

    _initBackground() {
        this._background.width = this.appWidth;
        this._background.height = this.appHeight;
        this._background.tint = 0xD7D7D6;
        this._background.interactive = true;
    }

    getApplicationView() {
        return this._pixiApp.view;
    }

    getScenesWrapper() {
        return this._scenesWrapper;
    }

    addStageChild(child) {
        this._pixiApp.stage.addChild(child);
    }

    getBackground() {
        return this._background;
    }

    setCursor(mode) {
        this._pixiApp.view.style.cursor = mode;
    }
}