self.HTMLVideoElement = function HTMLVideoElement() {};

self.HTMLImageElement = function HTMLImageElement() {};

self.HTMLCanvasElement = self.OffscreenCanvas;

self.document = {
    createElement( type ) {
        if ( type === 'canvas' )
        {
            return new OffscreenCanvas(0, 0);
        }

        return {
            style: {}
        };
    },

    addEventListener() {},
};

self.window = {
    console: self.console,

    addEventListener() {},

    removeEventListener() {},

    navigator: {},

    document: self.document,

    WebGLRenderingContext: self.WebGL2RenderingContext || self.WebGL2RenderingContext,

    requestAnimationFrame: self.requestAnimationFrame.bind(self),
};

const { WebBroadcastSystem } = require('./lib/web-brocast-system');

let WBS;

self.addEventListener( 'message', (e) => {
    switch (e.data.type) {
        case 'init':
            WBS = new WebBroadcastSystem(e.data.canvas, e.data.width, e.data.height);
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
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().createVirtualModel(e.data.url);
            break;
        case 'createImageSource':
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().createImageSource(e.data.url);
            break;
        case 'createVideoSource':
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().createVideoSource();
            break;
        case 'createTextSource':
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().createTextSource(e.data.text, e.data.style);
            break;
        case 'addSource':
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().addSource();
            break;
        case 'removeSource':
            WBS.getScenesWrapper().getSelectedScene().getSourcesWrapper().removeSource(e.data.sourceIndex);
        default:
            break;
    }
})