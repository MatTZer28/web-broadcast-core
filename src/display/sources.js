export default class Sources {
    constructor() {
        this.sources = [];
    }

    addSource(source) {
        this.sources.push(source);
    }

    removeSource(sourceIndex) {
        this.sources.splice(sourceIndex, 1);
    }
}