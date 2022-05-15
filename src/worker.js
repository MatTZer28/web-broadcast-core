self.HTMLVideoElement = function HTMLVideoElement() { };

self.HTMLImageElement = function HTMLImageElement() { };

self.HTMLCanvasElement = self.OffscreenCanvas;

self.document = {
    createElement(type) {
        if (type === 'canvas') {
            return new OffscreenCanvas(0, 0);
        }

        return {
            style: {}
        };
    },

    addEventListener() { }
};

self.window = {
    console: self.console,

    addEventListener() { },

    removeEventListener() { },

    navigator: {},

    document: self.document,

    WebGLRenderingContext: self.WebGL2RenderingContext || self.WebGL2RenderingContext,

    requestAnimationFrame: self.requestAnimationFrame.bind(self)
};

const { WebBroadcastSystem } = require('./lib/web-brocast-system');

let WBS;

let videoOffScreens = {};

self.addEventListener('message', (e) => {
    let mouseDownEvent = null;
    let mouseMoveEvent = null;
    let mouseUpEvent = null;

    switch (e.data.type) {
        case 'init':
            WBS = new WebBroadcastSystem(e.data.canvas, e.data.width, e.data.height, e.data.fps);
            break;
        case 'mouseDown':
            mouseDownEvent = new CustomEvent('onmousedown', { detail: { position: { x: e.data.posX, y: e.data.posY } } });
            self.dispatchEvent(mouseDownEvent);
            break;
        case 'mouseMove':
            mouseMoveEvent = new CustomEvent('onmousemove', { detail: { position: { x: e.data.posX, y: e.data.posY } } });
            self.dispatchEvent(mouseMoveEvent);
            break;
        case 'mouseUp':
            mouseUpEvent = new CustomEvent('onmouseup', { detail: { position: { x: e.data.posX, y: e.data.posY } } });
            self.dispatchEvent(mouseUpEvent);
            break;
        case 'createScene':
            WBS.getScenesWrapper().createScene();
            break;
        case 'removeScene':
            WBS.getScenesWrapper().removeScene(e.data.sceneIndex);
            break;
        case 'selectScene':
            WBS.getScenesWrapper().selectScene(e.data.sceneIndex);
            break;
        case 'createVirtualModel':
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().createVirtualModel(e.data.id, e.data.url);
            break;
        case 'createImageSource':
            const imageOffscreen = new OffscreenCanvas(e.data.bitmap.width, e.data.bitmap.height);

            imageOffscreen.getContext('bitmaprenderer').transferFromImageBitmap(e.data.bitmap);

            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().createImageSource(e.data.id, imageOffscreen);
            break;
        case 'createVideoSource':
            videoOffScreens[e.data.id] = new OffscreenCanvas(0, 0);

            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().createVideoSource(e.data.id, videoOffScreens[e.data.id]);
            break;
        case 'updateVideoSource':
            videoOffScreens[e.data.id].width = e.data.bitmap.width;

            videoOffScreens[e.data.id].height = e.data.bitmap.height;

            videoOffScreens[e.data.id].getContext('bitmaprenderer').transferFromImageBitmap(e.data.bitmap);

            videoOffScreens[e.data.id].texture.update();
            break;
        case 'createTextSource':
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().createTextSource(e.data.id, e.data.text, e.data.style);
            break;
        case 'addSource':
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().addSource();
            break;
        case 'removeSource':
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().removeSource(e.data.id);
        default:
            break;
    }
})