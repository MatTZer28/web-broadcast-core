import FocusBox from '../lib/focus_box';
import Virtual from '../lib/source/virtual';
import Image from '../lib/source/image';
import Video from '../lib/source/video';
import Text from '../lib/source/text';
import DisplayMedia from '../lib/display_media';

import * as PIXI from 'pixi.js'

export default class SourcesWrapper {
    constructor(WBS, parentScene) {
        this._WBS = WBS;

        this._parentScene = parentScene;

        this._sources = [];

        this.focusBox = new FocusBox(this._WBS);
        this.focusBox.zIndex = 2;

        this._parentScene.addChild(this.focusBox);
    }

    async addVirtualModel(sourcePath) {
        const source = new Virtual(this._WBS, this);
        
        await source.loadModel(sourcePath);

        source.zIndex = 2;

        this._sources.push(source);
        this._parentScene.addChild(source);
    }

    addImageSource(sourcePath) {
        const sourceTexture = PIXI.Texture.from(sourcePath);

        const source = new Image(this._WBS, this, sourceTexture);

        this._sources.push(source);
        this._parentScene.addChild(source);
    }

    async addVideoSource() {
        const displayMedia = new DisplayMedia();

        const sourceTexture = PIXI.Texture.from(await displayMedia.createVideoTexture());

        const source = new Video(this._WBS, this, sourceTexture);

        this._sources.push(source);
        this._parentScene.addChild(source);
    }

    addTextSource(text, style) {
        style = style || {};
        
        const source = new Text(this._WBS, this, text, style);

        this._sources.push(source);
        this._parentScene.addChild(source);
    }

    getSource(sourceIndex) {
        return this._sources[sourceIndex];
    }

    removeSource(sourceIndex) {
        this._sources[sourceIndex].destroy();
        this._sources.splice(sourceIndex, 1);
    }

    unfocusedWithout(source, state) {
        this._sources.forEach(s=> {
            if (s !== source) {
                s.setOnFoucsState(state);
            }
        });
    }

    disableInteractiveWithout(source, state) {
        this._sources.forEach(s => {
            if (s !== source) {
                s.setInteractiveState(state);
            }
        });
    }
}