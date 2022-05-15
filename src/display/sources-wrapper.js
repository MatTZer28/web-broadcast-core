const { FocusBox } = require('../lib/utils/focus-box');
const { Virtual } = require('../lib/source/virtual');
const { Image } = require('../lib/source/image');
const { Video } = require('../lib/source/video');
const { Text } = require('../lib/source/text');

const PIXI = require('pixi.js');

export class SourcesWrapper {
    constructor(WBS, parentScene) {
        this._WBS = WBS;

        this._parentScene = parentScene;

        this._sources = [];

        this._sourcesCreatedQueue = [];

        this._addSoucreCounter = 0;

        this.focusBox = new FocusBox(this._WBS);
        this.focusBox.zIndex = 2;

        this._parentScene.addChild(this.focusBox);

        this._setMouseEventListener();
    }

    _setMouseEventListener() {
        this._setOnMouseDownEventListener();
    }

    _setOnMouseDownEventListener() {
        self.addEventListener("onmousedown", (e) => {
            const posX = e.detail.position.x;
            const posY = e.detail.position.y;

            let isAnyFocused = false;

            this._sources.forEach(source => {
                if (source.isClickInsideSprite(posX, posY)) {
                    isAnyFocused = true;
                } else {
                    source.setOnFoucsState(false);
                }
            });

            if (!isAnyFocused) this.focusBox.resetFocusBox();
        });
    }

    async createVirtualModel(id, url) {
        this._sourceCreated = null;

        const source = new Virtual(this._WBS, this, id);

        await source.loadModel(url);

        source.zIndex = 2;

        this._sourcesCreatedQueue.push(source);
    }

    createImageSource(id, canvas) {
        this._sourceCreated = null;

        const sourceTexture = PIXI.Texture.from(canvas);

        const source = new Image(this._WBS, this, id,  sourceTexture);

        this._sourcesCreatedQueue.push(source);
    }

    createVideoSource(id, canvas) {
        this._sourceCreated = null;

        canvas.texture = PIXI.Texture.from(canvas);

        const source = new Video(this._WBS, this, id, canvas.texture);

        this._sourcesCreatedQueue.push(source);
    }

    createTextSource(id, text, style) {
        this._sourceCreated = null;

        style = style || {};

        const source = new Text(this._WBS, this, id, text, style);

        this._sourcesCreatedQueue.push(source);
    }

    addSource() {
        const interval = setInterval(() => {
            if (this._sourcesCreatedQueue.length > 0) {
                const source = this._sourcesCreatedQueue.shift();
                this._sources.push(source);
                this._parentScene.addChild(source);
                clearInterval(interval);
            }
        }, 100);
    }

    removeSource(id) {
        this._sources.some((source) => {
            if (source.id !== id) return false;

            if (source instanceof Video) self.postMessage({ type: 'removeVideo', id: id });

            source.destroy();
            this._sources.splice(this._sources.indexOf(source), 1);

            return true;
        });
    }

    unfocusedWithout(source, state) {
        this._sources.forEach(s => {
            if (s !== source) {
                s.setOnFoucsState(state);
            }
        });
    }
}