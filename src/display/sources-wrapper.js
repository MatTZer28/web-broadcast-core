const { FocusBox } = require('../lib/focus-box');
const { Virtual } = require('../lib/source/virtual');
const { Image } = require('../lib/source/image');
const { Video } = require('../lib/source/video');
const { Text } = require('../lib/source/text');
const { DisplayMedia } = require('../lib/display-media');

const PIXI = require('pixi.js');

export class SourcesWrapper {
    constructor(WBS, parentScene) {
        this._WBS = WBS;

        this._parentScene = parentScene;

        this._sources = [];

        this._sourceCreated = null;

        // this.focusBox = new FocusBox(this._WBS);
        // this.focusBox.zIndex = 2;

        // this._parentScene.addChild(this.focusBox);
    }

    async createVirtualModel(url) {
        const source = new Virtual(this._WBS, this);
        
        await source.loadModel(url);

        source.zIndex = 2;

        this._sourceCreated = source;
    }

    createImageSource(url) {
        const sourceTexture = PIXI.Texture.from(url);

        const source = new Image(this._WBS, this, sourceTexture);

        this._sourceCreated = source;
    }

    async createVideoSource() {
        const displayMedia = new DisplayMedia();

        const sourceTexture = PIXI.Texture.from(await displayMedia.createVideoTexture());

        const source = new Video(this._WBS, this, sourceTexture);

        this._sourceCreated = source;
    }

    createTextSource(text, style) {
        style = style || {};
        
        const source = new Text(this._WBS, this, text, style);

        this._sourceCreated = source;
    }

    addSource() {
        this._sources.push(this._sourceCreated);
        this._parentScene.addChild(this._sourceCreated);
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