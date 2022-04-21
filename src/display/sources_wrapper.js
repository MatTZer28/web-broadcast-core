import Source from "../lib/source";
import FocusBox from "../lib/focus_box";

export default class SourcesWrapper {
    constructor(WBS, parentScene) {
        this._WBS = WBS;

        this._parentScene = parentScene;

        this._sources = [];

        this.focusBox = new FocusBox(this._WBS);
        this.focusBox.zIndex = 2;

        this._parentScene.addChild(this.focusBox);
    }

    async addSource(sourceType, sourcePath) {
        const source = new Source(this._WBS, sourceType, sourcePath, this);

        await source.init();

        this._sources.push(source);
        this._parentScene.addChild(source.getTexture());
    }

    getSource(sourceIndex) {
        return this._sources[sourceIndex];
    }

    removeSource(sourceIndex) {
        this._sources[sourceIndex].destroy();
        this._sources.splice(sourceIndex, 1);
    }

    unfocusedWithout(texture, state) {
        this._sources.forEach(source => {
            if (source.getTexture() !== texture) {
                source.getTexture().setOnFoucsState(state);
            }
        });
    }

    disableInteractiveWithout(texture, state) {
        this._sources.forEach(source => {
            if (source.getTexture() !== texture) {
                source.getTexture().setInteractiveState(state);
            }
        });
    }
}