import Scene from '../lib/scene';

export default class ScenesWrapper {
    constructor(WBS) {
        this._WBS = WBS;
        this._scenes = [];
    }

    createScene() {
        let scene = new Scene(this._WBS);

        this._scenes.push(scene);
        this._WBS.addStageChild(scene);
        return scene;
    }

    getScene(sceneIndex) {
        return this._scenes[sceneIndex];
    }

    removeScene(sceneIndex) {
        this._scenes[sceneIndex].destroy();
        this._scenes.splice(sceneIndex, 1);
    }
}