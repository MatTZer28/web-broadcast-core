import SourcesWrapper from "../display/sources_wrapper";

import * as PIXI from 'pixi.js'

export default class Scene extends PIXI.Container {
    constructor(WBS) {
        super();

        this._WBS = WBS;

        this._sourcesWrapper = new SourcesWrapper(this._WBS, this);
        
        this.sortableChildren = true;
    }

    getSourcesWrapper() {
        return this._sourcesWrapper;
    }

    destroy() {
        this.destroy({
            children: true,
            texture: true,
            baseTexture: true
        });
    }
}