import Image from './texture/image';

import * as PIXI from 'pixi.js'

export default class Source {
    constructor(WBS, sourceType, sourcePath) {
        this._WBS = WBS;
        this.sourceTexture = PIXI.Texture.from(sourcePath);

        switch (sourceType) {
            case 'image':
                this._source = new Image(this._WBS, this.sourceTexture);
                break;
            case 'text':
                break;
            case 'video':
                break;
            default:
                break;
        }
    }

    getSource() {
        return this._source;
    }

    destroy() {
        this._source.destroy({
            children:true,
            texture:true,
            baseTexture:true
        });
    }
}