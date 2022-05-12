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

self.addEventListener( 'message', (e) => {
    const WBS = new WebBroadcastSystem(e.data.canvas, e.data.width, e.data.height);
})