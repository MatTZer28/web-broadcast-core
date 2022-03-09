import Scenes from './src/display/scenes';

import * as PIXI from 'pixi.js'

class WebBroadcastSysten {
    constructor(targetDOM) {
        this.pixiApp = new PIXI.Application();
        appendPIXIAppToTargetDOM(targetDOM);

        this.scenes = new Scenes();
    }

    appendPIXIAppToTargetDOM(targetDOM) {
        targetDOM.appendChild(this.pixiApp);
    }

    createScene() {
        this.scenes.createScene();
    }

    addSource(selectedSceneIndex, selectedSourceType) {
        
        this.scenes[selectedSceneIndex].addSource();
    }
}