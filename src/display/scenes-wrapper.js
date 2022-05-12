const { Scene } = require('../lib/scene');

export class ScenesWrapper {
    constructor(WBS) {
        this._WBS = WBS;
        
        this._scenes = [];

        this._selectedSceneIndex = null;
    }

    createScene() {
        if (this._selectedSceneIndex !== null) {
            this._WBS.removeStageChild(this._scenes[this._selectedSceneIndex]);
        }

        const scene = new Scene(this._WBS);

        this._scenes.push(scene);
        this._WBS.addStageChild(scene);

        this._selectedSceneIndex = this._scenes.indexOf(scene);
    }

    selectScene(sceneIndex) {
        this._WBS.removeStageChild(this._scenes[this._selectedSceneIndex]);

        this._WBS.addStageChild(this._scenes[sceneIndex]);

        this._selectedSceneIndex = sceneIndex;
    }

    getSelectedScene() {
        return this._scenes[this._selectedSceneIndex];
    }

    getScenesLength() {
        return this._scenes.length;
    }

    removeScene(sceneIndex) {
        this._scenes[sceneIndex].destroy();
        this._scenes.splice(sceneIndex, 1);
    }
}