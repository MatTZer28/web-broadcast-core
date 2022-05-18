import FocusBox from '../lib/utils/focus_box';
import Virtual from '../lib/source/virtual';
import Image from '../lib/source/image';
import Video from '../lib/source/video';
import Text from '../lib/source/text';
import DisplayMedia from '../lib/utils/display_media';

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

    async createVirtualModel(id, url) {
        const source = new Virtual(this._WBS, this, id);
        
        await source.loadModel(url);

        source.zIndex = 2;

        return source;
    }

    createImageSource(id, url) {
        const sourceTexture = PIXI.Texture.from(url);

        const source = new Image(this._WBS, this, id, sourceTexture);

        return source;
    }

    async createVideoSource(id) {
        const displayMedia = new DisplayMedia();

        const sourceTexture = PIXI.Texture.from(await displayMedia.createVideoTexture());

        const source = new Video(this._WBS, this, id, sourceTexture);

        return source;
    }

    createTextSource(id, text, style) {
        style = style || {};
        
        const source = new Text(this._WBS, this, id, text, style);

        return source;
    }

    addSource(source) {
        this._sources.push(source);
        this._parentScene.addChild(source);
    }

    getSourceByID(id) {
        let result_source;

        this._sources.some((source) => {
            if (source.id === id) {
                result_source = source;
                return true;
            } else return false;
        });

        return result_source;
    }

    removeSourceByID(id) {
        this._sources.some((source) => {
            if (source.id === id) {
                this._parentScene.removeChild(source);
                this._sources.splice(this._sources.indexOf(source), 1);
                return true;
            } else return false;
        });
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