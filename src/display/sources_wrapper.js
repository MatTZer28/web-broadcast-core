import FocusBox from '../lib/utils/focus_box';
import Virtual from '../lib/source/virtual';
import Image from '../lib/source/image';
import Video from '../lib/source/video'
import Screen from '../lib/source/screen';
import Text from '../lib/source/text';
import DisplayMedia from '../lib/utils/display_media';

import '../lib/utils/zip'
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

    async createVirtualModel(id, url, metadata) {
        const source = new Virtual(this._WBS, this, id, metadata);

        await source.loadModel(url);

        source.zIndex = 2;

        return source;
    }

    createImageSource(id, url, metadata) {
        metadata = metadata || null;

        const image = document.createElement('img');

        image.src = url;

        const sourceTexture = PIXI.Texture.from(image);

        const source = new Image(this._WBS, this, id, sourceTexture, metadata);

        return source;
    }

    createVideoSource(id, url, looping, metadata) {
        const video = document.createElement('video');

        video.src = url;

        const sourceTexture = PIXI.Texture.from(video);

        const source = new Video(this._WBS, this, id, sourceTexture, looping, metadata);

        return source;
    }

    async createScreenSource(id) {
        const displayMedia = new DisplayMedia();

        const sourceTexture = PIXI.Texture.from(await displayMedia.createScreenTexture());

        const source = new Screen(this._WBS, this, id, sourceTexture);

        return source;
    }

    createTextSource(id, text, style, metadata) {
        style = style || {};

        const source = new Text(this._WBS, this, id, text, style, metadata);

        return source;
    }

    addSource(source) {
        this._sources.push(source);
        this._parentScene.addChildAt(source, 0);
    }

    moveUpFocusedSoucre() {
        this._sources.some((source) => {
            if (source.getFocusState() === true) {

                let childIndex = this._parentScene.getChildIndex(source);

                if (childIndex < this._parentScene.children.length - 2) {
                    this._parentScene.setChildIndex(source, childIndex + 1);
                }

                return true;
            } else return false;
        });
    }

    moveTopFocusedSoucre() {
        this._sources.some((source) => {
            if (source.getFocusState() === true) {
                this._parentScene.setChildIndex(source, this._parentScene.children.length - 2);
                return true;
            } else return false;
        });
    }

    moveDownFocusedSoucre() {
        this._sources.some((source) => {
            if (source.getFocusState() === true) {

                let childIndex = this._parentScene.getChildIndex(source);

                if (childIndex > 0 && childIndex < this._parentScene.children.length - 1) {
                    this._parentScene.setChildIndex(source, childIndex - 1);
                }

                return true;
            } else return false;
        });
    }

    moveBottomFocusedSoucre() {
        this._sources.some((source) => {
            if (source.getFocusState() === true) {
                this._parentScene.setChildIndex(source, 0);
                return true;
            } else return false;
        });
    }


    setVideoLoopingState(id, state) {
        this._sources.some((source) => {
            if (source.id === id) {
                if (!source instanceof Video) return false;

                source.setLoopingState(state);
                return true;
            } else return false;
        });
    }

    setFocusedSoucreVisiability(state) {
        this._sources.some((source) => {
            if (source.getFocusState() === true) {

                source.setVisiableState(state);

                if (state === true) {
                    const bounds = source.getBounds();
                    this.focusBox.drawFocusBox(bounds.x, bounds.y, bounds.width, bounds.height);
                } else this.focusBox.resetFocusBox();

                return true;
            } else return false;
        });
    }

    foucusOn(id) {
        this._sources.some((source) => {
            if (source.id === id) {
                this.focusBox.setFocusedTarget(source);

                source.setOnFoucsState(true);

                this.unfocusedWithout(source, false);
                this.disableInteractiveWithout(source, false);

                const bounds = source.getBounds();
                this.focusBox.drawFocusBox(bounds.x, bounds.y, bounds.width, bounds.height);

                return true;
            } return false;
        });
    }

    getSourceMetaDataByID(id) {
        const data = { x: null, y: null, width: null, height: null, visible: null };

        this._sources.some((source) => {
            if (source.id === id) {
                const bounds = source.getBounds();

                data.x = bounds.x;

                data.y = bounds.y;

                data.width = bounds.width;

                data.height = bounds.height;

                data.visible = source.getVisibleState();

                return true;
            } else return false;
        });

        return data;
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
        this._sources.forEach(s => {
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