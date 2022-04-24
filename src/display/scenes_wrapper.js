import Scene from '../lib/scene';

export default class ScenesWrapper {
    constructor(WBS) {
        this._WBS = WBS;
        
        this._scenes = [];
    }

    createScene(name) {
        const scene = new Scene(this._WBS, name);

        this._scenes.push(scene);
        this._WBS.addStageChild(scene);

        return scene;
    }

    getScenesLength() {
        return this._scenes.length;
    }

    getScene(sceneIndex) {
        return this._scenes[sceneIndex];
    }

    removeScene(sceneIndex) {
        this._scenes[sceneIndex].destroy();
        this._scenes.splice(sceneIndex, 1);
    }
}