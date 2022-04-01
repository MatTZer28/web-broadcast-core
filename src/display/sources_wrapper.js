import Source from "../lib/source";
import FocusBox from "../lib/focus_box";

export default class SourcesWrapper {
    constructor(WBS, parentScene) {
        this._WBS = WBS;
        this._parentScene = parentScene;
        this._sources = [];
        this._focusBox = new FocusBox(this._WBS);

        for (const [key, value] of Object.entries(this._focusBox.getFocusBox())) {
            this._parentScene.addChild(value);
            value.zIndex = 2;
        }
    }

    drawFocusBox(x, y, width, height) {
        this._focusBox.drawFocusBox(x, y, width, height);
    }

    moveFocusBox(deltaX, deltaY) {
        this._focusBox.moveFocusBox(deltaX, deltaY);
    }

    resetFocusBox() {
        this._focusBox.resetFocusBox();
    }

    addSource(sourceType, sourcePath) {
        const source = new Source(this._WBS, sourceType, sourcePath, this);
        source.zIndex = 1;
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

    setSourceOnFocusedStateWithout(texture, state) {
        this._sources.forEach(source => {
            if (source.getSource() !== texture) {
                source.getSource().setOnFoucsState(state);
            }
        });
    }

    setSourceOnInteractiveStateWithout(texture, state) {
        this._sources.forEach(source => {
            if (source.getSource() !== texture) {
                source.getSource().setInteractiveState(state);
            }
        });
    }
}