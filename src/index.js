import Scenes from './display/scenes';

import * as PIXI from 'pixi.js'

export class WebBroadcastSysten {
    constructor(appWidth, appHeight) {
        this.pixiApp = new PIXI.Application({
            width: appWidth,
            height: appHeight,
        });
        this.scenes = new Scenes();
    }

    getApplicationView() {
        return this.pixiApp.view;
    }

    createScene() {
        this.scenes.createScene();
    }

    removeScene(sceneIndex) {
        this.scenes.removeScene(sceneIndex);
    }

    addSource(sceneIndex, sourceType) {
        this.scenes[sceneIndex].addSource(sourceType);
    }

    removeSource(sceneIndex, sourceIndex) {
        this.scenes[sceneIndex].removeSource(sourceIndex);
    }
}