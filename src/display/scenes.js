import Scene from '../lib/scene';

export default class Scenes {
    constructor() {
        this.scenes = [];
    }

    createScene() {
        this.scenes.push(new Scene());
    }

    removeScene(sceneIndex) {
        this.sources.splice(sceneIndex, 1);
    }
}