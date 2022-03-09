import Sources from "../display/sources";

export default class Scene {
    constructor() {
        this.sources = new Sources();
    }

    getSources() {
        return this.sources;
    }
}