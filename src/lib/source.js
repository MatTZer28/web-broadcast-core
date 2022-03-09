class Source {
    constructor(stream, name) {
        this.stream = stream;
        this.name = name;
        this.id = _generateID(5);
    }

    _generateID(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    destroy() {
        this.stream = null;
        this.name = null;
        this.id = null;
    }
}