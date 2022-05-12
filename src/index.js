let worker;

export function init(canvas, width, height) {
    const offscreen = canvas.transferControlToOffscreen();

    worker = new Worker(new URL('./worker.js', import.meta.url));

    worker.postMessage(
        {
            type: 'init',
            width: width,
            height: height,
            canvas: offscreen
        },
        [offscreen]
    );
}

export function createScene() {
    worker.postMessage({ type: 'createScene' });
}

export function removeScene(index) {
    worker.postMessage({ type: 'removeScene', sceneIndex: index });
}

export function selectScene(index) {
    worker.postMessage({ type: 'selectScene', sceneIndex: index });
}

export function createVirtualModel(url) {
    worker.postMessage({ type: 'createVirtualModel', url: url });
}

export function createImageSource(url) {
    worker.postMessage({ type: 'createImageSource', url: url });
}

export function createVideoSource() {
    worker.postMessage({ type: 'createVideoSource' });
}

export function createTextSource(text, style) {
    worker.postMessage({ type: 'createTextSource', text: text, style: style });
}

export function addSource() {
    worker.postMessage({ type: 'addSource' });
}

export function removeSource(index) {
    worker.postMessage({ type: 'removeSource', sceneIndex: index});
}