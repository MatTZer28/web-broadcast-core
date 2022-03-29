import Source from "../lib/source";

export default class SourcesWrapper {
    constructor(WBS, parentScene) {
        this._WBS = WBS;
        this._parentScene = parentScene;
        this._sources = [];
    }

    addSource(sourceType, sourcePath) {
        let source = new Source(this._WBS, sourceType, sourcePath);

        this._sources.push(source);
        this._parentScene.addSourceChild(source.getSource());
    }

    getSource(sourceIndex) {
        return this._sources[sourceIndex];
    }

    removeSource(sourceIndex) {
        this._sources[sourceIndex].destroy();
        this._sources.splice(sourceIndex, 1);
    }
}