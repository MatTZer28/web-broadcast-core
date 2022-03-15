import Source from "../lib/source";

export default class Sources {
    constructor(parentScene) {
        this.sources = [];
    }

    addSource(sourceType) {
        this.sources.push(new Source(sourceType));
    }

    removeSource(sourceIndex) {
        this.sources.splice(sourceIndex, 1);
    }
}