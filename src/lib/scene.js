class Scene {
    constructor() {
        this.sources = [];
    }

    addSource(source) {
        this.sources.push(source);
    }

    removeSource(source) {
        for(let i = 0; i < this.sources.length; i++) {
            if (self.sources[i].id === source.id) {
                self.sources.splice(i, 1);
                break;
            }
        }
    }
}