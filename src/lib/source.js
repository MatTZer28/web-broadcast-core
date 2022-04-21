import Image from './texture/image';
import Video from './texture/video';
import DisplayMedia from './display_media';

import * as PIXI from 'pixi.js'

export default class Source {
    constructor(WBS, sourceType, sourcePath, sourceWrapper) {
        this._WBS = WBS;

        this._sourceType = sourceType;

        this._sourcePath = sourcePath;

        this._sourceWrapper = sourceWrapper;

        this._sourceTexture = null;
    }

    async init() {
        switch (this._sourceType) {
            case 'image':
                this._loadImageTexture(this._sourcePath);
                this._texture = new Image(this._WBS, this._sourceTexture, this._sourceWrapper);
                break;

            case 'text':
                break;

            case 'video':
                await this._loadVideoTexture(new DisplayMedia());
                this._texture = new Video(this._WBS, this._sourceTexture, this._sourceWrapper);
                break;
                
            default:
                break;
        }
    }

    _loadImageTexture(sourcePath) {
        this._sourceTexture = PIXI.Texture.from(sourcePath);
    }

    async _loadVideoTexture(displayMedia) {
        await displayMedia.createMediaStream();
        this._sourceTexture = PIXI.Texture.from(displayMedia.getHTMLVideo());
    }

    getTexture() {
        return this._texture;
    }

    destroy() {
        this._texture.destroy({
            children: true,
            texture: true,
            baseTexture: true
        });
    }
}