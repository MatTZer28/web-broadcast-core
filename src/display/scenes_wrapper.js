import Scene from '../lib/scene';

export default class ScenesWrapper {
    constructor(WBS) {
        this._WBS = WBS;
        
        this._scenes = [];
    }

    createScene(id) {
        const scene = new Scene(this._WBS, id);

        this._scenes.push(scene);

        return scene;
    }
    
    focusScene(id) {
        this._scenes.some((scene) => {
            if (scene.id === id) {
                this._WBS.clearStageChild();
                this._WBS.addStageChild(scene);
                return true;
            } else return false;
        });
    }

    getScenesLength() {
        return this._scenes.length;
    }

    getSceneByID(id) {
        let result_scene;

        this._scenes.some((scene) => {
            if (scene.id === id) {
                result_scene = scene;
                return true;
            } else return false;
        });

        return result_scene;
    }

    removeSceneByID(id) {
        this._scenes.some((scene) => {
            if (scene.id === id) {
                this._WBS.removeChild(scene);
                this._scenes.splice(this._scenes.indexOf(scene), 1);
                return true;
            } else return false;
        });
    }
}