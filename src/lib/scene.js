import Sources from "../display/sources";

import * as PIXI from 'pixi.js'

export default class Scene {
    constructor() {
        this.sources = new Sources(this);
        this.container = new PIXI.Container();
    }

    getSources() {
        return this.sources;
    }
}